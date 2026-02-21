# react-aria-components-menu

## Scope

- Story group: `React Aria Components/Menu`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Menu.stories.tsx`
- `packages/react-aria-components/src/Menu.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Menu.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueMenu.ts`

## Gap List

1. Audit submenu architecture parity including nested submenu behavior (`Submenu*` stories currently label-only placeholders).
2. Audit menu section/header semantics parity (current Vue rendering uses repeated `VueMenu` blocks vs React `MenuSection` + `Separator` composition).
3. Audit custom render and virtualization behavior parity (`MenuCustomRender`, `VirtualizedExample`).

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `MenuExample`
   - `MenuComplex`
   - `MenuScrollPaddingExample`
   - `SubmenuExample`
   - `SubmenuNestedExample`
   - `SubmenuManyItemsExample`
   - `SubmenuDisabledExample`
   - `SubmenuSectionsExample`
   - `SubdialogExample`
   - `MenuCustomRender`
   - `VirtualizedExample`
2. Ported `MenuExample` to React-equivalent trigger/popover composition:
   - `packages/@vue-spectrum/components/stories/Menu.stories.ts` now renders a trigger button (`aria-label="Menu"`), popover, two sections, and closes on action.
3. Updated `VueMenu` behavior contracts to align with React `Menu` defaults from `packages/react-aria-components/src/Menu.tsx`:
   - default `selectionMode` is now `none` (non-selectable action menu),
   - default item role is `menuitem`,
   - `aria-checked` is only emitted for selectable modes (`single`/`multiple`),
   - action/select events fire without mutating selection in `selectionMode="none"`.

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --output-dir storybook-parity/catalog` (PASS for `react-aria-components-menu--menu-example`)
- Manual: pending

## Status

- Open items: source-level submenu and virtualization parity audit.
- Risks: Vue menu stories still emulate submenu/section behaviors and are not yet a full React-source-equivalent implementation.
- Closure criteria: React-source behavior gaps fixed and tested.
