# @vue-stately/tooltip

Vue state baseline for tooltip trigger open/close timing, warmup, and cooldown behavior.

## Exports

* `useTooltipTriggerState`

## Usage

```ts
import {useTooltipTriggerState} from '@vue-stately/tooltip';

let tooltip = useTooltipTriggerState({
  delay: 500,
  closeDelay: 120
});

tooltip.open();
tooltip.close();
```

## Known limitations

* API parity with `@react-stately/tooltip` is not complete yet.
* Global warmup/cooldown behavior is shared process state; use one tooltip state source per trigger instance.
