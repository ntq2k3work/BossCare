# Story Backlog

This backlog is seeded from `SPEC.md` after the BossCare MVP spec intake.

Do not create every possible story packet up front. Create story packets when
the work is selected or when a product decision needs a durable place to land.

## Candidate Epics

| Epic | Description | Status |
| --- | --- | --- |
| E01 Account and Household | Registration, sessions, household membership, and private data access. | sliced |
| E02 Pet Records | Pet profiles, health logs, vaccination records, check-ins, and media limits. | sliced |
| E03 AI Care Guide | Pet-only AI care guide with quota, safety refusal, emergency guidance, and affiliate suggestions. | sliced |
| E04 Billing and Entitlements | SePay payments, entitlement activation, reconciliation, and admin review. | sliced |

## Seeded Harness Stories

| Story | Lane | Product Source |
| --- | --- | --- |
| `auth-account` | normal | `SPEC.md#6.1-authentication-and-account` |
| `household-access` | high-risk | `SPEC.md#6.2-household` |
| `pet-profile` | normal | `SPEC.md#6.3-pet-profiles` |
| `health-log` | normal | `SPEC.md#6.4-health-logs` |
| `vaccination-reminder` | normal | `SPEC.md#6.5-vaccination-records-and-reminders` |
| `checkin-media` | normal | `SPEC.md#6.6-check-ins-and-moments` |
| `ai-care-guide` | high-risk | `SPEC.md#6.7-ai-care-guide` |
| `sepay-payment` | high-risk | `SPEC.md#8-payment-specification-sepay` |
| `payment-reconciliation` | high-risk | `SPEC.md#8.5-reconciliation` |
| `entitlement-gating` | high-risk | `SPEC.md#7-pricing-and-ai-cost-guardrails` |
| `admin-payment-review` | normal | `SPEC.md#8.4-matching-rules` |
