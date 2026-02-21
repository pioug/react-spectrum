# react-aria-components-searchfield

## Scope

- Story group: `React Aria Components/SearchField`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/SearchField.stories.tsx`
- `packages/react-aria-components/src/SearchField.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/SearchField.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueSearchField.ts`

## Gap List

1. Audit clear-button semantics/events and keyboard behavior parity.
2. Audit state/data attributes parity (`data-empty`, `data-invalid`, `data-disabled`, `data-readonly`, `data-required`).

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `SearchFieldExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: current Vue story does not yet expose React slot composition behavior.
- Closure criteria: React-source behavior gaps fixed and tested.
