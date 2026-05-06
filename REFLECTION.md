# Reflection

**The hardest bug you hit this week, and how you debugged it**
The hardest bug was related to the downgrade logic in the audit engine. Initially, the engine was recommending that users downgrade to a "Hobby" plan with $0 spend because it was searching for the *absolute cheapest* plan below their current spend, rather than the most appropriate tier. I formed the hypothesis that `Array.find` was grabbing the first match (which happened to be Free). To fix it, I rewrote the logic to filter for all plans cheaper than the current one, sort them by price descending, and pick the most expensive one from that subset. This correctly preserved features while still generating savings.

**A decision you reversed mid-week, and what made you reverse it**
I originally planned to use an LLM (Claude) to perform the actual audit math and logic. Midway through building, I reversed this decision and hardcoded the pricing rules in a pure TypeScript function. I reversed it because LLMs are non-deterministic and terrible at arithmetic; generating a "savings" number that couldn't be traced exactly back to a pricing page felt untrustworthy.

**What you would build in week 2 if you had it**
I would build an OAuth integration with common identity providers (Google Workspace / GitHub) to automatically detect active seats, rather than relying on self-reported inputs. Most founders don't actually know exactly how many seats they have provisioned, so automating the discovery phase would massively increase the tool's conversion rate.

**How you used AI tools**
I used Claude 3.5 Sonnet to scaffold the initial shadcn/ui components and generate the base Tailwind gradients for the landing page. I did *not* trust it with the pricing data extraction or the core audit engine logic, as those required specific 2026 context and rigorous exactness. I caught the AI hallucinating a nonexistent pricing tier for GitHub Copilot during an early draft, which reinforced my decision to manually research and hardcode the pricing data.

**Self-rating (1–10)**
- **Discipline (9):** Consistently pushed commits across the week and prioritized MVP features over shiny distractions.
- **Code quality (8):** Strong TS typing and test coverage, though error handling on the API routes could be more robust.
- **Design sense (9):** Delivered a premium, high-contrast dark mode UI that fits the "Obsidian Cinema" / developer tooling aesthetic.
- **Problem-solving (9):** Effectively navigated the tradeoff between AI capabilities and deterministic math.
- **Entrepreneurial thinking (10):** Structured the entire flow around capturing value first, delaying the email gate until the user experiences the "Aha!" moment.
