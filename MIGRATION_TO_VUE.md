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
7. Do not sign off parity from only one Storybook namespace when a component exists in multiple namespaces (for example `Button/*` and `React Aria Components/Button/*`).
8. Style parity is blocking, not optional. If computed styles diverge on canonical states, the component is not complete.
9. Controls parity is blocking, not optional. If Storybook controls/argTypes differ, the component is not complete.

## Session execution mode (required)

1. Do not wait for user screenshot checks to discover gaps.
2. Pick the next component in Storybook and run the full parity workflow end-to-end.
3. Only move to the next component after the current component passes the validation gate.
4. If blocked, record the blocker in commit/PR notes with the exact missing dependency or code path.
5. Ask for user validation only after structure, style, behavior, and tests are aligned for that component.

## Per-component parity workflow (required)

1. Build auditable Storybook outputs before gap analysis (use current React Storybook build artifact and a fresh Vue Storybook build).
2. Compare the exact same story id in both iframes (`iframe.html?id=<story-id>&viewMode=story`).
3. If the component exists in multiple Storybook namespaces, run parity for each namespace before marking the component complete.
4. Confirm story source structure, grouping, names, and featured scenario coverage match React. Use built `index.json` entries as the source of truth for story labels/names because Storybook may normalize names differently than source `story.name` declarations.
5. Compare story meta/controls contract for canonical stories: `args`, `argTypes`, control type/options/defaults, hidden/disabled rows, and story-level control/action parameter overrides.
6. Capture baseline DOM snapshots for the canonical interactive node (tag, class, role, `data-*`, `aria-*`, `tabindex`, and other critical attributes).
7. Always include native-button contract checks in the baseline and diffs: `disabled`, `aria-disabled`, `tabindex`, and `data-react-aria-pressable`.
8. Run a deterministic interaction probe sequence with real browser input: keyboard focus (`Tab`), hover, pointer down/up, keyboard activation (`Space`/`Enter`), then story-specific interactions.
9. Capture post-step snapshots after each probe and diff React vs Vue state attributes and class/state transitions.
10. After each interaction step, wait for state transitions to settle before capturing snapshots (at least one interaction animation interval) so comparisons are not skewed by in-flight CSS transitions.
11. Treat contract drift as a gap: missing attributes, extra attributes, wrong classes, mismatched ARIA state, or divergent interaction transitions.
12. When comparing built Storybook DOM classes, normalize framework-generated CSS-module hash prefixes (for example `Ab12_spectrum-*`) and compare semantic Spectrum/state tokens, not raw hashed class strings.
13. Verify compiled CSS selectors in the built output match the runtime state contract (for example `focus-ring`, `is-hovered`, `is-active`). If Vue emits state classes but compiled selectors are pseudo-only (or vice versa), fix the component/style wiring before sign-off.
14. Capture computed style snapshots for canonical nodes on at least these states when applicable: initial, focus-visible, hover, pressed, disabled, pending.
15. Compare a fixed critical style set per component (layout, typography, color, border, radius, shadow/outline, cursor/opacity, user-select/pointer-events). Treat any unexplained delta as a parity gap.
16. Do not use screenshot-only judgments for style parity. Screenshots are supporting evidence only after computed-style parity is established.
17. If direct cross-framework story imports fail in tests due workspace resolution, use browser-level probes against built Storybook output rather than blocking discovery.
18. Inspect React and Vue internals for the divergent code paths and fix one gap cluster at a time.
19. Add or update regression tests for each fixed gap, including at least one assertion for canonical DOM contract and one assertion for a critical style/state behavior in Vue tests.
20. Rerun the validation gate and only then move to the next component.
21. Use screenshots only as final confirmation after structure, styles, and behavior already match.

## Style handling policy (required)

1. Prioritize style sources in this order: `@adobe/spectrum-css-temp` component/vars styles, existing React package-local styles when needed for parity, and Vue-local styles only for Vue-only DOM that has no React equivalent.
2. Keep React/Spectrum class structure and class names where feasible.
3. Prefer wiring Vue components to existing React/Spectrum style modules instead of duplicating CSS.
4. Do not create Vue-only duplicate style files when an equivalent React/Spectrum stylesheet already exists.
5. Include tests for style-state behavior (focus, hover, pressed, disabled, pending) when fixing style gaps.
6. Do not add Vue-only overrides that merely make screenshots look similar while state selectors or DOM contracts remain mismatched.
7. When style mismatches appear, verify class and state-attribute parity first, then fix style sources.

## Validation gate before requesting review (required)

1. Run `yarn typecheck:vue`.
2. Run `yarn test:vue`.
3. Build Vue Storybook with `yarn build:vue:storybook`.
4. Run Storybook index parity check (React vs Vue story id diff must be zero for the targeted scope).
5. Capture and review DOM-contract diffs for canonical stories in each relevant namespace before sign-off.
6. Capture and review computed-style diffs for canonical stories in each relevant namespace and state matrix before sign-off.
7. Capture and review controls/argTypes parity evidence for canonical stories in each relevant namespace before sign-off.
8. Manually review React and Vue Storybook side by side for structure, controls, key attributes, computed styles, and interactions.
9. Confirm regression tests cover fixed gaps and evidence is captured in commit/PR notes.
