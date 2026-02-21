# react-aria-components-tabs

## Scope

- Story group: `React Aria Components/Tabs`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Tabs.stories.tsx`
- `packages/react-aria-components/src/Tabs.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Tabs.stories.ts`

## Gap List

1. Audit tablist/tab/tabpanel ARIA and keyboard parity.
2. Audit nested tabs and orientation-render-prop parity.
3. Audit tooltip-in-tab composition parity.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `TabsExample`
   - `TabsRenderProps`
   - `NestedTabs`

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
- Manual: pending

## Status

- Open items: source-level interaction and ARIA behavior audit.
- Risks: current Vue stories use simplified tab composition.
- Closure criteria: React-source behavior gaps resolved and parity checks pass.
