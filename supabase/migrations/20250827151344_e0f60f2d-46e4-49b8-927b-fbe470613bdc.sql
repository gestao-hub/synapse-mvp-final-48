-- Corrige problemas de segurança das views criadas

-- Remove as views com SECURITY DEFINER implícito
drop view if exists public.v_simulation_result;
drop view if exists public.v_metric_by_criterion;

-- Recria as views sem SECURITY DEFINER (padrão é SECURITY INVOKER)
create view public.v_simulation_result 
with (security_invoker = true) as
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

create view public.v_metric_by_criterion 
with (security_invoker = true) as
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