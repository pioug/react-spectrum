# react-aria-components-colorfield

## Scope

- Story group: `React Aria Components/ColorField`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/ColorField.stories.tsx`
- `packages/react-aria-components/src/ColorField.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/ColorField.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueColor.ts` (`VueColorField`)

## Gap List

1. Audit channel + colorSpace semantics parity (`hex` vs channel editing modes).
2. Audit validation and hidden input form semantics parity.
3. Audit data attribute and ARIA state parity (`data-channel`, disabled/invalid/readonly/required).

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `ColorFieldExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue color field currently has a reduced feature surface compared with React channel field modes.
- Closure criteria: React-source behavior gaps fixed and tested.
