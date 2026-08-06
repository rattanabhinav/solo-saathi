-- Tighten profiles table visibility.
--
-- Testing match_trekkers surfaced that any logged-in user could
-- directly `select * from profiles` and get back every user's row
-- (including phone) — the SELECT policy on profiles was permissive.
-- Matching doesn't need that: match_trekkers is SECURITY DEFINER, so
-- it can already read across profiles to compute matches regardless of
-- what this table's own RLS policy allows. The table itself should
-- only ever let a user read their own row.
--
-- This only touches SELECT policies. INSERT/UPDATE (used by the
-- create-profile save flow) are untouched.

alter table public.profiles enable row level security;

-- Drop whatever SELECT policy/policies currently exist on profiles,
-- regardless of name, so we don't have to guess what they're called.
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and cmd = 'SELECT'
  loop
    execute format('drop policy %I on public.profiles', pol.policyname);
  end loop;
end $$;

-- Replace with a single policy: a user can only read their own row.
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);
