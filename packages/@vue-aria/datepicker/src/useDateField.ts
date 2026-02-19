import {clampComparableValue, isValueOutOfRange} from './dateUtils';
import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaDateFieldOptions {
  inputValue: Ref<string>,
  inputType?: 'date' | 'time',
  isDisabled?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  maxValue?: MaybeRef<string | undefined>,
  minValue?: MaybeRef<string | undefined>,
  name?: MaybeRef<string | undefined>,
  onChange?: (value: string) => void
}

export interface DateFieldAria {
  clear: () => void,
  descriptionProps: ComputedRef<{
    id: string
  }>,
  errorMessageProps: ComputedRef<{
    id: string
  }>,
  inputProps: ComputedRef<{
    'aria-invalid': boolean,
    disabled: boolean,
    max?: string,
    min?: string,
    name?: string,
    readonly: boolean,
    required: boolean,
    type: 'date' | 'time',
    value: string
  }>,
  isInvalid: ComputedRef<boolean>,
  labelProps: ComputedRef<{
    id: string
  }>,
  setValue: (value: string) => void
}

export interface AriaTimeFieldOptions extends Omit<AriaDateFieldOptions, 'inputType'> {}

let dateFieldCounter = 0;

export function useDateField(options: AriaDateFieldOptions): DateFieldAria {
  dateFieldCounter += 1;
  let idBase = `vue-date-field-${dateFieldCounter}`;

  let inputType = computed(() => options.inputType ?? 'date');
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let isRequired = computed(() => Boolean(unref(options.isRequired)));
  let minValue = computed(() => unref(options.minValue));
  let maxValue = computed(() => unref(options.maxValue));
  let name = computed(() => unref(options.name));

  let isInvalid = computed(() => {
    if (isRequired.value && options.inputValue.value.length === 0) {
      return true;
    }

    if (options.inputValue.value.length === 0) {
      return false;
    }

    return isValueOutOfRange(options.inputValue.value, minValue.value, maxValue.value);
  });

  let setValue = (value: string) => {
    let nextValue = clampComparableValue(value, minValue.value, maxValue.value);
    options.inputValue.value = nextValue;
    options.onChange?.(nextValue);
  };

  let clear = () => {
    options.inputValue.value = '';
    options.onChange?.('');
  };

  let inputProps = computed(() => ({
    type: inputType.value,
    value: options.inputValue.value,
    disabled: isDisabled.value,
    readonly: isReadOnly.value,
    required: isRequired.value,
    min: minValue.value,
    max: maxValue.value,
    name: name.value,
    'aria-invalid': isInvalid.value
  }));

  let labelProps = computed(() => ({
    id: `${idBase}-label`
  }));

  let descriptionProps = computed(() => ({
    id: `${idBase}-description`
  }));

  let errorMessageProps = computed(() => ({
    id: `${idBase}-error`
  }));

  return {
    clear,
    descriptionProps,
    errorMessageProps,
    inputProps,
    isInvalid,
    labelProps,
    setValue
  };
}

export function useTimeField(options: AriaTimeFieldOptions): DateFieldAria {
  return useDateField({
    ...options,
    inputType: 'time'
  });
}
