# Vue Package Architecture

This document explains why Vue component implementations currently live in `packages/@vue-spectrum/components/src/components` while package folders such as `packages/@vue-spectrum/button` mostly export wrappers.

## Current structure

1. `@vue-spectrum/components` holds shared implementation code and base styles.
2. Package-level ports (`@vue-spectrum/button`, `@vue-spectrum/table`, etc.) provide package-scoped entry points that re-export the shared implementations.
3. `@vue-aria/*` packages provide lower-level behavior utilities (for example `@vue-aria/virtualizer`).

## Why this was chosen

1. Migration velocity: one implementation location made it faster to stand up many package entry points quickly.
2. Consistency: common conventions (`v-model`, event names, styling class patterns) stay uniform across ports.
3. Shared context: provider/theme behavior is centralized during early migration phases.
4. Lower duplication risk: wrappers avoid drifting copies while APIs are still changing.

## Trade-offs

1. Package boundaries are thinner than ideal during the baseline phase.
2. Changes in shared implementations can affect multiple package ports at once.
3. Long-term ownership is less obvious than package-local source layouts.

## Planned extraction path

1. Keep wrappers while APIs are in `in_progress` and changing rapidly.
2. Promote stable packages to package-local source when they meet these gates:
   - acceptance tests are stable,
   - public API surface is documented,
   - no active cross-package refactors are pending.
3. Move implementation files from `@vue-spectrum/components` into their package folders incrementally.
4. Leave compatibility re-exports temporarily to avoid breaking consumers during transitions.

## Practical rule today

If a migration package needs a new behavior quickly, implement in `@vue-spectrum/components` first, then extract to package-local source once that package reaches stabilization.
