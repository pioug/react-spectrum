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
  * `@react-spectrum/buttongroup` -> `@vue-spectrum/buttongroup` (`in_progress`)
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
  * `@react-spectrum/labeledvalue` -> `@vue-spectrum/labeledvalue` (`in_progress`)
  * `@react-spectrum/layout` -> `@vue-spectrum/layout` (`in_progress`)
  * `@react-spectrum/form` -> `@vue-spectrum/form` (`in_progress`)
  * `@react-spectrum/icon` -> `@vue-spectrum/icon` (`in_progress`)
  * `@react-spectrum/image` -> `@vue-spectrum/image` (`in_progress`)
  * `@react-spectrum/inlinealert` -> `@vue-spectrum/inlinealert` (`in_progress`)
  * `@react-spectrum/illustratedmessage` -> `@vue-spectrum/illustratedmessage` (`in_progress`)
* Started Tailwind plugin migration:
  * `tailwindcss-react-aria-components` -> `tailwindcss-vue-aria-components` (`in_progress`)
* Started composition-component migration:
  * `@react-spectrum/accordion` -> `@vue-spectrum/accordion` (`in_progress`)
  * `@react-spectrum/actionbar` -> `@vue-spectrum/actionbar` (`in_progress`)
  * `@react-spectrum/actiongroup` -> `@vue-spectrum/actiongroup` (`in_progress`)
  * `@react-spectrum/breadcrumbs` -> `@vue-spectrum/breadcrumbs` (`in_progress`)
  * `@react-spectrum/calendar` -> `@vue-spectrum/calendar` (`in_progress`)
  * `@react-spectrum/card` -> `@vue-spectrum/card` (`in_progress`)
  * `@react-spectrum/color` -> `@vue-spectrum/color` (`in_progress`)
  * `@react-spectrum/contextualhelp` -> `@vue-spectrum/contextualhelp` (`in_progress`)
  * `@react-spectrum/datepicker` -> `@vue-spectrum/datepicker` (`in_progress`)
  * `@react-spectrum/picker` -> `@vue-spectrum/picker` (`in_progress`)
  * `@react-spectrum/dialog` -> `@vue-spectrum/dialog` (`in_progress`)
  * `@react-spectrum/overlays` -> `@vue-spectrum/overlays` (`in_progress`)
  * `@react-spectrum/combobox` -> `@vue-spectrum/combobox` (`in_progress`)
  * `@react-spectrum/autocomplete` -> `@vue-spectrum/autocomplete` (`in_progress`)
  * `@react-spectrum/menu` -> `@vue-spectrum/menu` (`in_progress`)
  * `@react-spectrum/listbox` -> `@vue-spectrum/listbox` (`in_progress`)
  * `@react-spectrum/list` -> `@vue-spectrum/list` (`in_progress`)
* Started data-heavy migration:
  * `@react-spectrum/table` -> `@vue-spectrum/table` (`in_progress`)
  * `@react-spectrum/tree` -> `@vue-spectrum/tree` (`in_progress`)
  * `@react-spectrum/dnd` -> `@vue-spectrum/dnd` (`in_progress`)
  * `@react-spectrum/dropzone` -> `@vue-spectrum/dropzone` (`in_progress`)
  * `@react-spectrum/filetrigger` -> `@vue-spectrum/filetrigger` (`in_progress`)
* Started React Aria package migration:
  * `@react-aria/actiongroup` -> `@vue-aria/actiongroup` (`in_progress`)
  * `@react-aria/autocomplete` -> `@vue-aria/autocomplete` (`in_progress`)
  * `@react-aria/breadcrumbs` -> `@vue-aria/breadcrumbs` (`in_progress`)
  * `@react-aria/button` -> `@vue-aria/button` (`in_progress`)
  * `@react-aria/calendar` -> `@vue-aria/calendar` (`in_progress`)
  * `@react-aria/checkbox` -> `@vue-aria/checkbox` (`in_progress`)
  * `@react-aria/collections` -> `@vue-aria/collections` (`in_progress`)
  * `@react-aria/combobox` -> `@vue-aria/combobox` (`in_progress`)
  * `@react-aria/datepicker` -> `@vue-aria/datepicker` (`in_progress`)
  * `@react-aria/dialog` -> `@vue-aria/dialog` (`in_progress`)
  * `@react-aria/dnd` -> `@vue-aria/dnd` (`in_progress`)
  * `@react-aria/example-theme` -> `@vue-aria/example-theme` (`in_progress`)
  * `@react-aria/focus` -> `@vue-aria/focus` (`in_progress`)
  * `@react-aria/form` -> `@vue-aria/form` (`in_progress`)
  * `@react-aria/grid` -> `@vue-aria/grid` (`in_progress`)
  * `@react-aria/gridlist` -> `@vue-aria/gridlist` (`in_progress`)
  * `@react-aria/i18n` -> `@vue-aria/i18n` (`in_progress`)
  * `@react-aria/interactions` -> `@vue-aria/interactions` (`in_progress`)
  * `@react-aria/label` -> `@vue-aria/label` (`in_progress`)
  * `@react-aria/landmark` -> `@vue-aria/landmark` (`in_progress`)
  * `@react-aria/link` -> `@vue-aria/link` (`in_progress`)
  * `@react-aria/listbox` -> `@vue-aria/listbox` (`in_progress`)
  * `@react-aria/live-announcer` -> `@vue-aria/live-announcer` (`in_progress`)
  * `@react-aria/disclosure` -> `@vue-aria/disclosure` (`in_progress`)
  * `@react-aria/color` -> `@vue-aria/color` (`in_progress`)
  * `@react-aria/aria-modal-polyfill` -> `@vue-aria/aria-modal-polyfill` (`in_progress`)
  * `@react-aria/virtualizer` -> `@vue-aria/virtualizer` (`in_progress`)
  * Vue starter now includes composable coverage for `@vue-aria/actiongroup`, `@vue-aria/autocomplete`, `@vue-aria/breadcrumbs`, `@vue-aria/button`, `@vue-aria/calendar`, `@vue-aria/checkbox`, `@vue-aria/collections`, `@vue-aria/combobox`, `@vue-aria/datepicker`, `@vue-aria/dialog`, `@vue-aria/dnd`, `@vue-aria/example-theme`, `@vue-aria/focus`, `@vue-aria/form`, `@vue-aria/grid`, `@vue-aria/gridlist`, `@vue-aria/i18n`, `@vue-aria/interactions`, `@vue-aria/label`, `@vue-aria/landmark`, `@vue-aria/link`, `@vue-aria/listbox`, `@vue-aria/live-announcer`, `@vue-aria/disclosure`, `@vue-aria/color`, and `@vue-aria/aria-modal-polyfill`, plus a virtualized backlog demo wired to `@vue-aria/virtualizer`.
* Started Vue test adaptation:
  * `starters/vue` runs Vitest + Vue Test Utils interaction tests for `button`, `buttongroup`, `textfield`, `checkbox`, `radio`, `switch`, `layout`, `labeledvalue`, `illustratedmessage`, and `icon`.
  * Added composition coverage for `accordion`, `actionbar`, `actiongroup`, `breadcrumbs`, `calendar`, `card`, `color`, `contextualhelp`, `datepicker`, `picker`, `dialog`, `overlays`, `menu`, `listbox`, `list`, `combobox`, and `autocomplete`.
  * Added data-heavy and virtualization coverage for `table`, `tree`, `dnd`, `dropzone`, `filetrigger`, and `@vue-aria/virtualizer`, plus composable coverage for `@vue-aria/actiongroup`, `@vue-aria/autocomplete`, `@vue-aria/breadcrumbs`, `@vue-aria/button`, `@vue-aria/calendar`, `@vue-aria/checkbox`, `@vue-aria/collections`, `@vue-aria/combobox`, `@vue-aria/datepicker`, `@vue-aria/dialog`, `@vue-aria/dnd`, `@vue-aria/example-theme`, `@vue-aria/focus`, `@vue-aria/form`, `@vue-aria/grid`, `@vue-aria/gridlist`, `@vue-aria/i18n`, `@vue-aria/interactions`, `@vue-aria/label`, `@vue-aria/landmark`, `@vue-aria/link`, `@vue-aria/listbox`, `@vue-aria/live-announcer`, `@vue-aria/disclosure`, `@vue-aria/color`, and `@vue-aria/aria-modal-polyfill`.
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
