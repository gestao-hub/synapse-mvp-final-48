import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Text chunking function
function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end);
    
    // Try to break at word boundaries
    if (end < text.length) {
      const lastSpace = chunk.lastIndexOf(' ');
      if (lastSpace > chunkSize * 0.5) {
        chunks.push(chunk.slice(0, lastSpace).trim());
        start += lastSpace + 1;
      } else {
        chunks.push(chunk.trim());
        start = end;
      }
    } else {
      chunks.push(chunk.trim());
      break;
    }
    
    // Apply overlap for next chunk
    if (start > overlap) {
      start -= overlap;
    }
  }
  
  return chunks.filter(chunk => chunk.length > 0);
}

// Extract text from different file types
async function extractText(file: File): Promise<string> {
  const fileType = file.type || file.name.split('.').pop()?.toLowerCase();
  
  if (fileType?.includes('text') || file.name.endsWith('.txt')) {
    return await file.text();
  }
  
  if (fileType?.includes('pdf') || file.name.endsWith('.pdf')) {
    // For PDF extraction, we'll need a library like pdf-parse
    // For now, return a placeholder - in production you'd use pdf-parse
    throw new Error('PDF processing not implemented yet. Use TXT files for now.');
  }
  
  if (fileType?.includes('word') || file.name.endsWith('.docx')) {
    // For DOCX extraction, we'll need a library like mammoth
    // For now, return a placeholder - in production you'd use mammoth
    throw new Error('DOCX processing not implemented yet. Use TXT files for now.');
  }
  
  throw new Error(`Unsupported file type: ${fileType}`);
}

// Generate embeddings using OpenAI
async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Credenciais do Supabase não configuradas');
    }

    // Get auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header obrigatório');
    }

    // Create Supabase client with user's token
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      global: {
        headers: {
          authorization: authHeader,
        },
      },
    });

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('Arquivo não fornecido');
    }

    console.log(`Processando arquivo: ${file.name}, tipo: ${file.type}, tamanho: ${file.size}`);

    // Extract text from file
    const text = await extractText(file);
    console.log(`Texto extraído: ${text.length} caracteres`);

    // Chunk the text
    const chunks = chunkText(text);
    console.log(`Texto dividido em ${chunks.length} chunks`);

    // Process each chunk
    const results = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processando chunk ${i + 1}/${chunks.length}`);

      try {
        // Generate embedding
        const embedding = await generateEmbedding(chunk, OPENAI_API_KEY);
        
        // Save to database
        const { data, error } = await supabase
          .from('docs_chunks')
          .insert({
            user_id: user.id,
            filename: file.name,
            chunk_index: i,
            content: chunk,
            embedding: embedding,
            metadata: {
              file_size: file.size,
              file_type: file.type,
              chunk_length: chunk.length,
              total_chunks: chunks.length,
            },
          })
          .select()
          .single();

        if (error) {
          console.error(`Erro ao salvar chunk ${i}:`, error);
          throw error;
        }

        results.push({
          chunk_index: i,
          chunk_id: data.id,
          content_length: chunk.length,
        });

      } catch (error) {
        console.error(`Erro ao processar chunk ${i}:`, error);
        throw error;
      }
    }

    console.log(`Processamento concluído: ${results.length} chunks salvos`);

    return new Response(
      JSON.stringify({
        success: true,
        filename: file.name,
        total_chunks: chunks.length,
        chunks_processed: results.length,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Erro no processamento:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});