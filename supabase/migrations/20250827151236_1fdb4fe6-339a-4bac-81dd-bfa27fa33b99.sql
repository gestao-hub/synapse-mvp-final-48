-- AREAS: 'rh' | 'comercial' | 'educacional' | 'gestao'
-- MODOS: 'turn' | 'live'

create table if not exists public.scenarios (
  id uuid primary key default gen_random_uuid(),
  area text not null check (area in ('rh','comercial','educacional','gestao')),
  title text not null,
  description text,
  role_options jsonb not null default '["lado_a","lado_b"]'::jsonb,
  criteria jsonb not null, -- [{key,label,weight}]
  tags text[] default '{}',
  persona jsonb,           -- instruções de "personagem" da IA
  created_at timestamptz default now()
);

create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id uuid not null references public.scenarios(id) on delete restrict,
  mode text not null check (mode in ('turn','live')),
  role text not null,      -- papel escolhido
  started_at timestamptz default now(),
  ended_at timestamptz,
  duration_sec int,
  kpis jsonb,              -- {talk_ratio, first_response_ms, open_questions, next_step_marked, ...}
  notes jsonb,             -- {highlights, improvements, next_steps}
  recording_url text,
  transcript_url text
);

create table if not exists public.simulation_scores (
  id bigserial primary key,
  simulation_id uuid not null references public.simulations(id) on delete cascade,
  criterion_key text not null,
  criterion_label text not null,
  weight int not null default 1,
  score int not null check (score between 0 and 10),
  feedback text
);

create table if not exists public.minutes_log (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default current_date,
  whisper_sec int default 0,
  tts_sec int default 0,
  webrtc_sec int default 0
);

-- Índices
create index if not exists idx_simulations_user on public.simulations(user_id);
create index if not exists idx_simulations_scenario on public.simulations(scenario_id);
create index if not exists idx_scores_sim on public.simulation_scores(simulation_id);
create index if not exists idx_scenarios_area on public.scenarios(area);

-- RLS
alter table public.simulations enable row level security;
alter table public.simulation_scores enable row level security;
alter table public.minutes_log enable row level security;

-- Policies: cada usuário vê só o que é dele
drop policy if exists p_select_simulations on public.simulations;
create policy p_select_simulations on public.simulations
for select using (auth.uid() = user_id);

drop policy if exists p_insert_simulations on public.simulations;
create policy p_insert_simulations on public.simulations
for insert with check (auth.uid() = user_id);

drop policy if exists p_update_simulations on public.simulations;
create policy p_update_simulations on public.simulations
for update using (auth.uid() = user_id);

drop policy if exists p_select_scores on public.simulation_scores;
create policy p_select_scores on public.simulation_scores
for select using (exists (select 1 from public.simulations s where s.id = simulation_id and s.user_id = auth.uid()));

drop policy if exists p_insert_scores on public.simulation_scores;
create policy p_insert_scores on public.simulation_scores
for insert with check (exists (select 1 from public.simulations s where s.id = simulation_id and s.user_id = auth.uid()));

drop policy if exists p_select_minutes on public.minutes_log;
create policy p_select_minutes on public.minutes_log
for select using (auth.uid() = user_id);

drop policy if exists p_insert_minutes on public.minutes_log;
create policy p_insert_minutes on public.minutes_log
for insert with check (auth.uid() = user_id);

-- Views de métricas (nota geral e médias por critério)
create or replace view public.v_simulation_result as
select
  s.id as simulation_id,
  s.user_id,
  sc.area,
  sc.title as scenario_title,
  s.duration_sec,
  coalesce(
    round(
      (sum(ss.score * ss.weight)::numeric) /
      nullif(sum(ss.weight) * 10,0) * 100
    ), 0
  )::int as score_overall_calc
from simulations s
join scenarios sc on sc.id = s.scenario_id
left join simulation_scores ss on ss.simulation_id = s.id
group by s.id, s.user_id, sc.area, sc.title, s.duration_sec;

create or replace view public.v_metric_by_criterion as
select
  sc.area,
  sc.title as scenario_title,
  ss.criterion_key,
  ss.criterion_label,
  avg(ss.score)::numeric(5,2) as avg_score
from simulation_scores ss
join simulations s on s.id = ss.simulation_id
join scenarios sc on sc.id = s.scenario_id
group by sc.area, sc.title, ss.criterion_key, ss.criterion_label;