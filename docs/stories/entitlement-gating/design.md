# Entitlement Gating Design

## Architecture

Add a small entitlement policy module with Free, Plus, and Family plan definitions. Current auth context returns the Free entitlement until payment stories activate paid entitlements.

## Enforcement

- Pet profile service uses `petLimit`.
- Household invite uses `memberLimit`.
- Check-in media uses `mediaLimitMb`.
- AI guide will use `aiSessionsPerMonth`.

## Non-Goals

No payment activation in this slice. No subscription migration history yet.
