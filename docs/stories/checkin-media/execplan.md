# Check-In Media Exec Plan

## Steps

1. Extend Prisma schema with `CheckIn` and `MediaAsset`.
2. Add check-in validation, store, and service layers.
3. Implement scoped check-in route handlers.
4. Add check-in UI route and controls.
5. Add unit, route integration, and browser smoke tests.
6. Add `verify:checkin-media`, run Harness verification, and update matrix evidence.

## Rollback

Revert check-in schema, service, routes, UI, tests, story packet, and matrix row.

## Scope Note

This story covers check-in records, media metadata, and storage quota enforcement. Real binary object upload belongs to a future provider-selection story because no object-storage provider is part of the accepted MVP contract.
