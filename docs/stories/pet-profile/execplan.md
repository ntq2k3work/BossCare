# Pet Profile Exec Plan

## Steps

1. Extend Prisma schema and generated client with `Pet`.
2. Add pet validation, service, and store implementations.
3. Implement pet API routes with auth/household scoping.
4. Add `/app/pets` and `/app/pets/[id]` pages.
5. Add unit, route integration, and browser smoke tests.
6. Add `verify:pet-profile`, run Harness verification, and update matrix evidence.

## Rollback

Revert pet schema, routes, pages, tests, and story packet. Auth-account remains intact.

## Open Risk

Free-plan limit is implemented as one active pet from the existing entitlement placeholder. Future entitlement-gating may replace this with subscription-backed policy.
