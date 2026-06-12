# SePay Payment

## Status

implemented

## Lane

high-risk

## Product Contract

Signed-in users can create SePay bank-transfer payment orders. Verified inbound SePay webhook transactions can mark orders paid and activate household entitlements.

## Relevant Product Docs

- `SPEC.md#8-payment-specification-sepay`
- `SPEC.md#7-pricing-and-ai-cost-guardrails`
- `SPEC.md#11.2-subscription-and-payment-tables`

## Acceptance Criteria

- User can create a pending payment order for a paid plan.
- Payment order includes unique payment code and expected transfer content.
- SePay webhook verifies HMAC when secret is configured.
- Inbound exact amount + matching payment code marks payment paid.
- Duplicate webhook event does not activate entitlement twice.
- Mismatched webhook is stored without granting entitlement.
- Frontend cannot mark payment paid directly.

## Harness Delta

This story introduces payment order and transaction processing before reconciliation/admin review flows.
