-- The skills table already uses icon_name in the app. This keeps existing
-- databases in sync with supabase/schema.sql.
alter table public.skills
  add column if not exists icon_name text default '';
