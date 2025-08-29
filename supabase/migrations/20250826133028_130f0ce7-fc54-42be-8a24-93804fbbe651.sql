-- Corrigir a última função que está causando aviso de segurança
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;