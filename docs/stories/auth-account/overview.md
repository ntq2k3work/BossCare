# Auth Account

## Status

implemented

## Lane

high-risk

## Product Contract

Users can register, sign in, sign out, view their current account context, and receive a default household membership at registration time.

## Relevant Product Docs

- `SPEC.md#6.1-authentication-and-account`
- `SPEC.md#6.2-household`
- `SPEC.md#11.1-core-tables`
- `SPEC.md#12-api-routes`
- `SPEC.md#13-ui-routes`

## Acceptance Criteria

- User can create an account with a unique email.
- Registering creates one default household and owner membership.
- User can sign in and sign out reliably.
- User can view current plan and entitlement limits through `/api/me`.
- Anonymous users cannot access `/dashboard`.
- Session lookup returns only the signed-in user's household memberships.

## Harness Delta

This story turns the first accepted spec slice into an implemented product surface and durable validation evidence.
