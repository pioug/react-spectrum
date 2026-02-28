import {addMonths, cloneDate, formatMonthLabel, isAfterDay, isBeforeDay, isSameMonth, startOfMonth} from './utils';
import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';
import {useLabels} from '@vue-aria/utils';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface CalendarVisibleDuration {
  days?: number,
  months?: number,
  weeks?: number
}

export interface AriaCalendarOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  id?: MaybeRef<string | undefined>,
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
    'aria-label'?: string,
    'aria-labelledby'?: string,
    id?: string,
    role: 'application'
  }>,
  isDateDisabled: (date: Date) => boolean,
  nextPage: () => void,
  prevPage: () => void,
  selectDate: (date: Date) => void,
  selectedDate: ComputedRef<Date | null>,
  visibleDate: Ref<Date>,
  visibleRangeLabel: ComputedRef<string>
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
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
  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));
  let combinedAriaLabel = computed(() => [ariaLabel.value, visibleRangeLabel.value].filter(Boolean).join(', ') || undefined);
  let labelProps = computed(() => {
    return useLabels({
      id: resolveOptionalString(options.id),
      'aria-label': combinedAriaLabel.value,
      'aria-labelledby': ariaLabelledby.value
    });
  });
  let calendarProps = computed(() => ({
    role: 'application' as const,
    id: labelProps.value.id as string | undefined,
    'aria-label': labelProps.value['aria-label'],
    'aria-labelledby': labelProps.value['aria-labelledby'],
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
