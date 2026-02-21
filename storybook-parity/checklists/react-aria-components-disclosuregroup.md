# react-aria-components-disclosuregroup

## Scope

- Story group: `React Aria Components/DisclosureGroup`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/DisclosureGroup.stories.tsx`
- `packages/react-aria-components/src/Disclosure.tsx` (`DisclosureGroup`)

## Vue Sources

- `packages/@vue-spectrum/components/stories/DisclosureGroup.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueAccordion.ts` (`VueAccordion`)

## Gap List

1. Audit expanded-keys state model parity (single vs multiple expansion behavior).
2. Audit group-level disabled/readOnly semantics and state propagation parity.
3. Audit focus and keyboard navigation parity across grouped disclosures.

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `DisclosureGroupExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue accordion API does not yet match React disclosure-group contract exactly.
- Closure criteria: React-source behavior gaps fixed and tested.
