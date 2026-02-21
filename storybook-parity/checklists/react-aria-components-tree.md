# react-aria-components-tree

## Scope

- Story group: `React Aria Components/Tree`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Tree.stories.tsx`
- `packages/react-aria-components/src/Tree.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Tree.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueTree.ts`

## Gap List

1. Audit tree keyboard/selection semantics and ARIA parity against React tree contracts.
2. Audit async loading, virtualized rendering, and section parity.
3. Audit drag-and-drop and action/link behavior parity.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `TreeExampleStatic`
   - `TreeExampleSection`
   - `TreeExampleStaticNoActions`
   - `TreeExampleDynamic`
   - `TreeSectionDynamic`
   - `WithActions`
   - `WithLinks`
   - `EmptyTreeStaticStory`
   - `LoadingStoryDepOnCollectionStory`
   - `LoadingStoryDepOnTopStory`
   - `ButtonLoadingIndicatorStory`
   - `VirtualizedTree`
   - `VirtualizedTreeMultiLoaderMockAsync`
   - `VirtualizedTreeMultiLoaderUseAsyncList`
   - `TreeWithDragAndDrop`
   - `TreeWithDragAndDropVirtualized`
   - `VirtualizedTreeSectionRender`
   - `HugeVirtualizedTree`

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
- Manual: pending

## Status

- Open items: source-level behavior parity audit and implementation alignment for advanced tree scenarios.
- Risks: current Vue tree implementation is simplified relative to React tree feature depth.
- Closure criteria: React-source behavior gaps resolved and parity checks pass.
