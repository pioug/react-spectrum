# react-aria-components-dropzone

## Scope

- Story group: `React Aria Components/Dropzone`
- Target status: `in_progress`

## React Sources

- `packages/react-aria-components/stories/Dropzone.stories.tsx`
- `packages/react-aria-components/src/DropZone.tsx`

## Vue Sources

- `packages/@vue-spectrum/components/stories/Dropzone.stories.ts`
- `packages/@vue-spectrum/components/src/components/VueDropZone.ts`

## Gap List

1. Audit drag/drop state parity (`isHovered`, `isFocused`, `isFocusVisible`, `isDropTarget`) and render-prop behavior.
2. Audit clipboard paste, drop operation, and a11y label semantics parity.
3. Audit file-trigger integration parity and drop enter/exit event semantics.

## Fixes Applied

1. Added Vue story file with React-matching title/exports:
   - `DropzoneExampleWithFileTriggerLink`
   - `DropzoneExampleWithFileTriggerButton`
   - `DropzoneExampleWithDraggableAndFileTrigger`
   - `DropZoneOnlyAcceptPNGWithFileTrigger`
   - `DropZoneWithCaptureMobileOnly`
   - `DropzoneExampleWithDraggableObject`
   - `DropzoneExampleWithCopyableObject`
   - `DropzoneWithRenderProps`

## Tests

- Automated:
  - `yarn workspace vue-spectrum-starter build-storybook`
  - `node scripts/storybook-parity-export-manifest.mjs ...`
  - `yarn storybook:parity:manifest:compare`
- Manual: pending

## Status

- Open items: source-level behavior parity audit.
- Risks: Vue drop zone currently exposes a reduced behavior surface compared with React drop/clipboard contracts.
- Closure criteria: React-source behavior gaps fixed and tested.
