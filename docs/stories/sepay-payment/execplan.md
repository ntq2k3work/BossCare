# SePay Payment Exec Plan

## Steps

1. Extend Prisma schema with plans, entitlements, payments, and transactions.
2. Add payment matching and HMAC verification helpers.
3. Implement payment store and service.
4. Add payment API routes and billing UI.
5. Add unit, route, and browser smoke tests.
6. Add `verify:sepay-payment`, run Harness verification, and update matrix evidence.

## Rollback

Revert payment schema, service, routes, UI, tests, story packet, and matrix row.
