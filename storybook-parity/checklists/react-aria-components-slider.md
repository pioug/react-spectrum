# react-aria-components-slider

## Scope

- Story group: `React Aria Components/Slider`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Slider.stories.tsx`
- `packages/react-aria-components/src/Slider.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Slider.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueSlider.ts`

## Gap List

1. Audit multi-thumb behavior parity (React supports array values and thumb indexing).
2. Audit orientation, output formatting, and track/thumb render contract parity.
3. Audit hover/drag/focus state selectors parity.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `SliderExample`
   - `SliderCSS`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue slider currently exposes a reduced single-thumb behavior surface.
- Closure criteria: React-source behavior gaps fixed and tested.
