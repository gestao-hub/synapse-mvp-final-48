import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Parse request body
    const { query, limit = 5 } = await req.json();
    
    if (!query) {
      throw new Error('Query não fornecida');
    }

    console.log(`Buscando chunks similares para: "${query}"`);

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query, OPENAI_API_KEY);
    console.log(`Embedding gerado para query (${queryEmbedding.length} dimensões)`);

    // Search for similar chunks using vector similarity
    const { data: chunks, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7, // minimum similarity threshold
      match_count: limit,
      user_id_filter: user.id
    });

    if (error) {
      console.error('Erro na busca por chunks:', error);
      
      // Fallback: simple text search if vector search fails
      const { data: fallbackChunks, error: fallbackError } = await supabase
        .from('docs_chunks')
        .select('id, filename, content, chunk_index, metadata')
        .eq('user_id', user.id)
        .textSearch('content', query)
        .limit(limit);

      if (fallbackError) {
        throw fallbackError;
      }

      console.log(`Busca por texto encontrou ${fallbackChunks?.length || 0} chunks`);
      
      return new Response(
        JSON.stringify({
          success: true,
          chunks: fallbackChunks || [],
          method: 'text_search',
          query,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Busca por similaridade encontrou ${chunks?.length || 0} chunks`);

    return new Response(
      JSON.stringify({
        success: true,
        chunks: chunks || [],
        method: 'vector_search',
        query,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Erro na busca RAG:', error);
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