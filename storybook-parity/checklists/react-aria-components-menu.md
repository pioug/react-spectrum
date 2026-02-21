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

1. Audit remaining multi-level submenu close semantics (pointer-exit/Escape and nested collapse sequencing are still simplified).
2. Audit section/header parity for complex submenu section stories (`SubmenuSectionsExample` still simplifies nested section composition details).
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
6. Ported submenu delay semantics from React `SubmenuTrigger` stories:
   - `VueMenu` now supports `delay` (default `200`) for hover-open submenu timing.
   - `Submenu*` stories now bind story `delay` args to `VueMenu` so Storybook controls map to runtime behavior.
7. Ported MenuExample separator/header structure parity:
   - `VueMenu` now supports section separators with `role="separator"` and section `aria-label` support.
   - `MenuExample` now mirrors React section labeling (`Section 1` aria-label only, visible `Section 2` header).
8. Ported submenu keyboard focus handoff parity:
   - `VueMenu` now opens submenu on `ArrowRight` and moves focus to the first enabled submenu item.
   - `VueMenu` now collapses submenu on `ArrowLeft` from submenu items and returns focus to the parent trigger.
   - submenu trigger chevron is now rendered via React-style `data-has-submenu` CSS semantics so text content matches React.
   - behavior gate now asserts `ArrowRight`/`ArrowLeft` expanded states, focus handoff, and submenu item counts against React.
5. Ported section structure parity for `MenuExample`:
   - `VueMenu` now supports `sections` with `role="group"` semantics under a single top-level `role="menu"` container.
   - `packages/@vue-spectrum/components/stories/Menu.stories.ts` now passes section collections to one `VueMenu` instance instead of composing multiple root menus.

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --output-dir storybook-parity/catalog` (PASS for `react-aria-components-menu--menu-example`, `react-aria-components-menu--submenu-example`; includes menu group/top-level/separator structure plus submenu hover-delay and `ArrowRight`/`ArrowLeft` focus assertions)
- Manual: pending

## Status

- Open items: multi-level submenu close semantics, complex submenu section composition parity, virtualization semantics.
- Risks: nested submenu close sequencing is still simplified compared to React `SubmenuTrigger` internals.
- Closure criteria: React-source behavior gaps fixed and tested.
