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
- `packages/@vue-spectrum/combobox/src/index.ts`

## Gap List

1. Audit popover/listbox composition parity and render-prop semantics.
2. Audit async loading, virtualization, and IME behavior parity.
3. Audit multi-select combo box semantics and tag integration parity.

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
2. Replaced the components-layer combobox wrapper with the richer `@vue-spectrum/combobox` implementation to align base input/trigger/popup combobox structure with React contracts.
3. Fixed `WithCreateOption` Vue story template parsing and moved create-option list derivation into `setup()` computed state for deterministic behavior parity execution.

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --scenario-ids react-aria-components-combobox--combo-box-example,react-aria-components-combobox--with-create-option --output-dir storybook-parity/catalog` (2/2 passing)
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --output-dir storybook-parity/catalog` (21/21 passing)
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: advanced combo behaviors (virtualization, async loading transitions, multi-select semantics) still require source-level parity auditing.
- Closure criteria: React-source behavior gaps fixed and tested.
