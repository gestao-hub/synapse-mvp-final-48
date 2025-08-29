-- Create sessions_live table
CREATE TABLE public.sessions_live (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  track TEXT NOT NULL,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  transcript_user TEXT,
  transcript_ai TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sessions_live_turns table
CREATE TABLE public.sessions_live_turns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  turn_index INTEGER NOT NULL,
  speaker TEXT NOT NULL, -- 'user' or 'ai'
  content TEXT NOT NULL,
  timestamp_ms INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sessions_live ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions_live_turns ENABLE ROW LEVEL SECURITY;

-- Create policies for sessions_live
CREATE POLICY "Users can view their own live sessions" 
ON public.sessions_live 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own live sessions" 
ON public.sessions_live 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own live sessions" 
ON public.sessions_live 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for sessions_live_turns
CREATE POLICY "Users can view their own live session turns" 
ON public.sessions_live_turns 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.sessions_live sl 
  WHERE sl.id = sessions_live_turns.session_id 
  AND sl.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own live session turns" 
ON public.sessions_live_turns 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.sessions_live sl 
  WHERE sl.id = sessions_live_turns.session_id 
  AND sl.user_id = auth.uid()
));

-- Add foreign key constraint
ALTER TABLE public.sessions_live_turns 
ADD CONSTRAINT fk_session_live 
FOREIGN KEY (session_id) REFERENCES public.sessions_live(id) 
ON DELETE CASCADE;

-- Add updated_at trigger using existing function
CREATE TRIGGER update_sessions_live_updated_at
BEFORE UPDATE ON public.sessions_live
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();