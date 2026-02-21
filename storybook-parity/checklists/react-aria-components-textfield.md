# react-aria-components-textfield

## Scope

- Story group: `React Aria Components/TextField`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/TextField.stories.tsx`
- `packages/@react-spectrum/textfield/src/TextField.tsx`
- `packages/@react-spectrum/textfield/src/TextArea.tsx`
- `packages/@react-spectrum/textfield/src/TextFieldBase.tsx`

## Vue Sources

- `packages/@vue-spectrum/textfield/src/index.ts`
- `packages/@vue-spectrum/components/src/components/VueTextField.ts`
- `packages/@vue-spectrum/components/src/styles.css`
- `starters/vue/src/components.spec.ts`

## Gap List

1. Audit parity between React story props/variants and current Vue story coverage.
2. Audit event semantics (`change`, model updates, order) against React behavior.
3. Audit ARIA wiring (`aria-describedby`, validation icon labeling, invalid/valid state semantics).
4. Audit focus/hover/keyboard class contract parity (`focus-ring`, `is-hovered`, disabled guards).

## Fixes Applied

1. Added Vue Storybook story file with React-matching title/exports:
   - `packages/@vue-spectrum/components/stories/TextField.stories.ts`
   - `title: 'React Aria Components/TextField'`
   - exports: `TextfieldExample`, `TextFieldSubmitExample`
2. Verified Storybook id parity for this group via manifest export:
   - `react-aria-components-textfield--textfield-example`
   - `react-aria-components-textfield--text-field-submit-example`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs --source-url http://127.0.0.1:6106 --include-id-regex '^react-aria-components-' --output-path storybook-parity/manifest/vue-story-manifest.json`
  - `yarn storybook:parity:manifest:compare` (expected fail overall while scope is incomplete; confirms 2 matching ids)
- Manual: pending

## Status

- Open items: full source parity audit and behavior gap closure for TextField internals and submit behavior.
- Risks: visual parity may mask behavior mismatches without explicit behavior tests.
- Closure criteria: all identified gaps fixed in Vue implementation and covered by tests.
