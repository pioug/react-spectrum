# react-aria-components-toolbar

## Scope

- Story group: `React Aria Components/Toolbar`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Toolbar.stories.tsx`
- `packages/react-aria-components/src/Toolbar.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Toolbar.stories.ts`

## Gap List

1. Audit roving focus and keyboard behavior parity for toolbar grouping.
2. Audit embedded select support parity.
3. Audit orientation and separator semantics parity.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `ToolbarExample`
   - `SelectSupport`

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
- Manual: pending

## Status

- Open items: source-level behavior and keyboard interaction audit.
- Risks: current Vue stories use simplified toolbar composition.
- Closure criteria: React-source behavior gaps resolved and parity checks pass.
