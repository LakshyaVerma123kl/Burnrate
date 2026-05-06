# Metrics Strategy

## North Star Metric
**Qualified Leads Generated per Week**
*Why:* Burnrate is fundamentally a lead-generation asset for Credex. Daily Active Users (DAU) or total audits run are vanity metrics if they don't result in actionable pipeline for the core business. A "qualified lead" is defined as an email captured where the audit identified >$500/mo in savings.

## 3 Input Metrics

1. **Audit Completion Rate (Form Start → Form Submit)**
   *Why:* This measures the friction of the core UX. If people drop off on step 2, the form is too complex or we are asking for too much data too early.

2. **Viral Coefficient (Unique sessions from shared `?ref=` URLs)**
   *Why:* Burnrate must acquire users organically to keep CAC low. Tracking how many net new users a single completed audit generates tells us if the "Share" feature is working.

3. **Lead Capture Conversion Rate (Audit Viewed → Email Submitted)**
   *Why:* This measures the effectiveness of the "Aha!" moment. If the savings number is compelling, this rate goes up. If it's too low, we either aren't surfacing enough savings, or the CTA copy is weak.

## First Thing to Instrument
**PostHog funnel tracking on the Audit Form.** 
Specifically: `Landed on page` → `Clicked Start` → `Added 1 Tool` → `Clicked Submit` → `Viewed Results`. We need to know exactly where the drop-off is before we spend a dime on marketing.

## Pivot Trigger
**Trigger:** If the Lead Capture Conversion Rate is **< 2%** after 1,000 completed audits.
*Reasoning:* If 1,000 startups run their data through the tool and fewer than 20 care enough to leave their email to get help fixing the overspend, it means the problem isn't actually painful enough to build a business around, or startups simply don't care about $500/mo. We would need to pivot from an "Audit" tool to an "Automated Provisioning" tool (solving a different problem).
