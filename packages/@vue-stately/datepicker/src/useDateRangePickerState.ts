import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';
import {type DateRangeValue, useDateRangePicker} from '@vue-aria/datepicker';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;
export type DateValue = string | number | Date;

type TimeRangeValue = {
  end: string | null,
  start: string | null
};

export interface DateRangePickerState {
  dateRange: ComputedRef<DateRangeValue>,
  defaultValue: DateRangeValue,
  granularity: ComputedRef<'day'>,
  hasTime: ComputedRef<boolean>,
  isDisabled: ComputedRef<boolean>,
  isInvalid: ComputedRef<boolean>,
  isOpen: Ref<boolean>,
  isReadOnly: ComputedRef<boolean>,
  isRequired: ComputedRef<boolean>,
  timeRange: Ref<TimeRangeValue>,
  validationState: ComputedRef<'invalid' | null>,
  value: Ref<DateRangeValue>,
  close: () => void,
  formatValue: () => DateRangeValue | null,
  open: () => void,
  setDate: (part: 'start' | 'end', value: string | null) => void,
  setDateRange: (value: DateRangeValue) => void,
  setDateTime: (part: 'start' | 'end', value: string | null) => void,
  setOpen: (isOpen: boolean) => void,
  setTime: (part: 'start' | 'end', value: string | null) => void,
  setTimeRange: (value: TimeRangeValue) => void,
  setValue: (value: DateRangeValue) => void,
  toggle: () => void
}

function shouldCloseOnSelect(option: DateRangePickerStateOptions['shouldCloseOnSelect']): boolean {
  if (typeof option === 'function') {
    return option();
  }

  return option ?? true;
}

function cloneRange(value?: DateRangeValue): DateRangeValue {
  return {
    start: value?.start ?? null,
    end: value?.end ?? null
  };
}

export interface DateRangePickerStateOptions<T extends DateValue = DateValue> {
  defaultOpen?: MaybeRef<boolean>,
  defaultValue?: DateRangeValue,
  isDisabled?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  maxValue?: MaybeRef<string | undefined>,
  minValue?: MaybeRef<string | undefined>,
  onChange?: (value: DateRangeValue) => void,
  onOpenChange?: (isOpen: boolean) => void,
  shouldCloseOnSelect?: boolean | (() => boolean),
  value?: Ref<DateRangeValue | undefined>
}

export function useDateRangePickerState<T extends DateValue = DateValue>(props: DateRangePickerStateOptions<T>): DateRangePickerState {
  let options = props ?? ({} as DateRangePickerStateOptions<T>);
  let internalValue = ref(cloneRange(options.defaultValue));
  let isControlled = computed(() => options.value !== undefined && options.value.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let value = computed<DateRangeValue>({
    get: () => {
      if (isControlled.value && options.value) {
        return cloneRange(options.value.value);
      }

      return cloneRange(internalValue.value);
    },
    set: (nextValue) => {
      if (!isControlled.value) {
        internalValue.value = cloneRange(nextValue);
      }
    }
  }) as Ref<DateRangeValue>;
  let timeRange = ref<TimeRangeValue>({
    start: null,
    end: null
  });

  let aria = useDateRangePicker({
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

  let setOpen = (isOpen: boolean): void => {
    if (isOpen) {
      aria.open();
    } else {
      aria.close();
    }
  };

  let setValue = (nextValue: DateRangeValue): void => {
    aria.setRange(nextValue);
  };

  let setDateRange = (nextRange: DateRangeValue): void => {
    setValue(nextRange);
    if (shouldCloseOnSelect(options.shouldCloseOnSelect) && nextRange.start && nextRange.end) {
      aria.close();
    }
  };

  let setTimeRange = (nextRange: TimeRangeValue): void => {
    timeRange.value = {
      start: nextRange.start,
      end: nextRange.end
    };
  };

  let setDate = (part: 'start' | 'end', nextValue: string | null): void => {
    if (part === 'start') {
      aria.setStart(nextValue);
      return;
    }

    aria.setEnd(nextValue);
  };

  let setTime = (part: 'start' | 'end', nextValue: string | null): void => {
    if (part === 'start') {
      timeRange.value = {
        ...timeRange.value,
        start: nextValue
      };
      return;
    }

    timeRange.value = {
      ...timeRange.value,
      end: nextValue
    };
  };

  let setDateTime = (part: 'start' | 'end', nextValue: string | null): void => {
    setDate(part, nextValue);
  };

  return {
    value,
    defaultValue: cloneRange(options.defaultValue),
    dateRange: computed(() => value.value),
    timeRange,
    setValue,
    setDateRange,
    setTimeRange,
    setDate,
    setTime,
    setDateTime,
    granularity: computed(() => 'day' as const),
    hasTime: computed(() => false),
    isOpen: aria.isOpen,
    setOpen,
    open: aria.open,
    close: aria.close,
    toggle: aria.toggle,
    formatValue: () => {
      if (value.value.start == null && value.value.end == null) {
        return null;
      }

      return {
        start: value.value.start,
        end: value.value.end
      };
    },
    isInvalid: aria.isInvalid,
    validationState: computed(() => aria.isInvalid.value ? 'invalid' : null),
    isDisabled: computed(() => Boolean(unref(options.isDisabled))),
    isReadOnly: computed(() => Boolean(unref(options.isReadOnly))),
    isRequired: computed(() => Boolean(unref(options.isRequired)))
  };
}
