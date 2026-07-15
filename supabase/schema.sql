-- Portfolio Database Schema
-- Run this in Supabase SQL Editor FIRST, then run seed.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILE (single row)
-- ============================================
create table public.profile (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  title text not null,
  handle text not null,
  tagline text,
  status text default 'Online',
  location text,
  bio text,
  avatar_url text,
  about_highlights jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- EXPERIENCES
-- ============================================
create table public.experiences (
  id uuid primary key default uuid_generate_v4(),
  role text not null,
  company text not null,
  logo text,
  location text,
  period text,
  slug text unique not null,
  points jsonb default '[]'::jsonb,
  story text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- PROJECTS
-- ============================================
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  tagline text,
  period text,
  org text,
  image text,
  slug text unique not null,
  points jsonb default '[]'::jsonb,
  tech jsonb default '[]'::jsonb,
  story text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- EDUCATION
-- ============================================
create table public.education (
  id uuid primary key default uuid_generate_v4(),
  degree text not null,
  subject text,
  institution text not null,
  logo text,
  year text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CERTIFICATIONS
-- ============================================
create table public.certifications (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ============================================
-- PUBLICATIONS
-- ============================================
create table public.publications (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  authors jsonb default '[]'::jsonb,
  affiliations jsonb default '[]'::jsonb,
  conference text,
  location text,
  date text,
  doi text,
  pages text,
  keywords jsonb default '[]'::jsonb,
  abstract text,
  url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- SKILLS
-- ============================================
create table public.skills (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  color text,
  category text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ============================================
-- SOCIAL LINKS
-- ============================================
create table public.social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null,
  url text not null,
  label text,
  icon_svg text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ============================================
-- BLOGS
-- ============================================
create table public.blogs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  excerpt text,
  date text,
  image text,
  tags jsonb default '[]'::jsonb,
  content jsonb default '[]'::jsonb,
  slug text unique not null,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- GALLERY STORIES
-- ============================================
create table public.gallery_stories (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  image text,
  period text,
  slug text unique not null,
  story text,
  tags jsonb default '[]'::jsonb,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- NAV ITEMS
-- ============================================
create table public.nav_items (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  href text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ============================================
-- LEGACY LOGOS
-- ============================================
create table public.legacy_logos (
  id uuid primary key default uuid_generate_v4(),
  file text not null,
  number text not null,
  aspect text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ============================================
-- SITE CONFIG
-- ============================================
create table public.site_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
alter table public.profile enable row level security;
alter table public.experiences enable row level security;
alter table public.projects enable row level security;
alter table public.education enable row level security;
alter table public.certifications enable row level security;
alter table public.publications enable row level security;
alter table public.skills enable row level security;
alter table public.social_links enable row level security;
alter table public.blogs enable row level security;
alter table public.gallery_stories enable row level security;
alter table public.nav_items enable row level security;
alter table public.legacy_logos enable row level security;
alter table public.site_config enable row level security;

-- Public read policies
create policy "Public read profile" on public.profile for select using (true);
create policy "Public read experiences" on public.experiences for select using (true);
create policy "Public read projects" on public.projects for select using (true);
create policy "Public read education" on public.education for select using (true);
create policy "Public read certifications" on public.certifications for select using (true);
create policy "Public read publications" on public.publications for select using (true);
create policy "Public read skills" on public.skills for select using (true);
create policy "Public read social_links" on public.social_links for select using (true);
create policy "Public read blogs" on public.blogs for select using (true);
create policy "Public read gallery_stories" on public.gallery_stories for select using (true);
create policy "Public read nav_items" on public.nav_items for select using (true);
create policy "Public read legacy_logos" on public.legacy_logos for select using (true);
create policy "Public read site_config" on public.site_config for select using (true);

-- Authenticated full access policies (admin only)
create policy "Admin all profile" on public.profile for all using (auth.uid() is not null);
create policy "Admin all experiences" on public.experiences for all using (auth.uid() is not null);
create policy "Admin all projects" on public.projects for all using (auth.uid() is not null);
create policy "Admin all education" on public.education for all using (auth.uid() is not null);
create policy "Admin all certifications" on public.certifications for all using (auth.uid() is not null);
create policy "Admin all publications" on public.publications for all using (auth.uid() is not null);
create policy "Admin all skills" on public.skills for all using (auth.uid() is not null);
create policy "Admin all social_links" on public.social_links for all using (auth.uid() is not null);
create policy "Admin all blogs" on public.blogs for all using (auth.uid() is not null);
create policy "Admin all gallery_stories" on public.gallery_stories for all using (auth.uid() is not null);
create policy "Admin all nav_items" on public.nav_items for all using (auth.uid() is not null);
create policy "Admin all legacy_logos" on public.legacy_logos for all using (auth.uid() is not null);
create policy "Admin all site_config" on public.site_config for all using (auth.uid() is not null);
