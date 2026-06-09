# Pet Profile

## Status

implemented

## Lane

high-risk

## Product Contract

Signed-in users can create, edit, archive, and view pet profiles inside their active household.

## Relevant Product Docs

- `SPEC.md#6.3-pet-profiles`
- `SPEC.md#6.2-household`
- `SPEC.md#11.1-core-tables`
- `SPEC.md#12-api-routes`
- `SPEC.md#13-ui-routes`

## Acceptance Criteria

- User can create pets with required fields.
- User can view active and archived pets in the active household.
- User can edit pet profile fields.
- User can archive a pet without deleting it.
- Archived pets remain readable and do not count toward active pet limits.
- Free plan active pet limit is enforced.
- Anonymous users cannot access pet APIs or pages.

## Harness Delta

This story builds the first private household data surface on top of the verified auth-account boundary.
