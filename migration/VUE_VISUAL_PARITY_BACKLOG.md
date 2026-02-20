# Vue Visual Parity Backlog

This file tracks visual-parity scopes beyond package-level snapshots and records their fixture coverage status.

## Buckets

| Bucket | Scope | Fixture ids | Status |
| --- | --- | --- | --- |
| `s2` coverage | Add explicit `@vue-spectrum/s2` visual surface fixture | `pkg-s2` | done |
| State matrix | Disabled/invalid/focus/selection snapshots across core controls | `state-textfield-disabled`, `state-searchfield-invalid`, `state-searchfield-focus`, `state-numberfield-invalid`, `state-slider-disabled`, `state-radio-disabled`, `state-tabs-disabled`, `state-picker-disabled`, `state-dropzone-over`, `state-tree-selection` | done |
| RTL | Right-to-left rendering cluster with provider `dir="rtl"` and localized content | `rtl-cluster` | done |
| Forced colors | High-contrast/forced-colors snapshot cluster | `forced-colors-cluster` | done |
| Overlay placement | Multi-placement overlay/tooltip matrix snapshot | `overlay-placement-matrix` | done |
| Async/virtualized/dnd states | Loading, constrained-viewport collection rendering, and drag/drop state snapshots | `async-collection-cluster`, `virtualized-collection-cluster`, `dnd-state-cluster` | done |

## Enforcement

- Package-level fixture coverage and bucket fixture requirements are enforced by:
  - `yarn vue:parity:visual:coverage:assert`
- Rendered parity snapshots are enforced by:
  - `yarn vue:parity:visual:compare`

## Current high-diff hotspots

Snapshot source: `migration/vue-visual-parity-report.json` generated on February 20, 2026 (React reference baseline).

| Fixture | Diff ratio | Notes | Next step |
| --- | ---: | --- | --- |
| `pkg-dialog` | `99.97%` | Vue dialog surface sizing/chrome diverges from React modal dialog rendering. | Align Vue dialog token styling and modal surface structure to React dialog classes. |
| `pkg-calendar` | `63.31%` | Calendar grid and range calendar density/styling differ across month cells and headers. | Port calendar visual tokens (cell size, spacing, typography, selected/hover states). |
| `pkg-overlays` | `62.23%` | Popover surface and placement chrome differ (shape, spacing, border treatment). | Match popover border radius, padding, and placement offsets to React baseline. |
| `theme-express-cluster` | `61.99%` | Theme token mapping for express cluster still diverges strongly. | Audit express theme token aliases against React values. |
| `theme-default-cluster` | `59.90%` | Core token cluster mismatch across controls. | Normalize default theme colors, radii, borders, and spacing. |
| `theme-dark-cluster` | `58.33%` | Dark token cluster mismatch across controls. | Align dark semantic token values and control state styling. |
| `pkg-contextualhelp` | `54.70%` | Contextual help layout/chrome diverges in surface/body/footer treatment. | Align contextual help panel structure, typography, and borders. |
| `theme-light-cluster` | `52.79%` | Light token cluster mismatch persists. | Reconcile light theme token mappings with React values. |
| `state-picker-disabled` | `47.30%` | Disabled picker treatment differs (surface, text, affordances). | Align disabled picker state styles and icon opacity. |
| `pkg-actionbar` | `46.61%` | Improved after fixture alignment, but action bar/table visuals still differ. | Align action bar row height, borders, and selected affordance styling. |
