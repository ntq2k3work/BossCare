# SePay Payment Validation

## Expected Proof

| Layer | Expected proof |
| --- | --- |
| Unit | HMAC verification, payment code generation, matching, idempotency. |
| Integration | Payment order and webhook route behavior. |
| E2E | Browser smoke creates payment order and views pending transfer details. |
| Platform | Next.js build succeeds with payment routes. |
| Release | Harness matrix records proof status and evidence. |

## Evidence

Verified on 2026-06-09 with `npm run verify:sepay-payment`: vitest payment/unit and route coverage plus full suite, ESLint, Playwright Chromium billing smoke, and Next.js production build.
