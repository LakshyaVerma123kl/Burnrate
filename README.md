# Burnrate - AI Spend Audit

Burnrate is a free web app that audits AI tool spend for startups. It instantly identifies overspend, recommends more optimal pricing tiers, suggests cheaper alternatives with similar capabilities, and serves as a lead generation asset for Credex's discounted AI infrastructure credits.

## Quick Start

### Prerequisites
- Node.js 20+
- Anthropic API Key
- Supabase Project
- Resend API Key

### Install & Run Locally
1. Clone the repository
2. Run \`npm install\`
3. Copy \`.env.example\` to \`.env.local\` and fill in the required keys
4. Run \`npm run dev\`
5. Open \`http://localhost:3000\`

### Deploy
Deploy easily to Vercel:
1. Connect your GitHub repository to Vercel
2. Add your environment variables in the Vercel dashboard
3. Click "Deploy"

## Decisions & Trade-offs

1. **Next.js App Router vs. React SPA**: Chose Next.js for its robust SSR capabilities, which are essential for generating dynamic Open Graph meta tags for shareable audit result URLs.
2. **Supabase vs. Firebase**: Chose Supabase to get a real PostgreSQL backend. Relational querying will make it easier to analyze aggregated startup spend data later.
3. **Hardcoded Pricing Engine vs. LLM Engine**: Used a deterministic, pure-function math engine for the core audit logic rather than an LLM. Pricing logic must be 100% defensible, predictable, and exact. LLMs are used only for the personalized text summary.
4. **TailwindCSS vs. CSS Modules**: Chosen to rapidly iterate on a premium, dark-mode, "Obsidian Cinema" style UI without the bloat of external component libraries overriding styles.
5. **localStorage Persistence**: Opted to persist the multi-step form state locally in the browser rather than maintaining a backend session, allowing for a zero-login, frictionless UX.

## Deployed URL
**Coming soon...**
