# react-aria-components-meter

## Scope

- Story group: `React Aria Components/Meter`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Meter.stories.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Meter.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueMeter.ts`

## Gap List

1. Audit render-prop output parity and value text semantics.
2. Audit min/max/value and ARIA value mapping parity.

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `MeterExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: story id parity does not guarantee render-prop behavior parity.
- Closure criteria: React-source behavior gaps fixed and tested.
