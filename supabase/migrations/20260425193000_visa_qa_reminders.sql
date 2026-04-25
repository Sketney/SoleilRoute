create table if not exists visa_manual_overrides (
  id uuid primary key default gen_random_uuid(),
  citizenship text not null,
  destination text not null,
  visa_required boolean not null,
  visa_type text null,
  validity text null,
  processing_time text null,
  cost numeric(10,2) null,
  currency text null,
  embassy_url text null,
  application_url text null,
  passport_validity text null,
  notes text null,
  source_url text null,
  is_active boolean not null default true,
  created_by uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists visa_issue_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  trip_id uuid null references trips(id) on delete set null,
  visa_check_id uuid null references visa_checks(id) on delete set null,
  citizenship text not null,
  destination text not null,
  issue text not null,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reminder_deliveries (
  id uuid primary key default gen_random_uuid(),
  timeline_item_id uuid not null references timeline_items(id) on delete cascade,
  trip_id uuid not null references trips(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  notification_id uuid null references notifications(id) on delete set null,
  delivered_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique(timeline_item_id)
);

create index if not exists visa_manual_overrides_pair_idx
  on visa_manual_overrides(citizenship, destination, is_active);
create index if not exists visa_issue_reports_status_idx
  on visa_issue_reports(status, created_at desc);
create index if not exists reminder_deliveries_user_idx
  on reminder_deliveries(user_id, delivered_at desc);
