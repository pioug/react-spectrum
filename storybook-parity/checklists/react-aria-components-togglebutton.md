# react-aria-components-togglebutton

## Scope

- Story group: `React Aria Components/ToggleButton`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/ToggleButton.stories.tsx`
- `packages/react-aria-components/src/ToggleButton.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/ToggleButton.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueButton.ts`

## Gap List

1. Audit selected-state behavior parity and aria-pressed semantics.
2. Audit hover/press/focus-visible state data attribute parity.
3. Audit toggle-group integration parity with React toggle-button group contracts.

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `ToggleButtonExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue implementation currently maps to button semantics, not dedicated toggle-button semantics.
- Closure criteria: React-source behavior gaps fixed and tested.
