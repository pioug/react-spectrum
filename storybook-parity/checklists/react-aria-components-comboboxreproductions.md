# react-aria-components-comboboxreproductions

## Scope

- Story group: `React Aria Components/ComboBoxReproductions`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/ComboBoxReproductions.stories.tsx`
- `packages/react-aria-components/src/ComboBox.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/ComboBoxReproductions.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueComboBox.ts`

## Gap List

1. Audit long-option visual overflow parity against React CSS (line wrapping/truncation/scroll behavior).
2. Audit keyboard navigation detail parity for popup/listbox interactions.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `ComboBoxReproductionExample`
2. Ported React reproduction-specific style source into Vue story:
   - `packages/react-aria-components/stories/combobox-reproductions.css`
   - updated theme import to workspace-source path (`../../@react-aria/example-theme/src/index.css`) so React/Vue Storybook builds resolve consistently.
3. Replaced `@vue-spectrum/components` combobox wrapper implementation with `@vue-spectrum/combobox` base component to align with React structure:
   - trigger button rendered in control
   - input exposes combobox ARIA contract (`role="combobox"`, `aria-expanded`, `aria-controls`)
   - popup listbox/option structure rendered when expanded
4. Added behavior-gate scenario `react-aria-components-comboboxreproductions--combo-box-reproduction-example` covering trigger-open semantics and long-option presence parity.
5. Expanded reproduction behavior gate to include keyboard and overflow parity details:
   - `ArrowDown` opens popup and sets active descendant.
   - second `ArrowDown` advances active descendant.
   - `Enter` commits focused option and closes popup.
   - reopened popup exposes long-token horizontal overflow parity (`scrollWidth > clientWidth`).
6. Ported React combobox popup-width measurement pattern (input + trigger bounds) into Vue combobox internals so reproduction popup width tracks trigger width rather than content width.

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
  - `node scripts/storybook-parity-style-sources.mjs --output-dir storybook-parity/catalog` (pass, 0 missing style ports)
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --scenario-ids react-aria-components-comboboxreproductions--combo-box-reproduction-example --output-dir storybook-parity/catalog` (pass, keyboard + overflow checks included)
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --output-dir storybook-parity/catalog` (30/30 passing)
- Manual: pending

## Status

- Open items: manual visual snapshot audit only.
- Risks: minor visual details may still differ without screenshot parity artifacts.
- Closure criteria: React-source behavior gaps resolved and parity checks pass.
