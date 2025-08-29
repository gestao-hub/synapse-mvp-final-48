-- Enable vector extension first
CREATE EXTENSION IF NOT EXISTS vector;

-- Create docs_chunks table for storing document embeddings
CREATE TABLE public.docs_chunks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  filename TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 embedding dimension
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for similarity search
CREATE INDEX docs_chunks_embedding_idx ON public.docs_chunks 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create index for user filtering
CREATE INDEX docs_chunks_user_id_idx ON public.docs_chunks (user_id);

-- Enable RLS
ALTER TABLE public.docs_chunks ENABLE ROW LEVEL SECURITY;

-- Create policies for docs_chunks
CREATE POLICY "Users can view their own document chunks" 
ON public.docs_chunks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own document chunks" 
ON public.docs_chunks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own document chunks" 
ON public.docs_chunks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own document chunks" 
ON public.docs_chunks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_docs_chunks_updated_at
BEFORE UPDATE ON public.docs_chunks
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();