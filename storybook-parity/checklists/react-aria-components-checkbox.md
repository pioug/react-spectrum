# react-aria-components-checkbox

## Scope

- Story group: `React Aria Components/Checkbox`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Checkbox.stories.tsx`
- `packages/react-aria-components/src/Checkbox.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Checkbox.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueCheckbox.ts`

## Gap List

1. Audit pressed/hover/focus-visible data attribute parity and state timing.
2. Audit invalid/required/readonly semantics and group-item behavior parity.
3. Audit hidden input structure and event payload parity.

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `CheckboxExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: current Vue checkbox implementation is simplified versus React interactions.
- Closure criteria: React-source behavior gaps fixed and tested.
