# SePay Payment Design

## Architecture

Keep payment matching rules in `src/lib/payments`. Use a store interface with Prisma production storage and memory storage for local tests/smoke.

## Data Model

Add subscription plans, user entitlements, payments, and payment transactions. The payment story creates paid plan rows in memory/prisma as needed and activates entitlements from verified webhooks.

## API Contract

- `POST /api/payments`: create pending payment order for `plus` or `family`.
- `GET /api/payments/:id`: read signed-in household payment order.
- `POST /api/webhooks/sepay`: verify and process SePay transaction.

## Matching

Grant entitlement only when direction is inbound, amount equals expected amount, payment code is present, order is payable, and transaction id/reference has not already been consumed.

## Non-Goals

Polling reconciliation and admin resolution are separate stories.
