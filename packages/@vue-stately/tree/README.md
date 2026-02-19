# @vue-stately/tree

Vue state baseline for tree collection flattening, expansion state, and multi-selection integration.

## Exports

* `TreeCollection`
* `useTreeState`

## Usage

```ts
import {useTreeState} from '@vue-stately/tree';

let state = useTreeState({
  items: [
    {key: 'animals', childNodes: [{key: 'mammals'}, {key: 'birds'}]},
    {key: 'plants'}
  ],
  selectionMode: 'multiple'
});

state.toggleKey('animals');
state.selectionManager.toggleSelection('birds');
```

## Known limitations

* API parity with `@react-stately/tree` is not complete yet.
* Tree data normalization assumes caller-provided stable keys and does not auto-generate missing keys.
