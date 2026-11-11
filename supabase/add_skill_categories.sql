-- Optional seed for the skills section names.
-- The app falls back to these defaults when the row is missing, and the
-- admin "Edit Sections" dialog upserts this row on save.
insert into public.site_config (key, value)
values (
  'skill_categories',
  '{"categories":[{"key":"languages","label":"Languages"},{"key":"web","label":"Web Technologies"},{"key":"databases","label":"Databases"}]}'::jsonb
)
on conflict (key) do nothing;
