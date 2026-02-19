import {clampComparableValue, isValueOutOfRange} from './dateUtils';
import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaDatePickerOptions {
  defaultOpen?: MaybeRef<boolean>,
  isDisabled?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  maxValue?: MaybeRef<string | undefined>,
  minValue?: MaybeRef<string | undefined>,
  onChange?: (value: string | null) => void,
  onOpenChange?: (isOpen: boolean) => void,
  value: Ref<string | null>
}

export interface DatePickerAria {
  buttonProps: ComputedRef<{
    'aria-controls': string,
    'aria-expanded': boolean,
    'aria-haspopup': 'dialog',
    'aria-label': string,
    disabled: boolean
  }>,
  calendarProps: ComputedRef<{
    id: string,
    max?: string,
    min?: string,
    role: 'dialog',
    value: string | null
  }>,
  close: () => void,
  descriptionProps: ComputedRef<{
    id: string
  }>,
  errorMessageProps: ComputedRef<{
    id: string
  }>,
  fieldProps: ComputedRef<{
    'aria-controls': string,
    'aria-expanded': boolean,
    disabled: boolean,
    max?: string,
    min?: string,
    readonly: boolean,
    required: boolean,
    type: 'date',
    value: string
  }>,
  groupProps: ComputedRef<{
    'aria-disabled'?: boolean,
    role: 'group'
  }>,
  isInvalid: ComputedRef<boolean>,
  isOpen: Ref<boolean>,
  labelProps: ComputedRef<{
    id: string
  }>,
  open: () => void,
  setValue: (value: string | null) => void,
  toggle: () => void,
  value: ComputedRef<string | null>
}

let datePickerCounter = 0;

export function useDatePicker(options: AriaDatePickerOptions): DatePickerAria {
  datePickerCounter += 1;
  let idBase = `vue-date-picker-${datePickerCounter}`;
  let calendarId = `${idBase}-calendar`;

  let isOpen = ref(Boolean(unref(options.defaultOpen)));
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let isRequired = computed(() => Boolean(unref(options.isRequired)));
  let minValue = computed(() => unref(options.minValue));
  let maxValue = computed(() => unref(options.maxValue));

  let value = computed(() => options.value.value);

  let setOpen = (nextOpen: boolean) => {
    isOpen.value = nextOpen;
    options.onOpenChange?.(nextOpen);
  };

  let open = () => {
    if (isDisabled.value || isReadOnly.value) {
      return;
    }

    setOpen(true);
  };

  let close = () => {
    setOpen(false);
  };

  let toggle = () => {
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  };

  let setValue = (nextValue: string | null) => {
    if (nextValue == null || nextValue.length === 0) {
      options.value.value = null;
      options.onChange?.(null);
      return;
    }

    let clampedValue = clampComparableValue(nextValue, minValue.value, maxValue.value);
    options.value.value = clampedValue;
    options.onChange?.(clampedValue);
  };

  let isInvalid = computed(() => {
    if (isRequired.value && value.value == null) {
      return true;
    }

    if (value.value == null) {
      return false;
    }

    return isValueOutOfRange(value.value, minValue.value, maxValue.value);
  });

  let groupProps = computed(() => ({
    role: 'group' as const,
    'aria-disabled': isDisabled.value || isReadOnly.value ? true : undefined
  }));

  let fieldProps = computed(() => ({
    type: 'date' as const,
    value: value.value ?? '',
    disabled: isDisabled.value,
    readonly: isReadOnly.value,
    required: isRequired.value,
    min: minValue.value,
    max: maxValue.value,
    'aria-controls': calendarId,
    'aria-expanded': isOpen.value
  }));

  let buttonProps = computed(() => ({
    disabled: isDisabled.value || isReadOnly.value,
    'aria-haspopup': 'dialog' as const,
    'aria-controls': calendarId,
    'aria-expanded': isOpen.value,
    'aria-label': 'Toggle calendar'
  }));

  let calendarProps = computed(() => ({
    id: calendarId,
    role: 'dialog' as const,
    value: value.value,
    min: minValue.value,
    max: maxValue.value
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
    buttonProps,
    calendarProps,
    close,
    descriptionProps,
    errorMessageProps,
    fieldProps,
    groupProps,
    isInvalid,
    isOpen,
    labelProps,
    open,
    setValue,
    toggle,
    value
  };
}
