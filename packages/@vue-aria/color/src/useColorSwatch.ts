import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {normalizeColorString} from './colorUtils';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaColorSwatchOptions {
  ariaLabel?: MaybeRef<string | undefined>,
  color: MaybeRef<string>,
  isDisabled?: MaybeRef<boolean>
}

export interface ColorSwatchAria {
  swatchProps: ComputedRef<{
    'aria-disabled'?: boolean,
    'aria-label'?: string,
    role: 'img',
    style: {
      backgroundColor: string,
      opacity?: number
    }
  }>
}

export function useColorSwatch(options: AriaColorSwatchOptions): ColorSwatchAria {
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));

  let swatchProps = computed(() => ({
    role: 'img' as const,
    'aria-label': unref(options.ariaLabel),
    'aria-disabled': isDisabled.value || undefined,
    style: {
      backgroundColor: normalizeColorString(String(unref(options.color))),
      opacity: isDisabled.value ? 0.4 : undefined
    }
  }));

  return {
    swatchProps
  };
}
