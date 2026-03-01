# AGENTS Handoff - Vue Migration

Last updated: March 1, 2026 (Asia/Singapore)
Source of truth: this file (`AGENTS.md`)

## Core Rules

- Vue-first migration work; React packages are maintenance-only.
- Do not add parity scripts, counters, or checklist validators.
- Green tests are a regression gate, not parity proof.
- Always compare Vue against React source, API contracts, and React tests.
- Preserve React behavior/style contracts; avoid Vue-only behavior unless contract-compatible.
- Reuse React/Spectrum styles and selectors; avoid Vue-only style forks unless unavoidable.
- Fix parity gaps in Vue internals, not story-only workarounds.
- Validate in both story namespaces:
  - `packages/@vue-spectrum/*/stories`
  - `packages/vue-aria-components/stories`
- Use `PARITY_REVIEW_CHECKLIST.md` as the required tracker; work top-to-bottom unless reprioritized.
- Update checklist status continuously (`[ ]` -> `[x]`).
- Commit/push in small scoped increments; record scope, gaps, and validation in commit/PR notes.

## Per-Item Workflow

1. Pick the next unchecked checklist item.
2. Build parity artifacts (React artifact + fresh Vue Storybook build).
3. Compare the exact same story id in both iframes (`iframe.html?id=<story-id>&viewMode=story`).
4. Compare React vs Vue source/API/props/states and verify DOM, ARIA/data attrs, state classes/transitions, computed styles, and style wiring.
5. Fix Vue internals and add/adjust targeted regression tests.
6. Run the full Validation Gate.
7. Mark the checklist item complete.

## Required Parity Checks (Each Batch)

1. Story surface parity
   - Match story export keys (exact casing).
   - Match default export metadata (`title`, `excludeStories`, top-level `args`, top-level `argTypes`).
   - Ensure helper exports are correctly excluded.
   - Do not add Vue-only story surface unless required for React parity.

2. Story id parity
   - Confirm React/Vue story ids are 1:1 for the targeted scope.
   - Compare only the same story id.

3. Style-source parity (before interaction sign-off)
   - Match React/Vue style imports (Spectrum vars + local CSS).
   - Ensure Vue package deps include required CSS packages.
   - Ensure Vue renders required class/selector contracts.
   - Audit non-Spectrum helper classes with `rg`; rename collisions to component-scoped names.
   - Remove placeholder/private selectors that break style reuse parity.
   - Verify at least one triggered state in Storybook.

4. Contract parity per story
   - DOM structure/order.
   - ARIA and `data-*` attrs.
   - State classes/transitions.
   - Behavior/interactions (pointer, keyboard, focus/blur, dismiss/close, async/loading).
   - Computed visual styles.

5. Fix strategy
   - Fix internals first; do not hide gaps in stories.
   - Identify the React↔Vue gap before locking with tests.
   - Extend existing Vue parity tests when possible.
   - Prefer extending current parity specs over new parity scripts.

6. Sign-off
   - Keep checklist status current.
   - Do not move to next component family until Validation Gate passes.

## Validation Gate

- `yarn typecheck:vue`
- `yarn test:vue`
- `yarn build:vue:storybook`
- Story index parity check for targeted scope (React vs Vue story id diff must be zero)
- Manual side-by-side Storybook review (structure, controls, attrs, styles, interactions)
- Targeted style wiring check (imports, deps, selector/class contract, triggered state)

## Definition Of Done

- Structure, behavior, styles, controls, and tests match React across relevant namespaces.
- `PARITY_REVIEW_CHECKLIST.md` is fully completed for the reviewed scope.
