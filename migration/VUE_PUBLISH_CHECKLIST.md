# Vue Publish Checklist

This checklist defines the minimum release bar for promoting Vue migration packages from internal baseline ports to publish-ready packages.

## Release gates

1. Package API is documented in package README with examples and known limitations.
2. `yarn vue:migration:test` passes with no skipped package acceptance checks.
3. `yarn test:vue` passes for starter interaction coverage.
4. Package has at least one interaction or behavior test in Vue test harness coverage.
5. Migration tracker entry for the package has actionable notes and acceptance tests.
6. Migration examples in `migration/REACT_TO_VUE_MIGRATION_GUIDE.md` are current for the package.
7. Package versioning and changelog entry are prepared for public release.
8. Aggregate packages (`vue-aria`, `vue-stately`) are validated for export coverage when package-level releases are prepared.

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

1. On February 19, 2026, `yarn vue:migration:test` passed with all active migration acceptance checks.
2. On February 19, 2026, `yarn test:vue` passed in `starters/vue` with 171 passing tests.
