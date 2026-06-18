# Admin Overview

## Status

implemented

## Lane

normal

## Product Contract

Authenticated household owners can open `/admin` to review core platform totals for users, households, pets, payments, paid revenue, and open payment reviews.

## Relevant Product Docs

- `SPEC.md#13-ui-routes`
- `SPEC.md#8.4-matching-rules`

## Acceptance Criteria

- Anonymous users are redirected or rejected before admin stats are exposed.
- Non-owner household members cannot read admin overview stats.
- Owner users can see core totals for users, households, pets, payments, paid revenue, and open reviews.
- Dashboard links to `/admin/payments` for manual payment review.
- Browser smoke covers the `/admin` overview page.
