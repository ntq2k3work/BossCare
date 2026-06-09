# Health Log

## Status

implemented

## Lane

high-risk

## Product Contract

Signed-in users can create, browse, edit, and delete dated health logs for pets in their active household.

## Relevant Product Docs

- `SPEC.md#6.4-health-logs`
- `SPEC.md#6.3-pet-profiles`
- `SPEC.md#11.1-core-tables`
- `SPEC.md#12-api-routes`
- `SPEC.md#13-ui-routes`

## Acceptance Criteria

- User can add a dated health log for a household pet.
- User can filter logs by pet and type.
- User can attach notes.
- User can edit and delete logs inside their household.
- Logs are preserved in reverse chronological order for browsing.
- Anonymous users cannot access health log APIs or pages.
- Cross-household pet and log access returns not found.

## Harness Delta

This story adds the first time-series care record on top of verified auth and pet ownership.
