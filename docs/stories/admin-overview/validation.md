# Admin Overview Validation

## Expected Proof

| Layer | Expected proof |
| --- | --- |
| Unit | Memory store stats count users, households, pets, payment status, revenue, and open reviews. |
| Integration | `/api/admin/overview` blocks anonymous and non-owner access, then returns owner stats. |
| E2E | Browser smoke opens `/admin`, sees core stat labels, and finds the payment review link. |
| Platform | Next.js build includes the admin overview page and API route. |

## Evidence

Verified on 2026-06-18 with `npm run verify:admin-overview`.
