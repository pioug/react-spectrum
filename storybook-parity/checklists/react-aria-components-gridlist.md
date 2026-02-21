# react-aria-components-gridlist

## Scope

- Story group: `React Aria Components/GridList`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/GridList.stories.tsx`
- `packages/react-aria-components/src/GridList.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/GridList.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueListBox.ts`

## Gap List

1. Audit grid/list keyboard navigation and ARIA semantics parity.
2. Audit virtualized, async loading, and modal-picker behavior parity.
3. Audit section rendering and tag-integration parity.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `GridListExample`
   - `GridListSectionExample`
   - `VirtualizedGridListSection`
   - `VirtualizedGridList`
   - `VirtualizedGridListGrid`
   - `AsyncGridList`
   - `AsyncGridListVirtualized`
   - `TagGroupInsideGridList`
   - `GridListInModalPicker`
   - `AsyncGridListGridVirtualized`

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
- Manual: pending

## Status

- Open items: source-level behavior parity audit and implementation alignment for advanced grid list scenarios.
- Risks: current Vue implementation is mapped through listbox-level primitives.
- Closure criteria: React-source behavior gaps resolved and parity checks pass.
