# Vue Migration Plan

## Current (as of February 24, 2026)

1. React packages are in maintenance mode while Vue migration ports continue.
2. Storybook parity is still in progress and must be validated manually.
3. Script-driven parity and migration completion gates were removed.
4. Completion is not inferred from scripts or checklists.

## Current working method (required)

1. Do not add new parity scripts, migration tracker scripts, checklist-validator scripts, or script-based completion counters.
2. Find gaps by browsing React and Vue Storybook side by side.
3. Compare component internals/code paths in React vs Vue for each identified gap.
4. Fix behavior and structure in Vue component internals (no story-only hacks).
5. Add or update component tests for every fixed gap.
6. Record reviewed scope, gaps, and evidence in the component fix PR/commit notes.

## Validation for each component fix

1. `yarn typecheck:vue`
2. `yarn test:vue`
3. Manual Storybook side-by-side interaction review
4. Optional screenshots as confirmation evidence only

## Completion criteria

1. Story structure and controls match React.
2. Interactions and state behavior match React.
3. Code-path review shows no unexplained divergence for covered behaviors.
4. Regression tests exist for fixed gaps.
5. Evidence is attached to the component fix PR/commit notes.
