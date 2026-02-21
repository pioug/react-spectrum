# react-aria-components-colorslider

## Scope

- Story group: `React Aria Components/ColorSlider`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/ColorSlider.stories.tsx`
- `packages/react-aria-components/src/ColorSlider.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/ColorSlider.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueColor.ts` (`VueColorSlider`)

## Gap List

1. Audit slider track/thumb render contract parity and output labeling behavior.
2. Audit channel/value mapping parity across hue/saturation/lightness/alpha.
3. Audit orientation/disabled semantics parity and data attribute contract.

## Fixes Applied

1. Added Vue story file with React-matching title/export:
   - `ColorSliderExample`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue color slider currently lacks React slot-based track/thumb behavior surface.
- Closure criteria: React-source behavior gaps fixed and tested.
