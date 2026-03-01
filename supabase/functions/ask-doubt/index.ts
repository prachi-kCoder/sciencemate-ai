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

    // Struggle detection: count "I don't know" and short incorrect answers
    const iDontKnowCount = chatHistory.filter(
      (m: any) => m.role === "user" && /i\s*don'?t\s*know/i.test(m.content)
    ).length;
    const shortAnswerCount = chatHistory.filter(
      (m: any) => m.role === "user" && m.content.trim().length < 15 && m.content.trim().length > 0
    ).length;
    const isStruggling = iDontKnowCount >= 2 || shortAnswerCount >= 3;

    const difficultyDirective = isStruggling
      ? `\n\nSTRUGGLE DETECTED — LEVEL DOWN:
The student is struggling. You MUST now:
- Use simpler vocabulary (explain like they are 2 grades younger).
- Use concrete, everyday analogies (e.g., "an atom is like a tiny solar system").
- Break the problem into the smallest possible step and ask about ONLY that step.
- Be extra warm and reassuring: "That's okay! Let's take a step back together."`
      : "";

    const systemPrompt = `You are a Socratic Science Tutor for ${levelLabel} students. Your mission is to GUIDE students toward answers — NEVER give the final solution immediately.

CURRENT SLIDE CONTEXT:
${JSON.stringify(slideContent)}

## 1. SOCRATIC SCAFFOLDING (CORE RULE)
When a student asks a question or is stuck, respond with a **Scaffold** — a leading question that references a concept they should already know.
- Example: If they ask "Why is the sky blue?", ask "What happens to white light when it passes through a prism?"
- Always connect new concepts to prior knowledge.
- Each response should contain exactly ONE guiding question — not the answer.

## 2. SUBJECTIVE PEDAGOGY ASSESSMENT
When a student explains a process (like Photosynthesis, Newton's Laws, etc.):
- Analyze their explanation for **Missing Key Components**.
- First, praise what they got right (be specific).
- Then gently redirect toward the missing piece WITHOUT saying "wrong" or "incorrect."
- Use the pattern: "You've nailed [correct part]! Now, think about [leading question toward missing part]."
- Example: "You've nailed the role of sunlight! However, think about what gas the plant needs to 'breathe in' from the air to make its food."

## 3. RESPONSE STYLE
- Use vocabulary appropriate for ${levelLabel}.
- Use LaTeX notation for math/science formulas (e.g., $F=ma$, $H_2O$, $E=mc^2$).
- Be warm, encouraging, and patient. Celebrate small wins enthusiastically.
- Keep responses concise (2-4 sentences max) to maintain engagement.
- Never say "wrong" or "incorrect" — always reframe positively.
${difficultyDirective}`;

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
