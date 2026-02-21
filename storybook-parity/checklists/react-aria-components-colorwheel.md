# react-aria-components-colorwheel

## Scope

- Story group: `React Aria Components/ColorWheel`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/ColorWheel.stories.tsx`
- `packages/react-aria-components/src/ColorWheel.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/ColorWheel.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueColor.ts` (`VueColorWheel`)

## Gap List

1. Audit wheel geometry and thumb positioning contract parity.
2. Audit hue state and disabled semantics parity with React color wheel state model.
3. Audit ARIA/data attribute parity and keyboard interaction behavior.

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `ColorWheelExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue wheel implementation is not yet aligned to React wheel track/thumb API contracts.
- Closure criteria: React-source behavior gaps fixed and tested.
