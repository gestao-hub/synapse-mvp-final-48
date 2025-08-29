import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://preview--synapse-voice-coach.lovable.app",
  "http://localhost:5173",
]);

function cors(origin: string | null) {
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin)
    ? origin
    : Array.from(ALLOWED_ORIGINS)[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin") ?? null;
  const baseHeaders = cors(origin);
  
  console.log(`[create-dev-user] Request received: ${req.method} from origin: ${origin}`);

  if (req.method === "OPTIONS") {
    console.log("[create-dev-user] Handling OPTIONS request");
    return new Response(null, { status: 204, headers: baseHeaders });
  }

  if (req.method !== "POST") {
    console.log(`[create-dev-user] Invalid method: ${req.method}`);
    return new Response(JSON.stringify({ error: "Método não permitido" }), {
      status: 405,
      headers: { ...baseHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    console.log("[create-dev-user] Parsing request body...");
    const { email, password } = await req.json();
    console.log(`[create-dev-user] Request data - email: ${email}, password length: ${password?.length}`);
    
    if (!email || !password) {
      console.log("[create-dev-user] Missing email or password");
      return new Response(JSON.stringify({ error: "email e password são obrigatórios" }), {
        status: 400,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL") || "https://roboonbdessuipvcpgve.supabase.co";
    const serviceRole =
      Deno.env.get("SUPABASE_SERVICE_ROLE") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    console.log("[create-dev-user] url?", !!supabaseUrl, supabaseUrl?.slice(-6));
    console.log("[create-dev-user] serviceRole?", !!serviceRole, serviceRole?.slice(-6));

    if (!supabaseUrl || !serviceRole) {
      console.error("[create-dev-user] Missing Supabase configuration", { 
        hasUrl: !!supabaseUrl, 
        hasServiceRole: !!serviceRole 
      });
      return new Response(JSON.stringify({ error: "Configuração do Supabase ausente" }), {
        status: 500,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[create-dev-user] Creating Supabase admin client...");
    const admin = createClient(supabaseUrl, serviceRole);

    console.log("[create-dev-user] Attempting to create user...");
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      console.error("Erro ao criar usuário:", error);
      
      // Se o usuário já existe, isso é OK para desenvolvimento
      if (error.message?.includes('already been registered') || error.message?.includes('email_exists')) {
        console.log("[create-dev-user] User already exists - that's OK for dev");
        return new Response(
          JSON.stringify({ ok: true, message: "Usuário já existe (OK para dev)" }),
          { status: 200, headers: { ...baseHeaders, "Content-Type": "application/json" } },
        );
      }
      
      // Outros erros são retornados normalmente
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...baseHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[create-dev-user] User created successfully");
    return new Response(
      JSON.stringify({ ok: true, user: data.user, message: "Usuário criado com sucesso" }),
      { status: 200, headers: { ...baseHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("Erro na create-dev-user:", err);
    return new Response(JSON.stringify({ error: err?.message ?? "Erro interno do servidor" }), {
      status: 500,
      headers: { ...baseHeaders, "Content-Type": "application/json" },
    });
  }
});