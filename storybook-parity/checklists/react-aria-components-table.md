# react-aria-components-table

## Scope

- Story group: `React Aria Components/Table`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Table.stories.tsx`
- `packages/react-aria-components/src/Table.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Table.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueTable.ts`

## Gap List

1. Audit row/cell semantics and ARIA parity against React table contracts.
2. Audit drag-and-drop, load-more, empty/loading, and virtualization behavior parity.
3. Audit suspense/transition rendering parity with React async states.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `ReorderableTableExample`
   - `TableExampleStory`
   - `TableDynamicExample`
   - `TableCellColSpanExample`
   - `TableCellColSpanWithVariousSpansExample`
   - `DndTableExample`
   - `DndTableWithNoValidDropTargets`
   - `TableLoadingBodyWrapperStory`
   - `TableLoadingRowRenderWrapperStory`
   - `RenderEmptyStateStory`
   - `OnLoadMoreTableStory`
   - `VirtualizedTable`
   - `VirtualizedTableWithResizing`
   - `VirtualizedTableWithEmptyStateStory`
   - `OnLoadMoreTableStoryVirtualized`
   - `OnLoadMoreTableVirtualizedResizeWrapperStory`
   - `TableWithSuspense`
   - `TableWithReactTransition`

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
- Manual: pending

## Status

- Open items: source-level behavior parity audit and implementation alignment for advanced table scenarios.
- Risks: current Vue table implementation is simplified relative to React table feature depth.
- Closure criteria: React-source behavior gaps resolved and parity checks pass.
