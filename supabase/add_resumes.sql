-- Resume uploads with version history: many PDFs, exactly one flagged live.
-- Run this in the Supabase SQL Editor against an existing database
-- (safe to run more than once).

create table if not exists public.resumes (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  version int not null default 1,
  is_live boolean not null default false,
  file_url text not null,
  storage_path text not null,
  file_name text not null,
  file_size bigint,
  note text,
  created_at timestamptz default now()
);

comment on table public.resumes is 'Uploaded resume PDFs. The single row with is_live = true is what the public hero button links to.';
comment on column public.resumes.label is 'Human readable name, e.g. "Frontend - 2026".';
comment on column public.resumes.version is 'Upload order, oldest first. Used for the version history list.';
comment on column public.resumes.is_live is 'True for the one version the portfolio links to. Cleared on every other row when switching.';
comment on column public.resumes.file_url is 'Public storage URL, used for the preview iframe and the hero link.';
comment on column public.resumes.storage_path is 'Path inside the resumes bucket. Kept so deleting a row can also delete the file.';
comment on column public.resumes.file_name is 'Original uploaded file name, shown in the UI.';
comment on column public.resumes.file_size is 'Size in bytes, display only.';

create index if not exists resumes_version_idx on public.resumes (version desc);
create index if not exists resumes_live_idx on public.resumes (is_live);

alter table public.resumes enable row level security;

-- The hero button resolves the live resume with the anon key, so it must be
-- publicly readable like every other content table.
drop policy if exists "Public read resumes" on public.resumes;
create policy "Public read resumes" on public.resumes
  for select using (true);

drop policy if exists "Admin all resumes" on public.resumes;
create policy "Admin all resumes" on public.resumes
  for all using (auth.uid() is not null);

-- Public bucket so the PDF renders in an iframe and the hero link works.
-- The storage.objects policies in storage_policies.sql are global, so they
-- already cover this bucket.
insert into storage.buckets (id, name, public, file_size_limit)
values ('resumes', 'resumes', true, 10485760)
  on conflict (id) do nothing;
