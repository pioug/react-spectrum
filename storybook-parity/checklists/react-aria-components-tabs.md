# react-aria-components-tabs

## Scope

- Story group: `React Aria Components/Tabs`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Tabs.stories.tsx`
- `packages/react-aria-components/src/Tabs.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Tabs.stories.ts`
- `packages/@vue-spectrum/tabs/src/VueTabs.ts`

## Gap List

1. Add tooltip-in-tab composition parity for `TabsExample` from React source.
2. Audit `TabsRenderProps` callback shape and orientation-driven layout parity.
3. Re-run visual parity snapshots for all tabs stories after style-port phase.

## Fixes Applied

1. Replaced simplified button-based tabs stories with `VueTabs`-based stories matching React story export structure:
   - `TabsExample`
   - `TabsRenderProps`
   - `NestedTabs`
2. Aligned `VueTabs` keyboard plumbing to React behavior contract by binding tablist `keydown` handler from `useTabList`.
3. Added behavior-gate scenario `react-aria-components-tabs--tabs-example` to enforce:
   - tab count parity
   - initial selected tab parity
   - ArrowRight selection change parity
   - tabpanel content parity after keyboard interaction

## Tests

- Automated:
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --output-dir storybook-parity/catalog` (11/11 passing)
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --scenario-ids react-aria-components-tabs--tabs-example --output-dir storybook-parity/catalog` (pass)
- Manual:
  - Verified `TabsExample` ArrowRight focus/selection progression in both Storybooks.

## Status

- Open items: tooltip composition and render-props fidelity audit.
- Risks: `TabsExample` does not yet include React-side tooltip trigger composition.
- Closure criteria: React-source structure and behavior parity gates remain green after remaining source-derived fixes.
