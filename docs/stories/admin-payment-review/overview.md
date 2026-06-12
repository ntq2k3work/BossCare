# Admin Payment Review

## Status

implemented

## Lane

normal

## Product Contract

Household-owner operators can review unmatched or review-required SePay transactions, attach a trusted payment code, and safely resolve exact inbound transfers without granting entitlement from the frontend alone.

## Relevant Product Docs

- `SPEC.md#8.4-matching-rules`
- `SPEC.md#13-ui-routes`

## Acceptance Criteria

- Admin review API lists unmatched and review-required transactions.
- Admin resolve API requires an authenticated owner context.
- Resolution re-runs matching rules before marking a payment paid.
- UI route `/admin/payments` shows open review items and resolve controls.
- Browser smoke resolves a missed-code transaction.
