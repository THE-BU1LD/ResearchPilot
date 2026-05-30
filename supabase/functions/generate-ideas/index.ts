import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type Idea = {
  title: string;
  description: string;
  methodology: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  timeEstimate: string;
  tags: string[];
  novelty: number;
  feasibility: number;
  realWorldImpact: string;
  suggestedDataSources: string[];
};

function titleCase(s: string) {
  return s
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildFallbackIdeas(field: string, prompt: string, count: number): Idea[] {
  const f = titleCase(field || "general science");
  const topic = (prompt || "a meaningful problem").replace(/[\n\r]+/g, " ").trim();
  const core = topic.length > 80 ? topic.slice(0, 77).trim() + "…" : topic;

  const templates = [
    {
      title: `What is the impact of ${core.toLowerCase()} on ${f.toLowerCase()} outcomes?`,
      description: `Study a focused question around ${core.toLowerCase()} with simple comparisons, clear variables, and a feasible sample.`,
      methodology: "Use a small survey or structured dataset, define one independent variable, and compare outcomes across groups.",
      difficulty: "beginner" as const,
      timeEstimate: "2-4 weeks",
      tags: [f, "Survey", "Feasible"],
      novelty: 6,
      feasibility: 10,
      realWorldImpact: "Helps turn a broad interest into a measurable school-level project.",
      suggestedDataSources: ["School survey data", "Public datasets", "Interview notes"],
    },
    {
      title: `How can ${core.toLowerCase()} be improved using a low-cost intervention?`,
      description: `Build a practical study that tests one change, then measures whether the outcome improves.`,
      methodology: "Design a before/after or control vs treatment comparison with a simple evaluation rubric.",
      difficulty: "intermediate" as const,
      timeEstimate: "1-2 months",
      tags: [f, "Intervention", "Impact"],
      novelty: 7,
      feasibility: 8,
      realWorldImpact: "Produces an actionable recommendation that a school or community can actually use.",
      suggestedDataSources: ["Participant surveys", "Observation logs", "Open datasets"],
    },
    {
      title: `Which factors most strongly predict ${core.toLowerCase()} in ${f.toLowerCase()}?`,
      description: `Move beyond description and build a predictive or explanatory study with multiple variables.`,
      methodology: "Collect a multi-variable dataset, run correlation or regression, and evaluate which features matter most.",
      difficulty: "advanced" as const,
      timeEstimate: "2-3 months",
      tags: [f, "Regression", "Analysis"],
      novelty: 8,
      feasibility: 7,
      realWorldImpact: "Gives a stronger statistical angle and can support a publication-style writeup.",
      suggestedDataSources: ["Public repositories", "School records with permission", "Open government data"],
    },
  ];

  return Array.from({ length: count }, (_, i) => {
    const idea = templates[i % templates.length];
    return {
      ...idea,
      title: i < templates.length ? idea.title : `${idea.title} (${i + 1})`,
      novelty: Math.min(10, idea.novelty + (i % 2)),
      feasibility: Math.max(5, idea.feasibility - (i % 2)),
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, field, count = 4 } = await req.json().catch(() => ({}));
    const safeCount = Math.max(1, Math.min(8, Number(count) || 4));

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      const ideas = buildFallbackIdeas(String(field || "general science"), String(prompt || ""), safeCount);
      return new Response(JSON.stringify({ ideas, fallback: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a research advisor for high school students (ages 14-18). Generate unique, feasible research ideas tailored to the student's interests and field. Be specific, creative, and encouraging. Focus on novelty and real-world impact. Never write a full paper; only provide idea-level guidance.`;

    const userPrompt = `Research field: ${field || "general science"}
Student's interest: ${prompt || "I want to explore something interesting"}
Generate ${safeCount} research ideas with varying difficulty levels.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.75,
        tools: [
          {
            type: "function",
            function: {
              name: "return_research_ideas",
              description: `Return ${safeCount} research ideas for a high school student.`,
              parameters: {
                type: "object",
                properties: {
                  ideas: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        methodology: { type: "string" },
                        difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
                        timeEstimate: { type: "string" },
                        tags: { type: "array", items: { type: "string" } },
                        novelty: { type: "number" },
                        feasibility: { type: "number" },
                        realWorldImpact: { type: "string" },
                        suggestedDataSources: { type: "array", items: { type: "string" } },
                      },
                      required: ["title", "description", "methodology", "difficulty", "timeEstimate", "tags", "novelty", "feasibility"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["ideas"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_research_ideas" } },
      }),
    });

    if (!response.ok) {
      const localIdeas = buildFallbackIdeas(String(field || "general science"), String(prompt || ""), safeCount);
      return new Response(JSON.stringify({ ideas: localIdeas, fallback: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let ideas = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!ideas) {
      ideas = data.choices?.[0]?.message?.content || "{}";
    }

    try {
      const parsed = typeof ideas === "string" ? JSON.parse(ideas) : ideas;
      if (parsed?.ideas && Array.isArray(parsed.ideas)) {
        return new Response(JSON.stringify({ ideas: parsed.ideas.slice(0, safeCount) }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch {
      // fall through
    }

    return new Response(JSON.stringify({ ideas: buildFallbackIdeas(String(field || "general science"), String(prompt || ""), safeCount), fallback: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ ideas: buildFallbackIdeas("general science", "", 4), fallback: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
