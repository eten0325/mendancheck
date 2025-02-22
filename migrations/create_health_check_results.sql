create table public.health_check_results (
  id text primary key,
  user_id text not null,
  total_score integer not null,
  bmi numeric not null,
  bmi_evaluation text not null,
  systolic_blood_pressure integer not null,
  diastolic_blood_pressure integer not null,
  bp_evaluation text not null,
  blood_sugar numeric not null,
  hba1c numeric not null,
  glucose_evaluation text not null,
  ldl_cholesterol numeric not null,
  tg numeric not null,
  lipid_evaluation text not null,
  ast numeric not null,
  alt numeric not null,
  gamma_gtp numeric not null,
  liver_evaluation text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLSポリシーの設定
alter table public.health_check_results enable row level security;

create policy "Enable read access for all users"
  on public.health_check_results for select
  using (true);

create policy "Enable insert access for all users"
  on public.health_check_results for insert
  with check (true);

create policy "Enable update access for all users"
  on public.health_check_results for update
  using (true)
  with check (true);