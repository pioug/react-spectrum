# react-aria-components-tooltip

## Scope

- Story group: `React Aria Components/Tooltip`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Tooltip.stories.tsx`
- `packages/react-aria-components/src/Tooltip.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Tooltip.stories.ts`
- `packages/@vue-spectrum/components/src/components/VuePopover.ts`

## Gap List

1. Audit trigger timing and hover/focus interaction parity.
2. Audit arrow placement and boundary-offset behavior parity.
3. Audit container padding and positioning parity.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `TooltipExample`
   - `TooltipArrowBoundaryOffsetExample`
   - `TooltipContainerPaddingExample`

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
- Manual: pending

## Status

- Open items: source-level interaction and positioning audit.
- Risks: current Vue stories use popover primitives for tooltip parity fixtures.
- Closure criteria: React-source behavior gaps resolved and parity checks pass.
