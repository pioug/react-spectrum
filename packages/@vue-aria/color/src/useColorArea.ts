import {clamp, toPercentage} from './colorUtils';
import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaColorAreaOptions {
  colorChannel?: MaybeRef<string | undefined>,
  label?: MaybeRef<string | undefined>,
  x: Ref<number>,
  y: Ref<number>
}

export interface ColorAreaAria {
  areaProps: ComputedRef<{
    'aria-label'?: string,
    role: 'application',
    style: {
      background: string
    }
  }>,
  setValue: (x: number, y: number) => void,
  thumbProps: ComputedRef<{
    style: {
      left: string,
      top: string
    }
  }>
}

export function useColorArea(options: AriaColorAreaOptions): ColorAreaAria {
  let setValue = (x: number, y: number) => {
    options.x.value = clamp(x, 0, 1);
    options.y.value = clamp(y, 0, 1);
  };

  let thumbProps = computed(() => ({
    style: {
      left: toPercentage(clamp(options.x.value, 0, 1)),
      top: toPercentage(clamp(options.y.value, 0, 1))
    }
  }));

  let areaProps = computed(() => {
    let channel = unref(options.colorChannel) ?? 'saturation';
    let gradient = channel === 'hue'
      ? 'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)'
      : 'linear-gradient(to top, black, transparent), linear-gradient(to right, white, transparent)';

    return {
      role: 'application' as const,
      'aria-label': unref(options.label),
      style: {
        background: gradient
      }
    };
  });

  return {
    areaProps,
    setValue,
    thumbProps
  };
}
