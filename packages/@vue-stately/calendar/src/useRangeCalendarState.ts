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

function areDatesEqual(left: Date | null, right: Date | null): boolean {
  if (left == null || right == null) {
    return left === right;
  }

  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

function areDateRangesEqual(left: DateRange, right: DateRange): boolean {
  return areDatesEqual(left.start, right.start) && areDatesEqual(left.end, right.end);
}

function buildRangeFromAnchor(anchor: Date, date: Date): DateRange {
  let anchorDate = cloneDate(anchor);
  let nextDate = cloneDate(date);
  if (nextDate < anchorDate) {
    return {
      start: nextDate,
      end: anchorDate
    };
  }

  return {
    start: anchorDate,
    end: nextDate
  };
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
      if (!isControlled.value) {
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
    let normalizedNextValue = normalizeDateRange(nextValue);
    let previousValue = normalizeDateRange(valueRef.value);
    if (areDateRangesEqual(previousValue, normalizedNextValue)) {
      return;
    }

    valueRef.value = normalizedNextValue;
    options.onChange?.(normalizeDateRange(normalizedNextValue) as unknown as RangeValue<T>);
  };

  let setFocusedDate = (date: Date): void => {
    focusedDate.value = cloneDate(date);
    options.onFocusChange?.(cloneDate(focusedDate.value) as unknown as T);
  };

  let selectDate = (date: Date): void => {
    if (calendar.isDateDisabled(date)) {
      return;
    }

    let nextDate = cloneDate(date);
    let previousValue = normalizeDateRange(valueRef.value);
    let nextValue: DateRange;
    let nextAnchorDate: Date | null;

    if (isControlled.value) {
      if (!anchorDate.value) {
        nextValue = {
          start: nextDate,
          end: null
        };
        nextAnchorDate = nextDate;
      } else {
        nextValue = buildRangeFromAnchor(anchorDate.value, nextDate);
        nextAnchorDate = null;
      }
    } else {
      if (!previousValue.start || previousValue.end) {
        nextAnchorDate = nextDate;
      } else {
        nextAnchorDate = anchorDate.value;
      }

      calendar.selectDate(nextDate);
      nextValue = normalizeDateRange(valueRef.value);
      if (nextValue.start && nextValue.end) {
        nextAnchorDate = null;
      }
    }

    anchorDate.value = nextAnchorDate ? cloneDate(nextAnchorDate) : null;
    setFocusedDate(nextDate);
    if (isControlled.value) {
      calendar.selectDate(nextDate);
    }

    if (areDateRangesEqual(previousValue, nextValue)) {
      return;
    }

    options.onChange?.(normalizeDateRange(nextValue) as unknown as RangeValue<T>);
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
