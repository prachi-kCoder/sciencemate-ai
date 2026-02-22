import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { question, slideContent, gradeLevel = 8, chatHistory = [] } = await req.json();
    if (!question) throw new Error("Question is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const levelLabel = gradeLevel <= 12 ? `grade ${gradeLevel}` : gradeLevel === 13 ? "AP / College Prep" : "Undergraduate";
    const systemPrompt = `You are a patient, encouraging tutor for ${levelLabel} students.

CURRENT SLIDE CONTEXT:
${JSON.stringify(slideContent)}

INSTRUCTIONS:
- Never give the answer directly. Use Socratic questioning to guide the student to discover the answer themselves.
- Ask leading questions that build on what they already know.
- Use simple vocabulary appropriate for grade ${gradeLevel}.
- Use LaTeX notation for any math or science formulas (e.g., $F=ma$, $H_2O$).
- Be warm, encouraging, and patient. Celebrate small wins.
- Keep responses concise (2-4 sentences max) to maintain engagement.
- If the student seems stuck, provide a helpful hint rather than the answer.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory,
      { role: "user", content: question },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please wait a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ask-doubt error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
