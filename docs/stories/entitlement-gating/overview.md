# Entitlement Gating

## Status

implemented

## Lane

high-risk

## Product Contract

Plan limits control pet slots, household member slots, media storage, and AI session quota. Current free entitlements are enforced before paid-plan activation exists.

## Relevant Product Docs

- `SPEC.md#7-pricing-and-ai-cost-guardrails`
- `SPEC.md#11.2-subscription-and-payment-tables`

## Acceptance Criteria

- Current entitlement exposes pet, member, media, and AI limits.
- Pet creation respects active pet limit.
- Household invites respect member limit.
- Media check-ins respect storage limit.
- UI shows current entitlement limits.

## Harness Delta

This story centralizes limit policy before payment activation and AI sessions use it.
