# @vue-stately/toggle

Vue state baseline for single toggle state and grouped toggle selection state.

## Exports

* `useToggleState`
* `useToggleGroupState`

## Usage

```ts
import {ref} from 'vue';
import {useToggleGroupState, useToggleState} from '@vue-stately/toggle';

let isSelected = ref<boolean | undefined>(false);
let toggle = useToggleState({
  isSelected,
  onChange: (nextSelected) => {
    isSelected.value = nextSelected;
  }
});

let selectedKeys = ref(new Set<string>(['bold']));
let group = useToggleGroupState({
  selectedKeys,
  selectionMode: 'multiple'
});
```

## Known limitations

* API parity with `@react-stately/toggle` is not complete yet.
* Focus management and keyboard navigation behavior are owned by `@vue-aria/*` layer usage.
