import {clamp, toPercentage} from './colorUtils';
import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaColorWheelOptions {
  angle: Ref<number>,
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
    role: 'slider'
  }>
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

  let wheelProps = computed(() => ({
    role: 'slider' as const,
    'aria-label': unref(options.label)
  }));

  return {
    setValue,
    thumbProps,
    wheelProps
  };
}
