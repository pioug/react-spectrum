import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {normalizeColorString} from './colorUtils';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaColorFieldOptions {
  isDisabled?: MaybeRef<boolean>,
  isInvalid?: MaybeRef<boolean>,
  label?: MaybeRef<string | undefined>,
  onChange?: (value: string) => void,
  value: Ref<string>
}

export interface ColorFieldAria {
  inputProps: ComputedRef<{
    'aria-invalid'?: boolean,
    disabled: boolean,
    value: string
  }>,
  labelProps: ComputedRef<{
    'aria-disabled'?: boolean,
    label?: string
  }>,
  setValue: (value: string) => void
}

export function useColorField(options: AriaColorFieldOptions): ColorFieldAria {
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isInvalid = computed(() => Boolean(unref(options.isInvalid)));

  let setValue = (value: string) => {
    let normalizedValue = normalizeColorString(value);
    options.value.value = normalizedValue;
    options.onChange?.(normalizedValue);
  };

  let inputProps = computed(() => ({
    disabled: isDisabled.value,
    value: options.value.value,
    'aria-invalid': isInvalid.value || undefined
  }));

  let labelProps = computed(() => ({
    label: unref(options.label),
    'aria-disabled': isDisabled.value || undefined
  }));

  return {
    inputProps,
    labelProps,
    setValue
  };
}
