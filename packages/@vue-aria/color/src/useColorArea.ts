import {clamp, toPercentage} from './colorUtils';
import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {useLabels} from '@vue-aria/utils';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaColorAreaOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  colorChannel?: MaybeRef<string | undefined>,
  id?: MaybeRef<string | undefined>,
  label?: MaybeRef<string | undefined>,
  x: Ref<number>,
  y: Ref<number>
}

export interface ColorAreaAria {
  areaProps: ComputedRef<{
    'aria-labelledby'?: string,
    'aria-label'?: string,
    id?: string,
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

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
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
    let ariaLabel = resolveOptionalString(options.ariaLabel)
      ?? resolveOptionalString(options['aria-label'])
      ?? unref(options.label)
      ?? 'Color picker';
    let ariaLabelledby = resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']);
    let labelProps = useLabels({
      id: resolveOptionalString(options.id),
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby
    });
    let channel = unref(options.colorChannel) ?? 'saturation';
    let gradient = channel === 'hue'
      ? 'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)'
      : 'linear-gradient(to top, black, transparent), linear-gradient(to right, white, transparent)';

    return {
      role: 'application' as const,
      id: labelProps.id as string | undefined,
      'aria-label': labelProps['aria-label'],
      'aria-labelledby': labelProps['aria-labelledby'],
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
