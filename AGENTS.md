# AGENTS Handoff - Vue Migration

Last updated: February 28, 2026 (Asia/Singapore)
Source of truth: this file (`AGENTS.md`)

## Mission

- Finish React-to-Vue parity with evidence, not assumptions.
- Keep React packages in maintenance mode while Vue ports continue.
- Treat style parity and Storybook controls parity as blocking.
- Validate parity across both Storybook namespaces:
  - `packages/@vue-spectrum/*/stories`
  - `packages/vue-aria-components/stories`

## Non-negotiables Already Set

- Do not add parity scripts, migration counters, or checklist validators.
- Do not infer completion from generated reports/checklists.
- Automated tests protect from regressions, but passing tests alone do not mean parity is complete.
- Fix gaps in Vue component internals (not story-only hacks).
- Reuse/copy style sources from React when possible; do not keep Vue-only styles that have no React counterpart unless the DOM is truly Vue-only with no React equivalent.
- Replace placeholders/scaffolds with real parity stories before sign-off.
- Log reviewed scope, gaps, and evidence in commit/PR notes.
- Commit and push often in small, reviewable increments; do not batch unrelated families.
- Do not sign off a component from only one namespace when it exists in both.

## Required Review Lens (React Contract vs Vue)

- Review Vue component/composable implementations by comparing against React API contracts and existing React automated tests.
- Uncover parity gaps by comparing Vue and React source code directly (not only by rerunning Vue tests).
- For JS/TS behavior, treat React implementation as the edge-case contract: review React first, then implement the equivalent behavior in Vue; do not improvise Vue-only logic.
- Idiomatic Vue differences are acceptable only when they preserve the same React behavior contract and can be mapped clearly to the React concept.
- Compare exposed props/configuration and supported states/interaction paths for each component/composable.
- Run side-by-side Storybook comparisons for matching story ids and verify:
  - visual output,
  - DOM structure,
  - ARIA/data attributes,
  - state classes/transitions.

## Required Per-Component Loop

1. Build parity artifacts (React build artifact + fresh Vue Storybook build).
2. Compare the exact same story id in both iframes (`iframe.html?id=<story-id>&viewMode=story`).
3. Verify story structure, names, args, argTypes, controls/options/defaults.
4. Capture canonical DOM contract snapshots (`tag`, classes, role, `aria-*`, `data-*`, `tabindex`).
5. Run deterministic interaction probes (`Tab`, hover, pointer down/up, `Space`, `Enter`, story-specific interactions).
6. Capture computed styles for key states (initial, focus-visible, hover, pressed, disabled, pending).
7. Fix one gap cluster at a time in internals.
8. Add regression tests (DOM contract + style/state behavior assertions).
9. Re-run the full validation gate before moving to the next component.

## Validation Gate

- `yarn typecheck:vue`
- `yarn test:vue`
- `yarn build:vue:storybook`
- Story index parity check for targeted scope (React vs Vue diff must be zero)
- Manual side-by-side Storybook review for structure, controls, attributes, styles, and interactions

## Next Agent Start Checklist

1. Read this `AGENTS.md` fully: required workflow + latest evidence entries.
2. Finish/verify current unstaged story parity edits before starting a new family.
3. Run full validation gate and capture exact command outputs in commit notes.
4. Log evidence with date, changed files, fixed behavior contracts, and test/build results.
5. Only request review once structure, style, behavior, controls, and tests are all aligned.
