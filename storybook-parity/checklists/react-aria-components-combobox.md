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
2. Audit full render-props surface area parity (`isOpen`, collection wiring) against React internals.

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
4. Ported advanced ComboBox behavior contracts from React sources:
   - normalized string/object option handling (`id`/`name`/`textValue` sources)
   - controlled multi-select (`selectionMode="multiple"`, `selectedKeys`, `selectionChange`)
   - virtualized list windowing controls (`virtualized`, `visibleItemCount`, `estimatedItemHeight`)
   - listbox load-more surface (`loadMore`) and listbox/item class pass-through for React style parity.
5. Updated Vue ComboBox stories to mirror React source datasets and async behavior:
   - full US states dataset for `MultiSelectComboBox`
   - 10k-item dataset and filter model for `VirtualizedComboBox`
   - SWAPI-backed async dynamic loading model for `AsyncVirtualizedDynamicCombobox`
   - React story style-source imports from:
     - `packages/react-aria-components/example/index.css`
     - `packages/react-aria-components/stories/styles.css`
6. Added behavior-gate coverage for core + advanced combobox stories:
   - `react-aria-components-combobox--combo-box-example`
   - `react-aria-components-combobox--combo-box-ime-example`
   - `react-aria-components-combobox--combo-box-async-loading-example`
   - `react-aria-components-combobox--with-create-option`
   - `react-aria-components-combobox--virtualized-combo-box`
   - `react-aria-components-combobox--multi-select-combo-box`
   - `react-aria-components-combobox--async-virtualized-dynamic-combobox`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --scenario-ids react-aria-components-combobox--combo-box-example,react-aria-components-combobox--combo-box-ime-example,react-aria-components-combobox--combo-box-async-loading-example,react-aria-components-combobox--with-create-option,react-aria-components-combobox--virtualized-combo-box,react-aria-components-combobox--multi-select-combo-box,react-aria-components-combobox--async-virtualized-dynamic-combobox --output-dir storybook-parity/catalog` (7/7 passing)
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --output-dir storybook-parity/catalog` (26/26 passing)
- Manual: pending

## Status

- Open items: source-level render-props parity audit.
- Risks: render-props composition details are still simplified in Vue relative to React internals.
- Closure criteria: React-source behavior gaps fixed and tested.
