# Vue Migration Plan

## Current status (as of February 25, 2026)

1. React packages are in maintenance mode while Vue migration ports continue.
2. Storybook parity is still in progress and must be validated manually.
3. Vue Storybook includes both `@vue-spectrum/*/stories` and `packages/vue-aria-components/stories` sources for parity navigation coverage.
4. Completion is evidence-driven and not inferred from scripts, reports, or checklists.

## Non-negotiable rules (required)

1. Do not add parity scripts, migration tracker scripts, checklist-validator scripts, or script-based completion counters.
2. Do not infer completion from generated reports, checklists, or script output.
3. Fix behavior and structure in Vue component internals (no story-only hacks).
4. Scaffold placeholders are temporary only and must be replaced by real parity stories before a component is considered complete.
5. Record reviewed scope, gaps, and evidence in commit/PR notes.
6. Commit and push frequently in small, reviewable increments.

## Session execution mode (required)

1. Do not wait for user screenshot checks to discover gaps.
2. Pick the next component in Storybook and run the full parity workflow end-to-end.
3. Only move to the next component after the current component passes the validation gate.
4. If blocked, record the blocker in commit/PR notes with the exact missing dependency or code path.
5. Ask for user validation only after structure, style, behavior, and tests are aligned for that component.

## Per-component parity workflow (required)

1. Build auditable Storybook outputs before gap analysis (use current React Storybook build artifact and a fresh Vue Storybook build).
2. Compare the exact same story id in both iframes (`iframe.html?id=<story-id>&viewMode=story`).
3. Confirm story source structure, grouping, names, and featured scenario coverage match React.
4. Capture baseline DOM snapshots for the canonical interactive node (tag, class, role, `data-*`, `aria-*`, `tabindex`, and other critical attributes).
5. Run a deterministic interaction probe sequence: keyboard focus (`Tab`), hover, pointer down/up, keyboard activation (`Space`/`Enter`), then story-specific interactions.
6. Capture post-step snapshots after each probe and diff React vs Vue state attributes and class/state transitions.
7. Treat contract drift as a gap: missing attributes, extra attributes, wrong classes, mismatched ARIA state, or divergent interaction transitions.
8. Validate computed styles only on critical states and representative nodes; avoid screenshot-only judgments.
9. If direct cross-framework story imports fail in tests due workspace resolution, use browser-level probes against built Storybook output rather than blocking discovery.
10. Inspect React and Vue internals for the divergent code paths and fix one gap cluster at a time.
11. Add or update regression tests for each fixed gap.
12. Rerun the validation gate and only then move to the next component.
13. Use screenshots only as final confirmation after structure, styles, and behavior already match.

## Style handling policy (required)

1. Prioritize style sources in this order: `@adobe/spectrum-css-temp` component/vars styles, existing React package-local styles when needed for parity, and Vue-local styles only for Vue-only DOM that has no React equivalent.
2. Keep React/Spectrum class structure and class names where feasible.
3. Prefer wiring Vue components to existing React/Spectrum style modules instead of duplicating CSS.
4. Do not create Vue-only duplicate style files when an equivalent React/Spectrum stylesheet already exists.
5. Include tests for style-state behavior (focus, hover, pressed, disabled, pending) when fixing style gaps.

## Validation gate before requesting review (required)

1. Run `yarn typecheck:vue`.
2. Run `yarn test:vue`.
3. Build Vue Storybook with `yarn build:vue:storybook`.
4. Run Storybook index parity check (React vs Vue story id diff must be zero for the targeted scope).
5. Manually review React and Vue Storybook side by side for structure, key attributes, computed styles, and interactions.
6. Confirm regression tests cover fixed gaps and evidence is captured in commit/PR notes.
