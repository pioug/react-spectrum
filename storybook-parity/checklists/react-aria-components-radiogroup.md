# react-aria-components-radiogroup

## Scope

- Story group: `React Aria Components/RadioGroup`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/RadioGroup.stories.tsx`
- `packages/react-aria-components/src/RadioGroup.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/RadioGroup.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueRadioGroup.ts`

## Gap List

1. Audit group/radio state data attributes and focus-visible semantics parity.
2. Audit required/invalid/error-message behavior parity in form submit flows.
3. Audit dialog embedding and controlled/uncontrolled value behavior parity.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `RadioGroupExample`
   - `RadioGroupControlledExample`
   - `RadioGroupInDialogExample`
   - `RadioGroupSubmitExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue radio group validation/error semantics are not yet aligned to React contracts.
- Closure criteria: React-source behavior gaps fixed and tested.
