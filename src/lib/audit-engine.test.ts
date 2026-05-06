import { describe, it, expect } from "vitest";
import { runAudit } from "./audit-engine";

describe("Audit Engine", () => {
  it("Team plan with 2 users -> recommends individual plan", () => {
    // 2 users on Cursor Teams ($40/user) = $80/mo
    const result = runAudit(
      [{ toolId: "cursor", planId: "cursor_teams", monthlySpend: 80, seats: 2 }],
      2,
      "coding"
    );

    const cursorResult = result.tools[0];
    expect(cursorResult.recommendation).toBe("downgrade");
    expect(cursorResult.monthlySavings).toBe(40); // Pro is $20*2 = $40. $80 - $40 = 40.
  });

  it("Already optimal spend -> returns keep with $0 savings", () => {
    // 1 user on ChatGPT Plus ($20)
    const result = runAudit(
      [{ toolId: "chatgpt", planId: "chatgpt_plus", monthlySpend: 20, seats: 1 }],
      1,
      "research"
    );

    const gptResult = result.tools[0];
    // It's optimal, so it might say "keep". But wait, Check 4 (Credex) doesn't apply to $20 spend.
    expect(gptResult.recommendation).toBe("keep");
    expect(gptResult.monthlySavings).toBe(0);
  });

  it("High spend scenario -> Credex surfaced prominently", () => {
    // 50 users on Copilot Business ($19/user) = $950/mo
    const result = runAudit(
      [{ toolId: "copilot", planId: "copilot_business", monthlySpend: 950, seats: 50 }],
      50,
      "coding"
    );

    const copilotResult = result.tools[0];
    expect(copilotResult.recommendation).toBe("keep");
    expect(copilotResult.credexRelevant).toBe(true);
    expect(copilotResult.monthlySavings).toBe(190); // 20% of 950
  });

  it("Cheaper alternative -> Switch to Windsurf", () => {
    // 10 users on Cursor Pro+ ($60/user) = $600/mo
    const result = runAudit(
      [{ toolId: "cursor", planId: "cursor_pro_plus", monthlySpend: 600, seats: 10 }],
      10,
      "coding"
    );

    const cursorResult = result.tools[0];
    // Check 1 triggers first if they overpay, but they are paying exactly 600.
    // Cursor Pro+ is $60. Windsurf Pro is $15.
    // Wait, Check 3 logic checks if plan.monthlyPrice >= 20. Yes.
    expect(cursorResult.recommendation).toBe("switch");
    expect(cursorResult.recommendedAction).toBe("Switch to Windsurf Pro");
    expect(cursorResult.monthlySavings).toBe(450); // $600 - $150 = $450
  });

  it("API vs Subscription consolidation logic works per tool", () => {
    const result = runAudit(
      [
        { toolId: "claude", planId: "claude_pro", monthlySpend: 20, seats: 1 },
        { toolId: "claude", planId: "claude_api", monthlySpend: 50, seats: 1 },
        { toolId: "chatgpt", planId: "chatgpt_plus", monthlySpend: 20, seats: 1 },
        { toolId: "openai", planId: "openai_api", monthlySpend: 100, seats: 1 }
      ],
      1,
      "mixed"
    );

    // Claude should recommend consolidation
    const claudeApiResult = result.tools.find((t) => t.toolId === "claude" && t.currentPlan === "API Direct");
    expect(claudeApiResult?.recommendation).toBe("consolidate");

    // OpenAI API has no corresponding ChatGPT/OpenAI subscription in this test that triggers it for openai_api
    // Wait, the test input has chatgpt and openai, which are different toolIds. So they shouldn't trigger consolidation.
    const openaiApiResult = result.tools.find((t) => t.toolId === "openai" && t.currentPlan === "API Direct");
    expect(openaiApiResult?.recommendation).not.toBe("consolidate");
  });

  it("Handles 0 seats without Division by Zero or NaN", () => {
    const result = runAudit(
      [{ toolId: "cursor", planId: "cursor_pro_plus", monthlySpend: 60, seats: 0 }],
      5,
      "coding"
    );
    const cursorResult = result.tools[0];
    // Math.max(1, seats) prevents division by zero.
    // Pro+ is $60/mo. Windsurf is $15/mo.
    // Safe seats = 1. Windsurf = $15. Spend = $60.
    expect(cursorResult.recommendation).toBe("switch");
    expect(cursorResult.monthlySavings).toBe(45); // 60 - 15 = 45
    expect(cursorResult.reasoning).toContain("at $15/user/month compared to your current $60.00/user/month");
  });

  it("Handles negative monthly spend by clamping to 0", () => {
    const result = runAudit(
      [{ toolId: "cursor", planId: "cursor_pro", monthlySpend: -50, seats: 1 }],
      1,
      "coding"
    );
    const cursorResult = result.tools[0];
    expect(cursorResult.currentMonthlySpend).toBe(0);
    expect(cursorResult.recommendation).toBe("keep");
    expect(cursorResult.monthlySavings).toBe(0);
  });

  it("Gracefully ignores unknown tools and plans", () => {
    const result = runAudit(
      [
        { toolId: "unknown_tool", planId: "some_plan", monthlySpend: 50, seats: 1 },
        { toolId: "cursor", planId: "unknown_plan", monthlySpend: 50, seats: 1 }
      ],
      1,
      "coding"
    );
    expect(result.tools.length).toBe(0);
    expect(result.totalMonthlySavings).toBe(0);
  });
});

