# react-aria-components-animations

## Scope

- Story group: `React Aria Components - Animations`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/animations.stories.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/animations.stories.ts`
- `packages/@vue-spectrum/components/src/components/VuePopover.ts`

## Gap List

1. Audit modal animation timing and overlay transition parity.
2. Audit dismiss behavior parity and interaction locking.
3. Audit visual animation curve/duration parity with React implementation.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `ModalAnimation`

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
- Manual: pending

## Status

- Open items: source-level animation behavior audit.
- Risks: current Vue story uses simplified modal/popup animation surface.
- Closure criteria: React-source animation behavior gaps resolved and parity checks pass.
