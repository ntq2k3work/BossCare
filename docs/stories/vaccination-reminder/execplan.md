# Vaccination Reminder Exec Plan

## Steps

1. Extend Prisma schema with `VaccinationRecord`.
2. Add vaccination validation, store, and service layers.
3. Implement scoped vaccination route handlers.
4. Add pet vaccination UI route and controls.
5. Add unit, route integration, and browser smoke tests.
6. Add `verify:vaccination-reminder`, run Harness verification, and update matrix evidence.

## Rollback

Revert vaccination schema, service, routes, UI, tests, story packet, and matrix row. Existing auth, pet, and health-log slices remain intact.

## Open Risk

Reminder delivery is in-app only for MVP. Email, push, and background scheduling remain out of scope.
