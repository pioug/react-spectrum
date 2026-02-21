# react-aria-components-progressbar

## Scope

- Story group: `React Aria Components/ProgressBar`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/ProgressBar.stories.tsx`
- `packages/react-aria-components/src/ProgressBar.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/ProgressBar.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueProgressBar.ts`

## Gap List

1. Audit React render-prop shape (`percentage`, `valueText`, `isIndeterminate`) parity.
2. Audit ARIA props mapping (`aria-valuetext`, `aria-valuenow`, min/max clamps) parity.

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `ProgressBarExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: value text/render-prop parity is not implemented in Vue story/component contract yet.
- Closure criteria: React-source behavior gaps fixed and tested.
