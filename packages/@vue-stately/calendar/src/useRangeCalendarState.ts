import {cloneDate, endOfMonth, normalizeDateRange, startOfMonth} from './utils';
import {computed, type ComputedRef, type Ref, ref} from 'vue';
import type {DateRange, RangeCalendarState} from './types';
import {useRangeCalendar} from '@vue-aria/calendar';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface RangeCalendarStateOptions {
  defaultFocusedValue?: Date | null,
  defaultValue?: DateRange,
  isDisabled?: MaybeRef<boolean>,
  locale?: MaybeRef<string>,
  maxValue?: MaybeRef<Date | null | undefined>,
  minValue?: MaybeRef<Date | null | undefined>,
  onChange?: (value: DateRange) => void,
  onFocusChange?: (value: Date) => void,
  value?: Ref<DateRange>
}

export function useRangeCalendarState(options: RangeCalendarStateOptions = {}): RangeCalendarState {
  let internalValue = ref<DateRange>(normalizeDateRange(options.defaultValue ?? {
    start: null,
    end: null
  }));
  let valueRef = options.value ?? internalValue;

  let initialFocusedDate = options.defaultFocusedValue
    ?? valueRef.value.start
    ?? new Date();
  let focusedDate = ref(cloneDate(initialFocusedDate));
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
    options.onChange?.(normalizeDateRange(valueRef.value));
  };

  let setFocusedDate = (date: Date): void => {
    focusedDate.value = cloneDate(date);
    options.onFocusChange?.(cloneDate(focusedDate.value));
  };

  let selectDate = (date: Date): void => {
    if (!valueRef.value.start || valueRef.value.end) {
      anchorDate.value = cloneDate(date);
    }

    calendar.selectDate(date);
    setFocusedDate(date);
    options.onChange?.(normalizeDateRange(valueRef.value));

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
  };
}
