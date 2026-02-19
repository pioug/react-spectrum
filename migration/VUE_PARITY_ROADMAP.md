# Vue Parity Roadmap

This roadmap tracks the work needed to reach:

1. Full React-to-Vue API parity for mapped packages, including edge-case behavior.
2. Full pixel parity for mapped component render states.

## Success criteria

1. API parity:
   - Zero missing public exports across mapped package entrypoints.
   - Vue package prop/event signatures and documented behavior aligned with React equivalents.
   - Edge-case fixtures pass for keyboard, pointer, focus, disabled/read-only, validation, i18n/RTL, overlays, virtualized collections, SSR-safe ids, and async states.
2. Visual parity:
   - React and Vue fixture matrices render within configured pixel-diff thresholds.
   - Theme variants (`default`, `dark`, `express`, `light`) and density/scale snapshots are covered.
   - CI stores parity artifacts for failing diffs.

## Phases

### Phase 1: Parity infrastructure

1. [x] Add API parity report + assert pipeline:
   - `yarn vue:parity:api:report`
   - `yarn vue:parity:api:assert`
2. [ ] Add React-vs-Vue visual parity harness and screenshot diff runner.
3. [ ] Add parity CI jobs and artifact publication.

### Phase 2: Baseline measurement

1. [ ] Generate initial API parity baseline report.
2. [ ] Generate initial visual parity baseline report.
3. [ ] Rank gaps by severity and package dependency depth.

### Phase 3: API parity closure

1. [ ] Close missing exports package-by-package.
2. [ ] Close type signature and prop/event mismatch gaps.
3. [ ] Add edge-case behavior fixtures for each package cluster.

### Phase 4: Visual parity closure

1. [ ] Close token/theme/style mismatches by component cluster.
2. [ ] Add state-matrix visual fixtures (default, hover, focus-visible, active, disabled, invalid, selected).
3. [ ] Enforce strict thresholds in CI.

### Phase 5: Stabilization

1. [ ] Keep parity checks green for all new Vue migration changes.
2. [ ] Gate release/publish workflows on parity checks.
3. [ ] Document exceptions explicitly (if any) with rationale and migration guidance.

## Current status

* API parity infrastructure is implemented.
* API parity closure and visual parity closure are still in progress.
