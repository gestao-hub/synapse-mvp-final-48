import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      sessionId, 
      userTranscript, 
      aiTranscript, 
      turnIndex,
      speakerType // 'user' or 'ai'
    } = await req.json();

    console.log('💾 Salvando transcript em tempo real:', {
      sessionId,
      turnIndex,
      speakerType,
      textLength: (userTranscript || aiTranscript || '').length
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Salvar o turno específico na tabela sessions_live_turns
    if (speakerType && (userTranscript || aiTranscript)) {
      const { error: turnError } = await supabase
        .from('sessions_live_turns')
        .insert({
          session_id: sessionId,
          turn_index: turnIndex || 0,
          speaker: speakerType,
          content: userTranscript || aiTranscript,
          timestamp_ms: Date.now()
        });

      if (turnError) {
        console.error('❌ Erro ao salvar turno:', turnError);
      } else {
        console.log('✅ Turno salvo com sucesso');
      }
    }

    // 2. Buscar todos os turnos da sessão para atualizar os transcripts completos
    const { data: allTurns, error: fetchError } = await supabase
      .from('sessions_live_turns')
      .select('speaker, content')
      .eq('session_id', sessionId)
      .order('turn_index', { ascending: true });

    if (fetchError) {
      console.error('❌ Erro ao buscar turnos:', fetchError);
      throw fetchError;
    }

    // 3. Montar transcripts completos
    const userMessages = allTurns
      ?.filter(turn => turn.speaker === 'user')
      ?.map(turn => turn.content)
      ?.join('\n') || '';

    const aiMessages = allTurns
      ?.filter(turn => turn.speaker === 'ai')
      ?.map(turn => turn.content)
      ?.join('\n') || '';

    console.log('📝 Transcripts montados:', {
      userLines: userMessages.split('\n').filter(Boolean).length,
      aiLines: aiMessages.split('\n').filter(Boolean).length
    });

    // 4. Atualizar a sessão principal com os transcripts completos
    const { error: updateError } = await supabase
      .from('sessions_live')
      .update({
        transcript_user: userMessages || null,
        transcript_ai: aiMessages || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('❌ Erro ao atualizar sessão:', updateError);
      throw updateError;
    }

    console.log('✅ Transcript salvo e sessão atualizada com sucesso');

    return new Response(JSON.stringify({ 
      success: true,
      sessionId,
      userTranscriptLength: userMessages.length,
      aiTranscriptLength: aiMessages.length,
      totalTurns: allTurns?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erro ao salvar transcript:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});