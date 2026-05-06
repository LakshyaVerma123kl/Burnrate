import { getToolById, getPlanById, UseCase } from "./pricing-data";

export interface UserToolInput {
  toolId: string;
  planId: string;
  monthlySpend: number;
  seats: number;
}

export interface ToolAuditResult {
  toolId: string;
  toolName: string;
  currentPlan: string;
  currentMonthlySpend: number;
  recommendation: "keep" | "downgrade" | "switch" | "consolidate";
  recommendedAction: string;
  monthlySavings: number;
  reasoning: string;
  credexRelevant: boolean;
}

export interface AuditResult {
  tools: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export function runAudit(
  userTools: UserToolInput[],
  teamSize: number,
  useCase: UseCase
): AuditResult {
  const toolsResult: ToolAuditResult[] = [];
  let totalMonthlySavings = 0;

  for (const input of userTools) {
    const tool = getToolById(input.toolId);
    const plan = getPlanById(input.toolId, input.planId);

    if (!tool || !plan) continue;

    let recommendation: ToolAuditResult["recommendation"] = "keep";
    let recommendedAction = "Keep current plan";
    let monthlySavings = 0;
    let reasoning = "You are currently on the most optimal plan for your usage.";
    let credexRelevant = false;

    // Default expected spend based on our pricing data
    const expectedMonthlySpend =
      plan.monthlyPrice !== null
        ? plan.type === "per_user"
          ? plan.monthlyPrice * input.seats
          : plan.monthlyPrice
        : input.monthlySpend;

    // Check 1: Overpaying for current plan (paying more than listed price)
    if (input.monthlySpend > expectedMonthlySpend && plan.monthlyPrice !== null) {
      // Possible over-forecasting or paying for unused seats
      recommendation = "downgrade";
      recommendedAction = `Adjust seats to match actual team size`;
      monthlySavings = input.monthlySpend - expectedMonthlySpend;
      reasoning = `You are paying $${input.monthlySpend}/mo, but for ${input.seats} active seats on ${plan.name}, it should only cost $${expectedMonthlySpend}/mo. Removing unused seats saves you money.`;
    }

    // Check 2: Wrong plan for team size (e.g. on Teams plan but team size is 1)
    if (
      plan.minUsers &&
      teamSize < plan.minUsers &&
      plan.type === "per_user"
    ) {
      // Find a cheaper individual plan (pick the most expensive one that is still cheaper than current, to preserve features)
      const individualPlan = tool.plans
        .filter((p) => !p.minUsers && p.monthlyPrice !== null && p.monthlyPrice < (plan.monthlyPrice || Infinity))
        .sort((a, b) => (b.monthlyPrice || 0) - (a.monthlyPrice || 0))[0];
      if (individualPlan && individualPlan.monthlyPrice !== null) {
        recommendation = "downgrade";
        recommendedAction = `Downgrade to ${tool.name} ${individualPlan.name}`;
        const newCost = individualPlan.monthlyPrice * input.seats;
        monthlySavings = input.monthlySpend - newCost;
        reasoning = `${plan.name} is designed for teams of ${plan.minUsers}+. Since your team is ${teamSize}, downgrading to ${individualPlan.name} saves you money without losing core capability.`;
      }
    }

    // Check 3: Alternatives (If paying a lot for coding/writing, suggest cheaper tools)
    if (recommendation === "keep") {
      if (useCase === "coding" && input.toolId !== "windsurf" && plan.monthlyPrice && plan.monthlyPrice >= 20) {
        // Windsurf is $15/user for Pro
        const windsurfProPrice = 15 * input.seats;
        if (windsurfProPrice < input.monthlySpend) {
          recommendation = "switch";
          recommendedAction = "Switch to Windsurf Pro";
          monthlySavings = input.monthlySpend - windsurfProPrice;
          reasoning = `Windsurf offers similar AI coding capabilities at $15/user/month compared to your current $${(input.monthlySpend / input.seats).toFixed(2)}/user/month.`;
        }
      }
    }

    // Check 4: Credex Discount
    // If the spend is high enough, we can offer ~20% off via Credex credits
    if (recommendation === "keep" && input.monthlySpend > 50) {
      recommendation = "keep"; // Still keep the tool, but use Credex
      recommendedAction = `Buy ${tool.name} credits via Credex`;
      monthlySavings = input.monthlySpend * 0.2; // 20% discount assumption
      reasoning = `Your plan is optimal, but you can save ~20% ($${monthlySavings.toFixed(2)}/mo) by purchasing discounted ${tool.name} infrastructure credits through Credex.`;
      credexRelevant = true;
    }

    totalMonthlySavings += monthlySavings;

    toolsResult.push({
      toolId: input.toolId,
      toolName: tool.name,
      currentPlan: plan.name,
      currentMonthlySpend: input.monthlySpend,
      recommendation,
      recommendedAction,
      monthlySavings,
      reasoning,
      credexRelevant,
    });
  }

  // Check for consolidation (API vs Subscription)
  const apiDirectSpend = userTools.find(t => t.planId.endsWith("_api") || t.planId.includes("api_direct"));
  const subSpend = userTools.find(t => !t.planId.endsWith("_api") && !t.planId.includes("api_direct"));

  // Find API vs Sub overlap in results to add a note
  if (apiDirectSpend && subSpend) {
    const apiResult = toolsResult.find(r => r.currentPlan === "API Direct" && r.toolId === apiDirectSpend.toolId);
    if (apiResult && apiResult.recommendation === "keep") {
        apiResult.recommendation = "consolidate";
        apiResult.recommendedAction = "Consolidate API and Subscription usage";
        apiResult.reasoning = "You are paying for both direct API access and an individual subscription. Depending on usage volume, routing all usage through the API or upgrading the subscription may be more cost-effective.";
    }
  }

  return {
    tools: toolsResult,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
}
