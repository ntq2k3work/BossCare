# Health Log Exec Plan

## Steps

1. Extend Prisma schema with `HealthLog`.
2. Add health-log validation, store, and service layers.
3. Implement scoped health-log route handlers.
4. Add pet health UI route and controls.
5. Add unit, route integration, and browser smoke tests.
6. Add `verify:health-log`, run Harness verification, and update matrix evidence.

## Rollback

Revert health-log schema, service, routes, UI, tests, story packet, and matrix rows. Auth and pet profile remain intact.

## Open Risk

Media attachment proof is deferred to the `checkin-media` story because storage is not implemented yet.
