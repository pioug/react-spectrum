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

1. Audit remaining visual detail parity for complex submenu section stories (structure/ARIA now matched; styling nuances still simplified).
2. Audit any remaining custom-render edge cases (`MenuCustomRender` still uses simplified rendering).

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
   - `VueMenu` now collapses submenu on `Escape` from submenu items and returns focus to the parent trigger.
   - submenu trigger chevron is now rendered via React-style `data-has-submenu` CSS semantics so text content matches React.
   - behavior gate now asserts `ArrowRight`/`ArrowLeft`/`Escape` expanded states, focus handoff, and submenu item counts against React.
9. Ported nested submenu sections composition parity:
   - `VueMenu` now supports `childSections` on submenu trigger items, including per-section headers and separators.
   - `SubmenuSectionsExample` now mirrors React nested section composition (`Submenu Section 1/2`, separator, six submenu items).
   - behavior gate now asserts nested section group/separator/header/item counts for `react-aria-components-menu--submenu-sections-example`.
10. Ported VirtualizedExample behavior contract parity:
   - `VueMenu` now supports flat-list virtualization (`virtualized`, `visibleItemCount`, `estimatedItemHeight`) with scroll windowing.
   - `VirtualizedExample` now uses flat menu items (`Object n`) and virtualized rendering like the React story contract.
   - behavior gate now asserts windowed rendering and scroll-window updates for `react-aria-components-menu--virtualized-example`.
11. Ported nested pointer-exit close sequencing parity:
   - `VueMenu` now closes hovered submenus when pointer leaves trigger/submenu regions after delay, matching React hover-close behavior.
   - behavior gate now asserts `hoverExpandedAfterLeave=false` and `submenuItemCountAfterHoverLeave=0` for `react-aria-components-menu--submenu-example`.
5. Ported section structure parity for `MenuExample`:
   - `VueMenu` now supports `sections` with `role="group"` semantics under a single top-level `role="menu"` container.
   - `packages/@vue-spectrum/components/stories/Menu.stories.ts` now passes section collections to one `VueMenu` instance instead of composing multiple root menus.

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
  - `node scripts/storybook-parity-behavior.mjs --react-url http://127.0.0.1:9003 --vue-url http://127.0.0.1:6106 --output-dir storybook-parity/catalog` (PASS for `react-aria-components-menu--menu-example`, `react-aria-components-menu--submenu-example`, `react-aria-components-menu--submenu-sections-example`, `react-aria-components-menu--virtualized-example`; includes menu structure, submenu hover/keyboard/pointer-close, nested section, and virtualization-window assertions)
- Manual: pending

## Status

- Open items: complex submenu visual detail parity, custom-render edge cases.
- Risks: some story-level visual details remain simplified while behavior/ARIA parity gates pass.
- Closure criteria: React-source behavior gaps fixed and tested.
