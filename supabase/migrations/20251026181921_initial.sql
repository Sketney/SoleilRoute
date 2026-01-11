create extension if not exists "pgcrypto";

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  name text not null,
  destination_country text not null,
  destination_city text not null,
  start_date date not null,
  end_date date not null,
  total_budget numeric not null,
  currency text not null,
  base_currency text not null default 'USD',
  exchange_rate numeric,
  citizenship text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.budget_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  category text not null,
  description text,
  amount numeric not null,
  currency text not null,
  is_paid boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.visa_requirements (
  id uuid primary key default gen_random_uuid(),
  citizenship text not null,
  destination_country text not null,
  visa_required boolean not null default true,
  visa_type text,
  duration_days integer,
  cost numeric,
  currency text,
  embassy_url text,
  notes text,
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists visa_requirements_citizenship_destination_idx
  on public.visa_requirements (citizenship, destination_country);

create table if not exists public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  base_currency text not null,
  rates jsonb not null,
  fetched_at timestamptz not null default timezone('utc', now()),
  provider text not null default 'ExchangeRate API'
);

create unique index if not exists exchange_rates_base_currency_idx
  on public.exchange_rates (base_currency);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(user_id)
);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger set_trips_updated_at
  before update on public.trips
  for each row execute procedure public.handle_updated_at();

create trigger set_budget_items_updated_at
  before update on public.budget_items
  for each row execute procedure public.handle_updated_at();

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create or replace function public.calculate_trip_totals(target_trip uuid)
returns table(total_amount numeric, total_paid numeric)
language sql
as $$
  select
    coalesce(sum(amount), 0) as total_amount,
    coalesce(sum(case when is_paid then amount else 0 end), 0) as total_paid
  from public.budget_items
  where trip_id = target_trip;
$$;
