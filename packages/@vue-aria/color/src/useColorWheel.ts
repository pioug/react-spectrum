import {clamp, toPercentage} from './colorUtils';
import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {useLabels} from '@vue-aria/utils';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaColorWheelOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  angle: Ref<number>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  id?: MaybeRef<string | undefined>,
  label?: MaybeRef<string | undefined>,
  radius: Ref<number>
}

export interface ColorWheelAria {
  setValue: (angle: number, radius: number) => void,
  thumbProps: ComputedRef<{
    style: {
      left: string,
      top: string,
      transform: string
    }
  }>,
  wheelProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    id?: string,
    role: 'slider'
  }>
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useColorWheel(options: AriaColorWheelOptions): ColorWheelAria {
  let setValue = (angle: number, radius: number) => {
    let normalizedAngle = Number.isFinite(angle) ? angle : 0;
    options.angle.value = ((normalizedAngle % 360) + 360) % 360;
    options.radius.value = clamp(radius, 0, 1);
  };

  let thumbProps = computed(() => {
    let radians = (options.angle.value * Math.PI) / 180;
    let radius = clamp(options.radius.value, 0, 1);
    let x = 0.5 + (Math.cos(radians) * radius * 0.5);
    let y = 0.5 + (Math.sin(radians) * radius * 0.5);

    return {
      style: {
        left: toPercentage(x),
        top: toPercentage(y),
        transform: `translate(-50%, -50%) rotate(${options.angle.value}deg)`
      }
    };
  });

  let wheelProps = computed(() => {
    let ariaLabel = resolveOptionalString(options.ariaLabel)
      ?? resolveOptionalString(options['aria-label'])
      ?? unref(options.label)
      ?? 'Hue';
    let ariaLabelledby = resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']);
    let labelProps = useLabels({
      id: resolveOptionalString(options.id),
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby
    });

    return {
      role: 'slider' as const,
      id: labelProps.id as string | undefined,
      'aria-label': labelProps['aria-label'],
      'aria-labelledby': labelProps['aria-labelledby']
    };
  });

  return {
    setValue,
    thumbProps,
    wheelProps
  };
}
