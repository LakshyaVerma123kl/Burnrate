import { NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamSize, useCase, tools } = body;

    if (!teamSize || !useCase || !tools || !Array.isArray(tools)) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // Run pure audit engine
    const auditResult = runAudit(tools, teamSize, useCase);

    let id: string;

    // Try Supabase
    if (supabase) {
      const { data, error } = await supabase
        .from("audits")
        .insert([
          {
            team_size: teamSize,
            use_case: useCase,
            tools: JSON.stringify(tools),
            results: JSON.stringify(auditResult),
            total_monthly_savings: auditResult.totalMonthlySavings,
            total_annual_savings: auditResult.totalAnnualSavings
          }
        ])
        .select("id")
        .single();

      if (!error && data) {
        id = data.id;
      } else {
        console.error("Supabase insert error:", error);
        id = randomUUID();
      }
    } else {
      id = randomUUID();
    }

    // Always return full results so the client can display them immediately
    return NextResponse.json({ id, ...auditResult });
  } catch (err) {
    console.error("Audit API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET endpoint to fetch audit by ID (for shareable URLs)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("audits")
    .select("results")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  const results = typeof data.results === "string" ? JSON.parse(data.results) : data.results;
  return NextResponse.json(results);
}
