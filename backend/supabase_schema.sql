-- ═══════════════════════════════════════════════════════════════════════════
-- AquaGov Supabase Schema
-- Run in Supabase SQL Editor: Dashboard → SQL Editor → New Query → Paste → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Enable UUID extension ─────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Districts ─────────────────────────────────────────────────────────────────
create table if not exists districts (
  id          serial primary key,
  name        text not null,
  state       text not null default 'Maharashtra',
  pincode     text,
  lat         double precision,
  lng         double precision,
  created_at  timestamptz default now()
);

-- Seed districts
insert into districts (id, name, state, lat, lng) values
  (1,  'Beed',       'Maharashtra', 18.99, 75.76),
  (2,  'Latur',      'Maharashtra', 18.40, 76.56),
  (3,  'Osmanabad',  'Maharashtra', 18.18, 76.04),
  (4,  'Solapur',    'Maharashtra', 17.68, 75.90),
  (5,  'Aurangabad', 'Maharashtra', 19.88, 75.33),
  (6,  'Nanded',     'Maharashtra', 19.16, 77.31),
  (7,  'Jalgaon',    'Maharashtra', 21.00, 75.56),
  (8,  'Buldhana',   'Maharashtra', 20.53, 76.18),
  (9,  'Washim',     'Maharashtra', 20.11, 77.13),
  (10, 'Yavatmal',   'Maharashtra', 20.39, 78.12)
on conflict (id) do nothing;

-- ── ML Predictions ────────────────────────────────────────────────────────────
create table if not exists predictions (
  id            uuid primary key default uuid_generate_v4(),
  district_id   int references districts(id),
  district_name text,
  drought_prob  double precision,
  risk_level    text check (risk_level in ('LOW','MEDIUM','HIGH','CRITICAL')),
  horizon_days  int default 7,
  model_version text,
  predicted_at  timestamptz default now()
);

create index if not exists idx_predictions_district_time
  on predictions (district_id, predicted_at desc);

-- ── Climate Observations ─────────────────────────────────────────────────────
create table if not exists climate_observations (
  id          uuid primary key default uuid_generate_v4(),
  district_id int references districts(id),
  date        date not null,
  rainfall    double precision,
  temperature double precision,
  humidity    double precision,
  rain_7d     double precision,
  rain_30d    double precision,
  recorded_at timestamptz default now()
);

create unique index if not exists idx_climate_district_date
  on climate_observations (district_id, date);

-- ── Tankers ───────────────────────────────────────────────────────────────────
create table if not exists tankers (
  id                  serial primary key,
  vehicle_number      text unique not null,
  driver_name         text,
  current_lat         double precision,
  current_lng         double precision,
  status              text default 'idle' check (status in ('active','loading','maintenance','idle')),
  capacity_liters     int default 10000,
  current_load_liters int default 0,
  route_id            text,
  eta_minutes         int,
  district_id         int references districts(id),
  last_updated        timestamptz default now()
);

-- ── Subscribers (SMS) ─────────────────────────────────────────────────────────
create table if not exists subscribers (
  id           uuid primary key default uuid_generate_v4(),
  phone        text unique not null,
  pincode      text,
  "group"      text default 'farmers',
  name         text,
  registered   timestamptz default now(),
  active       boolean default true
);

-- ── SMS Campaigns ─────────────────────────────────────────────────────────────
create table if not exists sms_campaigns (
  id            text primary key,
  message       text,
  target_group  text,
  recipients    int,
  sent          int,
  failed        int,
  delivery_rate double precision,
  created_at    timestamptz default now()
);

-- ── Users ─────────────────────────────────────────────────────────────────────
create table if not exists users (
  id          serial primary key,
  name        text not null,
  email       text unique not null,
  role        text check (role in ('admin','dwo','block_manager','operator','viewer')),
  region      text,
  phone       text,
  status      text default 'active' check (status in ('active','inactive')),
  created_at  timestamptz default now(),
  last_active timestamptz
);

-- ── Alerts / Notifications ────────────────────────────────────────────────────
create table if not exists alerts (
  id          uuid primary key default uuid_generate_v4(),
  type        text not null,   -- 'vwsi_escalation' | 'tanker_breakdown' | 'sms_failure'
  title       text not null,
  detail      text,
  district_id int references districts(id),
  severity    text default 'medium' check (severity in ('low','medium','high','critical')),
  acknowledged boolean default false,
  created_at  timestamptz default now()
);

-- ── Row Level Security (RLS) ─────────────────────────────────────────────────
alter table districts          enable row level security;
alter table predictions        enable row level security;
alter table climate_observations enable row level security;
alter table tankers             enable row level security;
alter table subscribers        enable row level security;
alter table sms_campaigns      enable row level security;
alter table users              enable row level security;
alter table alerts             enable row level security;

-- Allow all reads for anonymous (tighten in production)
create policy "allow_read_all" on districts          for select using (true);
create policy "allow_read_all" on predictions        for select using (true);
create policy "allow_read_all" on climate_observations for select using (true);
create policy "allow_read_all" on tankers            for select using (true);
create policy "allow_read_all" on sms_campaigns      for select using (true);
create policy "allow_read_all" on users              for select using (true);
create policy "allow_read_all" on alerts             for select using (true);

-- Service-role key can write (backend uses service role)
create policy "service_write" on predictions         for all using (true);
create policy "service_write" on climate_observations for all using (true);
create policy "service_write" on tankers              for all using (true);
create policy "service_write" on subscribers          for all using (true);
create policy "service_write" on sms_campaigns        for all using (true);
create policy "service_write" on users                for all using (true);
create policy "service_write" on alerts               for all using (true);
