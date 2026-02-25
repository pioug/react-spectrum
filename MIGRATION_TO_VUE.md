# Vue Migration Plan

## Current (as of February 24, 2026)

1. React packages are in maintenance mode while Vue migration ports continue.
2. Storybook parity is still in progress and must be validated manually.
3. Vue Storybook includes both `@vue-spectrum/*/stories` and `packages/vue-aria-components/stories` sources for parity navigation coverage.
4. Script-driven parity and migration completion gates were removed.
5. Completion is not inferred from scripts or checklists.

## Working method (required)

1. Do not add new parity scripts, migration tracker scripts, checklist-validator scripts, or script-based completion counters.
2. Do not infer completion from generated reports, checklists, or script output.
3. Compare React and Vue Storybook side by side for every component and story.
4. Review React and Vue component internals to discover real code paths and feature behavior.
5. Fix behavior and structure in Vue component internals (no story-only hacks).
6. Add or update component tests for every fixed gap.
7. Record reviewed scope, gaps, and evidence in commit/PR notes.
8. Commit and push frequently in small, reviewable increments.

## Execution mode (required every session)

1. Do not wait for user screenshot checks to discover gaps.
2. Pick the next component in Storybook and run the full parity loop end-to-end.
3. Only move to the next component after the current component passes the done gate.
4. If blocked, record the blocker in commit/PR notes with the exact missing dependency or code path.
5. Ask for user validation only after structure, style, behavior, and tests are aligned for that component.

## Done gate before requesting review (required)

1. Story source structure is matched to React for the component.
2. Featured scenarios present in React stories are present in Vue stories.
3. DOM structure and critical attributes/classes are matched.
4. Computed style checks for critical states are matched.
5. Interaction/state flow is matched.
6. Vue implementation changes are covered by regression tests.
7. Validation commands pass and notes are captured in commit/PR description.

## Story parity strategy (required)

1. Match story source structure first.
2. Vue stories must mirror React story grouping, names, and covered featured scenarios for each component.
3. Scaffold placeholders are temporary only and must be replaced by real parity stories before marking a component as in progress.
4. If React has multiple featured stories for a component, Vue must expose the same feature surface before parity review can be considered complete.

## Per-component parity loop (required)

1. Open React and Vue Storybook side by side for one component.
2. Confirm story list and scenario coverage match first.
3. Diff rendered markup structure and key attributes (`role`, ARIA, data attributes, class names).
4. Diff computed styles on representative nodes and key states (default, hover, focus, pressed, disabled, selected, open, pending/loading where applicable).
5. Exercise interactions and state transitions in both implementations.
6. Inspect React and Vue internals for any remaining divergence.
7. Fix Vue implementation and wire styles to existing sources (see style policy below).
8. Add regression tests for the fixed gap.
9. Use screenshots only as final confirmation after structure, styles, and behavior already match.

## Gap discovery workflow (required)

1. Build auditable Storybook outputs before gap analysis (use current React Storybook build artifact and a fresh Vue Storybook build).
2. Compare the exact same story id in both iframes (`iframe.html?id=<story-id>&viewMode=story`).
3. Capture baseline DOM snapshots for the canonical interactive node (tag, class, role, `data-*`, `aria-*`, `tabindex`, and other critical attributes).
4. Run a deterministic interaction probe sequence for each story: keyboard focus (`Tab`), hover, pointer down/up, keyboard activation (`Space`/`Enter`), then story-specific interactions.
5. Capture post-step snapshots after each probe and diff React vs Vue state attributes and class/state transitions.
6. Treat contract drift as a gap: missing attributes, extra attributes, wrong classes, mismatched ARIA state, or divergent interaction transitions.
7. Validate computed styles only on critical states and representative nodes; avoid broad screenshot-only judgments.
8. If direct cross-framework story imports fail in tests due workspace resolution, use browser-level probes against built Storybook output rather than blocking discovery.
9. Record each gap with evidence: story id, probe step, expected React output, actual Vue output, and suspected source file path.
10. Fix one gap cluster at a time, add regression coverage, then rerun validation gates before moving to the next component.

## Style handling policy (required)

1. Style source of truth priority is:
   1. `@adobe/spectrum-css-temp` component and vars styles.
   2. Existing React package-local styles when needed for parity.
   3. Vue-local styles only for Vue-only DOM that has no React equivalent.
2. Vue components should keep React/Spectrum class structure and class names where feasible.
3. Prefer wiring Vue components to existing React/Spectrum style modules instead of duplicating CSS.
4. Do not create Vue-only duplicate style files when an equivalent React/Spectrum stylesheet already exists.
5. When fixing style gaps, include tests for style-state behavior (e.g. focus, hover, pressed, disabled, pending) so regressions are caught.

## Validation for each component fix

1. `yarn typecheck:vue`
2. `yarn test:vue`
3. Vue Storybook build (`yarn build:vue:storybook`)
4. Storybook index parity check (React vs Vue story id diff must be zero for targeted scope)
5. Manual Storybook side-by-side review for structure, computed styles, and interactions
6. Optional final screenshot confirmation

## Completion criteria

1. Story structure and controls match React.
2. Interactions and state behavior match React.
3. Rendered markup structure and key ARIA/class attributes match React expectations.
4. Computed styles for covered states match React expectations.
5. Code-path review shows no unexplained divergence for covered behaviors.
6. Regression tests exist for fixed gaps.
7. Evidence is attached to commit/PR notes.
