# Vue Migration Plan

This repository has been historically React-first. A full migration to Vue requires replacing framework-coupled packages (`@react-aria/*`, `@react-stately/*`, `@react-spectrum/*`, and `react-aria-components`) with Vue-native equivalents.

## Current status

Roadmap baseline coverage is complete across all migration phases for tracked packages:

* `migration/vue-migration-status.json` now reports `ported: 154`, `in_progress: 0`, `planned: 0`, `blocked: 0`, and `not_started: 0`.
* `VUE_MIGRATION_TRACKER.md` documents all tracked package mappings as `ported`.

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
* Ported foundational component package:
  * `react-aria-components` -> `@vue-spectrum/components` (`ported`)
* Ported meta-package aggregators:
  * `react-aria` -> `vue-aria` (`ported`)
  * `react-stately` -> `vue-stately` (`ported`)
* Started first package-level port:
  * `@react-spectrum/provider` -> `@vue-spectrum/provider` is now tracked as `ported`.
* Expanded first-wave ports:
  * `@react-spectrum/button` -> `@vue-spectrum/button` (`ported`)
  * `@react-spectrum/buttongroup` -> `@vue-spectrum/buttongroup` (`ported`)
  * `@react-spectrum/avatar` -> `@vue-spectrum/avatar` (`ported`)
  * `@react-spectrum/badge` -> `@vue-spectrum/badge` (`ported`)
  * `@react-spectrum/well` -> `@vue-spectrum/well` (`ported`)
  * `@react-spectrum/view` -> `@vue-spectrum/view` (`ported`)
  * `@react-spectrum/text` -> `@vue-spectrum/text` (`ported`)
  * `@react-spectrum/textfield` -> `@vue-spectrum/textfield` (`ported`)
  * `@react-spectrum/searchfield` -> `@vue-spectrum/searchfield` (`ported`)
  * `@react-spectrum/numberfield` -> `@vue-spectrum/numberfield` (`ported`)
  * `@react-spectrum/slider` -> `@vue-spectrum/slider` (`ported`)
  * `@react-spectrum/progress` -> `@vue-spectrum/progress` (`ported`)
  * `@react-spectrum/meter` -> `@vue-spectrum/meter` (`ported`)
  * `@react-spectrum/statuslight` -> `@vue-spectrum/statuslight` (`ported`)
  * `@react-spectrum/checkbox` -> `@vue-spectrum/checkbox` (`ported`)
  * `@react-spectrum/radio` -> `@vue-spectrum/radio` (`ported`)
  * `@react-spectrum/switch` -> `@vue-spectrum/switch` (`ported`)
  * `@react-spectrum/divider` -> `@vue-spectrum/divider` (`ported`)
  * `@react-spectrum/link` -> `@vue-spectrum/link` (`ported`)
  * `@react-spectrum/label` -> `@vue-spectrum/label` (`ported`)
  * `@react-spectrum/labeledvalue` -> `@vue-spectrum/labeledvalue` (`ported`)
  * `@react-spectrum/layout` -> `@vue-spectrum/layout` (`ported`)
  * `@react-spectrum/form` -> `@vue-spectrum/form` (`ported`)
  * `@react-spectrum/icon` -> `@vue-spectrum/icon` (`ported`)
  * `@react-spectrum/image` -> `@vue-spectrum/image` (`ported`)
  * `@react-spectrum/inlinealert` -> `@vue-spectrum/inlinealert` (`ported`)
  * `@react-spectrum/illustratedmessage` -> `@vue-spectrum/illustratedmessage` (`ported`)
* Started Tailwind plugin migration:
  * `tailwindcss-react-aria-components` -> `tailwindcss-vue-aria-components` (`ported`)
* Started composition-component migration:
  * `@react-spectrum/accordion` -> `@vue-spectrum/accordion` (`ported`)
  * `@react-spectrum/actionbar` -> `@vue-spectrum/actionbar` (`ported`)
  * `@react-spectrum/actiongroup` -> `@vue-spectrum/actiongroup` (`ported`)
  * `@react-spectrum/breadcrumbs` -> `@vue-spectrum/breadcrumbs` (`ported`)
  * `@react-spectrum/calendar` -> `@vue-spectrum/calendar` (`ported`)
  * `@react-spectrum/card` -> `@vue-spectrum/card` (`ported`)
  * `@react-spectrum/color` -> `@vue-spectrum/color` (`ported`)
  * `@react-spectrum/contextualhelp` -> `@vue-spectrum/contextualhelp` (`ported`)
  * `@react-spectrum/datepicker` -> `@vue-spectrum/datepicker` (`ported`)
  * `@react-spectrum/picker` -> `@vue-spectrum/picker` (`ported`)
  * `@react-spectrum/dialog` -> `@vue-spectrum/dialog` (`ported`)
  * `@react-spectrum/overlays` -> `@vue-spectrum/overlays` (`ported`)
  * `@react-spectrum/combobox` -> `@vue-spectrum/combobox` (`ported`)
  * `@react-spectrum/autocomplete` -> `@vue-spectrum/autocomplete` (`ported`)
  * `@react-spectrum/menu` -> `@vue-spectrum/menu` (`ported`)
  * `@react-spectrum/listbox` -> `@vue-spectrum/listbox` (`ported`)
  * `@react-spectrum/list` -> `@vue-spectrum/list` (`ported`)
  * `@react-spectrum/tabs` -> `@vue-spectrum/tabs` (`ported`)
  * `@react-spectrum/tag` -> `@vue-spectrum/tag` (`ported`)
  * `@react-spectrum/toast` -> `@vue-spectrum/toast` (`ported`)
  * `@react-spectrum/tooltip` -> `@vue-spectrum/tooltip` (`ported`)
  * `@react-spectrum/utils` -> `@vue-spectrum/utils` (`ported`)
  * `@react-spectrum/test-utils` -> `@vue-spectrum/test-utils` (`ported`)
  * `@react-spectrum/theme-dark` -> `@vue-spectrum/theme-dark` (`ported`)
  * `@react-spectrum/theme-default` -> `@vue-spectrum/theme-default` (`ported`)
  * `@react-spectrum/theme-express` -> `@vue-spectrum/theme-express` (`ported`)
  * `@react-spectrum/theme-light` -> `@vue-spectrum/theme-light` (`ported`)
  * `@react-spectrum/story-utils` -> `@vue-spectrum/story-utils` (`ported`)
  * `@react-spectrum/style-macro-s1` -> `@vue-spectrum/style-macro-s1` (`ported`)
* Started data-heavy migration:
  * `@react-spectrum/table` -> `@vue-spectrum/table` (`ported`)
  * `@react-spectrum/tree` -> `@vue-spectrum/tree` (`ported`)
  * `@react-spectrum/dnd` -> `@vue-spectrum/dnd` (`ported`)
  * `@react-spectrum/dropzone` -> `@vue-spectrum/dropzone` (`ported`)
  * `@react-spectrum/filetrigger` -> `@vue-spectrum/filetrigger` (`ported`)
  * `@react-spectrum/s2` -> `@vue-spectrum/s2` (`ported`)
  * `@react-spectrum/steplist` -> `@vue-spectrum/steplist` (`ported`)
* Started React Aria package migration:
  * `@react-aria/actiongroup` -> `@vue-aria/actiongroup` (`ported`)
  * `@react-aria/autocomplete` -> `@vue-aria/autocomplete` (`ported`)
  * `@react-aria/breadcrumbs` -> `@vue-aria/breadcrumbs` (`ported`)
  * `@react-aria/button` -> `@vue-aria/button` (`ported`)
  * `@react-aria/calendar` -> `@vue-aria/calendar` (`ported`)
  * `@react-aria/checkbox` -> `@vue-aria/checkbox` (`ported`)
  * `@react-aria/collections` -> `@vue-aria/collections` (`ported`)
  * `@react-aria/combobox` -> `@vue-aria/combobox` (`ported`)
  * `@react-aria/datepicker` -> `@vue-aria/datepicker` (`ported`)
  * `@react-aria/dialog` -> `@vue-aria/dialog` (`ported`)
  * `@react-aria/dnd` -> `@vue-aria/dnd` (`ported`)
  * `@react-aria/example-theme` -> `@vue-aria/example-theme` (`ported`)
  * `@react-aria/focus` -> `@vue-aria/focus` (`ported`)
  * `@react-aria/form` -> `@vue-aria/form` (`ported`)
  * `@react-aria/grid` -> `@vue-aria/grid` (`ported`)
  * `@react-aria/gridlist` -> `@vue-aria/gridlist` (`ported`)
  * `@react-aria/i18n` -> `@vue-aria/i18n` (`ported`)
  * `@react-aria/interactions` -> `@vue-aria/interactions` (`ported`)
  * `@react-aria/label` -> `@vue-aria/label` (`ported`)
  * `@react-aria/landmark` -> `@vue-aria/landmark` (`ported`)
  * `@react-aria/link` -> `@vue-aria/link` (`ported`)
  * `@react-aria/listbox` -> `@vue-aria/listbox` (`ported`)
  * `@react-aria/live-announcer` -> `@vue-aria/live-announcer` (`ported`)
  * `@react-aria/menu` -> `@vue-aria/menu` (`ported`)
  * `@react-aria/meter` -> `@vue-aria/meter` (`ported`)
  * `@react-aria/numberfield` -> `@vue-aria/numberfield` (`ported`)
  * `@react-aria/overlays` -> `@vue-aria/overlays` (`ported`)
  * `@react-aria/progress` -> `@vue-aria/progress` (`ported`)
  * `@react-aria/radio` -> `@vue-aria/radio` (`ported`)
  * `@react-aria/searchfield` -> `@vue-aria/searchfield` (`ported`)
  * `@react-aria/select` -> `@vue-aria/select` (`ported`)
  * `@react-aria/selection` -> `@vue-aria/selection` (`ported`)
  * `@react-aria/separator` -> `@vue-aria/separator` (`ported`)
  * `@react-aria/slider` -> `@vue-aria/slider` (`ported`)
  * `@react-aria/spinbutton` -> `@vue-aria/spinbutton` (`ported`)
  * `@react-aria/ssr` -> `@vue-aria/ssr` (`ported`)
  * `@react-aria/steplist` -> `@vue-aria/steplist` (`ported`)
  * `@react-aria/switch` -> `@vue-aria/switch` (`ported`)
  * `@react-aria/toggle` -> `@vue-aria/toggle` (`ported`)
  * `@react-aria/toolbar` -> `@vue-aria/toolbar` (`ported`)
  * `@react-aria/tooltip` -> `@vue-aria/tooltip` (`ported`)
  * `@react-aria/tree` -> `@vue-aria/tree` (`ported`)
  * `@react-aria/utils` -> `@vue-aria/utils` (`ported`)
  * `@react-aria/visually-hidden` -> `@vue-aria/visually-hidden` (`ported`)
  * `@react-aria/tag` -> `@vue-aria/tag` (`ported`)
  * `@react-aria/test-utils` -> `@vue-aria/test-utils` (`ported`)
  * `@react-aria/textfield` -> `@vue-aria/textfield` (`ported`)
  * `@react-aria/toast` -> `@vue-aria/toast` (`ported`)
  * `@react-aria/tabs` -> `@vue-aria/tabs` (`ported`)
  * `@react-aria/table` -> `@vue-aria/table` (`ported`)
  * `@react-aria/disclosure` -> `@vue-aria/disclosure` (`ported`)
  * `@react-aria/color` -> `@vue-aria/color` (`ported`)
  * `@react-aria/aria-modal-polyfill` -> `@vue-aria/aria-modal-polyfill` (`ported`)
  * `@react-aria/virtualizer` -> `@vue-aria/virtualizer` (`ported`)
  * Vue starter now includes composable coverage for `@vue-aria/actiongroup`, `@vue-aria/autocomplete`, `@vue-aria/breadcrumbs`, `@vue-aria/button`, `@vue-aria/calendar`, `@vue-aria/checkbox`, `@vue-aria/collections`, `@vue-aria/combobox`, `@vue-aria/datepicker`, `@vue-aria/dialog`, `@vue-aria/dnd`, `@vue-aria/example-theme`, `@vue-aria/focus`, `@vue-aria/form`, `@vue-aria/grid`, `@vue-aria/gridlist`, `@vue-aria/i18n`, `@vue-aria/interactions`, `@vue-aria/label`, `@vue-aria/landmark`, `@vue-aria/link`, `@vue-aria/listbox`, `@vue-aria/live-announcer`, `@vue-aria/menu`, `@vue-aria/meter`, `@vue-aria/numberfield`, `@vue-aria/overlays`, `@vue-aria/progress`, `@vue-aria/radio`, `@vue-aria/searchfield`, `@vue-aria/select`, `@vue-aria/selection`, `@vue-aria/separator`, `@vue-aria/slider`, `@vue-aria/spinbutton`, `@vue-aria/ssr`, `@vue-aria/steplist`, `@vue-aria/switch`, `@vue-aria/toggle`, `@vue-aria/toolbar`, `@vue-aria/tooltip`, `@vue-aria/tree`, `@vue-aria/utils`, `@vue-aria/visually-hidden`, `@vue-aria/tag`, `@vue-aria/tabs`, `@vue-aria/table`, `@vue-aria/test-utils`, `@vue-aria/textfield`, `@vue-aria/toast`, `@vue-aria/disclosure`, `@vue-aria/color`, and `@vue-aria/aria-modal-polyfill`, plus a virtualized backlog demo wired to `@vue-aria/virtualizer`.
* Started React Stately package migration:
  * `@react-stately/autocomplete` -> `@vue-stately/autocomplete` (`ported`)
  * `@react-stately/calendar` -> `@vue-stately/calendar` (`ported`)
  * `@react-stately/checkbox` -> `@vue-stately/checkbox` (`ported`)
  * `@react-stately/combobox` -> `@vue-stately/combobox` (`ported`)
  * `@react-stately/collections` -> `@vue-stately/collections` (`ported`)
  * `@react-stately/color` -> `@vue-stately/color` (`ported`)
  * `@react-stately/data` -> `@vue-stately/data` (`ported`)
  * `@react-stately/datepicker` -> `@vue-stately/datepicker` (`ported`)
  * `@react-stately/disclosure` -> `@vue-stately/disclosure` (`ported`)
  * `@react-stately/dnd` -> `@vue-stately/dnd` (`ported`)
  * `@react-stately/flags` -> `@vue-stately/flags` (`ported`)
  * `@react-stately/form` -> `@vue-stately/form` (`ported`)
  * `@react-stately/grid` -> `@vue-stately/grid` (`ported`)
  * `@react-stately/layout` -> `@vue-stately/layout` (`ported`)
  * `@react-stately/list` -> `@vue-stately/list` (`ported`)
  * `@react-stately/menu` -> `@vue-stately/menu` (`ported`)
  * `@react-stately/numberfield` -> `@vue-stately/numberfield` (`ported`)
  * `@react-stately/overlays` -> `@vue-stately/overlays` (`ported`)
  * `@react-stately/radio` -> `@vue-stately/radio` (`ported`)
  * `@react-stately/searchfield` -> `@vue-stately/searchfield` (`ported`)
  * `@react-stately/select` -> `@vue-stately/select` (`ported`)
  * `@react-stately/selection` -> `@vue-stately/selection` (`ported`)
  * `@react-stately/slider` -> `@vue-stately/slider` (`ported`)
  * `@react-stately/steplist` -> `@vue-stately/steplist` (`ported`)
  * `@react-stately/table` -> `@vue-stately/table` (`ported`)
  * `@react-stately/tabs` -> `@vue-stately/tabs` (`ported`)
  * `@react-stately/toast` -> `@vue-stately/toast` (`ported`)
  * `@react-stately/toggle` -> `@vue-stately/toggle` (`ported`)
  * `@react-stately/tooltip` -> `@vue-stately/tooltip` (`ported`)
  * `@react-stately/tree` -> `@vue-stately/tree` (`ported`)
  * `@react-stately/utils` -> `@vue-stately/utils` (`ported`)
  * `@react-stately/virtualizer` -> `@vue-stately/virtualizer` (`ported`)
* Started Vue test adaptation:
  * `starters/vue` runs Vitest + Vue Test Utils interaction tests for `button`, `buttongroup`, `textfield`, `checkbox`, `radio`, `switch`, `tabs`, `tag`, `toast`, `tooltip`, `layout`, `labeledvalue`, `illustratedmessage`, and `icon`.
  * Added composition coverage for `accordion`, `actionbar`, `actiongroup`, `breadcrumbs`, `calendar`, `card`, `color`, `contextualhelp`, `datepicker`, `picker`, `dialog`, `overlays`, `menu`, `listbox`, `list`, `tabs`, `tag`, `combobox`, `autocomplete`, `story-utils`, `test-utils`, `theme-dark`, `theme-default`, `theme-express`, `theme-light`, `utils`, `style-macro-s1`, `@vue-stately/autocomplete`, `@vue-stately/calendar`, `@vue-stately/checkbox`, `@vue-stately/collections`, `@vue-stately/color`, `@vue-stately/combobox`, `@vue-stately/data`, `@vue-stately/datepicker`, `@vue-stately/disclosure`, `@vue-stately/dnd`, `@vue-stately/flags`, `@vue-stately/form`, `@vue-stately/grid`, `@vue-stately/layout`, `@vue-stately/list`, `@vue-stately/menu`, `@vue-stately/numberfield`, `@vue-stately/overlays`, `@vue-stately/radio`, `@vue-stately/searchfield`, `@vue-stately/select`, `@vue-stately/selection`, `@vue-stately/slider`, `@vue-stately/steplist`, `@vue-stately/table`, `@vue-stately/tabs`, `@vue-stately/toast`, `@vue-stately/toggle`, `@vue-stately/tooltip`, `@vue-stately/tree`, `@vue-stately/utils`, and `@vue-stately/virtualizer`.
  * Added data-heavy and virtualization coverage for `table`, `tree`, `steplist`, `dnd`, `dropzone`, `filetrigger`, and `@vue-aria/virtualizer`, plus composable coverage for `@vue-aria/actiongroup`, `@vue-aria/autocomplete`, `@vue-aria/breadcrumbs`, `@vue-aria/button`, `@vue-aria/calendar`, `@vue-aria/checkbox`, `@vue-aria/collections`, `@vue-aria/combobox`, `@vue-aria/datepicker`, `@vue-aria/dialog`, `@vue-aria/dnd`, `@vue-aria/example-theme`, `@vue-aria/focus`, `@vue-aria/form`, `@vue-aria/grid`, `@vue-aria/gridlist`, `@vue-aria/i18n`, `@vue-aria/interactions`, `@vue-aria/label`, `@vue-aria/landmark`, `@vue-aria/link`, `@vue-aria/listbox`, `@vue-aria/live-announcer`, `@vue-aria/menu`, `@vue-aria/meter`, `@vue-aria/numberfield`, `@vue-aria/overlays`, `@vue-aria/progress`, `@vue-aria/radio`, `@vue-aria/searchfield`, `@vue-aria/select`, `@vue-aria/selection`, `@vue-aria/separator`, `@vue-aria/slider`, `@vue-aria/spinbutton`, `@vue-aria/ssr`, `@vue-aria/steplist`, `@vue-aria/switch`, `@vue-aria/toggle`, `@vue-aria/toolbar`, `@vue-aria/tooltip`, `@vue-aria/tree`, `@vue-aria/utils`, `@vue-aria/visually-hidden`, `@vue-aria/tag`, `@vue-aria/tabs`, `@vue-aria/table`, `@vue-aria/test-utils`, `@vue-aria/textfield`, `@vue-aria/toast`, `@vue-aria/disclosure`, `@vue-aria/color`, and `@vue-aria/aria-modal-polyfill`.
* Started API stabilization and deprecation planning:
  * `migration/VUE_PUBLISH_CHECKLIST.md`
  * `migration/REACT_DEPRECATION_PLAN.md`
  * `migration/REACT_TO_VUE_MIGRATION_GUIDE.md`
  * `migration/VUE_PACKAGE_ARCHITECTURE.md`
  * Expanded package-level usage and limitations docs for `@vue-stately/toggle`, `@vue-stately/tooltip`, `@vue-stately/tree`, `@vue-stately/utils`, and `@vue-stately/virtualizer`.
  * Added concrete conversion examples for `@vue-stately/toggle`, `@vue-stately/tooltip`, `@vue-stately/tree`, `@vue-stately/utils`, and `@vue-stately/virtualizer` in `migration/REACT_TO_VUE_MIGRATION_GUIDE.md`.
  * On February 19, 2026, `yarn vue:migration:test` passed with all active migration acceptance checks.
  * On February 19, 2026, all tracked `@react-stately/*` packages were promoted to `ported` in the migration tracker.
  * On February 19, 2026, all tracked `@react-aria/*` packages were promoted to `ported` in the migration tracker.
  * On February 19, 2026, all tracked `@react-spectrum/*` packages were promoted to `ported` in the migration tracker.
  * On February 19, 2026, the remaining integration ports (`react-aria-components` and `tailwindcss-react-aria-components`) were promoted to `ported`.
  * On February 19, 2026, meta-package aggregators (`react-aria` and `react-stately`) were promoted to `ported` via new `vue-aria` and `vue-stately` packages.

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
