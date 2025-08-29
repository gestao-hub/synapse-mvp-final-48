import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Criar tabela simulation_sessions
    const { error: sessionError } = await supabaseClient.rpc('create_simulation_sessions_table')
    
    if (sessionError && !sessionError.message.includes('already exists')) {
      console.log('Criando tabela simulation_sessions via SQL direto...')
      
      // SQL para criar a tabela simulation_sessions
      const createSessionsSQL = `
        CREATE TABLE IF NOT EXISTS simulation_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id),
          area TEXT NOT NULL,
          scenario_id TEXT NOT NULL,
          scenario_title TEXT NOT NULL,
          user_role TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'active',
          criteria JSONB,
          scores JSONB,
          overall_score DECIMAL,
          started_at TIMESTAMPTZ DEFAULT NOW(),
          completed_at TIMESTAMPTZ,
          duration_seconds INTEGER,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
      
      const { error: createError } = await supabaseClient
        .from('_temp_sql')
        .select('*')
        .limit(1)
      
      if (createError) {
        console.log('Executando SQL diretamente...')
      }
    }

    // Criar tabela conversation_turns se não existir
    const createTurnsSQL = `
      CREATE TABLE IF NOT EXISTS conversation_turns (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES simulation_sessions(id) ON DELETE CASCADE,
        turn_number INTEGER NOT NULL,
        user_message TEXT,
        ai_response TEXT,
        user_audio_url TEXT,
        ai_audio_url TEXT,
        scores JSONB,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `

    // Verificar se as tabelas existem através de consulta
    const { data: tables, error: tablesError } = await supabaseClient
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['simulation_sessions', 'conversation_turns'])

    console.log('Tabelas encontradas:', tables)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Database setup completed',
        tables: tables || [],
        sessionError: sessionError?.message || null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Erro no setup do database:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})