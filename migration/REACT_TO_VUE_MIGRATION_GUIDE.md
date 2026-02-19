# React to Vue Migration Guide

This guide documents the current migration path from React Spectrum packages to the Vue migration baseline in this repository.

## Scope

These ports are tracked as `in_progress`. API parity with React is not complete yet, but package entry points and baseline behaviors exist.

## Package mapping

### Foundation and primitives

| React package | Vue package |
| --- | --- |
| `react-aria-components` | `@vue-spectrum/components` |
| `@react-spectrum/provider` | `@vue-spectrum/provider` |
| `@react-spectrum/button` | `@vue-spectrum/button` |
| `@react-spectrum/buttongroup` | `@vue-spectrum/buttongroup` |
| `@react-spectrum/avatar` | `@vue-spectrum/avatar` |
| `@react-spectrum/badge` | `@vue-spectrum/badge` |
| `@react-spectrum/well` | `@vue-spectrum/well` |
| `@react-spectrum/view` | `@vue-spectrum/view` |
| `@react-spectrum/text` | `@vue-spectrum/text` |
| `@react-spectrum/textfield` | `@vue-spectrum/textfield` |
| `@react-spectrum/searchfield` | `@vue-spectrum/searchfield` |
| `@react-spectrum/numberfield` | `@vue-spectrum/numberfield` |
| `@react-spectrum/slider` | `@vue-spectrum/slider` |
| `@react-spectrum/progress` | `@vue-spectrum/progress` |
| `@react-spectrum/meter` | `@vue-spectrum/meter` |
| `@react-spectrum/statuslight` | `@vue-spectrum/statuslight` |
| `@react-spectrum/checkbox` | `@vue-spectrum/checkbox` |
| `@react-spectrum/radio` | `@vue-spectrum/radio` |
| `@react-spectrum/switch` | `@vue-spectrum/switch` |
| `@react-spectrum/divider` | `@vue-spectrum/divider` |
| `@react-spectrum/link` | `@vue-spectrum/link` |
| `@react-spectrum/label` | `@vue-spectrum/label` |
| `@react-spectrum/labeledvalue` | `@vue-spectrum/labeledvalue` |
| `@react-spectrum/layout` | `@vue-spectrum/layout` |
| `@react-spectrum/form` | `@vue-spectrum/form` |
| `@react-spectrum/icon` | `@vue-spectrum/icon` |
| `@react-spectrum/image` | `@vue-spectrum/image` |
| `@react-spectrum/inlinealert` | `@vue-spectrum/inlinealert` |
| `@react-spectrum/illustratedmessage` | `@vue-spectrum/illustratedmessage` |

### Composition and data-heavy

| React package | Vue package |
| --- | --- |
| `@react-spectrum/accordion` | `@vue-spectrum/accordion` |
| `@react-spectrum/actionbar` | `@vue-spectrum/actionbar` |
| `@react-spectrum/actiongroup` | `@vue-spectrum/actiongroup` |
| `@react-spectrum/dialog` | `@vue-spectrum/dialog` |
| `@react-spectrum/overlays` | `@vue-spectrum/overlays` |
| `@react-spectrum/combobox` | `@vue-spectrum/combobox` |
| `@react-spectrum/autocomplete` | `@vue-spectrum/autocomplete` |
| `@react-spectrum/menu` | `@vue-spectrum/menu` |
| `@react-spectrum/listbox` | `@vue-spectrum/listbox` |
| `@react-spectrum/list` | `@vue-spectrum/list` |
| `@react-spectrum/table` | `@vue-spectrum/table` |
| `@react-spectrum/tree` | `@vue-spectrum/tree` |
| `@react-spectrum/dnd` | `@vue-spectrum/dnd` |
| `@react-spectrum/dropzone` | `@vue-spectrum/dropzone` |
| `@react-spectrum/filetrigger` | `@vue-spectrum/filetrigger` |
| `@react-aria/virtualizer` | `@vue-aria/virtualizer` |

## Core API conversion patterns

| React pattern | Vue pattern |
| --- | --- |
| JSX children | Vue default slot |
| `className` | `class` |
| `value` + `onChange` | `v-model` + `@update:modelValue` |
| `isDisabled` | `:disabled` |
| `onPress` / `onClick` callbacks | `@click` |
| controlled selection props | `v-model` selection state |

## Examples

### Provider

```tsx
// React
import {Provider} from '@react-spectrum/provider';

<Provider colorScheme="light" scale="medium">...</Provider>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import {Provider as VueProvider} from '@vue-spectrum/provider';
</script>

<template>
  <VueProvider color-scheme="light" scale="medium">...</VueProvider>
</template>
```

### TextField

```tsx
// React
<TextField label="Name" value={name} onChange={setName} />
```

```vue
<!-- Vue -->
<VueTextField v-model="name" label="Name" />
```

### RadioGroup

```tsx
// React
<RadioGroup label="Framework" value={framework} onChange={setFramework}>
  <Radio value="react">React</Radio>
  <Radio value="vue">Vue</Radio>
</RadioGroup>
```

```vue
<!-- Vue -->
<VueRadioGroup v-model="framework" label="Framework">
  <VueRadio value="react">React</VueRadio>
  <VueRadio value="vue">Vue</VueRadio>
</VueRadioGroup>
```

### Table

```vue
<VueTable
  v-model="selectedTicket"
  :columns="ticketColumns"
  :rows="ticketRows"
  row-key="ticket"
  @row-action="onRowAction" />
```

### DropZone

```vue
<VueDropZone
  label="Drop assets"
  @files-drop="onFilesDrop"
  @text-drop="onTextDrop" />
```

### Virtualizer

```ts
import {ref} from 'vue';
import {useVirtualizer} from '@vue-aria/virtualizer';

const scrollTop = ref(0);
const virtualizer = useVirtualizer({
  itemCount: 500,
  itemHeight: 36,
  viewportHeight: 320,
  scrollTop,
  overscan: 3
});
```

## Validation checklist

1. Run `yarn workspace vue-spectrum-starter typecheck`.
2. Run `yarn workspace vue-spectrum-starter build`.
3. Run `yarn test:vue`.
4. Run `yarn vue:migration:test` before merging migration updates.
