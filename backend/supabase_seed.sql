-- ============================================================
--  AquaGov – Supabase Seed Script
--  Paste into: Supabase Dashboard → SQL Editor → New Query → Run
--
--  NOTE: predictions table is left EMPTY on purpose.
--  Run the cron job after this to populate it from the real LSTM model:
--      cd backend
--      python -m app.cron.daily_predict
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- 1. USERS
-- ─────────────────────────────────────────────────────────────
create table if not exists users (
  id          bigint primary key,
  name        text not null,
  email       text unique not null,
  role        text not null default 'viewer',
  region      text,
  phone       text,
  status      text not null default 'active',
  created_at  timestamptz default now(),
  last_active timestamptz
);

insert into users (id, name, email, role, region, phone, status, created_at, last_active) values
  (1, 'Rajesh Patil',  'rajesh.p@maharashtra.gov.in', 'admin',         'Beed District',  '+919876540001', 'active',   '2024-01-01T00:00:00Z', now()),
  (2, 'Amit Kumar',    'amit.k@maharashtra.gov.in',   'block_manager', 'Parli Block',     '+919876540002', 'active',   '2024-01-05T00:00:00Z', now()),
  (3, 'Priya Sharma',  'priya.s@maharashtra.gov.in',  'block_manager', 'Majalgaon Block', '+919876540003', 'inactive', '2024-02-01T00:00:00Z', null),
  (4, 'Suresh Nair',   'suresh.n@maharashtra.gov.in', 'operator',      'Khamgaon',        '+919876540004', 'active',   '2024-03-10T00:00:00Z', now()),
  (5, 'Meena Jadhav',  'meena.j@maharashtra.gov.in',  'dwo',           'Latur District',  '+919876540005', 'active',   '2024-04-01T00:00:00Z', now())
on conflict (id) do nothing;


-- ─────────────────────────────────────────────────────────────
-- 2. PREDICTIONS  (populated by the ML cron job — NOT seeded here)
--    Run:  cd backend && python -m app.cron.daily_predict
-- ─────────────────────────────────────────────────────────────
create table if not exists predictions (
  id            bigint generated always as identity primary key,
  district_id   int not null,
  district_name text,
  drought_prob  float not null,
  risk_level    text not null,
  horizon_days  int default 7,
  model_version text,
  predicted_at  timestamptz default now()
);


-- ─────────────────────────────────────────────────────────────
-- 3. TANKERS  (fleet of 24)
-- ─────────────────────────────────────────────────────────────
create table if not exists tankers (
  id                  bigint primary key,
  vehicle_number      text unique not null,
  driver_name         text,
  current_lat         float,
  current_lng         float,
  status              text default 'active',
  capacity_liters     int default 10000,
  current_load_liters int default 0,
  route_id            text,
  eta_minutes         int,
  district_id         int,
  last_updated        timestamptz default now()
);

insert into tankers (id, vehicle_number, driver_name, current_lat, current_lng, status, capacity_liters, current_load_liters, route_id, eta_minutes, district_id) values
  (1,  'MH-14-AB-1201', 'Rajiv Nair',    18.894, 75.460, 'active',      10000, 4886, 'R-01', 36, 2),
  (2,  'MH-14-AB-1202', 'Amit Patil',    18.623, 75.346, 'loading',     10000, 7348, 'R-02', 73, 3),
  (3,  'MH-14-AB-1203', 'Dinesh Yadav',  18.580, 75.884, 'active',      10000, 6454, 'R-03', 83, 4),
  (4,  'MH-14-AB-1204', 'Prashant More', 19.078, 76.053, 'active',      10000, 9736, 'R-04', 54, 5),
  (5,  'MH-14-AB-1205', 'Vinod Shinde',  19.351, 75.473, 'loading',     10000, 8411,  null,  27, 6),
  (6,  'MH-14-AB-1206', 'Suresh Kumar',  19.340, 75.599, 'maintenance', 10000, 8549, 'R-06', 16, 7),
  (7,  'MH-14-AB-1207', 'Rajiv Nair',    18.959, 75.663, 'active',      10000, 7570, 'R-07',  5, 8),
  (8,  'MH-14-AB-1208', 'Amit Patil',    18.915, 75.623, 'maintenance', 10000, 3662, 'R-08', 64, 9),
  (9,  'MH-14-AB-1209', 'Dinesh Yadav',  19.009, 75.458, 'loading',     10000, 3420, 'R-09', 50, 10),
  (10, 'MH-14-AB-1210', 'Prashant More', 18.619, 76.212, 'active',      10000, 9123,  null,  61, 1),
  (11, 'MH-14-AB-1211', 'Vinod Shinde',  19.085, 76.243, 'maintenance', 10000, 8409, 'R-11', 27, 2),
  (12, 'MH-14-AB-1212', 'Suresh Kumar',  18.527, 75.283, 'loading',     10000, 8602, 'R-12', 58, 3),
  (13, 'MH-14-AB-1213', 'Rajiv Nair',    18.571, 75.685, 'active',      10000, 4170, 'R-13', 44, 4),
  (14, 'MH-14-AB-1214', 'Amit Patil',    19.107, 75.641, 'active',      10000, 7287, 'R-14', 56, 5),
  (15, 'MH-14-AB-1215', 'Dinesh Yadav',  18.691, 76.047, 'active',      10000, 8246,  null,  32, 6),
  (16, 'MH-14-AB-1216', 'Prashant More', 18.933, 75.805, 'active',      10000, 5898, 'R-16', 65, 7),
  (17, 'MH-14-AB-1217', 'Vinod Shinde',  19.412, 75.391, 'maintenance', 10000, 9381, 'R-17', 24, 8),
  (18, 'MH-14-AB-1218', 'Suresh Kumar',  19.098, 75.668, 'active',      10000, 3972, 'R-18', 23, 9),
  (19, 'MH-14-AB-1219', 'Rajiv Nair',    18.786, 76.251, 'loading',     10000, 4192, 'R-19', 31, 10),
  (20, 'MH-14-AB-1220', 'Amit Patil',    19.370, 75.579, 'loading',     10000, 9536,  null,  34, 1),
  (21, 'MH-14-AB-1221', 'Dinesh Yadav',  19.336, 75.377, 'active',      10000, 4523, 'R-21', 14, 2),
  (22, 'MH-14-AB-1222', 'Prashant More', 18.991, 75.271, 'active',      10000, 5764, 'R-22', 32, 3),
  (23, 'MH-14-AB-1223', 'Vinod Shinde',  18.867, 75.597, 'loading',     10000, 6161, 'R-23', 58, 4),
  (24, 'MH-14-AB-1224', 'Suresh Kumar',  19.304, 75.794, 'active',      10000, 3307, 'R-24', 52, 5)
on conflict (id) do nothing;


-- ─────────────────────────────────────────────────────────────
-- 4. SMS_CAMPAIGNS  (broadcast history)
-- ─────────────────────────────────────────────────────────────
create table if not exists sms_campaigns (
  id            text primary key,
  message       text not null,
  target_group  text not null,
  recipients    int default 0,
  sent          int default 0,
  failed        int default 0,
  delivery_rate float default 0,
  created_at    timestamptz default now()
);

-- Done! ✅
-- Next step: populate predictions by running the ML cron:
--   cd backend
--   python -m app.cron.daily_predict
