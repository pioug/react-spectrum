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
