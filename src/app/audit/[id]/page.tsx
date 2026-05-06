import { supabase } from "@/lib/supabase";
import { getAudit } from "@/lib/store";
import { notFound } from "next/navigation";
import { CheckCircle, ArrowDownCircle, Replace } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditResult, ToolAuditResult } from "@/lib/audit-engine";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { AiSummaryBox } from "@/components/AiSummaryBox";

export const dynamic = "force-dynamic";

export default async function AuditResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let audit: AuditResult | null = null;

  // Try Supabase first
  if (supabase) {
    const { data, error } = await supabase
      .from("audits")
      .select("results")
      .eq("id", id)
      .single();

    if (!error && data) {
      audit = typeof data.results === "string" ? JSON.parse(data.results) : data.results;
    }
  }

  // Fallback: in-memory store
  if (!audit) {
    const stored = getAudit(id);
    if (stored) {
      audit = stored.results;
    }
  }

  if (!audit) notFound();

  const isHighSavings = audit.totalMonthlySavings > 500;
  const isOptimal = audit.totalMonthlySavings < 100;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          You can save <br />
          <span className="text-orange-500">${audit.totalMonthlySavings.toFixed(2)}/mo</span>
        </h1>
        <p className="text-xl text-zinc-400">
          That&apos;s <strong className="text-white">${audit.totalAnnualSavings.toFixed(2)}</strong> a year in runway.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Tool Breakdown</h2>
          {audit.tools.map((t: ToolAuditResult, i: number) => {
            const isKeep = t.recommendation === "keep";
            const Icon = isKeep ? CheckCircle : t.recommendation === "downgrade" ? ArrowDownCircle : Replace;
            
            return (
              <Card key={i} className={`bg-black/50 border-white/10 ${t.monthlySavings > 0 ? "border-l-4 border-l-orange-500" : ""}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${isKeep ? "text-green-500" : "text-orange-500"}`} />
                        {t.toolName}
                      </CardTitle>
                      <p className="text-sm text-zinc-400 mt-1">Currently paying ${t.currentMonthlySpend}/mo on {t.currentPlan}</p>
                    </div>
                    {t.monthlySavings > 0 && (
                      <div className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-sm font-semibold">
                        Save ${t.monthlySavings.toFixed(2)}/mo
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white font-medium mb-1">Action: {t.recommendedAction}</p>
                  <p className="text-sm text-zinc-400">{t.reasoning}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          <Card className="bg-zinc-950 border-white/10 sticky top-24">
            <CardHeader>
              <CardTitle>AI Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <AiSummaryBox results={audit} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-black border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-orange-500">
                {isHighSavings ? "Significant Savings Found" : isOptimal ? "You're Spending Well" : "Optimize Your Stack"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-300">
                {isHighSavings 
                  ? "Your potential savings exceed $500/month. Book a consultation with Credex to restructure your AI infrastructure."
                  : isOptimal
                  ? "Your stack is highly optimized! Leave your email and we'll notify you when cheaper plans drop."
                  : "We can help you capture these savings with discounted infrastructure credits."}
              </p>
              <LeadCaptureModal auditId={id} highSavings={isHighSavings} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
