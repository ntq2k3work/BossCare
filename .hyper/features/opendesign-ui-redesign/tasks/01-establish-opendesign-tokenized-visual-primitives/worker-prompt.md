# Hyper Worker Assignment

You are a worker agent executing a task directly in the project root.

## Assignment Details

| Field | Value |
|-------|-------|
| Feature | opendesign-ui-redesign |
| Task | 01-establish-opendesign-tokenized-visual-primitives |
| Task # | 1 |

**CRITICAL**: All file operations MUST be within this project root.

Do NOT modify files outside this project.
Do not run git commit automatically; leave commit/push decisions to the orchestrator or user.

---

## Your Mission

# Task: 01-establish-opendesign-tokenized-visual-primitives

## Feature: opendesign-ui-redesign

## Dependencies

_None_

## Plan Section

### 1. Establish OpenDesign tokenized visual primitives

**Depends on**: none

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/ui/pet-ui.tsx`
- Test: `tests/e2e/auth.spec.ts`

**What to do**:
- Step 1: Add OpenDesign-inspired CSS variables to `src/app/globals.css` under `:root`:
  - Apple base: `--bc-bg`, `--bc-surface`, `--bc-surface-soft`, `--bc-ink`, `--bc-muted`, `--bc-border`, `--bc-accent`, `--bc-accent-hover`.
  - Glass accent: `--bc-glass`, `--bc-glass-border`, `--bc-glass-shadow`.
  - Motion/radius: `--bc-radius-sm`, `--bc-radius-md`, `--bc-radius-lg`, `--bc-ease`, `--bc-motion`.
- Step 2: Refactor `Card`, `Panel`, `Badge`, `Button`, `ButtonLink`, `PageHeader`, `StatCard`, `EmptyState` in `pet-ui.tsx` to use the new tokens/classes.
- Step 3: Keep existing exports and props unchanged.
- Step 4: Remove heavy purple/violet default styling as the primary brand; use restrained Apple blue/cyan as single accent.
- Step 5: Run: `npm run lint`
  - Expected: no ESLint errors.
- Step 6: Run: `npm run test:e2e -- tests/e2e/auth.spec.ts --project=chromium`
  - Expected: register/login/payment flow still works.

**Must NOT do**:
- Do not rename exported UI components.
- Do not add emoji or icon dependencies.
- Do not break accessible button/link semantics.

**References**:
- `/tmp/open-design/design-systems/apple/tokens.css` — base surface/type/radius/elevation direction.
- `/tmp/open-design/design-systems/glassmorphism/tokens.css` — glass accent values.
- `src/components/ui/pet-ui.tsx` — shared primitive layer.

**Verify**:
- [ ] Run: `npm run lint` → exit 0.
- [ ] Run: `npm run test:e2e -- tests/e2e/auth.spec.ts --project=chromium` → pass.

## Task Type

modification

## Context

## discovery

Original request: "https://github.com/nexu-io/open-design.git sử dụng opendesign design lại toàn bộ UI". User confirmed current model request: "dùng cx/gpt-5.5"; current session model is cx/gpt-5.5. Scope clarified: MVP core screens. Style clarified: Mix Apple clean + light glass. Change level clarified: keep existing routes/flows/copy labels where possible, redesign visual style/layout/components. OpenDesign research: cloned https://github.com/nexu-io/open-design.git into /tmp/open-design. Relevant token references: /tmp/open-design/design-systems/apple/tokens.css uses white/pale-gray surfaces, restrained Apple blue accent, SF Pro/Helvetica stack, radius 8/12/18, section rhythm 100/64/40, subtle elevation; /tmp/open-design/design-systems/glassmorphism/tokens.css uses translucent surfaces rgba(255,255,255,.74), airy borders, cyan-blue accent, large radii and soft elevated shadow. BossCare UI map: core pages include src/app/page.tsx, src/app/login/page.tsx, src/app/register/page.tsx, src/components/ui/app-shell.tsx, src/app/dashboard/page.tsx, src/app/dashboard/pets/page.tsx, src/app/dashboard/billing/page.tsx, src/app/admin/page.tsx, src/app/admin/payments/page.tsx. Shared UI components: src/components/ui/pet-ui.tsx, app-shell.tsx, ai-care-widget.tsx, affiliate-suggestions.tsx, language-switcher.tsx. Tests likely affected: tests/e2e/auth.spec.ts, tests/e2e/ai-care-widget.spec.ts, tests/e2e/admin-overview.spec.ts.


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
  task: "01-establish-opendesign-tokenized-visual-primitives",
  feature: "opendesign-ui-redesign",
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
  task: "01-establish-opendesign-tokenized-visual-primitives",
  feature: "opendesign-ui-redesign",
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
  task: "01-establish-opendesign-tokenized-visual-primitives",
  feature: "opendesign-ui-redesign",
  status: "failed",
  summary: "What went wrong and what was attempted"
})
```

If you made **partial progress** but can't continue:

```
hyper_task_done({
  task: "01-establish-opendesign-tokenized-visual-primitives",
  feature: "opendesign-ui-redesign",
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
