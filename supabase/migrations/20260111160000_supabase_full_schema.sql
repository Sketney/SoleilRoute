create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  notifications_email_enabled boolean not null default true,
  notifications_in_app_enabled boolean not null default true,
  is_moderator boolean not null default false,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.sessions (
  token text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz not null
);

alter table if exists public.trips
  add column if not exists budget_tier text default 'mid';
alter table if exists public.trips
  add column if not exists notes text;
alter table if exists public.trips
  add column if not exists visa_status text default 'unknown';
alter table if exists public.trips
  add column if not exists visa_last_checked timestamptz;

alter table if exists public.trips
  drop constraint if exists trips_user_id_fkey;
alter table if exists public.trips
  add constraint trips_user_id_fkey
  foreign key (user_id) references public.users(id) on delete cascade;

create table if not exists public.budget_caps (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  category text not null,
  limit_amount numeric not null,
  currency text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists budget_caps_trip_category_idx
  on public.budget_caps (trip_id, category);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info',
  action_url text,
  created_at timestamptz not null default timezone('utc', now()),
  read_at timestamptz
);

create table if not exists public.visa_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  citizenship text not null,
  destination text not null,
  found boolean not null,
  visa_required boolean,
  visa_type text,
  validity text,
  processing_time text,
  cost numeric,
  currency text,
  embassy_url text,
  notes text,
  source text not null,
  checked_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  title text not null,
  due_date date not null,
  type text not null,
  status text not null,
  notes text,
  amount numeric,
  currency text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.trip_collaborators (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null,
  added_by uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.trip_invitations (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  invitee_user_id uuid not null references public.users(id) on delete cascade,
  invitee_email text not null,
  invited_by uuid not null references public.users(id) on delete cascade,
  role text not null,
  status text not null,
  created_at timestamptz not null default timezone('utc', now()),
  responded_at timestamptz
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.users(id) on delete cascade,
  author_email text not null,
  tag text not null,
  text text not null,
  image_url text,
  map_url text,
  created_at timestamptz not null default timezone('utc', now()),
  status text not null default 'pending',
  moderated_by uuid references public.users(id) on delete set null,
  moderated_at timestamptz,
  rejection_reason text
);

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  parent_id uuid references public.community_comments(id) on delete set null,
  author_id uuid not null references public.users(id) on delete cascade,
  author_email text not null,
  text text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.community_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists community_likes_unique
  on public.community_likes (post_id, user_id);

create table if not exists public.community_saves (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists community_saves_unique
  on public.community_saves (post_id, user_id);
