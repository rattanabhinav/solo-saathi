-- Vibe Summary (AI match reasoning) — see docs/features/vibe_summary.md.
--
-- Run AFTER match_trekkers_function.sql and
-- connection_requests_accepted_email.sql (reuses compatibility_scores()
-- and the scoring helpers defined there).
--
-- What this adds:
--   1. vibe_summaries table — stores each AI-written summary so Claude
--      writes it once per pair instead of on every page load. One row per
--      (viewer, match): the text is written *to* the viewer ("Vikram's
--      stamina differs from yours"), so A's summary of B isn't the same as
--      B's summary of A. inputs_hash is a fingerprint of everything the
--      summary was written from (computed by the server route); if either
--      person changes their answers, the fingerprint no longer matches and
--      the server rewrites the summary.
--   2. get_vibe_inputs(match) — everything the server needs to write one
--      summary: both people's answers, the scores, and any saved summary.
--   3. save_vibe_summary(...) — stores (or replaces) a summary.
--
-- Same shape as connection_requests: the table is fully locked to the
-- browser (no direct reads or writes); the server route calls the two
-- functions with the logged-in user's token, so auth.uid() is that user,
-- and both functions re-check the pair is a real match first — same trek
-- and at least 50% compatible (is_vibe_eligible below).
--
-- What leaves the database for the AI: the match's first name, both
-- cities, the trek, both people's 10 matching answers, and the scores.
-- Never phone, email, age or full name.
--
-- The 50% threshold is also in lib/vibe/config.ts (VIBE_SUMMARY_MIN_SCORE)
-- so the matches page knows which cards to ask for — keep the two in sync.

create table if not exists public.vibe_summaries (
  viewer_id uuid not null references public.profiles(id) on delete cascade,
  match_id uuid not null references public.profiles(id) on delete cascade,
  summary text not null,
  inputs_hash text not null,
  model text not null,
  generated_at timestamptz not null default now(),
  primary key (viewer_id, match_id)
);

-- RLS on with no policies + no grants = the browser can't touch this table
-- at all. The SECURITY DEFINER functions below run as the table's owner,
-- so they can still read and write it.
alter table public.vibe_summaries enable row level security;
revoke all on public.vibe_summaries from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- The one rule for who gets a Vibe Summary: same trek (the same hard
-- filter match_trekkers uses) and an overall score of at least 50.
-- Internal helper only — not callable from the browser.
-- ---------------------------------------------------------------------
drop function if exists is_vibe_eligible(uuid, uuid);

create function is_vibe_eligible(p_viewer_id uuid, p_match_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from profiles me
    join profiles them on them.id = p_match_id
    cross join lateral compatibility_scores(me.id, them.id) cs
    where me.id = p_viewer_id
      and me.id <> them.id
      and me.trek_destination = them.trek_destination
      and cs.overall_score >= 50
  );
$$;

revoke all on function is_vibe_eligible(uuid, uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- Read: everything needed to write (or reuse) one summary, from the
-- caller's point of view — "my_*" is the logged-in user, "their_*" is the
-- match. Returns no row at all if the pair isn't eligible (or the caller
-- isn't logged in), which the server treats as "no summary for this card".
--
-- Scores and answer columns are in the same order as SIGNAL_DEFS in
-- components/compatibility-card.tsx (Stamina -> Risk).
-- ---------------------------------------------------------------------
drop function if exists get_vibe_inputs(uuid);

create function get_vibe_inputs(p_match_id uuid)
returns table (
  their_first_name text,
  trek_destination text,
  my_city text,
  their_city text,
  my_trail_stamina text,
  their_trail_stamina text,
  my_walking_pace text,
  their_walking_pace text,
  my_rest_frequency text,
  their_rest_frequency text,
  my_morning_person text,
  their_morning_person text,
  my_dietary_preference text,
  their_dietary_preference text,
  my_music_preference text,
  their_music_preference text,
  my_talkative_level text,
  their_talkative_level text,
  my_photography_style text,
  their_photography_style text,
  my_smoking_drinking text,
  their_smoking_drinking text,
  my_risk_tolerance text,
  their_risk_tolerance text,
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
  cached_summary text,
  cached_inputs_hash text
)
language sql
security definer
set search_path = public
stable
as $$
  select
    split_part(btrim(them.name), ' ', 1),
    me.trek_destination,
    me.city,
    them.city,
    me.trail_stamina,
    them.trail_stamina,
    me.walking_pace,
    them.walking_pace,
    me.rest_frequency,
    them.rest_frequency,
    me.morning_person,
    them.morning_person,
    me.dietary_preference,
    them.dietary_preference,
    me.music_preference,
    them.music_preference,
    me.talkative_level,
    them.talkative_level,
    me.photography_style,
    them.photography_style,
    me.smoking_drinking,
    them.smoking_drinking,
    me.risk_tolerance,
    them.risk_tolerance,
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
    vs.summary,
    vs.inputs_hash
  from profiles me
  join profiles them on them.id = p_match_id
  cross join lateral compatibility_scores(me.id, them.id) cs
  left join vibe_summaries vs on vs.viewer_id = me.id and vs.match_id = them.id
  where me.id = auth.uid()
    and is_vibe_eligible(me.id, them.id);
$$;

revoke all on function get_vibe_inputs(uuid) from public, anon;
grant execute on function get_vibe_inputs(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- Write: store the caller's summary of one match, replacing any older
-- version (e.g. after someone changed their answers). Re-checks
-- eligibility so a row can't be written for a pair that was never a match.
--
-- A logged-in user could call this from their own browser and save made-up
-- text — but rows are per viewer, so the only person who'd ever see it is
-- themselves. Nobody can write a summary that someone else will read.
-- ---------------------------------------------------------------------
drop function if exists save_vibe_summary(uuid, text, text, text);

create function save_vibe_summary(
  p_match_id uuid,
  p_summary text,
  p_inputs_hash text,
  p_model text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Must be logged in to save a vibe summary';
  end if;

  if not is_vibe_eligible(auth.uid(), p_match_id) then
    raise exception 'Vibe summaries are only for same-trek matches of 50%% or more';
  end if;

  if p_summary is null or length(btrim(p_summary)) = 0 or length(p_summary) > 1500 then
    raise exception 'Summary must be between 1 and 1500 characters';
  end if;

  insert into vibe_summaries (viewer_id, match_id, summary, inputs_hash, model, generated_at)
  values (auth.uid(), p_match_id, btrim(p_summary), p_inputs_hash, p_model, now())
  on conflict (viewer_id, match_id) do update
    set summary = excluded.summary,
        inputs_hash = excluded.inputs_hash,
        model = excluded.model,
        generated_at = excluded.generated_at;
end;
$$;

revoke all on function save_vibe_summary(uuid, text, text, text) from public, anon;
grant execute on function save_vibe_summary(uuid, text, text, text) to authenticated;
