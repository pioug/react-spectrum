# AGENTS Handoff - Vue Migration

Last updated: February 28, 2026 (Asia/Singapore)  
Source of truth: this file (`AGENTS.md`)

## Non-negotiables

- React packages are in maintenance mode; migration parity work is Vue-first.
- Do not add parity scripts, migration counters, or checklist validators.
- Passing automated tests protects from regressions but does not prove parity.
- Compare Vue against React source, API contracts, and existing React tests before implementing.
- Do not improvise Vue-only behavior logic; idiomatic Vue differences are valid only when the React behavior contract is preserved.
- Reuse/copy React/Spectrum styles where possible; avoid Vue-only style forks unless there is no React-equivalent DOM.
- Vue ports should not add extra stories, styles, logic, or CSS beyond React parity, except when needed to solve Vue-idiomatic constraints without changing the React behavior/style contract.
- Fix behavior in Vue internals, not in story-only workarounds; replace placeholders before sign-off.
- Validate each component in all relevant Storybook namespaces:
  - `packages/@vue-spectrum/*/stories`
  - `packages/vue-aria-components/stories`
- Commit and push often in small, reviewable increments; keep changes scoped to one component family/behavior cluster.
- Record scope, gaps, evidence, and validation outputs in commit/PR notes.

## Per-Component Workflow

1. Build parity artifacts (React artifact + fresh Vue Storybook build).
2. Compare the exact same story id in both iframes (`iframe.html?id=<story-id>&viewMode=story`).
3. Compare React vs Vue source/API/props/states, and verify visual output, DOM structure, ARIA/data attributes, state classes/transitions, and computed styles.
4. Fix Vue internals and add/adjust regression tests for the gap.
5. Run full validation gate; move to next component only after pass.

## Validation Gate

- `yarn typecheck:vue`
- `yarn test:vue`
- `yarn build:vue:storybook`
- Story index parity check for targeted scope (React vs Vue story id diff must be zero)
- Manual side-by-side Storybook review for structure, controls, attributes, styles, and interactions

## Definition Of Done

- Structure, behavior, styles, controls, and tests match React across all relevant namespaces, with evidence logged.
