# react-aria-components-form

## Scope

- Story group: `React Aria Components/Form`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Form.stories.tsx`
- `packages/react-aria-components/src/Form.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Form.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueForm.ts`

## Gap List

1. Audit validation behavior parity (`native` vs `aria`) and noValidate semantics.
2. Audit form context wiring parity for nested field components.
3. Audit submit/reset behavior parity (preventDefault policy and event payload).

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `FormAutoFillExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue form context semantics differ from React and need parity fixes.
- Closure criteria: React-source behavior gaps fixed and tested.
