-- Gallery stories: multiple photos per story, with `image` kept as the cover.
-- Run this once in the Supabase SQL editor.

alter table public.gallery_stories
  add column if not exists photos jsonb not null default '[]'::jsonb;

-- Backfill existing single-image stories so the new story-page gallery has
-- something to show without re-saving every record.
update public.gallery_stories
set photos = jsonb_build_array(image)
where image is not null
  and image <> ''
  and (photos is null or photos = '[]'::jsonb);
