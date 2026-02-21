# react-aria-components-checkboxgroup

## Scope

- Story group: `React Aria Components/CheckboxGroup`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/CheckboxGroup.stories.tsx`
- `packages/react-aria-components/src/Checkbox.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/CheckboxGroup.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueCheckbox.ts`

## Gap List

1. Audit grouped checkbox semantics and ARIA parity.
2. Audit submit/reset and required validation parity.
3. Audit error and helper text behavior parity.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `CheckboxGroupExample`
   - `CheckboxGroupSubmitExample`

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
- Manual: pending

## Status

- Open items: source-level grouped validation and field error behavior audit.
- Risks: current Vue implementation composes independent checkbox controls.
- Closure criteria: React-source behavior gaps resolved and parity checks pass.
