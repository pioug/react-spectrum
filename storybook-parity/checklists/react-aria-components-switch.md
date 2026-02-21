# react-aria-components-switch

## Scope

- Story group: `React Aria Components/Switch`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Switch.stories.tsx`
- `packages/react-aria-components/src/Switch.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Switch.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueSwitch.ts`

## Gap List

1. Audit pressed/hover/focus-visible data attribute parity and selector contract.
2. Audit read-only semantics and hidden input behavior parity.
3. Audit slot composition parity with React switch indicator contract.

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `SwitchExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: current Vue switch behavior/state attributes are not fully aligned to React.
- Closure criteria: React-source behavior gaps fixed and tested.
