-- Matching function for SoloSaathi.
--
-- Hard filter: same trek_destination (see CLAUDE.md "Matching logic").
-- Then a weighted score across 10 questions, weights exactly as specified
-- in CLAUDE.md — do not change these without checking with the product owner:
--   Stamina 20%, Pace 15%, Breaks 5%, Morning/evening 5%, Dietary 10%,
--   Music 5%, Chat 5%, Photos 5%, Smoking/drinking 10%, Risk appetite 20%.
--
-- Scoring, per CLAUDE.md "Matching logic":
--
-- Generic (5 signals: Stamina, Pace, Music, Chat, Photos). Each is a
-- 4-option scale already ordered from one extreme to the other in
-- app/create-profile/page.tsx (e.g. beginner -> advanced, slow -> fast).
-- Scored by ordinal distance on that scale: same answer = 100, one step
-- off ~= 67, two steps off ~= 33, opposite ends = 0. One helper
-- (ordinal_score) implements this so these 5 fields share one formula
-- instead of five near-identical ones.
--
-- 5 edge cases get their own explicit case-based function:
--   - Risk appetite: exact match = 100, "flexible" vs any other = 90,
--     otherwise ordinal distance among the remaining 3 options
--     (one step off ~= 67, two steps off ~= 33).
--   - Dietary: exact match = 100, "flexible" vs any other = 90,
--     vegetarian<->vegan = 67, veg/vegan vs non-veg = 33.
--   - Smoking/drinking: exact match = 100, neither<->both = 0,
--     "neither" vs a single habit = 33, "both" vs a single habit = 67,
--     drink-only<->smoke-only = 55.
--   - Breaks: exact match = 100, "flexible" (go with flow) vs any
--     other = 90, otherwise ordinal distance among the remaining
--     3 options.
--   - Morning/evening: same shape as Breaks — exact match = 100,
--     "flexible" vs any other = 90, otherwise ordinal distance among
--     the remaining 3 options.
-- Risk, Breaks and Morning/evening reuse ordinal_score for their
-- non-flexible branch (passing the full 4-option scale so the distance
-- math still divides by 3, giving the same 67/33 buckets as the
-- generic case) — only the "flexible short-circuits to 90" part is
-- bespoke. Dietary and Smoking/drinking aren't a single ordered line
-- (vegetarian/vegan cluster together against non-veg; drink-only and
-- smoke-only are parallel habits, not a midpoint), so they get a fully
-- explicit case table instead.

-- ---------------------------------------------------------------------
-- Generic ordinal-distance scorer, reused for the 5 fields that are a
-- clean linear scale, and for the non-flexible branch of Risk/Breaks/
-- Morning.
-- ---------------------------------------------------------------------
drop function if exists ordinal_score(text[], text, text);

create function ordinal_score(scale text[], a text, b text)
returns numeric
language sql
immutable
as $$
  select case
    when a is null or b is null then null
    else round(
      100 * (
        1 - abs(
          array_position(scale, a) - array_position(scale, b)
        )::numeric / (array_length(scale, 1) - 1)
      ),
      1
    )
  end;
$$;

-- ---------------------------------------------------------------------
-- Risk appetite: "flexible" (group decision) is compatible with anyone;
-- cautious/moderate/adventurous otherwise follow the generic ordinal
-- distance (using the full 4-option scale as the denominator so the
-- buckets come out at 67/33, matching the generic formula).
-- ---------------------------------------------------------------------
drop function if exists score_risk(text, text);

create function score_risk(a text, b text)
returns numeric
language sql
immutable
as $$
  select case
    when a is null or b is null then null
    when a = b then 100
    when (a = 'flexible' or b = 'flexible') then 90
    else ordinal_score(array['cautious', 'moderate', 'adventurous', 'flexible'], a, b)
  end;
$$;

-- ---------------------------------------------------------------------
-- Dietary: vegetarian/vegan treated as a "veg cluster" that's closer to
-- each other than to non-veg; "flexible" is compatible with anyone.
-- ---------------------------------------------------------------------
drop function if exists score_dietary(text, text);

create function score_dietary(a text, b text)
returns numeric
language sql
immutable
as $$
  select case
    when a is null or b is null then null
    when a = b then 100
    when (a = 'flexible' or b = 'flexible') then 90
    when (a in ('vegetarian', 'vegan') and b in ('vegetarian', 'vegan')) then 67
    else 33 -- veg/vegan paired with non-veg
  end;
$$;

-- ---------------------------------------------------------------------
-- Smoking/drinking: "neither" and "both" are opposite ends; a single
-- habit (drink-only/smoke-only) sits in between, closer to "both" than
-- to "neither"; the two single habits are moderately compatible.
-- ---------------------------------------------------------------------
drop function if exists score_smoking_drinking(text, text);

create function score_smoking_drinking(a text, b text)
returns numeric
language sql
immutable
as $$
  select case
    when a is null or b is null then null
    when a = b then 100
    when (a = 'neither' and b = 'both') or (a = 'both' and b = 'neither') then 0
    when (a = 'neither' and b in ('drink-only', 'smoke-only'))
      or (b = 'neither' and a in ('drink-only', 'smoke-only')) then 33
    when (a = 'both' and b in ('drink-only', 'smoke-only'))
      or (b = 'both' and a in ('drink-only', 'smoke-only')) then 67
    else 55 -- drink-only vs smoke-only
  end;
$$;

-- ---------------------------------------------------------------------
-- Breaks (rest_frequency): "flexible" (go with flow) is compatible with
-- anyone; minimal/normal/frequent otherwise follow the generic ordinal
-- distance.
-- ---------------------------------------------------------------------
drop function if exists score_breaks(text, text);

create function score_breaks(a text, b text)
returns numeric
language sql
immutable
as $$
  select case
    when a is null or b is null then null
    when a = b then 100
    when (a = 'flexible' or b = 'flexible') then 90
    else ordinal_score(array['minimal', 'normal', 'frequent', 'flexible'], a, b)
  end;
$$;

-- ---------------------------------------------------------------------
-- Morning/evening: same shape as Breaks — "flexible" is compatible with
-- anyone; early/moderate/late otherwise follow the generic ordinal
-- distance.
-- ---------------------------------------------------------------------
drop function if exists score_morning(text, text);

create function score_morning(a text, b text)
returns numeric
language sql
immutable
as $$
  select case
    when a is null or b is null then null
    when a = b then 100
    when (a = 'flexible' or b = 'flexible') then 90
    else ordinal_score(array['early', 'moderate', 'late', 'flexible'], a, b)
  end;
$$;

-- ---------------------------------------------------------------------
-- Main matching function. Only ever computes matches for the calling
-- user (auth.uid()) — SECURITY DEFINER lets it read across profiles to
-- find candidates (bypassing the "select own row only" RLS policy),
-- but the auth.uid() check stops anyone from passing in someone else's
-- id to see their matches.
-- ---------------------------------------------------------------------
drop function if exists match_trekkers(uuid);

create function match_trekkers(requesting_user_id uuid)
returns table (
  match_id uuid,
  name text,
  age int,
  city text,
  trek_destination text,
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
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if requesting_user_id is distinct from auth.uid() then
    raise exception 'Cannot request matches for another user';
  end if;

  return query
  with me as (
    select * from profiles where id = requesting_user_id
  ),
  scored as (
    select
      p.id as match_id,
      p.name,
      p.age,
      p.city,
      p.trek_destination,
      ordinal_score(array['beginner', 'moderate', 'experienced', 'advanced'], me.trail_stamina, p.trail_stamina) as stamina_score,
      ordinal_score(array['slow', 'moderate', 'brisk', 'fast'], me.walking_pace, p.walking_pace) as pace_score,
      score_breaks(me.rest_frequency, p.rest_frequency) as breaks_score,
      score_morning(me.morning_person, p.morning_person) as morning_score,
      score_dietary(me.dietary_preference, p.dietary_preference) as dietary_score,
      ordinal_score(array['no-music', 'earphones', 'shared-soft', 'shared-loud'], me.music_preference, p.music_preference) as music_score,
      ordinal_score(array['quiet', 'occasional', 'chatty', 'very-chatty'], me.talkative_level, p.talkative_level) as chat_score,
      ordinal_score(array['minimal', 'occasional', 'frequent', 'constant'], me.photography_style, p.photography_style) as photos_score,
      score_smoking_drinking(me.smoking_drinking, p.smoking_drinking) as smoking_drinking_score,
      score_risk(me.risk_tolerance, p.risk_tolerance) as risk_score
    from profiles p, me
    where p.id <> requesting_user_id
      and p.trek_destination = me.trek_destination
  )
  select
    scored.match_id,
    scored.name,
    scored.age,
    scored.city,
    scored.trek_destination,
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
  from scored
  order by overall_score desc;
end;
$$;

-- Matching is a logged-in feature only.
revoke all on function match_trekkers(uuid) from public, anon;
grant execute on function match_trekkers(uuid) to authenticated;
