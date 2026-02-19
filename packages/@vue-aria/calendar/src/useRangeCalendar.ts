import {addMonths, cloneDate, type DateRange, formatMonthLabel, isAfterDay, isBeforeDay, isSameMonth, startOfMonth} from './utils';
import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaRangeCalendarOptions {
  isDisabled?: MaybeRef<boolean>,
  locale?: MaybeRef<string>,
  maxValue?: MaybeRef<Date | null | undefined>,
  minValue?: MaybeRef<Date | null | undefined>,
  value?: Ref<DateRange>,
  visibleDate?: Ref<Date>
}

export interface RangeCalendarAria {
  calendarProps: ComputedRef<{
    'aria-disabled'?: boolean,
    'aria-label': string,
    role: 'group'
  }>,
  highlightedRange: ComputedRef<DateRange>,
  isDateDisabled: (date: Date) => boolean,
  nextPage: () => void,
  prevPage: () => void,
  selectDate: (date: Date) => void,
  visibleDate: Ref<Date>,
  visibleRangeLabel: ComputedRef<string>
}

function normalizeRange(range: DateRange): DateRange {
  return {
    start: range.start ? cloneDate(range.start) : null,
    end: range.end ? cloneDate(range.end) : null
  };
}

export function useRangeCalendar(options: AriaRangeCalendarOptions = {}): RangeCalendarAria {
  let internalVisibleDate = ref(startOfMonth(options.value?.value.start ?? new Date()));
  let visibleDate = options.visibleDate ?? internalVisibleDate;

  let internalRange = ref<DateRange>({
    start: options.value?.value.start ? cloneDate(options.value.value.start) : null,
    end: options.value?.value.end ? cloneDate(options.value.value.end) : null
  });

  let highlightedRange = computed(() => {
    if (options.value) {
      return normalizeRange(options.value.value);
    }

    return normalizeRange(internalRange.value);
  });

  let locale = computed(() => unref(options.locale) ?? 'en-US');
  let minValue = computed(() => unref(options.minValue));
  let maxValue = computed(() => unref(options.maxValue));
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));

  let isDateDisabled = (date: Date): boolean => {
    if (isDisabled.value) {
      return true;
    }

    let normalizedDate = cloneDate(date);
    if (minValue.value && isBeforeDay(normalizedDate, minValue.value)) {
      return true;
    }

    if (maxValue.value && isAfterDay(normalizedDate, maxValue.value)) {
      return true;
    }

    return false;
  };

  let setRange = (nextRange: DateRange) => {
    let normalizedRange = normalizeRange(nextRange);
    if (options.value) {
      options.value.value = normalizedRange;
      return;
    }

    internalRange.value = normalizedRange;
  };

  let selectDate = (date: Date) => {
    if (isDateDisabled(date)) {
      return;
    }

    let normalizedDate = cloneDate(date);
    let currentRange = highlightedRange.value;
    if (!currentRange.start || (currentRange.start && currentRange.end)) {
      setRange({
        start: normalizedDate,
        end: null
      });
    } else if (isBeforeDay(normalizedDate, currentRange.start)) {
      setRange({
        start: normalizedDate,
        end: currentRange.start
      });
    } else {
      setRange({
        start: currentRange.start,
        end: normalizedDate
      });
    }

    if (!isSameMonth(normalizedDate, visibleDate.value)) {
      visibleDate.value = startOfMonth(normalizedDate);
    }
  };

  let prevPage = () => {
    visibleDate.value = addMonths(visibleDate.value, -1);
  };

  let nextPage = () => {
    visibleDate.value = addMonths(visibleDate.value, 1);
  };

  let visibleRangeLabel = computed(() => formatMonthLabel(visibleDate.value, locale.value));
  let calendarProps = computed(() => ({
    role: 'group' as const,
    'aria-label': 'Range calendar',
    'aria-disabled': isDisabled.value || undefined
  }));

  return {
    calendarProps,
    highlightedRange,
    isDateDisabled,
    nextPage,
    prevPage,
    selectDate,
    visibleDate,
    visibleRangeLabel
  };
}
