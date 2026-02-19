# Vue Publish Checklist

This checklist defines the minimum release bar for promoting Vue migration packages from internal baseline ports to publish-ready packages.

## Release gates

1. Package API is documented in package README with examples and known limitations.
2. `yarn vue:migration:test` passes with no skipped package acceptance checks.
3. `yarn test:vue` passes for starter interaction coverage.
4. Package has at least one interaction or behavior test in Vue test harness coverage.
5. Migration tracker entry for the package has actionable notes and acceptance tests.
6. Package versioning and changelog entry are prepared for public release.

## Publish order

1. `@vue-aria/*` foundational utilities (for example virtualizer).
2. `@vue-spectrum/*` primitives (`provider`, form controls, base display primitives).
3. Composition packages (`dialog`, `overlays`, `menu`, `listbox`, `combobox`).
4. Data-heavy packages (`table`, `tree`, `dnd`).

## Post-publish validation

1. Verify starter app works against published package versions.
2. Verify docs examples compile against published versions.
3. Track migration defects under a dedicated Vue migration label.
