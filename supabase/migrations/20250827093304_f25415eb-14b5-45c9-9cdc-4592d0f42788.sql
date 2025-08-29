-- Create scenarios table
CREATE TABLE public.scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  track TEXT NOT NULL,
  name TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  voice_id TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- Create policies for scenarios (admin only for CRUD, read for all authenticated users)
CREATE POLICY "All authenticated users can view scenarios" 
ON public.scenarios 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Service role can manage scenarios" 
ON public.scenarios 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER update_scenarios_updated_at
BEFORE UPDATE ON public.scenarios
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Insert default scenarios for each track
INSERT INTO public.scenarios (track, name, system_prompt, voice_id, is_default) VALUES
('rh', 'Entrevista de Seleção', 'Você é um candidato em uma entrevista de emprego. Responda às perguntas do recrutador de forma natural e profissional, demonstrando suas qualificações e interesse na vaga.', 'EXAVITQu4vr4xnSDxMaL', true),
('comercial', 'Negociação com Cliente', 'Você é um cliente interessado em um produto/serviço, mas tem objeções sobre preço e benefícios. Seja realista nas suas objeções e permita que o vendedor trabalhe para te convencer.', 'CwhRBWXzGAHq8TQ4Fs17', true),
('educacional', 'Tutoria Estudantil', 'Você é um estudante que precisa de ajuda com o conteúdo. Faça perguntas relevantes e demonstre dificuldades realistas que um aluno teria no tema em questão.', '9BWtsMINqrJLrRacOk9x', true);