# react-aria-components-combobox

## Scope

- Story group: `React Aria Components/ComboBox`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/ComboBox.stories.tsx`
- `packages/react-aria-components/src/ComboBox.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/ComboBox.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueComboBox.ts`

## Gap List

1. Audit popover/listbox composition parity and render-prop semantics.
2. Audit async loading, virtualization, and IME behavior parity.
3. Audit multi-select combo box semantics and tag integration parity.
4. Audit create-option behavior parity.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `ComboBoxExample`
   - `ComboBoxRenderPropsStatic`
   - `ComboBoxRenderPropsDefaultItems`
   - `ComboBoxRenderPropsItems`
   - `ComboBoxRenderPropsListBoxDynamic`
   - `ComboBoxAsyncLoadingExample`
   - `ComboBoxImeExample`
   - `VirtualizedComboBox`
   - `AsyncVirtualizedDynamicCombobox`
   - `WithCreateOption`
   - `ComboBoxListBoxItemWithAriaLabel`
   - `MultiSelectComboBox`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue combobox is currently a simplified datalist-driven surface vs React combobox contracts.
- Closure criteria: React-source behavior gaps fixed and tested.
