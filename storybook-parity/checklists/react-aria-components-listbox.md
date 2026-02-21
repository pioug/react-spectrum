# react-aria-components-listbox

## Scope

- Story group: `React Aria Components/ListBox`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/ListBox.stories.tsx`
- `packages/react-aria-components/src/ListBox.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/ListBox.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueListBox.ts`

## Gap List

1. Audit keyboard and selection parity against React ListBox behavior contracts.
2. Audit drag-and-drop, virtualization, and async loading behavior parity.
3. Audit ARIA/state render parity for sections, grid layout, and empty/loading states.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `ListBoxExample`
   - `ListBoxSections`
   - `ListBoxComplex`
   - `ListBoxDnd`
   - `ListBoxPreviewOffset`
   - `ListBoxHover`
   - `ListBoxGrid`
   - `VirtualizedListBox`
   - `VirtualizedListBoxEmpty`
   - `VirtualizedListBoxDnd`
   - `VirtualizedListBoxGrid`
   - `VirtualizedListBoxWaterfall`
   - `AsyncListBox`
   - `AsyncListBoxVirtualized`
   - `ListBoxScrollMargin`
   - `ListBoxSmoothScroll`
   - `VirtualizedListBoxDndOnAction`
   - `DropOntoRoot`

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
- Manual: pending

## Status

- Open items: source-level behavior parity audit and implementation alignment for advanced listbox scenarios.
- Risks: current Vue listbox implementation is simplified relative to React listbox feature depth.
- Closure criteria: React-source behavior gaps resolved and parity checks pass.
