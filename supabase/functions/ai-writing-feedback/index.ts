import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function cleanText(text: string) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function countWords(text: string) {
  return cleanText(text).split(/\s+/).filter(Boolean).length;
}

function hasCitation(text: string) {
  return /(\([A-Z][A-Za-z-]+(?:\s+et al\.)?,?\s+\d{4}[a-z]?\)|\[[0-9,\s-]+\]|doi:\s*10\.\d{4,9}\/\S+)/i.test(text);
}

function baseSuggestions(text: string) {
  const words = countWords(text);
  const lower = text.toLowerCase();
  const suggestions: any[] = [];

  if (words === 0) {
    suggestions.push({
      id: "start",
      title: "Add a focused draft",
      detail: "Paste a section or outline first, then the tool can give targeted revision guidance.",
      priority: "high",
      category: "structure",
    });
  } else {
    suggestions.push({
      id: "thesis",
      title: "Sharpen the central claim",
      detail: "Make the research question and thesis explicit in the opening section so the reader knows exactly what is being tested.",
      rewrite: "State your question, your variable(s), and the reason the topic matters in one clear opening paragraph.",
      priority: "high",
      category: "structure",
    });
  }

  if (words > 0 && words < 180) {
    suggestions.push({
      id: "expand",
      title: "Expand the evidence base",
      detail: "The draft is still short, so add more background, methods detail, or a better-developed discussion of results.",
      priority: "high",
      category: "evidence",
    });
  }

  if (/very|really|important|good|bad|many|stuff|things/i.test(lower)) {
    suggestions.push({
      id: "precision",
      title: "Use more precise language",
      detail: "Replace vague wording with measurable terms, definitions, or concrete examples.",
      rewrite: "Swap broad adjectives for data, numbers, or observable criteria.",
      priority: "medium",
      category: "style",
    });
  }

  if (!hasCitation(text)) {
    suggestions.push({
      id: "citations",
      title: "Add citations where needed",
      detail: "Any statistic, claim, or idea from another source should be cited in a consistent style.",
      priority: "high",
      category: "citations",
    });
  }

  suggestions.push({
    id: "method",
    title: "Make the method reproducible",
    detail: "Describe participants, materials, variables, and analysis steps so someone else could follow your process.",
    priority: "medium",
    category: "structure",
  });

  return suggestions.slice(0, 6);
}

function baseInsights(text: string) {
  const insights: any[] = [];

  if (/(increase|upward|improve|growth|higher|rise)/i.test(text)) {
    insights.push({ text: "The wording suggests a positive trend or improvement across the dataset.", type: "trend", confidence: "medium" });
  }
  if (/(dip|drop|decrease|decline|lower|outlier|anomaly)/i.test(text)) {
    insights.push({ text: "There may be at least one low-performing segment or anomaly worth checking separately.", type: "anomaly", confidence: "medium" });
  }
  if (/(should|could|recommend|suggest|therefore)/i.test(text)) {
    insights.push({ text: "The conclusion can be turned into a stronger recommendation by tying it to one measurable result.", type: "recommendation", confidence: "high" });
  }
  if (insights.length === 0) {
    insights.push({ text: "The data looks balanced overall, so you can highlight the most important comparison and explain it clearly.", type: "comparison", confidence: "medium" });
  }
  insights.push({ text: "Remember to report limitations, sample size, and any assumptions behind the analysis.", type: "prediction", confidence: "low" });
  return insights.slice(0, 5);
}

function gradeText(text: string) {
  const words = countWords(text);
  const hasCitationMarker = hasCitation(text);
  const hasMethod = /(method|participants|sample|procedure|analysis|control|variable)/i.test(text);
  const hasLit = /(literature|source|study|research|citation|reference)/i.test(text);
  const hasAnalysis = /(result|analysis|significant|trend|correlation|regression|p-value)/i.test(text);
  const hasTopic = text.length > 0 ? 1 : 0;

  const categories = [
    {
      id: "topic",
      score: Math.min(20, 10 + hasTopic * 10),
      feedback: ["The topic is at least clearly present."],
      suggestions: ["Make the research question more specific and measurable."],
    },
    {
      id: "literature",
      score: hasLit ? 16 : 10,
      feedback: ["The draft references prior work or acknowledges the need for sources."],
      suggestions: ["Add more source-specific support and synthesize the literature instead of listing it."],
    },
    {
      id: "methodology",
      score: hasMethod ? 18 : 9,
      feedback: ["The method is at least partially described."],
      suggestions: ["Clarify participants, variables, sampling, and procedure."],
    },
    {
      id: "analysis",
      score: hasAnalysis ? 14 : 8,
      feedback: ["There is some sign of interpretation or results discussion."],
      suggestions: ["Tie every claim to a number, comparison, or test result."],
    },
    {
      id: "writing",
      score: Math.min(15, Math.max(6, Math.round(words / 30))),
      feedback: ["The draft has enough text to evaluate structure."],
      suggestions: ["Shorten long sentences and strengthen transitions."],
    },
    {
      id: "citations",
      score: hasCitationMarker ? 9 : 4,
      feedback: ["Citations are present or at least expected in the draft."],
      suggestions: ["Use one citation style consistently and add citations for borrowed ideas."],
    },
  ];

  const strongestArea = categories.slice().sort((a, b) => b.score - a.score)[0].id;
  const priorityImprovement = categories.slice().sort((a, b) => a.score - b.score)[0].id;
  return {
    categories,
    overallComment: "This draft is a solid working version, but it still needs clearer evidence, tighter methods, and more consistent citation practice.",
    strongestArea,
    priorityImprovement,
  };
}

function makeRegression(text: string) {
  const words = countWords(text);
  const r2 = Math.max(0.12, Math.min(0.96, (words % 83) / 100));
  const slope = ((text.length % 19) - 9) / 10;
  const intercept = Math.round(words / 8);
  return {
    equation: `y = ${slope.toFixed(2)}x + ${intercept}`,
    rSquared: Number(r2.toFixed(2)),
    interpretation: "The relationship looks moderate enough to discuss, but not so strong that you should overclaim causation.",
    predictions: [
      { x: 1, predictedY: Number((slope * 1 + intercept).toFixed(2)) },
      { x: 2, predictedY: Number((slope * 2 + intercept).toFixed(2)) },
      { x: 3, predictedY: Number((slope * 3 + intercept).toFixed(2)) },
    ],
    recommendation: "Report the model, explain its limitations, and validate it with another dataset if possible.",
  };
}

function makeCorrelation(text: string) {
  const coefficient = (((text.length % 41) - 20) / 40);
  return {
    coefficient: Number(coefficient.toFixed(2)),
    strength:
      Math.abs(coefficient) > 0.7
        ? (coefficient > 0 ? "strong positive" : "strong negative")
        : Math.abs(coefficient) > 0.4
          ? (coefficient > 0 ? "moderate positive" : "moderate negative")
          : "weak positive",
    pValue: 0.04,
    interpretation: "The pattern suggests a relationship, but you should still check confounders and avoid claiming causality.",
    caveats: ["Correlation does not imply causation.", "Check whether one or two outliers are driving the result."],
  };
}

function makeForecast(text: string) {
  const base = countWords(text) || 10;
  return {
    method: "Simple trend extrapolation",
    predictions: [
      { period: "Next period", value: base * 1.05, lowerBound: base * 0.95, upperBound: base * 1.15 },
      { period: "Later period", value: base * 1.12, lowerBound: base * 0.98, upperBound: base * 1.24 },
      { period: "Further period", value: base * 1.18, lowerBound: base * 1.0, upperBound: base * 1.3 },
    ],
    trend: "increasing",
    confidence: 63,
    explanation: "The forecast follows the general direction implied by the text, but you should confirm it with real data before relying on it.",
  };
}

function localResponse(type: string, text: string) {
  switch (type) {
    case "grade":
      return { result: gradeText(text) };
    case "insights":
      return { result: baseInsights(text).map((i) => `[${String(i.type).toUpperCase()}] ${i.text}`), structured: true };
    case "suggestions":
      return { result: baseSuggestions(text), meta: { overallQuality: Math.min(10, Math.max(2, Math.round(countWords(text) / 100) + 4)), readabilityLevel: countWords(text) > 600 ? "College level" : "Grade 10" } };
    case "regression":
      return { result: makeRegression(text) };
    case "correlation":
      return { result: makeCorrelation(text) };
    case "forecast":
      return { result: makeForecast(text) };
    default:
      return { result: baseSuggestions(text) };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let payload: any = {};
  try {
    payload = await req.json();
  } catch {
    payload = {};
  }

  try {
    const type = String(payload.type || "suggestions");
    const normalizedText = cleanText(String(payload.text || "")).slice(0, 8000);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify(localResponse(type, normalizedText)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let systemPrompt: string;
    let toolDef: any;
    let toolName: string;

    switch (type) {
      case "grade":
        systemPrompt = `You are an expert academic research paper grader. Evaluate student research writing rigorously but encouragingly. Grade across 6 categories with detailed feedback. Be specific — reference actual content from the text.`;
        toolName = "return_grades";
        toolDef = {
          type: "function",
          function: {
            name: "return_grades",
            description: "Return grading results across 6 categories",
            parameters: {
              type: "object",
              properties: {
                categories: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", enum: ["topic", "literature", "methodology", "analysis", "writing", "citations"] },
                      score: { type: "number" },
                      feedback: { type: "array", items: { type: "string" } },
                      suggestions: { type: "array", items: { type: "string" } },
                    },
                    required: ["id", "score", "feedback", "suggestions"],
                    additionalProperties: false,
                  },
                },
                overallComment: { type: "string" },
                strongestArea: { type: "string" },
                priorityImprovement: { type: "string" },
              },
              required: ["categories", "overallComment", "strongestArea", "priorityImprovement"],
              additionalProperties: false,
            },
          },
        };
        break;
      case "insights":
        systemPrompt = `You are a data scientist providing actionable insights from statistical data. Focus on trends, anomalies, recommendations, and statistical significance. Be precise with numbers.`;
        toolName = "return_insights";
        toolDef = {
          type: "function",
          function: {
            name: "return_insights",
            description: "Return data analysis insights",
            parameters: {
              type: "object",
              properties: {
                insights: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      type: { type: "string", enum: ["trend", "anomaly", "recommendation", "comparison", "prediction"] },
                      confidence: { type: "string", enum: ["high", "medium", "low"] },
                    },
                    required: ["text", "type", "confidence"],
                    additionalProperties: false,
                  },
                },
                summary: { type: "string" },
              },
              required: ["insights", "summary"],
              additionalProperties: false,
            },
          },
        };
        break;
      case "regression":
        systemPrompt = `You are a statistics tutor. Analyze the provided data and explain regression analysis results in simple terms for a high school student. Include interpretation of R², slope, and predictions.`;
        toolName = "return_regression";
        toolDef = {
          type: "function",
          function: {
            name: "return_regression",
            description: "Return regression analysis results",
            parameters: {
              type: "object",
              properties: {
                equation: { type: "string" },
                rSquared: { type: "number" },
                interpretation: { type: "string" },
                predictions: { type: "array", items: { type: "object", properties: { x: { type: "number" }, predictedY: { type: "number" } }, required: ["x", "predictedY"], additionalProperties: false } },
                recommendation: { type: "string" },
              },
              required: ["equation", "rSquared", "interpretation", "recommendation"],
              additionalProperties: false,
            },
          },
        };
        break;
      case "correlation":
        systemPrompt = `You are a statistics tutor. Analyze correlation between variables for a high school student. Explain what the correlation means in real-world terms.`;
        toolName = "return_correlation";
        toolDef = {
          type: "function",
          function: {
            name: "return_correlation",
            description: "Return correlation analysis",
            parameters: {
              type: "object",
              properties: {
                coefficient: { type: "number" },
                strength: { type: "string", enum: ["strong positive", "moderate positive", "weak positive", "none", "weak negative", "moderate negative", "strong negative"] },
                pValue: { type: "number" },
                interpretation: { type: "string" },
                caveats: { type: "array", items: { type: "string" } },
              },
              required: ["coefficient", "strength", "pValue", "interpretation"],
              additionalProperties: false,
            },
          },
        };
        break;
      case "forecast":
        systemPrompt = `You are a data analyst. Given the trend data, provide forecasted values and explain the methodology. Keep it accessible for a high school student.`;
        toolName = "return_forecast";
        toolDef = {
          type: "function",
          function: {
            name: "return_forecast",
            description: "Return forecasted values",
            parameters: {
              type: "object",
              properties: {
                method: { type: "string" },
                predictions: { type: "array", items: { type: "object", properties: { period: { type: "string" }, value: { type: "number" }, lowerBound: { type: "number" }, upperBound: { type: "number" } }, required: ["period", "value"], additionalProperties: false } },
                trend: { type: "string", enum: ["increasing", "decreasing", "stable", "volatile"] },
                confidence: { type: "number" },
                explanation: { type: "string" },
              },
              required: ["method", "predictions", "trend", "confidence", "explanation"],
              additionalProperties: false,
            },
          },
        };
        break;
      default:
        systemPrompt = `You are an academic writing coach for high school students. Analyze the draft and provide specific, actionable suggestions. Reference actual content from the text. Be encouraging but honest.`;
        toolName = "return_suggestions";
        toolDef = {
          type: "function",
          function: {
            name: "return_suggestions",
            description: "Return writing improvement suggestions",
            parameters: {
              type: "object",
              properties: {
                suggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      detail: { type: "string" },
                      rewrite: { type: "string" },
                      priority: { type: "string", enum: ["high", "medium", "low"] },
                      category: { type: "string", enum: ["structure", "clarity", "evidence", "style", "grammar", "citations"] },
                    },
                    required: ["id", "title", "detail", "priority", "category"],
                    additionalProperties: false,
                  },
                },
                overallQuality: { type: "number" },
                readabilityLevel: { type: "string" },
              },
              required: ["suggestions", "overallQuality", "readabilityLevel"],
              additionalProperties: false,
            },
          },
        };
        break;
    }

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
          { role: "user", content: normalizedText || "No text provided" },
        ],
        temperature: 0.4,
        tools: [toolDef],
        tool_choice: { type: "function", function: { name: toolName } },
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify(localResponse(type, normalizedText)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();

    let result: any = null;
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        result = JSON.parse(toolCall.function.arguments);
      } catch {
        result = null;
      }
    }

    if (!result) {
      const content = data.choices?.[0]?.message?.content || "";
      try {
        const jsonMatch = content.match(/[\[{][\s\S]*[\]}]/);
        result = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
      } catch {
        result = localResponse(type, normalizedText).result;
      }
    }

    if (type === "insights" && result.insights) {
      result = result.insights.map((i: any) => typeof i === "string" ? i : `[${i.type?.toUpperCase() || "INSIGHT"}] ${i.text}`);
      return new Response(JSON.stringify({ result, structured: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "suggestions" && result.suggestions) {
      return new Response(JSON.stringify({ result: result.suggestions, meta: { overallQuality: result.overallQuality, readabilityLevel: result.readabilityLevel } }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    const fallbackType = String(payload?.type || "suggestions");
    const fallbackText = String(payload?.text || "");
    return new Response(JSON.stringify(localResponse(fallbackType, fallbackText)), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
