# react-aria-components-colorswatch

## Scope

- Story group: `React Aria Components/ColorSwatch`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/ColorSwatch.stories.tsx`
- `packages/react-aria-components/src/ColorSwatch.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/ColorSwatch.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueColor.ts` (`VueColorSwatch`)

## Gap List

1. Audit style/render-prop parity for dynamic color styles.
2. Audit ARIA/label semantics parity and color parsing behavior.
3. Audit swatch context behavior parity when used under ColorPicker.

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `ColorSwatchExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue swatch styling API is simplified versus React render-prop style contract.
- Closure criteria: React-source behavior gaps fixed and tested.
