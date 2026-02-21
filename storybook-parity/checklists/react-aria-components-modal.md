# react-aria-components-modal

## Scope

- Story group: `React Aria Components/Modal`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Modal.stories.tsx`
- `packages/react-aria-components/src/Modal.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Modal.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueDialog.ts`

## Gap List

1. Audit modal overlay + content split parity (`ModalOverlay` + `Modal`) and animation state semantics.
2. Audit dismissable behavior, inertness/focus trapping, and nested trigger behavior parity.
3. Audit dialog trigger/state wiring parity and keyboard dismissal semantics.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `ModalExample`
   - `InertTestStory`
   - `DateRangePickerInsideModalStory`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue dialog/modal internals are currently simpler than React modal overlay contracts.
- Closure criteria: React-source behavior gaps fixed and tested.
