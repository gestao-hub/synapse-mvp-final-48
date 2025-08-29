import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  nome: string;
  email: string;
  empresa?: string;
  telefone?: string;
  mensagem: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Contact email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const formData: ContactFormData = await req.json();
    console.log("Received form data:", { ...formData, email: "***" });

    if (!formData.nome || !formData.email || !formData.mensagem) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: nome, email e mensagem" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!SENDGRID_API_KEY) {
      console.error("SendGrid API key not configured");
      return new Response(
        JSON.stringify({ error: "Configuração de email não encontrada" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Prepare email content
    const emailContent = `
      <h2>Nova mensagem de contato</h2>
      <p><strong>Nome:</strong> ${formData.nome}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      ${formData.empresa ? `<p><strong>Empresa:</strong> ${formData.empresa}</p>` : ''}
      ${formData.telefone ? `<p><strong>Telefone:</strong> ${formData.telefone}</p>` : ''}
      <p><strong>Mensagem:</strong></p>
      <p>${formData.mensagem.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><em>Esta mensagem foi enviada através do formulário de contato do site.</em></p>
    `;

    const emailData = {
      personalizations: [
        {
          to: [
            {
              email: "contato@excluvia.com", // Substitua pelo seu email
              name: "Excluvia Contato"
            }
          ],
          subject: `Nova mensagem de contato - ${formData.nome}`
        }
      ],
      from: {
        email: "noreply@excluvia.com", // Email verificado no SendGrid
        name: "Site Excluvia"
      },
      reply_to: {
        email: formData.email,
        name: formData.nome
      },
      content: [
        {
          type: "text/html",
          value: emailContent
        }
      ]
    };

    console.log("Sending email via SendGrid...");

    const response = await fetch(SENDGRID_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    console.log("SendGrid response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SendGrid API error:", errorText);
      
      return new Response(
        JSON.stringify({ 
          error: "Erro ao enviar email. Tente novamente mais tarde.",
          details: response.status === 401 ? "Configuração de API inválida" : "Erro no servidor"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Email sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Mensagem enviada com sucesso!" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Erro interno do servidor",
        message: "Não foi possível processar sua solicitação. Tente novamente mais tarde."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);