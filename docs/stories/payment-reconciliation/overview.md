# Payment Reconciliation

## Status

implemented

## Lane

high-risk

## Product Contract

Authenticated operators can import recent SePay transactions missed by webhook delivery. The import path applies the same matching, idempotency, review, and entitlement rules as direct webhooks.

## Relevant Product Docs

- `SPEC.md#8.5-reconciliation`
- `SPEC.md#8.4-matching-rules`

## Acceptance Criteria

- Reconciliation accepts a batch of normalized SePay transactions.
- Duplicate transactions are idempotent.
- Exact inbound payment-code matches activate entitlements.
- Missing-code or mismatched transactions become review items.
- Browser smoke covers missed-webhook recovery through the admin review flow.
