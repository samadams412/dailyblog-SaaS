-- Blog series: independent of category, one series per post, manual order within it.
create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

alter table public.blog
  add column if not exists series_id uuid references public.series(id) on delete set null,
  add column if not exists series_order integer;

alter table public.series enable row level security;

-- Public can read series (needed to render a series index/listing).
create policy "series_select" on public.series
  for select using (true);

-- Writes mirror the existing admin-only policy shape on blog/blog_content.
create policy "series_insert" on public.series
  for insert with check (is_admin());

create policy "series_update" on public.series
  for update using (is_admin()) with check (is_admin());

create policy "series_delete" on public.series
  for delete using (is_admin());
