# react-aria-components-taggroup

## Scope

- Story group: `React Aria Components/TagGroup`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/TagGroup.stories.tsx`
- `packages/react-aria-components/src/TagGroup.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/TagGroup.stories.ts`

## Gap List

1. Audit selection and remove-action semantics parity.
2. Audit label/list/empty-state ARIA parity.
3. Audit tooltip + link behavior parity for tags.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `TagGroupExample`
   - `TagGroupExampleWithRemove`
   - `EmptyTagGroup`

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
- Manual: pending

## Status

- Open items: source-level behavior and accessibility audit.
- Risks: current Vue stories use simplified tag composition.
- Closure criteria: React-source behavior gaps resolved and parity checks pass.
