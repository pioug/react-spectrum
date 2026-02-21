# react-aria-components-select

## Scope

- Story group: `React Aria Components/Select`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Select.stories.tsx`
- `packages/react-aria-components/src/Select.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Select.stories.ts`
- `packages/@vue-spectrum/components/src/components/VuePicker.ts`

## Gap List

1. Audit select trigger/popover/listbox architecture and render-prop behavior parity.
2. Audit multiple selection, required validation, and submit/reset semantics parity.
3. Audit virtualization/async list behavior parity and scroll interaction edge cases.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `SelectExample`
   - `SelectRenderProps`
   - `SelectWithTagGroup`
   - `SelectManyItems`
   - `VirtualizedSelect`
   - `AsyncVirtualizedCollectionRenderSelect`
   - `SelectSubmitExample`
   - `RequiredSelectWithManyItems`
   - `SelectScrollBug`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue picker implementation is currently a simplified select surface vs React select composition contracts.
- Closure criteria: React-source behavior gaps fixed and tested.
