# Test Matrix

This file maps product behavior to proof.

No product behavior has been defined or implemented yet. Do not mark a row
implemented until tests or validation evidence exist.

## Status Values

| Status | Meaning |
| --- | --- |
| planned | Accepted as intended behavior, not implemented |
| in_progress | Actively being built |
| implemented | Implemented and proof exists |
| changed | Contract changed after earlier implementation |
| retired | No longer part of the product contract |

## Matrix

| Story | Contract | Unit | Integration | E2E | Platform | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `admin-payment-review` | `SPEC.md#8.4-matching-rules` | no | no | no | no | planned | Planned: unit mismatch reasons; integration review resolution; e2e admin resolve; platform audit log smoke. |
| `ai-care-guide` | `SPEC.md#6.7-ai-care-guide` | no | no | no | no | planned | Planned: unit safety classifier/prompt rules; integration retrieval+quota; e2e ask/refusal/emergency; platform AI cost metrics. |
| `auth-account` | `SPEC.md#6.1-authentication-and-account` | no | no | no | no | planned | Planned: unit auth validation; integration auth endpoints; e2e register-login-logout; platform access check. |
| `checkin-media` | `SPEC.md#6.6-check-ins-and-moments` | no | no | no | no | planned | Planned: unit media limit checks; integration check-in/media save; e2e create check-in; platform upload failure smoke. |
| `entitlement-gating` | `SPEC.md#7-pricing-and-ai-cost-guardrails` | no | no | no | no | planned | Planned: unit limit policy; integration entitlement enforcement; e2e upgrade-unlock; platform quota/cost metric smoke. |
| `health-log` | `SPEC.md#6.4-health-logs` | no | no | no | no | planned | Planned: unit log validation; integration log CRUD/filter; e2e add/browse log; platform chronological display smoke. |
| `household-access` | `SPEC.md#6.2-household` | no | no | no | no | planned | Planned: unit role checks; integration household access control; e2e member invite/access; platform private data isolation. |
| `payment-reconciliation` | `SPEC.md#8.5-reconciliation` | no | no | no | no | planned | Planned: unit reconciliation matcher; integration SePay transaction import; e2e missed-webhook recovery; platform admin report smoke. |
| `pet-profile` | `SPEC.md#6.3-pet-profiles` | no | no | no | no | planned | Planned: unit pet validation; integration pet CRUD; e2e create-edit-archive; platform mobile form smoke. |
| `sepay-payment` | `SPEC.md#8-payment-specification-sepay` | no | no | no | no | planned | Planned: unit signature/matching; integration webhook idempotency; e2e payment order flow; platform webhook log/retry smoke. |
| `vaccination-reminder` | `SPEC.md#6.5-vaccination-records-and-reminders` | no | no | no | no | planned | Planned: unit due-date status; integration vaccine CRUD; e2e upcoming/overdue view; platform reminder view smoke. |

## Evidence Rules

- Unit proof covers pure domain and application rules.
- Integration proof covers backend enforcement, data integrity, provider
  behavior, jobs, or service contracts.
- E2E proof covers user-visible browser flows.
- Platform proof covers only shell, deployment, mobile, desktop, or runtime
  behavior that cannot be proven in lower layers.
- A story can be implemented without every proof column if the story packet
  explains why.
