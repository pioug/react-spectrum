# react-aria-components-datepicker

## Scope

- Story group: `React Aria Components/DatePicker`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/DatePicker.stories.tsx`
- `packages/react-aria-components/src/DatePicker.tsx`
- `packages/react-aria-components/src/DateField.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/DatePicker.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueDatePicker.ts`

## Gap List

1. Audit segmented input + popover calendar composition parity.
2. Audit trigger width behavior and overlay positioning parity.
3. Audit autofill/form hidden-input semantics parity for date/date-range values.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `DatePickerExample`
   - `DatePickerTriggerWidthExample`
   - `DateRangePickerExample`
   - `DateRangePickerTriggerWidthExample`
   - `DatePickerAutofill`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue date picker internals are simplified versus React overlay/state model.
- Closure criteria: React-source behavior gaps fixed and tested.
