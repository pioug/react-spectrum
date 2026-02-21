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

1. Audit hover-delay and focus-management parity for submenu open behavior (`SubmenuTrigger` delay semantics from React source are not yet implemented).
2. Audit separator/header visual parity for sectioned menus (`MenuSection` + `Separator` styling/details still simplified in Vue).
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
4. Ported nested submenu data structures and rendering for `Submenu*` stories:
   - `VueMenu` now accepts nested `children` items, exposes `aria-haspopup="menu"` / `aria-expanded`, and renders nested submenu menu trees.
   - `packages/@vue-spectrum/components/stories/Menu.stories.ts` now mirrors React submenu story content using nested menu item collections.
5. Ported section structure parity for `MenuExample`:
   - `VueMenu` now supports `sections` with `role="group"` semantics under a single top-level `role="menu"` container.
   - `packages/@vue-spectrum/components/stories/Menu.stories.ts` now passes section collections to one `VueMenu` instance instead of composing multiple root menus.

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --output-dir storybook-parity/catalog` (PASS for `react-aria-components-menu--menu-example`, `react-aria-components-menu--submenu-example`; includes menu group/top-level structure assertions)
- Manual: pending

## Status

- Open items: submenu delay/focus contract parity, separator/header visual parity, virtualization semantics.
- Risks: submenu open behavior currently click/enter-driven only and does not yet implement React `SubmenuTrigger` timing/hover contracts.
- Closure criteria: React-source behavior gaps fixed and tested.
