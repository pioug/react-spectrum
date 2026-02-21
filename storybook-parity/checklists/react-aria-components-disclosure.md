# react-aria-components-disclosure

## Scope

- Story group: `React Aria Components/Disclosure`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Disclosure.stories.tsx`
- `packages/react-aria-components/src/Disclosure.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Disclosure.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueAccordion.ts` (`VueDisclosure`, `VueDisclosureTitle`, `VueDisclosurePanel`)

## Gap List

1. Audit controlled expansion parity (`isExpanded` + `onExpandedChange`) and focus-visible state semantics.
2. Audit trigger/panel ARIA linkage parity and role behavior.
3. Audit disclosure state data attributes parity (`data-expanded`, `data-disabled`, `data-focus-visible-within`).

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `DisclosureExample`
   - `DisclosureControlledExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: controlled disclosure behavior is not first-class in current Vue component API.
- Closure criteria: React-source behavior gaps fixed and tested.
