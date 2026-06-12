# Payment Reconciliation Validation

## Expected Proof

| Layer | Expected proof |
| --- | --- |
| Unit | Reconciliation report counts matched, duplicate, unmatched, and review transactions. |
| Integration | `/api/payments/reconcile` imports transactions and keeps unsafe matches in review. |
| E2E | Browser smoke creates a missed transaction and resolves it through admin review. |
| Platform | Next.js build includes reconciliation route. |

## Evidence

Verified on 2026-06-09 with `npm test`, `npm run lint`, `npm run build`, and `npx playwright test tests/e2e/auth.spec.ts --project=chromium`.
