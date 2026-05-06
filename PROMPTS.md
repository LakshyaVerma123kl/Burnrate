# LLM Prompts

## Core Audit Summary Prompt

**Model:** `claude-3-haiku-20240307`

**Prompt:**
```text
You are a financial auditor analyzing AI tool spend for a startup.
Here is the audit data: ${JSON.stringify(results)}

Write a professional, personalized 2-3 sentence summary (max 100 words) of their spend situation.
Highlight the biggest areas of overspend and exactly what they should do about it.
If they are spending perfectly, commend them. Do not use markdown formatting.
```

### Rationale

1. **Role Definition:** "You are a financial auditor..." sets the tone. It prevents the model from acting like a cheerleader and forces a dry, professional, authoritative tone suitable for a B2B SaaS tool.
2. **Constraint:** "2-3 sentence summary (max 100 words)... Do not use markdown formatting." This is critical because the output is rendered directly into a small UI Card component. Markdown (like `**bold**` or `### Headers`) would break the raw text layout if not parsed via a markdown library, which we avoided to keep the client bundle small.
3. **Conditionals:** "If they are spending perfectly, commend them." Prevents the LLM from hallucinating problems where none exist.

### What I tried that didn't work

Initially, I tried to have the LLM do the actual math:
*"Here are the tools they use. Here is the 2026 pricing for those tools. Calculate their optimal spend."*

**Why it failed:** 
1. **Hallucinations:** The LLM would occasionally mix up plan names (e.g., suggesting "ChatGPT Team" instead of "Business") or apply outdated pricing constraints.
2. **Bad Math:** Even Claude 3.5 Sonnet struggles to reliably multiply `$19 * 43 seats` and then compare it accurately across 3 different alternative tools in a single zero-shot pass without chain-of-thought prompting, which takes too long.
3. **Speed:** Running a complex prompt took 4-6 seconds. Hardcoded logic takes 1ms.

**Conclusion:** LLMs are great for generating the natural language summary based on *predetermined* math, but terrible at calculating the math itself. I moved the logic to pure TypeScript and used the LLM solely for the "human touch" summary.
