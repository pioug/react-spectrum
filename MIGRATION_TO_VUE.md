# Vue Migration Plan

This repository has been historically React-first. A full migration to Vue requires replacing framework-coupled packages (`@react-aria/*`, `@react-stately/*`, `@react-spectrum/*`, and `react-aria-components`) with Vue-native equivalents.

## Current status

Phase 1 is implemented:

* Added `@vue-spectrum/components` with initial Vue-native components.
* Added `starters/vue` to validate local development with Vue.
* Added root scripts:
  * `yarn start:vue`
  * `yarn build:vue`
  * `yarn typecheck:vue`
* Added a package-by-package tracker:
  * `VUE_MIGRATION_TRACKER.md` (generated snapshot)
  * `migration/vue-migration-status.json` (status and acceptance test definitions)
  * `yarn vue:migration:report` (regenerates tracker)
  * `yarn vue:migration:test` (runs acceptance tests for active ports)
* Added CI enforcement:
  * CircleCI `vue-migration` job runs `yarn vue:migration:report` and `yarn vue:migration:test`.
* Started first package-level port:
  * `@react-spectrum/provider` -> `@vue-spectrum/provider` is now tracked as `in_progress`.
* Expanded first-wave ports:
  * `@react-spectrum/button` -> `@vue-spectrum/button` (`in_progress`)
  * `@react-spectrum/avatar` -> `@vue-spectrum/avatar` (`in_progress`)
  * `@react-spectrum/badge` -> `@vue-spectrum/badge` (`in_progress`)
  * `@react-spectrum/well` -> `@vue-spectrum/well` (`in_progress`)
  * `@react-spectrum/view` -> `@vue-spectrum/view` (`in_progress`)
  * `@react-spectrum/text` -> `@vue-spectrum/text` (`in_progress`)
  * `@react-spectrum/textfield` -> `@vue-spectrum/textfield` (`in_progress`)
  * `@react-spectrum/searchfield` -> `@vue-spectrum/searchfield` (`in_progress`)
  * `@react-spectrum/numberfield` -> `@vue-spectrum/numberfield` (`in_progress`)
  * `@react-spectrum/slider` -> `@vue-spectrum/slider` (`in_progress`)
  * `@react-spectrum/progress` -> `@vue-spectrum/progress` (`in_progress`)
  * `@react-spectrum/meter` -> `@vue-spectrum/meter` (`in_progress`)
  * `@react-spectrum/statuslight` -> `@vue-spectrum/statuslight` (`in_progress`)
  * `@react-spectrum/checkbox` -> `@vue-spectrum/checkbox` (`in_progress`)
  * `@react-spectrum/radio` -> `@vue-spectrum/radio` (`in_progress`)
  * `@react-spectrum/switch` -> `@vue-spectrum/switch` (`in_progress`)
  * `@react-spectrum/divider` -> `@vue-spectrum/divider` (`in_progress`)
  * `@react-spectrum/link` -> `@vue-spectrum/link` (`in_progress`)
  * `@react-spectrum/label` -> `@vue-spectrum/label` (`in_progress`)
  * `@react-spectrum/form` -> `@vue-spectrum/form` (`in_progress`)
  * `@react-spectrum/image` -> `@vue-spectrum/image` (`in_progress`)
  * `@react-spectrum/inlinealert` -> `@vue-spectrum/inlinealert` (`in_progress`)
* Started Tailwind plugin migration:
  * `tailwindcss-react-aria-components` -> `tailwindcss-vue-aria-components` (`in_progress`)
* Started composition-component migration:
  * `@react-spectrum/dialog` -> `@vue-spectrum/dialog` (`in_progress`)
  * `@react-spectrum/overlays` -> `@vue-spectrum/overlays` (`in_progress`)
  * `@react-spectrum/combobox` -> `@vue-spectrum/combobox` (`in_progress`)
  * `@react-spectrum/menu` -> `@vue-spectrum/menu` (`in_progress`)
  * `@react-spectrum/listbox` -> `@vue-spectrum/listbox` (`in_progress`)
* Started data-heavy migration:
  * `@react-spectrum/table` -> `@vue-spectrum/table` (`in_progress`)
  * `@react-spectrum/tree` -> `@vue-spectrum/tree` (`in_progress`)
  * `@react-spectrum/dnd` -> `@vue-spectrum/dnd` (`in_progress`)
* Started React Aria package migration:
  * `@react-aria/virtualizer` -> `@vue-aria/virtualizer` (`in_progress`)
  * Vue starter now includes a virtualized backlog demo wired to `@vue-aria/virtualizer`.
* Started Vue test adaptation:
  * `starters/vue` runs Vitest + Vue Test Utils interaction tests for `button`, `textfield`, `checkbox`, `radio`, and `switch`.
  * Added composition coverage for `dialog`, `overlays`, `menu`, `listbox`, and `combobox`.
  * Added data-heavy and virtualization coverage for `table`, `tree`, `dnd`, and `@vue-aria/virtualizer`.
* Started API stabilization and deprecation planning:
  * `migration/VUE_PUBLISH_CHECKLIST.md`
  * `migration/REACT_DEPRECATION_PLAN.md`
  * `migration/REACT_TO_VUE_MIGRATION_GUIDE.md`
  * `migration/VUE_PACKAGE_ARCHITECTURE.md`

## Migration phases

1. Foundation
   * Establish Vue package namespace and starter app.
   * Define base provider, styling tokens, and component API conventions.
2. Primitive components
   * Implement Vue primitives for button, field, text input, checkbox, radio, and switch.
   * Add unit tests for keyboard and pointer interactions.
3. Composition components
   * Port listbox, menu, dialog, popover, and combo patterns.
   * Add accessibility coverage and focus management tests.
4. Data-heavy components
   * Port table, tree, virtualizer-backed collections, and drag/drop interactions.
   * Measure and tune performance.
5. API stabilization and deprecation
   * Publish Vue packages and document migration guides for consumers.
   * Freeze React package feature development and deprecate gradually.

## Constraints to plan around

* Existing hooks are React-specific and cannot be consumed directly from Vue.
* Build, docs, and test infrastructure in this repo are currently React-oriented.
* Migration requires incremental package-by-package replacement to avoid ecosystem breakage.
