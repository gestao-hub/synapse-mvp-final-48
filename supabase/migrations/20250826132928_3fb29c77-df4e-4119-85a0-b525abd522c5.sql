-- Adicionar coluna display_name se não existir e atualizar email para não-nulo
DO $$
BEGIN
  -- Adicionar display_name se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'display_name') THEN
    ALTER TABLE public.profiles ADD COLUMN display_name text;
  END IF;
  
  -- Tornar email não-nulo e único se ainda não for
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email' AND is_nullable = 'YES') THEN
    -- Primeiro, garantir que não há emails nulos
    UPDATE public.profiles SET email = 'user@example.com' WHERE email IS NULL;
    
    -- Depois tornar not null
    ALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;
    
    -- Adicionar constraint unique se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'profiles' AND constraint_type = 'UNIQUE' AND constraint_name LIKE '%email%') THEN
      ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
    END IF;
  END IF;
END $$;

-- Corrigir funções com search_path para segurança
CREATE OR REPLACE FUNCTION public.set_updated_at()
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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, auth
AS $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email,'@',1));
  return new;
end;
$$;

-- Recriar triggers
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();