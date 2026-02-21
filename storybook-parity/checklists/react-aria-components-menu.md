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

1. Audit trigger/popover/submenu architecture parity including nested submenu behavior.
2. Audit menu section/header/separator semantics parity and keyboard navigation behavior.
3. Audit custom render and virtualization behavior parity (`VirtualizedExample`).

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

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue menu implementation currently lacks React trigger/submenu/virtualization contracts.
- Closure criteria: React-source behavior gaps fixed and tested.
