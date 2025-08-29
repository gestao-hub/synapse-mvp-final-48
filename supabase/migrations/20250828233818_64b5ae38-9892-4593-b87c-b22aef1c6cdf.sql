-- Recriar views simples sem RLS (elas herdam as permissões das tabelas base)
CREATE OR REPLACE VIEW v_live_session_metrics AS
SELECT 
  sl.track as area,
  sl.user_id,
  COUNT(sl.id) as total_sessions,
  AVG(sl.score_overall) as avg_score,
  AVG(sl.duration_ms::DECIMAL / 60000) as avg_duration_minutes,
  COUNT(CASE WHEN sl.completed_at IS NOT NULL THEN 1 END) as completed_sessions,
  DATE_TRUNC('month', sl.created_at) as month_year
FROM sessions_live sl
WHERE sl.score_overall IS NOT NULL
GROUP BY sl.track, sl.user_id, DATE_TRUNC('month', sl.created_at);

CREATE OR REPLACE VIEW v_live_session_criteria_metrics AS
SELECT 
  sl.track as area,
  sl.user_id,
  slm.criterion_key,
  slm.criterion_label,
  AVG(slm.score) as avg_score,
  COUNT(slm.id) as evaluation_count,
  DATE_TRUNC('month', sl.created_at) as month_year
FROM sessions_live sl
JOIN sessions_live_metrics slm ON sl.id = slm.session_id
GROUP BY sl.track, sl.user_id, slm.criterion_key, slm.criterion_label, DATE_TRUNC('month', sl.created_at);