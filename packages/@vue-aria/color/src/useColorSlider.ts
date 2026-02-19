import {clamp} from './colorUtils';
import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type ColorChannel = 'alpha' | 'blue' | 'green' | 'hue' | 'lightness' | 'red' | 'saturation';

export interface AriaColorSliderOptions {
  channel?: MaybeRef<ColorChannel>,
  label?: MaybeRef<string | undefined>,
  maxValue?: MaybeRef<number>,
  minValue?: MaybeRef<number>,
  step?: MaybeRef<number>,
  value: Ref<number>
}

export interface ColorSliderAria {
  decrement: () => void,
  groupProps: ComputedRef<{
    'aria-label'?: string,
    role: 'group'
  }>,
  increment: () => void,
  setValue: (value: number) => void,
  thumbProps: ComputedRef<{
    style: {
      left: string
    }
  }>,
  trackProps: ComputedRef<{
    'aria-valuemax': number,
    'aria-valuemin': number,
    'aria-valuenow': number,
    role: 'slider'
  }>
}

function normalizeStep(step: number | undefined): number {
  if (!Number.isFinite(step) || step == null || step <= 0) {
    return 1;
  }

  return step;
}

export function useColorSlider(options: AriaColorSliderOptions): ColorSliderAria {
  let minValue = computed(() => Number(unref(options.minValue ?? 0)));
  let maxValue = computed(() => Number(unref(options.maxValue ?? (unref(options.channel) === 'hue' ? 360 : 100))));
  let step = computed(() => normalizeStep(unref(options.step)));

  let setValue = (value: number) => {
    options.value.value = clamp(value, minValue.value, maxValue.value);
  };

  let increment = () => {
    setValue(options.value.value + step.value);
  };

  let decrement = () => {
    setValue(options.value.value - step.value);
  };

  let trackProps = computed(() => ({
    role: 'slider' as const,
    'aria-valuemin': minValue.value,
    'aria-valuemax': maxValue.value,
    'aria-valuenow': options.value.value
  }));

  let thumbProps = computed(() => {
    let span = maxValue.value - minValue.value;
    let percent = span === 0 ? 0 : ((options.value.value - minValue.value) / span) * 100;

    return {
      style: {
        left: `${clamp(percent, 0, 100)}%`
      }
    };
  });

  let groupProps = computed(() => ({
    role: 'group' as const,
    'aria-label': unref(options.label)
  }));

  return {
    decrement,
    groupProps,
    increment,
    setValue,
    thumbProps,
    trackProps
  };
}
