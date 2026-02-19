import {addDays, formatDateString, parseDateString} from './dateValueUtils';
import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';
import {useDateField} from '@vue-aria/datepicker';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface DateFieldStateOptions {
  defaultValue?: string,
  isDisabled?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  maxValue?: MaybeRef<string | undefined>,
  minValue?: MaybeRef<string | undefined>,
  onChange?: (value: string) => void,
  value?: Ref<string>
}

export interface DateFieldState {
  dateValue: ComputedRef<Date | null>,
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

export function useDateFieldState(options: DateFieldStateOptions = {}): DateFieldState {
  let internalValue = ref(options.defaultValue ?? '');
  let value = options.value ?? internalValue;

  let aria = useDateField({
    inputValue: value,
    isDisabled: options.isDisabled,
    isReadOnly: options.isReadOnly,
    isRequired: options.isRequired,
    maxValue: options.maxValue,
    minValue: options.minValue,
    onChange: options.onChange
  });

  let increment = (amount = 1): void => {
    let baseline = value.value || formatDateString(new Date());
    let nextValue = addDays(baseline, amount);
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
    dateValue: computed(() => {
      if (!value.value) {
        return null;
      }

      return parseDateString(value.value);
    }),
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
