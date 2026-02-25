import {addMonths, cloneDate, formatMonthLabel, isAfterDay, isBeforeDay, isSameMonth, startOfMonth} from './utils';
import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface CalendarVisibleDuration {
  days?: number,
  months?: number,
  weeks?: number
}

export interface AriaCalendarOptions {
  isDisabled?: MaybeRef<boolean>,
  locale?: MaybeRef<string>,
  maxValue?: MaybeRef<Date | null | undefined>,
  minValue?: MaybeRef<Date | null | undefined>,
  pageBehavior?: MaybeRef<'single' | 'visible'>,
  value?: Ref<Date | null>,
  visibleDuration?: MaybeRef<CalendarVisibleDuration | undefined>,
  visibleDate?: Ref<Date>
}

export interface CalendarAria {
  calendarProps: ComputedRef<{
    'aria-disabled'?: boolean,
    'aria-label': string,
    role: 'group'
  }>,
  isDateDisabled: (date: Date) => boolean,
  nextPage: () => void,
  prevPage: () => void,
  selectDate: (date: Date) => void,
  selectedDate: ComputedRef<Date | null>,
  visibleDate: Ref<Date>,
  visibleRangeLabel: ComputedRef<string>
}

export function useCalendar(options: AriaCalendarOptions = {}): CalendarAria {
  let internalVisibleDate = ref(startOfMonth(options.value?.value ?? new Date()));
  let visibleDate = options.visibleDate ?? internalVisibleDate;

  let internalSelectedDate = ref<Date | null>(options.value?.value ? cloneDate(options.value.value) : null);
  let selectedDate = computed(() => options.value?.value ?? internalSelectedDate.value);

  let locale = computed(() => unref(options.locale) ?? 'en-US');
  let minValue = computed(() => unref(options.minValue));
  let maxValue = computed(() => unref(options.maxValue));
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let pageBehavior = computed(() => unref(options.pageBehavior) ?? 'visible');
  let visibleDuration = computed(() => unref(options.visibleDuration));
  let pageMonths = computed(() => {
    if (pageBehavior.value === 'single') {
      return 1;
    }

    let visibleMonths = visibleDuration.value?.months;
    if (typeof visibleMonths === 'number' && visibleMonths > 1) {
      return visibleMonths;
    }

    return 1;
  });

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

  let setSelectedDate = (date: Date | null) => {
    if (options.value) {
      options.value.value = date ? cloneDate(date) : null;
      return;
    }

    internalSelectedDate.value = date ? cloneDate(date) : null;
  };

  let selectDate = (date: Date) => {
    if (isDateDisabled(date)) {
      return;
    }

    let normalizedDate = cloneDate(date);
    setSelectedDate(normalizedDate);
    if (!isSameMonth(normalizedDate, visibleDate.value)) {
      visibleDate.value = startOfMonth(normalizedDate);
    }
  };

  let prevPage = () => {
    visibleDate.value = addMonths(visibleDate.value, -pageMonths.value);
  };

  let nextPage = () => {
    visibleDate.value = addMonths(visibleDate.value, pageMonths.value);
  };

  let visibleRangeLabel = computed(() => formatMonthLabel(visibleDate.value, locale.value));
  let calendarProps = computed(() => ({
    role: 'group' as const,
    'aria-label': 'Calendar',
    'aria-disabled': isDisabled.value || undefined
  }));

  return {
    calendarProps,
    isDateDisabled,
    nextPage,
    prevPage,
    selectDate,
    selectedDate,
    visibleDate,
    visibleRangeLabel
  };
}
