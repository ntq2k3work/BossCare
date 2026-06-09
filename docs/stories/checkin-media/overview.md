# Check-In Media

## Status

implemented

## Lane

high-risk

## Product Contract

Signed-in users can create dated pet check-ins with mood, note, and optional media metadata inside their active household.

## Relevant Product Docs

- `SPEC.md#6.6-check-ins-and-moments`
- `SPEC.md#11.1-core-tables`
- `SPEC.md#13-ui-routes`

## Acceptance Criteria

- User can create a short check-in with date, mood, note, and optional media.
- User can browse check-ins by pet.
- Media metadata respects the current plan storage limit.
- Invalid media input does not create broken check-in records.
- Anonymous users cannot access check-in APIs or pages.
- Cross-household pet access returns not found.

## Harness Delta

This story adds quick pet moments and media metadata before a real object-storage provider is selected.
