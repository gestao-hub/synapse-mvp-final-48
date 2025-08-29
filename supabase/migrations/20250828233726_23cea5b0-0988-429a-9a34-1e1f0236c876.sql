-- Adicionar campos de métricas às sessões live
ALTER TABLE sessions_live 
ADD COLUMN IF NOT EXISTS score_overall DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS metrics_detailed JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS feedback_summary TEXT;

-- Criar tabela para métricas detalhadas por critério das sessões live
CREATE TABLE IF NOT EXISTS sessions_live_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES sessions_live(id) ON DELETE CASCADE,
  criterion_key TEXT NOT NULL,
  criterion_label TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),
  feedback TEXT,
  weight INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na nova tabela
ALTER TABLE sessions_live_metrics ENABLE ROW LEVEL SECURITY;

-- Policies para sessions_live_metrics
CREATE POLICY "Users can view their own live session metrics" 
ON sessions_live_metrics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM sessions_live sl 
  WHERE sl.id = sessions_live_metrics.session_id 
  AND sl.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own live session metrics" 
ON sessions_live_metrics 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM sessions_live sl 
  WHERE sl.id = sessions_live_metrics.session_id 
  AND sl.user_id = auth.uid()
));

-- Criar view para métricas agregadas por área
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

-- Criar view para métricas por critério
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_sessions_live_user_track ON sessions_live(user_id, track);
CREATE INDEX IF NOT EXISTS idx_sessions_live_created_at ON sessions_live(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_live_metrics_session ON sessions_live_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_live_metrics_criterion ON sessions_live_metrics(criterion_key);