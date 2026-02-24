# Vue Migration Plan

## Current (as of February 24, 2026)

1. React packages are in maintenance mode while Vue migration ports continue.
2. Storybook parity is still in progress and must be validated manually.
3. Vue Storybook now includes `@vue-spectrum/*/stories` source scaffolds for components that previously had no Vue story source.
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
3. Manual Storybook side-by-side review for structure, computed styles, and interactions
4. Optional final screenshot confirmation

## Completion criteria

1. Story structure and controls match React.
2. Interactions and state behavior match React.
3. Rendered markup structure and key ARIA/class attributes match React expectations.
4. Computed styles for covered states match React expectations.
5. Code-path review shows no unexplained divergence for covered behaviors.
6. Regression tests exist for fixed gaps.
7. Evidence is attached to commit/PR notes.
