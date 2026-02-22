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

1. Audit event and interaction parity for press/hover/focus states and emitted payloads.

## Fixes Applied

1. Added Vue Storybook story file with React-matching title/exports:
   - `packages/@vue-spectrum/components/stories/Button.stories.ts`
   - `title: 'React Aria Components/Button'`
   - exports: `ButtonExample`, `PendingButton`, `PendingButtonTooltip`, `RippleButtonExample`, `ButtonPerformance`, `ButtonRender`
2. Verified Storybook id parity for this group via manifest export (6 ids).
3. Ported React story style sources used by button parity fixtures into the Vue story:
   - `packages/react-aria-components/stories/button-pending.css`
   - `packages/react-aria-components/stories/button-ripple.css`
4. Ported pending, pending-tooltip, and ripple story behavior from React source structure:
   - pending stories now use spinner/text layering classes from React CSS and pending-state gating.
   - pending tooltip story now suppresses tooltip while pending to match React behavior.
   - ripple story now emits click-position ripple element using the React ripple class contract.
5. Added `render` prop support to `@vue-spectrum/button` and updated `ButtonRender` story to use custom renderer callback, matching React render-override semantics.

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs --source-url http://127.0.0.1:6106 --include-id-regex '^react-aria-components-' --output-path storybook-parity/manifest/vue-story-manifest.json`
  - `yarn storybook:parity:manifest:compare` (expected fail overall while scope is incomplete; confirms matched ids)
  - `node scripts/storybook-parity-style-sources.mjs --output-dir storybook-parity/catalog` (pass, 0 missing style ports)
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --scenario-ids react-aria-components-button--button-example,react-aria-components-button--pending-button,react-aria-components-button--pending-button-tooltip,react-aria-components-button--ripple-button-example,react-aria-components-button--button-render --output-dir storybook-parity/catalog` (5/5 passing)
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --output-dir storybook-parity/catalog` (18/18 passing)
- Manual: pending

## Status

- Open items: press-event payload semantics and hover/focus state parity deep-audit.
- Risks: button interaction payloads are not yet behavior-gated event-for-event.
- Closure criteria: React-source-audited behavior gaps resolved in Vue implementation and covered by tests.
