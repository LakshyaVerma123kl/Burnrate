# Tests

We use Vitest to test the core audit engine logic. 

**File**: `src/lib/audit-engine.test.ts`

## Automated Tests Written

1. **Team plan with 2 users -> recommends individual plan**
   - Covers: Scenario where a user selects a "Teams" plan but their team size is too small, triggering a downgrade recommendation to an individual Pro plan.
2. **Already optimal spend -> returns keep with $0 savings**
   - Covers: Scenario where the user is on the correct plan and not overspending, ensuring we do not hallucinate fake savings.
3. **High spend scenario -> Credex surfaced prominently**
   - Covers: Scenario where spend exceeds a threshold, correctly setting `credexRelevant = true` and calculating a 20% discount potential.
4. **Cheaper alternative -> Switch to Windsurf**
   - Covers: Scenario where a user pays a premium for a coding tool and is offered a cheaper alternative (Windsurf) that meets their use case.
5. **API vs Subscription consolidation**
   - Covers: Edge case where a user is paying for both direct API usage and a frontend subscription from the same vendor.

## How to Run

```bash
npm run test
```
