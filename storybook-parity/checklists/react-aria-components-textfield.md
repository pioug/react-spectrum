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

1. None yet.

## Tests

- Automated: pending
- Manual: pending

## Status

- Open items: full source parity audit and behavior gap closure.
- Risks: visual parity may mask behavior mismatches without explicit behavior tests.
- Closure criteria: all identified gaps fixed in Vue implementation and covered by tests.
