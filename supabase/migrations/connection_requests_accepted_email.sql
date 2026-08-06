-- Extend connection request reads: per-pair compatibility scores, and the
-- other person's email once (and only once) a request is accepted.
--
-- get_my_connection_requests() now also returns the same 10 compatibility
-- signals + overall score match_trekkers shows, computed by the
-- compatibility_scores helper below, plus other_email — non-null only
-- when status = 'accepted'. That's the actual point of accepting a
-- request: two trekkers who both opted in can now reach each other
-- outside the app. Pending or declined requests, in either direction,
-- never expose an email — only an accepted pair does, regardless of who
-- accepted. All three statuses (pending/accepted/declined) are still
-- returned; the frontend buckets Sent/Received (pending + declined) vs.
-- Accepted, rather than the backend hiding declined rows outright.
--
-- compatibility_scores() intentionally duplicates match_trekkers' final
-- weighted-sum formula (same weights from CLAUDE.md) instead of
-- refactoring match_trekkers to call it — match_trekkers is already
-- verified against production data, and CLAUDE.md flags the matching
-- logic as a product decision not to change without asking, so this
-- leaves it untouched. The 6 scoring building blocks (ordinal_score,
-- score_risk, score_dietary, score_smoking_drinking, score_breaks,
-- score_morning) are still shared, defined in the match_trekkers
-- migration — only the ~15-line final SELECT is duplicated here.

-- ---------------------------------------------------------------------
-- Pairwise compatibility between any two profiles. Not exposed to
-- clients directly (no grant to authenticated) — it's only ever called
-- from within other SECURITY DEFINER functions below, which already
-- gate what pairs of users a given caller is allowed to see scored
-- against each other.
-- ---------------------------------------------------------------------
drop function if exists compatibility_scores(uuid, uuid);

create function compatibility_scores(user_a uuid, user_b uuid)
returns table (
  stamina_score numeric,
  pace_score numeric,
  breaks_score numeric,
  morning_score numeric,
  dietary_score numeric,
  music_score numeric,
  chat_score numeric,
  photos_score numeric,
  smoking_drinking_score numeric,
  risk_score numeric,
  overall_score numeric
)
language sql
security definer
set search_path = public
stable
as $$
  with a as (
    select * from profiles where id = user_a
  ),
  b as (
    select * from profiles where id = user_b
  ),
  scored as (
    select
      ordinal_score(array['beginner', 'moderate', 'experienced', 'advanced'], a.trail_stamina, b.trail_stamina) as stamina_score,
      ordinal_score(array['slow', 'moderate', 'brisk', 'fast'], a.walking_pace, b.walking_pace) as pace_score,
      score_breaks(a.rest_frequency, b.rest_frequency) as breaks_score,
      score_morning(a.morning_person, b.morning_person) as morning_score,
      score_dietary(a.dietary_preference, b.dietary_preference) as dietary_score,
      ordinal_score(array['no-music', 'earphones', 'shared-soft', 'shared-loud'], a.music_preference, b.music_preference) as music_score,
      ordinal_score(array['quiet', 'occasional', 'chatty', 'very-chatty'], a.talkative_level, b.talkative_level) as chat_score,
      ordinal_score(array['minimal', 'occasional', 'frequent', 'constant'], a.photography_style, b.photography_style) as photos_score,
      score_smoking_drinking(a.smoking_drinking, b.smoking_drinking) as smoking_drinking_score,
      score_risk(a.risk_tolerance, b.risk_tolerance) as risk_score
    from a, b
  )
  select
    scored.stamina_score,
    scored.pace_score,
    scored.breaks_score,
    scored.morning_score,
    scored.dietary_score,
    scored.music_score,
    scored.chat_score,
    scored.photos_score,
    scored.smoking_drinking_score,
    scored.risk_score,
    round(
      coalesce(scored.stamina_score, 50)          * 0.20 +
      coalesce(scored.pace_score, 50)              * 0.15 +
      coalesce(scored.breaks_score, 50)            * 0.05 +
      coalesce(scored.morning_score, 50)           * 0.05 +
      coalesce(scored.dietary_score, 50)           * 0.10 +
      coalesce(scored.music_score, 50)             * 0.05 +
      coalesce(scored.chat_score, 50)              * 0.05 +
      coalesce(scored.photos_score, 50)            * 0.05 +
      coalesce(scored.smoking_drinking_score, 50)  * 0.10 +
      coalesce(scored.risk_score, 50)              * 0.20,
      1
    ) as overall_score
  from scored;
$$;

revoke all on function compatibility_scores(uuid, uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- Read helper: both sent and received requests for the caller (all three
-- statuses, both directions), joined with the *other* party's basic
-- profile info, compatibility_scores() against them, and their email
-- (nulled out unless the request is accepted). A plain client-side join
-- against profiles/auth.users wouldn't work here — profiles_select_own
-- restricts everyone to their own row, and auth.users isn't reachable
-- from the client at all — so this mirrors match_trekkers and reads
-- across both via SECURITY DEFINER, scoped to auth.uid()'s own requests
-- only.
-- ---------------------------------------------------------------------
drop function if exists get_my_connection_requests();

create function get_my_connection_requests()
returns table (
  request_id uuid,
  direction text,
  status text,
  created_at timestamptz,
  responded_at timestamptz,
  other_id uuid,
  other_name text,
  other_age int,
  other_city text,
  other_trek_destination text,
  stamina_score numeric,
  pace_score numeric,
  breaks_score numeric,
  morning_score numeric,
  dietary_score numeric,
  music_score numeric,
  chat_score numeric,
  photos_score numeric,
  smoking_drinking_score numeric,
  risk_score numeric,
  overall_score numeric,
  other_email text
)
language sql
security definer
set search_path = public
stable
as $$
  select
    cr.id as request_id,
    case when cr.requester_id = auth.uid() then 'sent' else 'received' end as direction,
    cr.status,
    cr.created_at,
    cr.responded_at,
    p.id as other_id,
    p.name as other_name,
    p.age as other_age,
    p.city as other_city,
    p.trek_destination as other_trek_destination,
    cs.stamina_score,
    cs.pace_score,
    cs.breaks_score,
    cs.morning_score,
    cs.dietary_score,
    cs.music_score,
    cs.chat_score,
    cs.photos_score,
    cs.smoking_drinking_score,
    cs.risk_score,
    cs.overall_score,
    case when cr.status = 'accepted' then u.email else null end as other_email
  from connection_requests cr
  join profiles p
    on p.id = case when cr.requester_id = auth.uid() then cr.recipient_id else cr.requester_id end
  join auth.users u
    on u.id = p.id
  cross join lateral compatibility_scores(auth.uid(), p.id) cs
  where cr.requester_id = auth.uid() or cr.recipient_id = auth.uid()
  order by cr.created_at desc;
$$;

revoke all on function get_my_connection_requests() from public, anon;
grant execute on function get_my_connection_requests() to authenticated;
