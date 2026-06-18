# Test Matrix

This file maps product behavior to proof.

Product behavior is tracked story by story below. Do not mark a row implemented
until tests or validation evidence exist.

## Status Values

| Status | Meaning |
| --- | --- |
| planned | Accepted as intended behavior, not implemented |
| in_progress | Actively being built |
| implemented | Implemented and proof exists |
| changed | Contract changed after earlier implementation |
| retired | No longer part of the product contract |

## Matrix

| Story | Contract | Unit | Integration | E2E | Platform | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `admin-payment-review` | `SPEC.md#8.4-matching-rules` | yes | yes | yes | yes | implemented | `npm test`; `npm run lint`; `npm run build`; `npx playwright test tests/e2e/auth.spec.ts --project=chromium`. |
| `admin-overview` | `SPEC.md#13-ui-routes` | yes | yes | yes | yes | implemented | `npm run verify:admin-overview` passed: Vitest, ESLint, Next.js build, and Playwright Chromium admin overview smoke. |
| `ai-care-guide` | `SPEC.md#6.7-ai-care-guide` | yes | yes | yes | yes | implemented | `npm run verify:ai-care-guide` passed: Vitest, ESLint, Next.js build, and Playwright E2E. |
| `auth-account` | `SPEC.md#6.1-authentication-and-account` | yes | yes | yes | yes | implemented | `npm test`; `npm run lint`; `npm run build`; `npm run test:e2e`. |
| `checkin-media` | `SPEC.md#6.6-check-ins-and-moments` | yes | yes | yes | yes | implemented | `npm test`; `npm run lint`; `npm run build`; `npm run test:e2e`. |
| `entitlement-gating` | `SPEC.md#7-pricing-and-ai-cost-guardrails` | yes | yes | yes | yes | implemented | `npm test`; `npm run lint`; `npm run build`; `npm run test:e2e`. |
| `health-log` | `SPEC.md#6.4-health-logs` | yes | yes | yes | yes | implemented | `npm test`; `npm run lint`; `npm run build`; `npm run test:e2e`. |
| `household-access` | `SPEC.md#6.2-household` | yes | yes | yes | yes | implemented | `npm test`; `npm run lint`; `npm run build`; `npm run test:e2e`. |
| `payment-reconciliation` | `SPEC.md#8.5-reconciliation` | yes | yes | yes | yes | implemented | `npm test`; `npm run lint`; `npm run build`; `npx playwright test tests/e2e/auth.spec.ts --project=chromium`. |
| `pet-profile` | `SPEC.md#6.3-pet-profiles` | yes | yes | yes | yes | implemented | `npm test`; `npm run lint`; `npm run build`; `npm run test:e2e`. |
| `sepay-payment` | `SPEC.md#8-payment-specification-sepay` | yes | yes | yes | yes | implemented | `npm run verify:sepay-payment` passed: vitest payment/unit and route coverage, ESLint, Playwright Chromium billing smoke, Next.js build. |
| `vaccination-reminder` | `SPEC.md#6.5-vaccination-records-and-reminders` | yes | yes | yes | yes | implemented | `npm test`; `npm run lint`; `npm run build`; `npm run test:e2e`. |

## Evidence Rules

- Unit proof covers pure domain and application rules.
- Integration proof covers backend enforcement, data integrity, provider
  behavior, jobs, or service contracts.
- E2E proof covers user-visible browser flows.
- Platform proof covers only deployment, browser runtime, scheduled job, webhook
  runtime, or other web/web-app behavior that cannot be proven in lower layers.
- A story can be implemented without every proof column if the story packet
  explains why.
