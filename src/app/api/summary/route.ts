import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { results } = await request.json();
    if (!results) return NextResponse.json({ error: "No results provided" }, { status: 400 });

    const prompt = `You are a financial auditor analyzing AI tool spend for a startup.
Here is the audit data: ${JSON.stringify(results)}

Write a professional, personalized 2-3 sentence summary (max 100 words) of their spend situation.
Highlight the biggest areas of overspend and exactly what they should do about it.
If they are spending perfectly, commend them. Do not use markdown formatting.`;

    // Try Groq first (free Llama)
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            max_tokens: 200,
            messages: [{ role: "user", content: prompt }]
          })
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({ summary: data.choices[0].message.content });
        }
        console.error("Groq API Error:", await res.text());
      } catch (e) {
        console.error("Groq fetch error:", e);
      }
    }

    // Try Gemini as second option
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 200 }
            })
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return NextResponse.json({ summary: text });
        }
        console.error("Gemini API Error:", await res.text());
      } catch (e) {
        console.error("Gemini fetch error:", e);
      }
    }

    // Try Anthropic as third option
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01"
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 150,
            messages: [{ role: "user", content: prompt }]
          })
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({ summary: data.content[0].text });
        }
        console.error("Anthropic API Error:", await res.text());
      } catch (e) {
        console.error("Anthropic fetch error:", e);
      }
    }

    // Final fallback: templated summary
    const actionable = results.tools?.filter((t: { recommendation: string }) => t.recommendation !== "keep").length || 0;
    const fallback = `Based on your audit, you could save $${results.totalMonthlySavings?.toFixed(2) || "0"}/month across your AI stack. ` +
      `We identified ${actionable} tool${actionable !== 1 ? "s" : ""} with optimization opportunities — review the breakdown below for specific actions.`;
    return NextResponse.json({ summary: fallback });
  } catch (err) {
    console.error("Summary API Error:", err);
    return NextResponse.json({ summary: "Your AI stack has been audited. Review the tool breakdown below for optimization opportunities." });
  }
}
