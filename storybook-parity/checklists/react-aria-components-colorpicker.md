# react-aria-components-colorpicker

## Scope

- Story group: `React Aria Components/ColorPicker`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/ColorPicker.stories.tsx`
- `packages/react-aria-components/src/ColorPicker.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/ColorPicker.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueColor.ts` (`VueColorPicker`)

## Gap List

1. Audit shared color-state composition parity across field/area/slider/swatch/swatch-picker contexts.
2. Audit dialog/trigger and popover interaction semantics parity.
3. Audit format/channel switching behavior parity and emitted color model consistency.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `ColorPickerExample`
   - `ColorPickerSliders`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue color picker composition is simplified and not yet aligned to React context-driven composition contracts.
- Closure criteria: React-source behavior gaps fixed and tested.
