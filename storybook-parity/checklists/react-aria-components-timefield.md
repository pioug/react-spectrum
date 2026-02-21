# react-aria-components-timefield

## Scope

- Story group: `React Aria Components/TimeField`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/TimeField.stories.tsx`
- `packages/react-aria-components/src/DateField.tsx` (`TimeField`)

## Vue Sources

- `packages/@vue-spectrum/components/stories/TimeField.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueDatePicker.ts` (`VueTimeField`)

## Gap List

1. Audit segmented time input behavior parity and placeholder state handling.
2. Audit keyboard navigation and focus/selection behavior parity.
3. Audit validation and required/readonly/disabled semantics parity.

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `TimeFieldExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue time field currently uses native time input rather than segmented field model.
- Closure criteria: React-source behavior gaps fixed and tested.
