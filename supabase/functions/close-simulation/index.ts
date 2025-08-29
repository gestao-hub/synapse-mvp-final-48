import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const url = Deno.env.get("SUPABASE_URL")!;
const service = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
const sb = createClient(url, service);

interface CloseSimulationRequest {
  simulation_id: string;
  scores?: Array<{
    criterion_key: string;
    criterion_label: string;
    weight?: number;
    score: number;
    feedback?: string;
  }>;
  kpis?: {
    talk_ratio?: number;
    first_response_ms?: number;
    open_questions?: number;
    next_step_marked?: boolean;
  };
  notes?: {
    highlights?: string[];
    improvements?: string[];
    next_steps?: string[];
  };
  duration_sec?: number;
  recording_url?: string;
  transcript_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Use POST", { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body: CloseSimulationRequest = await req.json();
    console.log('Closing simulation:', body.simulation_id);

    const { 
      simulation_id, 
      scores = [], 
      kpis = {}, 
      notes = {}, 
      duration_sec, 
      recording_url, 
      transcript_url 
    } = body;

    if (!simulation_id) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'simulation_id is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Update simulation with end data
    console.log('Updating simulation with end data...');
    const { error: updateError } = await sb.from("simulations").update({
      ended_at: new Date().toISOString(),
      duration_sec,
      kpis,
      notes,
      recording_url: recording_url || null,
      transcript_url: transcript_url || null
    }).eq("id", simulation_id);

    if (updateError) {
      console.error('Error updating simulation:', updateError);
      return new Response(JSON.stringify({
        ok: false,
        error: 'Failed to update simulation: ' + updateError.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Insert scores if provided
    if (scores.length > 0) {
      console.log(`Inserting ${scores.length} scores...`);
      const rows = scores.map((s: any) => ({
        simulation_id,
        criterion_key: s.criterion_key,
        criterion_label: s.criterion_label,
        weight: s.weight ?? 1,
        score: s.score,
        feedback: s.feedback || null
      }));

      const { error: scoresError } = await sb.from("simulation_scores").insert(rows);

      if (scoresError) {
        console.error('Error inserting scores:', scoresError);
        return new Response(JSON.stringify({
          ok: false,
          error: 'Failed to insert scores: ' + scoresError.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Compute overall score from view
    console.log('Computing overall score...');
    const { data, error: viewError } = await sb
      .from("v_simulation_result")
      .select("score_overall_calc")
      .eq("simulation_id", simulation_id)
      .maybeSingle();

    if (viewError) {
      console.error('Error getting overall score:', viewError);
      return new Response(JSON.stringify({
        ok: false,
        error: 'Failed to compute overall score: ' + viewError.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const overall = data?.score_overall_calc ?? 0;
    console.log(`Simulation ${simulation_id} closed successfully. Overall score: ${overall}`);

    return new Response(JSON.stringify({ 
      ok: true, 
      overall,
      scores_inserted: scores.length
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Fatal error closing simulation:', error);
    return new Response(JSON.stringify({
      ok: false,
      error: error.message
    }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      }
    });
  }
});