# react-aria-components-colorarea

## Scope

- Story group: `React Aria Components/ColorArea`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/ColorArea.stories.tsx`
- `packages/react-aria-components/src/ColorArea.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/ColorArea.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueColor.ts` (`VueColorArea`)

## Gap List

1. Audit color-space and channel semantics parity (`xChannel`, `yChannel`, shared color state).
2. Audit thumb positioning and keyboard/pointer interaction parity.
3. Audit disabled/data attribute parity and decorator-composed slider synchronization.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `ColorAreaExample`
   - `ColorAreaHSL`
   - `ColorAreaHSB`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue color area currently uses simplified XY channels rather than React color-state contracts.
- Closure criteria: React-source behavior gaps fixed and tested.
