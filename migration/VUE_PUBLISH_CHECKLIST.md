# Vue Publish Checklist

This checklist defines the minimum release bar for promoting Vue migration packages from internal baseline ports to publish-ready packages.

## Release gates

1. Package API is documented in package README with examples and known limitations.
2. `yarn typecheck:vue` passes for starter TypeScript coverage.
3. `yarn test:vue` passes for starter interaction coverage.
4. Storybook gaps are discovered by manual side-by-side review of React and Vue stories (structure, controls, states, and interactions), not inferred from parity scripts.
5. React and Vue component internals are compared to confirm behavior/code-path equivalence for every fixed gap.
6. Every parity fix adds or updates a component-level test to prevent regression.
7. Progress/evidence is updated in `migration/STORYBOOK_PARITY_PROGRESS.md` for each component reviewed.
8. Migration examples in `migration/REACT_TO_VUE_MIGRATION_GUIDE.md` are current for the package.
9. Package versioning and changelog entry are prepared for public release.
10. Aggregate packages (`vue-aria`, `vue-stately`) are validated for export coverage when package-level releases are prepared.

## Publish order

1. `@vue-aria/*` foundational utilities (for example virtualizer).
2. `@vue-stately/*` state packages that back migrated Vue components.
3. Aggregate exports (`vue-aria`, `vue-stately`) once package-level exports are stable.
4. `@vue-spectrum/*` primitives (`provider`, form controls, base display primitives).
5. Composition packages (`dialog`, `overlays`, `menu`, `listbox`, `combobox`).
6. Data-heavy packages (`table`, `tree`, `dnd`).

## Post-publish validation

1. Verify starter app works against published package versions.
2. Verify docs examples compile against published versions.
3. Track migration defects under a dedicated Vue migration label.

## Current baseline evidence

1. On February 24, 2026, legacy parity and migration-tracker scripts were removed from active workflow.
2. On February 24, 2026, `migration/STORYBOOK_PARITY_PROGRESS.md` was established as the manual progression log.
3. On February 19, 2026, `yarn test:vue` passed in `starters/vue` with 181 passing tests.
4. The CircleCI `vue-migration` job now enforces `yarn typecheck:vue` and `yarn test:vue`.
