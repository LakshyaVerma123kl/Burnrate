export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolPricing {
  id: string;
  name: string;
  plans: ToolPlan[];
}

export interface ToolPlan {
  id: string;
  name: string;
  monthlyPrice: number | null; // null for custom pricing
  type: "per_user" | "flat" | "usage_based";
  includedUsage?: string;
  minUsers?: number;
  maxUsers?: number;
}

export const PRICING_DATA: ToolPricing[] = [
  {
    id: "cursor",
    name: "Cursor",
    plans: [
      { id: "cursor_hobby", name: "Hobby", monthlyPrice: 0, type: "flat" },
      { id: "cursor_pro", name: "Pro", monthlyPrice: 20, type: "per_user" },
      { id: "cursor_pro_plus", name: "Pro+", monthlyPrice: 60, type: "per_user" },
      { id: "cursor_ultra", name: "Ultra", monthlyPrice: 200, type: "per_user" },
      { id: "cursor_teams", name: "Teams", monthlyPrice: 40, type: "per_user", minUsers: 3 },
      { id: "cursor_enterprise", name: "Enterprise", monthlyPrice: null, type: "per_user" }
    ]
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    plans: [
      { id: "copilot_free", name: "Free", monthlyPrice: 0, type: "flat" },
      { id: "copilot_pro", name: "Pro", monthlyPrice: 10, type: "per_user" },
      { id: "copilot_pro_plus", name: "Pro+", monthlyPrice: 39, type: "per_user" },
      { id: "copilot_business", name: "Business", monthlyPrice: 19, type: "per_user" },
      { id: "copilot_enterprise", name: "Enterprise", monthlyPrice: 39, type: "per_user" }
    ]
  },
  {
    id: "claude",
    name: "Claude",
    plans: [
      { id: "claude_free", name: "Free", monthlyPrice: 0, type: "flat" },
      { id: "claude_pro", name: "Pro", monthlyPrice: 20, type: "per_user" },
      { id: "claude_max_5x", name: "Max 5x", monthlyPrice: 100, type: "per_user" },
      { id: "claude_max_20x", name: "Max 20x", monthlyPrice: 200, type: "per_user" },
      { id: "claude_team", name: "Team", monthlyPrice: 30, type: "per_user", minUsers: 5 },
      { id: "claude_enterprise", name: "Enterprise", monthlyPrice: null, type: "per_user" },
      { id: "claude_api", name: "API Direct", monthlyPrice: null, type: "usage_based" }
    ]
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    plans: [
      { id: "chatgpt_free", name: "Free", monthlyPrice: 0, type: "flat" },
      { id: "chatgpt_plus", name: "Plus", monthlyPrice: 20, type: "per_user" },
      { id: "chatgpt_pro", name: "Pro", monthlyPrice: 200, type: "per_user" },
      { id: "chatgpt_business", name: "Business", monthlyPrice: 25, type: "per_user", minUsers: 2 },
      { id: "chatgpt_enterprise", name: "Enterprise", monthlyPrice: null, type: "per_user" },
      { id: "chatgpt_api", name: "API Direct", monthlyPrice: null, type: "usage_based" }
    ]
  },
  {
    id: "anthropic_api",
    name: "Anthropic API",
    plans: [
      { id: "anthropic_api_direct", name: "API Direct", monthlyPrice: null, type: "usage_based" }
    ]
  },
  {
    id: "openai_api",
    name: "OpenAI API",
    plans: [
      { id: "openai_api_direct", name: "API Direct", monthlyPrice: null, type: "usage_based" }
    ]
  },
  {
    id: "gemini",
    name: "Gemini",
    plans: [
      { id: "gemini_free", name: "Free", monthlyPrice: 0, type: "flat" },
      { id: "gemini_plus", name: "AI Plus", monthlyPrice: 7.99, type: "per_user" },
      { id: "gemini_pro", name: "AI Pro", monthlyPrice: 19.99, type: "per_user" },
      { id: "gemini_ultra", name: "AI Ultra", monthlyPrice: 41.67, type: "per_user" },
      { id: "gemini_api", name: "API Direct", monthlyPrice: null, type: "usage_based" }
    ]
  },
  {
    id: "windsurf",
    name: "Windsurf",
    plans: [
      { id: "windsurf_free", name: "Free", monthlyPrice: 0, type: "flat" },
      { id: "windsurf_pro", name: "Pro", monthlyPrice: 15, type: "per_user" },
      { id: "windsurf_teams", name: "Teams", monthlyPrice: 30, type: "per_user", minUsers: 2 },
      { id: "windsurf_enterprise", name: "Enterprise", monthlyPrice: 60, type: "per_user" }
    ]
  }
];

export function getToolById(id: string): ToolPricing | undefined {
  return PRICING_DATA.find((t) => t.id === id);
}

export function getPlanById(toolId: string, planId: string): ToolPlan | undefined {
  const tool = getToolById(toolId);
  return tool?.plans.find((p) => p.id === planId);
}
