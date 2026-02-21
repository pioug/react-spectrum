# react-aria-components-numberfield

## Scope

- Story group: `React Aria Components/NumberField`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/NumberField.stories.tsx`
- `packages/react-aria-components/src/NumberField.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/NumberField.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueNumberField.ts`

## Gap List

1. Audit formatter + locale behavior parity (`formatOptions`, localized input handling).
2. Audit increment/decrement button slot behavior and validation/error semantics parity.
3. Audit hidden input form integration and wheel behavior parity.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `NumberFieldExample`
   - `NumberFieldControlledExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue implementation currently has a reduced behavior surface vs React.
- Closure criteria: React-source behavior gaps fixed and tested.
