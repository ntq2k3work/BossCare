# AI Care Guide Validation

## Expected Proof

| Layer | Expected proof |
| --- | --- |
| Unit | Safety classification, refusal behavior, emergency no-quota path, and quota accounting. |
| Integration | `/api/ai-care-guide` answers authenticated requests. |
| E2E | Browser smoke asks general and emergency questions. |
| Platform | Next.js build includes AI Care Guide routes. |

## Evidence

Verified on 2026-06-09 with `npm test`, `npm run lint`, `npm run build`, and `npx playwright test tests/e2e/auth.spec.ts --project=chromium`.
