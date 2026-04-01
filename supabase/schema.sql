-- =============================================
-- UX心理学図鑑 — Supabase Schema
-- =============================================

-- 1. 診断結果テーブル
create table if not exists analyses (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  analyzed_at timestamptz not null default now(),
  screenshot_path text,
  findings jsonb not null default '[]'::jsonb,
  scores jsonb not null default '{}'::jsonb,
  summary text not null default '',
  improvement_hints jsonb not null default '[]'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

-- 2. レート制限テーブル
create table if not exists rate_limits (
  ip text primary key,
  count integer not null default 0,
  reset_at timestamptz not null
);

-- 3. ページビュー追跡テーブル
create table if not exists page_views (
  id bigint generated always as identity primary key,
  page_path text not null,
  page_type text not null check (page_type in ('home', 'principle', 'category', 'analyze', 'other')),
  principle_id text,
  category text,
  referrer text,
  user_agent text,
  ip_address text,
  created_at timestamptz not null default now()
);

-- =============================================
-- インデックス
-- =============================================
create index if not exists idx_analyses_created_at on analyses (created_at desc);
create index if not exists idx_rate_limits_reset_at on rate_limits (reset_at);
create index if not exists idx_page_views_created_at on page_views (created_at desc);
create index if not exists idx_page_views_page_type on page_views (page_type);
create index if not exists idx_page_views_principle_id on page_views (principle_id);
create index if not exists idx_page_views_category on page_views (category);
create index if not exists idx_page_views_path_time on page_views (page_path, created_at desc);

-- =============================================
-- RLS (Row Level Security)
-- =============================================
alter table analyses enable row level security;
alter table rate_limits enable row level security;
alter table page_views enable row level security;

-- analyses: 誰でも閲覧、service roleのみ挿入
create policy "Anyone can view analyses" on analyses for select using (true);
create policy "Service role can insert analyses" on analyses for insert with check (true);

-- rate_limits: service roleのみ
create policy "Service role can manage rate_limits" on rate_limits for all using (true);

-- page_views: service roleが挿入、誰でも読み取り
create policy "Anyone can view page_views" on page_views for select using (true);
create policy "Service role can insert page_views" on page_views for insert with check (true);

-- =============================================
-- Storage: screenshots バケット
-- Supabaseダッシュボードから public で作成してください
-- =============================================
