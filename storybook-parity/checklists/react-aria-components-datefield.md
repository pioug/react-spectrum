# react-aria-components-datefield

## Scope

- Story group: `React Aria Components/DateField`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/DateField.stories.tsx`
- `packages/react-aria-components/src/DateField.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/DateField.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueDatePicker.ts` (`VueDateField`)

## Gap List

1. Audit segmented date input behavior parity (placeholder segments, keyboard navigation).
2. Audit hidden date input + form autofill semantics parity (`name`, `autoComplete`).
3. Audit validation behavior parity (`native` vs `aria`, invalid/readOnly/required semantics).

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `DateFieldExample`
   - `DateFieldAutoFill`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue date field behavior surface is simplified versus React segmented field implementation.
- Closure criteria: React-source behavior gaps fixed and tested.
