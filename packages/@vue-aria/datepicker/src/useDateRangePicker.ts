import {clampComparableValue, isValueOutOfRange} from './dateUtils';
import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type DateRangeValue = {
  end: string | null,
  start: string | null
};

export interface AriaDateRangePickerOptions {
  defaultOpen?: MaybeRef<boolean>,
  isDisabled?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  maxValue?: MaybeRef<string | undefined>,
  minValue?: MaybeRef<string | undefined>,
  onChange?: (value: DateRangeValue) => void,
  onOpenChange?: (isOpen: boolean) => void,
  value: Ref<DateRangeValue>
}

export interface DateRangePickerAria {
  buttonProps: ComputedRef<{
    'aria-controls': string,
    'aria-expanded': boolean,
    'aria-haspopup': 'dialog',
    'aria-label': string,
    disabled: boolean
  }>,
  calendarProps: ComputedRef<{
    end: string | null,
    id: string,
    max?: string,
    min?: string,
    role: 'dialog',
    start: string | null
  }>,
  close: () => void,
  descriptionProps: ComputedRef<{
    id: string
  }>,
  endFieldProps: ComputedRef<{
    disabled: boolean,
    max?: string,
    min?: string,
    readonly: boolean,
    required: boolean,
    type: 'date',
    value: string
  }>,
  errorMessageProps: ComputedRef<{
    id: string
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
  setEnd: (value: string | null) => void,
  setRange: (value: DateRangeValue) => void,
  setStart: (value: string | null) => void,
  startFieldProps: ComputedRef<{
    disabled: boolean,
    max?: string,
    min?: string,
    readonly: boolean,
    required: boolean,
    type: 'date',
    value: string
  }>,
  toggle: () => void,
  value: ComputedRef<DateRangeValue>
}

let dateRangePickerCounter = 0;

function normalizeDateValue(value: string | null, minValue?: string, maxValue?: string): string | null {
  if (value == null || value.length === 0) {
    return null;
  }

  return clampComparableValue(value, minValue, maxValue);
}

function normalizeRangeValue(range: DateRangeValue, minValue?: string, maxValue?: string): DateRangeValue {
  let start = normalizeDateValue(range.start, minValue, maxValue);
  let end = normalizeDateValue(range.end, minValue, maxValue);

  if (start != null && end != null && start > end) {
    end = start;
  }

  return {
    end,
    start
  };
}

export function useDateRangePicker(options: AriaDateRangePickerOptions): DateRangePickerAria {
  dateRangePickerCounter += 1;
  let idBase = `vue-date-range-picker-${dateRangePickerCounter}`;
  let calendarId = `${idBase}-calendar`;

  let isOpen = ref(Boolean(unref(options.defaultOpen)));
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let isRequired = computed(() => Boolean(unref(options.isRequired)));
  let minValue = computed(() => unref(options.minValue));
  let maxValue = computed(() => unref(options.maxValue));

  let value = computed(() => options.value.value);

  let setOpen = (nextOpen: boolean) => {
    if (isOpen.value === nextOpen) {
      return;
    }

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

  let setRange = (nextRange: DateRangeValue) => {
    let normalizedRange = normalizeRangeValue(nextRange, minValue.value, maxValue.value);
    if (
      options.value.value.start === normalizedRange.start
      && options.value.value.end === normalizedRange.end
    ) {
      return;
    }

    options.value.value = normalizedRange;
    options.onChange?.(normalizedRange);
  };

  let setStart = (start: string | null) => {
    setRange({
      end: value.value.end,
      start
    });
  };

  let setEnd = (end: string | null) => {
    setRange({
      end,
      start: value.value.start
    });
  };

  let isInvalid = computed(() => {
    if (isRequired.value && (value.value.start == null || value.value.end == null)) {
      return true;
    }

    if (value.value.start != null && value.value.end != null && value.value.start > value.value.end) {
      return true;
    }

    if (value.value.start != null && isValueOutOfRange(value.value.start, minValue.value, maxValue.value)) {
      return true;
    }

    if (value.value.end != null && isValueOutOfRange(value.value.end, minValue.value, maxValue.value)) {
      return true;
    }

    return false;
  });

  let groupProps = computed(() => ({
    role: 'group' as const,
    'aria-disabled': isDisabled.value || isReadOnly.value ? true : undefined
  }));

  let startFieldProps = computed(() => ({
    type: 'date' as const,
    value: value.value.start ?? '',
    disabled: isDisabled.value,
    readonly: isReadOnly.value,
    required: isRequired.value,
    min: minValue.value,
    max: maxValue.value
  }));

  let endFieldProps = computed(() => ({
    type: 'date' as const,
    value: value.value.end ?? '',
    disabled: isDisabled.value,
    readonly: isReadOnly.value,
    required: isRequired.value,
    min: minValue.value,
    max: maxValue.value
  }));

  let buttonProps = computed(() => ({
    disabled: isDisabled.value || isReadOnly.value,
    'aria-haspopup': 'dialog' as const,
    'aria-controls': calendarId,
    'aria-expanded': isOpen.value,
    'aria-label': 'Toggle range calendar'
  }));

  let calendarProps = computed(() => ({
    id: calendarId,
    role: 'dialog' as const,
    start: value.value.start,
    end: value.value.end,
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
    endFieldProps,
    errorMessageProps,
    groupProps,
    isInvalid,
    isOpen,
    labelProps,
    open,
    setEnd,
    setRange,
    setStart,
    startFieldProps,
    toggle,
    value
  };
}
