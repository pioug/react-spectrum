# react-aria-components-popover

## Scope

- Story group: `React Aria Components/Popover`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Popover.stories.tsx`
- `packages/react-aria-components/src/Popover.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Popover.stories.ts`
- `packages/@vue-spectrum/components/src/components/VuePopover.ts`

## Gap List

1. Audit placement/arrow semantics parity against React popover behavior.
2. Audit trigger observer and scrolling boundary behavior parity.
3. Audit offset and trigger-width behavior parity.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `PopoverExample`
   - `PopoverTriggerObserverExample`
   - `PopoverArrowBoundaryOffsetExample`
   - `PopoverTriggerWidthExample`
   - `ScrollingBoundaryContainer`

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
- Manual: pending

## Status

- Open items: source-level behavior parity audit and implementation alignment for advanced popover positioning scenarios.
- Risks: current Vue popover implementation is simplified relative to React popover feature depth.
- Closure criteria: React-source behavior gaps resolved and parity checks pass.
