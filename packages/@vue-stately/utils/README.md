# @vue-stately/utils

Vue utility baseline for controlled state and numeric clamp/step helpers shared across state hooks.

## Exports

* `useControlledState`
* `clamp`
* `roundToStepPrecision`
* `snapValueToStep`
* `toFixedNumber`

## Usage

```ts
import {ref} from 'vue';
import {clamp, snapValueToStep, useControlledState} from '@vue-stately/utils';

let externalValue = ref<number | undefined>(5);
let [value, setValue] = useControlledState(externalValue, 0);
setValue((current) => clamp(current + 4, 0, 10));

let snapped = snapValueToStep(7.2, 0, 10, 0.5);
```

## Known limitations

* API parity with `@react-stately/utils` is not complete yet.
* `useControlledState` does not emit controlled/uncontrolled transition warnings in this baseline.
