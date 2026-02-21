# react-aria-components-breadcrumbs

## Scope

- Story group: `React Aria Components/Breadcrumbs`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Breadcrumbs.stories.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Breadcrumbs.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueBreadcrumbs.ts`

## Gap List

1. Audit dynamic item rendering parity and item/action semantics.
2. Audit link semantics and ARIA current-page behavior parity.

## Fixes Applied

1. Added Vue story file with React-matching title and export names:
   - `BreadcrumbsExample`
   - `DynamicBreadcrumbsExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: full source behavior parity audit.
- Risks: current story ids match but implementation behavior may differ.
- Closure criteria: React-source behavior gaps fixed and tested.
