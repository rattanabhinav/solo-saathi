-- Connection requests for SoloSaathi.
--
-- Lets a user send a connection request to a matched trekker (surfaced by
-- match_trekkers), and lets the recipient accept/decline it.
--
-- Same shape as match_trekkers: the table's own RLS only ever lets a user
-- read rows they're party to (as requester or recipient) — all writes
-- (send/accept/decline) go through SECURITY DEFINER functions instead of
-- raw table policies. Reasons this is safer than table-level INSERT/UPDATE
-- policies for this table specifically:
--   - Sending a request needs to re-check the hard filter (trek_destination
--     overlap) server-side, not just trust the client sent it from a real
--     match.
--   - Accepting/declining is a state transition (pending -> accepted or
--     declined) that only the recipient may perform, and RLS UPDATE
--     policies can't easily stop someone from also rewriting
--     requester_id/recipient_id in the same statement — a function that
--     only ever sets the status/responded_at columns closes that off
--     entirely.

create table if not exists public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint connection_requests_no_self_request check (requester_id <> recipient_id)
);

-- Only one *pending* request per direction at a time — stops someone
-- spamming the same person with repeat requests. A prior "declined" row
-- doesn't block a fresh attempt (a partial index, not a plain unique
-- constraint, so it only applies while status = 'pending').
create unique index if not exists connection_requests_one_pending_per_direction
  on public.connection_requests (requester_id, recipient_id)
  where status = 'pending';

create index if not exists connection_requests_recipient_idx
  on public.connection_requests (recipient_id);

alter table public.connection_requests enable row level security;

-- Table grants: read-only for authenticated users. INSERT/UPDATE are not
-- granted at all — the functions below are SECURITY DEFINER (owned by the
-- migration role), so they can still write regardless of these grants;
-- this just stops anyone from bypassing the functions with a raw
-- supabase.from("connection_requests").insert(...)/.update(...) call.
revoke all on public.connection_requests from public, anon, authenticated;
grant select on public.connection_requests to authenticated;

create policy "connection_requests_select_own"
  on public.connection_requests
  for select
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

-- ---------------------------------------------------------------------
-- Send a connection request. Re-enforces the same hard filter
-- match_trekkers uses (trek_destination overlap) so requests can't be
-- sent to someone who was never actually a match, and blocks duplicate
-- requests in either direction while one is still pending or accepted.
-- ---------------------------------------------------------------------
drop function if exists send_connection_request(uuid);

create function send_connection_request(p_recipient_id uuid)
returns public.connection_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_requester_id uuid := auth.uid();
  v_requester_trek text;
  v_recipient_trek text;
  v_existing_active int;
  v_row public.connection_requests;
begin
  if v_requester_id is null then
    raise exception 'Must be logged in to send a connection request';
  end if;

  if p_recipient_id = v_requester_id then
    raise exception 'Cannot send a connection request to yourself';
  end if;

  select trek_destination into v_requester_trek from profiles where id = v_requester_id;
  select trek_destination into v_recipient_trek from profiles where id = p_recipient_id;

  if v_recipient_trek is null then
    raise exception 'Recipient not found';
  end if;

  if v_requester_trek is distinct from v_recipient_trek then
    raise exception 'Can only send requests to trekkers heading to the same destination';
  end if;

  select count(*) into v_existing_active
  from connection_requests
  where status in ('pending', 'accepted')
    and (
      (requester_id = v_requester_id and recipient_id = p_recipient_id)
      or (requester_id = p_recipient_id and recipient_id = v_requester_id)
    );

  if v_existing_active > 0 then
    raise exception 'A connection request already exists between you and this trekker';
  end if;

  insert into connection_requests (requester_id, recipient_id)
  values (v_requester_id, p_recipient_id)
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function send_connection_request(uuid) from public, anon;
grant execute on function send_connection_request(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- Accept/decline. Only the recipient can respond, and only while the
-- request is still pending — the function is the only path that can
-- change status, and it only ever touches status/responded_at.
-- ---------------------------------------------------------------------
drop function if exists respond_to_connection_request(uuid, text);

create function respond_to_connection_request(p_request_id uuid, p_response text)
returns public.connection_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.connection_requests;
begin
  if p_response not in ('accepted', 'declined') then
    raise exception 'Response must be accepted or declined';
  end if;

  update connection_requests
  set status = p_response, responded_at = now()
  where id = p_request_id
    and recipient_id = auth.uid()
    and status = 'pending'
  returning * into v_row;

  if v_row is null then
    raise exception 'Request not found or already responded to';
  end if;

  return v_row;
end;
$$;

revoke all on function respond_to_connection_request(uuid, text) from public, anon;
grant execute on function respond_to_connection_request(uuid, text) to authenticated;

-- The read side (get_my_connection_requests) is defined in
-- connection_requests_details.sql, not here — it needs
-- compatibility_scores() (also defined there) to include per-pair
-- compatibility signals and the other person's email, so there's no
-- useful standalone version of it to define in this file first.
