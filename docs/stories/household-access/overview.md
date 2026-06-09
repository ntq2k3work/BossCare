# Household Access

## Status

implemented

## Lane

high-risk

## Product Contract

Households group shared pet records and enforce member-only access. Owners can invite existing users as household members.

## Relevant Product Docs

- `SPEC.md#6.2-household`
- `SPEC.md#6.1-authentication-and-account`
- `SPEC.md#11.1-core-tables`

## Acceptance Criteria

- Each user belongs to at least one household.
- Owner can invite an existing user to the active household.
- Members can view household membership.
- Non-members cannot read or modify household private data.
- Role checks prevent non-owners from inviting members.

## Harness Delta

This story makes household membership visible and testable before entitlement-based member limits are enforced.
