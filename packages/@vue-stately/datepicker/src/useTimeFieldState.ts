import {addMinutes} from './dateValueUtils';
import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';
import {useTimeField} from '@vue-aria/datepicker';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface TimeFieldStateOptions {
  defaultValue?: string,
  isDisabled?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  maxValue?: MaybeRef<string | undefined>,
  minValue?: MaybeRef<string | undefined>,
  onChange?: (value: string) => void,
  value?: Ref<string>
}

export interface TimeFieldState {
  defaultValue: string,
  isDisabled: ComputedRef<boolean>,
  isInvalid: ComputedRef<boolean>,
  isReadOnly: ComputedRef<boolean>,
  isRequired: ComputedRef<boolean>,
  validationState: ComputedRef<'invalid' | null>,
  value: Ref<string>,
  clear: () => void,
  decrement: (amount?: number) => void,
  formatValue: () => string,
  increment: (amount?: number) => void,
  setValue: (value: string) => void
}

export function useTimeFieldState(options: TimeFieldStateOptions = {}): TimeFieldState {
  let internalValue = ref(options.defaultValue ?? '');
  let value = options.value ?? internalValue;

  let aria = useTimeField({
    inputValue: value,
    isDisabled: options.isDisabled,
    isReadOnly: options.isReadOnly,
    isRequired: options.isRequired,
    maxValue: options.maxValue,
    minValue: options.minValue,
    onChange: options.onChange
  });

  let increment = (amount = 1): void => {
    let baseline = value.value || '00:00';
    let nextValue = addMinutes(baseline, amount);
    if (nextValue) {
      aria.setValue(nextValue);
    }
  };

  let decrement = (amount = 1): void => {
    increment(-amount);
  };

  return {
    value,
    defaultValue: options.defaultValue ?? '',
    setValue: aria.setValue,
    clear: aria.clear,
    increment,
    decrement,
    formatValue: () => value.value,
    isInvalid: aria.isInvalid,
    validationState: computed(() => aria.isInvalid.value ? 'invalid' : null),
    isDisabled: computed(() => Boolean(unref(options.isDisabled))),
    isReadOnly: computed(() => Boolean(unref(options.isReadOnly))),
    isRequired: computed(() => Boolean(unref(options.isRequired)))
  };
}
