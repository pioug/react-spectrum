# react-aria-components-comboboxreproductions

## Scope

- Story group: `React Aria Components/ComboBoxReproductions`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/ComboBoxReproductions.stories.tsx`
- `packages/react-aria-components/src/ComboBox.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/ComboBoxReproductions.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueComboBox.ts`

## Gap List

1. Audit reproduction-case layout parity, including long option overflow behavior.
2. Audit trigger/input/button composition parity.
3. Audit popup/listbox interaction parity.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `ComboBoxReproductionExample`
2. Ported React reproduction-specific style source into Vue story:
   - `packages/react-aria-components/stories/combobox-reproductions.css`

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
  - `node scripts/storybook-parity-style-sources.mjs --output-dir storybook-parity/catalog` (pass, 0 missing style ports)
- Manual: pending

## Status

- Open items: source-level interaction and overflow behavior audit.
- Risks: current Vue combobox surface is datalist-based.
- Closure criteria: React-source behavior gaps resolved and parity checks pass.
