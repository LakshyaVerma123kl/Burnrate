import { NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import { supabase } from "@/lib/supabase";
import { saveAudit } from "@/lib/store";
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

    // Try Supabase first
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
        return NextResponse.json({ id: data.id });
      }
      console.error("Supabase insert error:", error);
    }

    // Fallback: in-memory store for local dev
    const id = randomUUID();
    saveAudit({ id, teamSize, useCase, tools, results: auditResult });
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Audit API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
