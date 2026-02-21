# react-aria-components-filetrigger

## Scope

- Story group: `React Aria Components/FileTrigger`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/FileTrigger.stories.tsx`
- `packages/react-aria-components/src/FileTrigger.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/FileTrigger.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueFileTrigger.ts`

## Gap List

1. Audit press responder + hidden input trigger semantics parity.
2. Audit directory upload and `webkitdirectory` behavior parity.
3. Audit select event payload parity (`FileList | null` vs Vue array form).

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `FileTriggerButton`
   - `FileTriggerDirectories`
   - `FileTriggerLinkAllowsMultiple`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue file trigger events currently differ in payload shape from React.
- Closure criteria: React-source behavior gaps fixed and tested.
