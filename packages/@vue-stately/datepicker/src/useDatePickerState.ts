import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';
import {useDatePicker} from '@vue-aria/datepicker';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;
export type DateValue = string | number | Date;

export interface DatePickerStateOptions<T extends DateValue = DateValue> {
  defaultOpen?: MaybeRef<boolean>,
  defaultValue?: string | null,
  isDisabled?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  maxValue?: MaybeRef<string | undefined>,
  minValue?: MaybeRef<string | undefined>,
  onChange?: (value: string | null) => void,
  onOpenChange?: (isOpen: boolean) => void,
  shouldCloseOnSelect?: boolean | (() => boolean),
  value?: Ref<string | null>
}

export interface DatePickerState {
  dateValue: ComputedRef<string | null>,
  defaultValue: string | null,
  granularity: ComputedRef<'day'>,
  hasTime: ComputedRef<boolean>,
  isDisabled: ComputedRef<boolean>,
  isInvalid: ComputedRef<boolean>,
  isOpen: Ref<boolean>,
  isReadOnly: ComputedRef<boolean>,
  isRequired: ComputedRef<boolean>,
  timeValue: Ref<string | null>,
  validationState: ComputedRef<'invalid' | null>,
  value: Ref<string | null>,
  close: () => void,
  commit: () => void,
  formatValue: () => string,
  open: () => void,
  setDateValue: (value: string | null) => void,
  setOpen: (isOpen: boolean) => void,
  setTimeValue: (value: string | null) => void,
  setValue: (value: string | null) => void,
  toggle: () => void
}

export function useDatePickerState<T extends DateValue = DateValue>(props: DatePickerStateOptions<T>): DatePickerState {
  let options = props ?? ({} as DatePickerStateOptions<T>);
  let internalValue = ref<string | null>(options.defaultValue ?? null);
  let value = options.value ?? internalValue;
  let timeValue = ref<string | null>(null);

  let aria = useDatePicker({
    defaultOpen: options.defaultOpen,
    isDisabled: options.isDisabled,
    isReadOnly: options.isReadOnly,
    isRequired: options.isRequired,
    maxValue: options.maxValue,
    minValue: options.minValue,
    onChange: options.onChange,
    onOpenChange: options.onOpenChange,
    value
  });

  let shouldCloseOnSelect = () => {
    if (typeof options.shouldCloseOnSelect === 'function') {
      return options.shouldCloseOnSelect();
    }

    return options.shouldCloseOnSelect ?? true;
  };

  let setOpen = (isOpen: boolean): void => {
    if (isOpen) {
      aria.open();
    } else {
      aria.close();
    }
  };

  let setValue = (nextValue: string | null): void => {
    aria.setValue(nextValue);
  };

  let setDateValue = (nextDateValue: string | null): void => {
    setValue(nextDateValue);
    if (shouldCloseOnSelect()) {
      aria.close();
    }
  };

  let setTimeValue = (nextTimeValue: string | null): void => {
    timeValue.value = nextTimeValue;
  };

  let commit = (): void => {
    if (value.value != null) {
      setValue(value.value);
    }
  };

  return {
    value,
    defaultValue: options.defaultValue ?? null,
    dateValue: computed(() => value.value),
    timeValue,
    setValue,
    setDateValue,
    setTimeValue,
    granularity: computed(() => 'day' as const),
    hasTime: computed(() => false),
    isOpen: aria.isOpen,
    setOpen,
    open: aria.open,
    close: aria.close,
    toggle: aria.toggle,
    commit,
    formatValue: () => value.value ?? '',
    isInvalid: aria.isInvalid,
    validationState: computed(() => aria.isInvalid.value ? 'invalid' : null),
    isDisabled: computed(() => Boolean(unref(options.isDisabled))),
    isReadOnly: computed(() => Boolean(unref(options.isReadOnly))),
    isRequired: computed(() => Boolean(unref(options.isRequired)))
  };
}
