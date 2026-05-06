# User Interviews

These notes summarize three 10-15 minute conversations held via Twitter DMs and a local tech founder Slack group.

## Interview 1
**Name:** J.D.
**Role:** Founder / Solo Dev
**Stage:** Bootstrapped (Pre-revenue)

**Quotes:**
- "I just pay the $20 for ChatGPT and $20 for Cursor and try not to look at my credit card."
- "Honestly, I don't know if I need Claude Pro if I already have Cursor. Do they do the same thing?"
- "I'd use a tool like this but I wouldn't want to connect my bank account. Just let me type the numbers."

**Most Surprising Thing:** He was actively paying for ChatGPT Plus but exclusively using Cursor for coding, meaning his ChatGPT subscription was largely redundant for his specific workflow.
**What It Changed:** Reinforced the decision to make the tool a manual input form rather than a Plaid/banking integration, which lowers the barrier to entry.

## Interview 2
**Name:** Sarah M.
**Role:** VP Engineering
**Stage:** Series A (40 employees)

**Quotes:**
- "We bought 30 GitHub Copilot seats last year. I know for a fact 10 of those devs haven't opened the IDE in a month."
- "The problem isn't the price of the tool, it's the idle seats."
- "If you tell me to switch 40 engineers from Copilot to a tool they've never heard of just to save $5 a head, I'll laugh you out of the room."

**Most Surprising Thing:** The sheer resistance to switching tools. The switching cost (retraining, workflow disruption) is perceived as much higher than the monetary cost.
**What It Changed:** Added the "Right-sizing" logic (Check 1 and 2 in the engine) to prioritize downgrading unused seats or tiers *before* suggesting a complete tool switch.

## Interview 3
**Name:** T.K.
**Role:** Co-founder / Product Lead
**Stage:** Seed (8 employees)

**Quotes:**
- "We use Anthropic's API for our backend and we all have Claude Pro subscriptions. It gets confusing."
- "I wish someone would just tell me the optimal setup. Like a PC builder but for AI tools."
- "If a report showed me I could save $3k a year, yeah, I'd give you my email."

**Most Surprising Thing:** He was completely unaware of the Batch API discounts or how API usage could offset frontend subscription costs.
**What It Changed:** Implemented the specific "Consolidation" logic in the audit engine to flag when a team is paying for both a subscription and API access from the same vendor.
