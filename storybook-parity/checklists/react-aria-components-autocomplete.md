# react-aria-components-autocomplete

## Scope

- Story group: `React Aria Components/Autocomplete`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Autocomplete.stories.tsx`
- `packages/react-aria-components/src/Autocomplete.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Autocomplete.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueComboBox.ts`
- `packages/@vue-spectrum/components/src/components/VueSearchField.ts`
- `packages/@vue-spectrum/components/src/components/VueListBox.ts`

## Gap List

1. Audit keyboard focus management and ARIA combobox/listbox semantics parity.
2. Audit submenu/popover/dialog-trigger composition parity.
3. Audit async loading, virtualization, table/tag integration, and custom filtering parity.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `AutocompleteExample`
   - `AutocompleteSearchfield`
   - `AutocompleteMenuDynamic`
   - `AutocompleteOnActionOnMenuItems`
   - `AutocompleteDisabledKeys`
   - `AutocompleteAsyncLoadingExample`
   - `AutocompleteCaseSensitive`
   - `AutocompleteWithListbox`
   - `AutocompleteWithVirtualizedListbox`
   - `AutocompleteInPopover`
   - `AutocompleteInPopoverDialogTrigger`
   - `AutocompleteMenuInPopoverDialogTrigger`
   - `AutocompleteSelect`
   - `AutocompleteWithAsyncListBox`
   - `AutocompleteWithGridList`
   - `AutocompleteWithTable`
   - `AutocompleteWithTagGroup`
   - `AutocompletePreserveFirstSectionStory`
   - `AutocompleteUserCustomFiltering`
   - `AutocompleteWithExtraButtons`

## Tests

- Automated:
  - `node scripts/storybook-parity-validate-checklists.mjs`
  - `yarn build:vue:storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `node scripts/storybook-parity-compare-manifests.mjs`
- Manual: pending

## Status

- Open items: source-level behavior parity audit and implementation alignment for advanced autocomplete scenarios.
- Risks: current Vue surfaces are simplified relative to React autocomplete feature depth.
- Closure criteria: React-source behavior gaps resolved and parity checks pass.
