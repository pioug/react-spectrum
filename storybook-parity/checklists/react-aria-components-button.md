# react-aria-components-button

## Scope

- Story group: `React Aria Components/Button`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Button.stories.tsx`
- `packages/@react-spectrum/button/src/Button.tsx`
- `packages/@react-spectrum/button/src/ActionButton.tsx`
- `packages/@react-spectrum/button/src/ToggleButton.tsx`
- `packages/@react-spectrum/button/src/ClearButton.tsx`
- `packages/@react-spectrum/button/src/LogicButton.tsx`
- `packages/@react-spectrum/button/src/FieldButton.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Button.stories.ts`
- `packages/@vue-spectrum/button/src/index.ts`
- `packages/@vue-spectrum/components/src/components/VueButton.ts`
- `starters/vue/src/components.spec.ts`

## Gap List

1. Audit parity for pending/loading semantics from React `PendingButton` stories.
2. Audit parity for tooltip/ripple stories and whether Vue equivalents exist in implementation.
3. Audit parity for render override/custom button rendering semantics (`ButtonRender` story).
4. Audit event and interaction parity for press/hover/focus states and emitted payloads.

## Fixes Applied

1. Added Vue Storybook story file with React-matching title/exports:
   - `packages/@vue-spectrum/components/stories/Button.stories.ts`
   - `title: 'React Aria Components/Button'`
   - exports: `ButtonExample`, `PendingButton`, `PendingButtonTooltip`, `RippleButtonExample`, `ButtonPerformance`, `ButtonRender`
2. Verified Storybook id parity for this group via manifest export (6 ids).

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs --source-url http://127.0.0.1:6106 --include-id-regex '^react-aria-components-' --output-path storybook-parity/manifest/vue-story-manifest.json`
  - `yarn storybook:parity:manifest:compare` (expected fail overall while scope is incomplete; confirms matched ids)
- Manual: pending

## Status

- Open items: source-level behavior parity audit and gap closure for pending/tooltip/ripple/render semantics.
- Risks: current Vue stories provide id coverage but do not yet prove full React behavior parity.
- Closure criteria: React-source-audited behavior gaps resolved in Vue implementation and covered by tests.
