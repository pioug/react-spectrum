import {cloneDate, endOfMonth, normalizeDateRange, startOfMonth} from './utils';
import {computed, type ComputedRef, type Ref, ref, watch} from 'vue';
import type {DateRange, RangeCalendarState} from './types';
import {useRangeCalendar} from '@vue-aria/calendar';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;
export type DateValue = string | number | Date;

type RangeValue<T> = {
  start: T | null,
  end: T | null
};

export interface RangeCalendarStateOptions<T extends DateValue = DateValue> {
  defaultFocusedValue?: T | null,
  defaultValue?: RangeValue<T>,
  isDisabled?: MaybeRef<boolean>,
  locale?: MaybeRef<string>,
  maxValue?: MaybeRef<T | null | undefined>,
  minValue?: MaybeRef<T | null | undefined>,
  onChange?: (value: RangeValue<T>) => void,
  onFocusChange?: (value: T) => void,
  value?: Ref<RangeValue<T> | undefined>
}

export function useRangeCalendarState<T extends DateValue = DateValue>(
  props: RangeCalendarStateOptions<T>
): RangeCalendarState<T> {
  let options = props ?? ({} as RangeCalendarStateOptions<T>);
  let internalValue = ref<DateRange>(normalizeDateRange(options.defaultValue as unknown as DateRange ?? {
    start: null,
    end: null
  }));
  let isControlled = computed(() => options.value !== undefined && options.value.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let valueRef = computed<DateRange>({
    get: () => {
      if (isControlled.value && options.value) {
        return normalizeDateRange(options.value.value as unknown as DateRange);
      }

      return normalizeDateRange(internalValue.value);
    },
    set: (nextValue) => {
      let normalized = normalizeDateRange(nextValue);
      if (isControlled.value && options.value) {
        options.value.value = normalized as unknown as RangeValue<T>;
      } else {
        internalValue.value = normalized;
      }
    }
  }) as Ref<DateRange>;

  let initialFocusedDate = options.defaultFocusedValue
    ?? valueRef.value.start
    ?? new Date();
  let focusedDate = ref(cloneDate(initialFocusedDate as unknown as Date));
  let isFocused = ref(false);
  let anchorDate = ref<Date | null>(null);
  let visibleDate = ref(startOfMonth(initialFocusedDate));

  let calendar = useRangeCalendar({
    isDisabled: options.isDisabled,
    locale: options.locale,
    maxValue: options.maxValue,
    minValue: options.minValue,
    value: valueRef,
    visibleDate
  });

  let value = computed(() => normalizeDateRange(valueRef.value));
  let highlightedRange = computed(() => normalizeDateRange(calendar.highlightedRange.value));
  let visibleRange = computed(() => ({
    start: startOfMonth(visibleDate.value),
    end: endOfMonth(visibleDate.value)
  }));

  let setValue = (nextValue: DateRange): void => {
    valueRef.value = normalizeDateRange(nextValue);
    options.onChange?.(normalizeDateRange(valueRef.value) as unknown as RangeValue<T>);
  };

  let setFocusedDate = (date: Date): void => {
    focusedDate.value = cloneDate(date);
    options.onFocusChange?.(cloneDate(focusedDate.value) as unknown as T);
  };

  let selectDate = (date: Date): void => {
    if (!valueRef.value.start || valueRef.value.end) {
      anchorDate.value = cloneDate(date);
    }

    calendar.selectDate(date);
    setFocusedDate(date);
    options.onChange?.(normalizeDateRange(valueRef.value) as unknown as RangeValue<T>);

    if (valueRef.value.start && valueRef.value.end) {
      anchorDate.value = null;
    }
  };

  return {
    value,
    setValue,
    anchorDate,
    highlightedRange,
    visibleRange,
    focusedDate,
    setFocusedDate,
    selectDate,
    selectFocusedDate: () => {
      selectDate(focusedDate.value);
    },
    isSelected: (date: Date) => {
      let range = highlightedRange.value;
      if (!range.start || !range.end) {
        return false;
      }

      return date >= range.start && date <= range.end;
    },
    isCellDisabled: (date: Date) => {
      return calendar.isDateDisabled(date);
    },
    isFocused,
    setFocused: (nextFocused: boolean) => {
      isFocused.value = nextFocused;
    }
  } as unknown as RangeCalendarState<T>;
}
