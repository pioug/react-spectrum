# react-aria-components-link

## Scope

- Story group: `React Aria Components/Link`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Link.stories.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Link.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueLink.ts`

## Gap List

1. Audit aria and href/lang/target behavior parity.
2. Audit interaction semantics and event payload parity.

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `LinkExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: story id parity does not guarantee full behavior parity.
- Closure criteria: React-source behavior gaps fixed and tested.
