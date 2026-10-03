-- Add the navbar logo / favicon avatar to the profile row.
-- Run this in the Supabase SQL Editor against an existing database
-- (safe to run more than once).

alter table public.profile
  add column if not exists nav_avatar_url text;

comment on column public.profile.avatar_url is 'Lanyard / ID card photo';
comment on column public.profile.nav_avatar_url is 'Navbar logo + favicon image. Falls back to avatar_url when null.';
