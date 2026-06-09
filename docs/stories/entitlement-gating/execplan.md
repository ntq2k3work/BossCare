# Entitlement Gating Exec Plan

## Steps

1. Add entitlement plan policy module.
2. Extend auth context entitlement shape.
3. Replace hardcoded pet/media limits with entitlement policy.
4. Add member invite limit.
5. Add tests and verify.

## Rollback

Revert entitlement policy module, auth context changes, service changes, tests, and matrix updates.
