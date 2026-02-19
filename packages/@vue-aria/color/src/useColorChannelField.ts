import {clamp} from './colorUtils';
import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type ColorNumberChannel = 'alpha' | 'blue' | 'green' | 'hue' | 'lightness' | 'red' | 'saturation';

export interface AriaColorChannelFieldOptions {
  channel?: MaybeRef<ColorNumberChannel>,
  label?: MaybeRef<string | undefined>,
  maxValue?: MaybeRef<number>,
  minValue?: MaybeRef<number>,
  onChange?: (value: number) => void,
  step?: MaybeRef<number>,
  value: Ref<number>
}

export interface ColorChannelFieldAria {
  decrement: () => void,
  increment: () => void,
  inputProps: ComputedRef<{
    'aria-label'?: string,
    max: number,
    min: number,
    step: number,
    value: number
  }>,
  setValue: (value: number) => void
}

function normalizeStep(step: number | undefined): number {
  if (!Number.isFinite(step) || step == null || step <= 0) {
    return 1;
  }

  return step;
}

export function useColorChannelField(options: AriaColorChannelFieldOptions): ColorChannelFieldAria {
  let minValue = computed(() => Number(unref(options.minValue ?? 0)));
  let maxValue = computed(() => Number(unref(options.maxValue ?? (unref(options.channel) === 'hue' ? 360 : 100))));
  let step = computed(() => normalizeStep(unref(options.step)));

  let setValue = (value: number) => {
    let nextValue = clamp(value, minValue.value, maxValue.value);
    options.value.value = nextValue;
    options.onChange?.(nextValue);
  };

  let increment = () => {
    setValue(options.value.value + step.value);
  };

  let decrement = () => {
    setValue(options.value.value - step.value);
  };

  let inputProps = computed(() => ({
    value: options.value.value,
    min: minValue.value,
    max: maxValue.value,
    step: step.value,
    'aria-label': unref(options.label)
  }));

  return {
    decrement,
    increment,
    inputProps,
    setValue
  };
}
