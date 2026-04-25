create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  trip_id uuid null references trips(id) on delete set null,
  product_type text not null check (product_type in ('trip_pass', 'monthly_pro', 'annual_pro')),
  provider text not null,
  provider_checkout_id text null,
  provider_payment_id text null,
  status text not null check (status in ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  amount numeric(10,2) not null,
  currency text not null,
  paid_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  provider text not null,
  provider_subscription_id text null,
  plan text not null check (plan in ('monthly_pro', 'annual_pro')),
  status text not null check (status in ('active', 'past_due', 'canceled', 'expired')),
  current_period_start timestamptz null,
  current_period_end timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists trip_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  trip_id uuid not null references trips(id) on delete cascade,
  entitlement_type text not null check (entitlement_type in ('trip_pass', 'pro_subscription', 'admin_grant')),
  status text not null check (status in ('active', 'revoked', 'expired')),
  source_purchase_id uuid null references purchases(id) on delete set null,
  granted_at timestamptz not null default now(),
  expires_at timestamptz null,
  created_at timestamptz not null default now(),
  unique(user_id, trip_id, entitlement_type)
);

create table if not exists trip_plans (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  version integer not null default 1,
  status text not null check (status in ('preview', 'full')),
  plan_json jsonb not null,
  generated_at timestamptz not null,
  visa_checked_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(trip_id)
);

create index if not exists purchases_user_id_idx on purchases(user_id);
create index if not exists purchases_trip_id_idx on purchases(trip_id);
create index if not exists subscriptions_user_id_idx on subscriptions(user_id);
create index if not exists trip_entitlements_user_trip_idx on trip_entitlements(user_id, trip_id);
create index if not exists trip_plans_trip_id_idx on trip_plans(trip_id);
