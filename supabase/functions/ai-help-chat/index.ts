import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";
import { checkRateLimit, getClientIP, rateLimitErrorResponse, RATE_LIMITS } from "../_shared/rateLimit.ts";
import { handleError, handleApiError, handleValidationError, ErrorCode } from "../_shared/errorHandler.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const messageSchema = z.object({
  message: z.string().trim().min(1).max(2000, "Message must be less than 2000 characters"),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIP = getClientIP(req);
  const rateLimitResult = await checkRateLimit(clientIP, RATE_LIMITS.AI_CHAT);
  
  if (!rateLimitResult.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return rateLimitErrorResponse(rateLimitResult, corsHeaders);
  }

  try {
    const body = await req.json();
    const parsed = messageSchema.safeParse(body);
    
    if (!parsed.success) {
      return handleValidationError(parsed.error, "ai-help-chat", corsHeaders);
    }
    
    const { message } = parsed.data;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are a helpful customer service assistant for Berman Electric, a licensed electrician serving Long Island, Nassau County, Suffolk County, and Ronkonkoma NY. 

Key information about Berman Electric:
- 20+ years of experience in electrical services
- Licensed and insured electrician
- Services: Residential electrical work, commercial electrical services, emergency repairs, panel upgrades, lighting installation, EV charger installation, generator installation
- Service areas: Long Island, Nassau County, Suffolk County, Ronkonkoma NY
- Phone: (516) 361-4068
- Email: info@bermanelectrical.com
- Hours: Monday-Friday 7:00 AM - 7:00 PM, Emergency services available on weekends

Be helpful, professional, and concise. If someone needs immediate assistance, direct them to call (516) 361-4068. For quotes, suggest using the contact form or calling directly.` 
          },
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      return await handleApiError(response, "ai-help-chat", corsHeaders);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleError(error, "ai-help-chat", corsHeaders);
  }
});
