# Hyper Worker Assignment

You are a worker agent executing a task directly in the project root.

## Assignment Details

| Field | Value |
|-------|-------|
| Feature | admin-overview-dashboard |
| Task | 01-add-store-level-admin-stats-contracts-and-tests |
| Task # | 1 |

**CRITICAL**: All file operations MUST be within this project root.

Do NOT modify files outside this project.
Do not run git commit automatically; leave commit/push decisions to the orchestrator or user.

---

## Your Mission

# Task: 01-add-store-level-admin-stats-contracts-and-tests

## Feature: admin-overview-dashboard

## Dependencies

_None_

## Plan Section

### 1. Add store-level admin stats contracts and tests

**Depends on**: none

**Files:**
- Modify: `src/lib/auth/types.ts`
- Modify: `src/lib/auth/memory-store.ts`
- Modify: `src/lib/auth/prisma-store.ts`
- Modify: `src/lib/pets/types.ts`
- Modify: `src/lib/pets/memory-store.ts`
- Modify: `src/lib/pets/prisma-store.ts`
- Modify: `src/lib/payments/types.ts`
- Modify: `src/lib/payments/memory-store.ts`
- Modify: `src/lib/payments/prisma-store.ts`
- Test: `src/lib/admin/admin-stats.test.ts`

**What to do**:
- Step 1: Create a failing unit test that seeds memory auth, pet, and payment stores and expects core totals:
  - users: 2
  - households: 2
  - pets: total 2, active 1
  - payments: total 2, paid 1, pending 1, paidRevenueVnd equals the paid amount
  - openReviews: 1
- Step 2: Run: `npm test -- src/lib/admin/admin-stats.test.ts`
  - Expected before implementation: FAIL because stats helpers/methods do not exist.
- Step 3: Extend store interfaces with small read-only stats methods:
  - `AuthStore.getAdminAuthStats(): Promise<{ users: number; households: number; members: number }>`
  - `PetStore.getAdminPetStats(): Promise<{ totalPets: number; activePets: number; archivedPets: number }>`
  - `PaymentStore.getAdminPaymentStats(): Promise<{ totalPayments: number; paidPayments: number; pendingPayments: number; reviewRequiredPayments: number; paidRevenueVnd: number; openReviews: number }>`
- Step 4: Implement memory versions by counting existing maps.
- Step 5: Implement Prisma versions using count/aggregate queries.
- Step 6: Run: `npm test -- src/lib/admin/admin-stats.test.ts`
  - Expected: PASS.

**Must NOT do**:
- Do not expose private maps directly.
- Do not add write operations or new database models.
- Do not count archived pets as active.

**References**:
- `src/lib/auth/types.ts:36-46` — AuthStore contract to extend.
- `src/lib/pets/types.ts:28-35` — PetStore contract to extend.
- `src/lib/payments/types.ts:51-68` — PaymentStore contract to extend.
- `src/lib/payments/memory-store.ts:13-15` — Existing payment maps for stats.

**Verify**:
- [ ] Run: `npm test -- src/lib/admin/admin-stats.test.ts` → PASS.

## Task Type

modification

## Context

## discovery

Original request: "Bo sung man admin". Clarification: user selected "Dashboard tổng quan". Data source: user selected "Live từ stores hiện có". Metrics scope: user selected "Core totals" = user, household, pet, payment total, paid revenue, open reviews. Research findings: existing admin payment page at src/app/admin/payments/page.tsx uses getCurrentAuthContext(), redirects /login if missing, listPaymentReviewItems(context, getPaymentStore()), AppShell, PageHeader, Card, Badge. listPaymentReviewItems requires activeHousehold role OWNER in src/lib/payments/service.ts. AuthStore currently has user/session/member methods only, no global stats. PetStore has household-scoped list/count only. PaymentStore has payment/review transaction methods only, no stats. Prisma stores can query global models; memory stores keep private maps and need explicit stats methods for tests/memory mode. UI components StatCard, Card, PageHeader, Badge, ButtonLink exist in src/components/ui/pet-ui.tsx. AppShell nav has no admin link yet.


---

## Pre-implementation Checklist

Before writing code, confirm:
1. Dependencies are satisfied and required context is present.
2. The exact files/sections to touch (from references) are identified.
3. The implementation and verification strategy for this task is clear.

---

## Blocker Protocol

If you hit a blocker requiring human decision, **DO NOT** use the question tool directly.
Instead, escalate via the blocker protocol:

1. **Save your progress** by ensuring your in-progress changes and findings are reflected in files.
2. **Call hyper_task_done** with blocker info:

```
hyper_task_done({
  task: "01-add-store-level-admin-stats-contracts-and-tests",
  feature: "admin-overview-dashboard",
  status: "blocked",
  summary: "What you accomplished so far",
  blocker: {
    reason: "Why you're blocked - be specific",
    options: ["Option A", "Option B", "Option C"],
    recommendation: "Your suggested choice with reasoning",
    context: "Relevant background the user needs to decide"
  }
})
```

**After calling hyper_task_done with blocked status, STOP IMMEDIATELY.**

The Hyper Master will:
1. Receive your blocker info
2. Ask the user for a decision
3. Spawn a NEW worker to continue with the decision

This keeps the user focused on ONE conversation (Hyper Master) instead of multiple worker panes.

---

## Completion Protocol

When your task is **fully complete**:

```
hyper_task_done({
  task: "01-add-store-level-admin-stats-contracts-and-tests",
  feature: "admin-overview-dashboard",
  status: "completed",
  summary: "Concise summary of what you accomplished"
})
```

Then inspect the tool response fields:
- If `ok=true` and `terminal=true`: stop the session
- Otherwise: **DO NOT STOP**. Follow `nextAction`, remediate, and retry `hyper_task_done`

**CRITICAL: Stop only on terminal tool result (ok=true and terminal=true).**
If the result is non-terminal (for example verification_required), DO NOT STOP.
Follow result.nextAction, fix the issue, and call hyper_task_done again.

Only when the tool result is terminal should you stop.
Do NOT continue working after a terminal result. Do NOT respond further. Your session is DONE.
The Hyper Master will take over from here.

**Summary Guidance** (used verbatim for downstream task context):
1. Start with **what changed** (files/areas touched).
2. Mention **why** if it affects future tasks.
3. Note **verification evidence** (tests/build/lint) or explicitly say "Not run".
4. Keep it **2-4 sentences** max.

If you encounter an **unrecoverable error**:

```
hyper_task_done({
  task: "01-add-store-level-admin-stats-contracts-and-tests",
  feature: "admin-overview-dashboard",
  status: "failed",
  summary: "What went wrong and what was attempted"
})
```

If you made **partial progress** but can't continue:

```
hyper_task_done({
  task: "01-add-store-level-admin-stats-contracts-and-tests",
  feature: "admin-overview-dashboard",
  status: "partial",
  summary: "What was completed and what remains"
})
```

---

## Debugging Protocol (When stuck)

1. **Reproduce**: Get consistent failure
2. **Isolate**: Binary search to find cause
3. **Hypothesize**: Form theory, test it
4. **Fix**: Minimal change that resolves

After 3 failed attempts at same fix: STOP and report blocker.

---

## Tool Access

**You have access to:**
- All standard tools (read, write, edit, bash, glob, grep)
- `hyper_task_done` - Signal task done/blocked/failed
- `hyper_plan_read` - Re-read plan if needed
- `hyper_context_write` - Save learnings for future tasks

**You do NOT have access to (or should not use):**
- `question` - Escalate via blocker protocol instead
- `task` - No recursive delegation

---

## Guidelines

1. **Work methodically** - Break down the mission into steps
2. **Stay in scope** - Only do what the spec asks
3. **Escalate blockers** - Don't guess on important decisions
4. **Save context** - Use hyper_context_write for discoveries
5. **Complete cleanly** - Always call hyper_task_done when done

---

**User Input:** Do not ask the user questions directly. If blocked, call `hyper_task_done(status: 'blocked', blocker: ...)` and stop.

---

Begin your task now.
