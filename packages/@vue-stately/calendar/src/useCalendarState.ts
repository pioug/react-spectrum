import {addDays, addMonths, cloneDate, endOfMonth, sameDay, startOfMonth} from './utils';
import type {CalendarState} from './types';
import {computed, type ComputedRef, type Ref, ref} from 'vue';
import {useCalendar} from '@vue-aria/calendar';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface CalendarStateOptions {
  defaultFocusedValue?: Date | null,
  defaultValue?: Date | null,
  isDisabled?: MaybeRef<boolean>,
  locale?: MaybeRef<string>,
  maxValue?: MaybeRef<Date | null | undefined>,
  minValue?: MaybeRef<Date | null | undefined>,
  onChange?: (value: Date | null) => void,
  onFocusChange?: (value: Date) => void,
  value?: Ref<Date | null>
}

export function useCalendarState(options: CalendarStateOptions = {}): CalendarState {
  let internalValue = ref<Date | null>(options.defaultValue ? cloneDate(options.defaultValue) : null);
  let valueRef = options.value ?? internalValue;

  let initialFocusedDate = options.defaultFocusedValue
    ?? valueRef.value
    ?? new Date();
  let focusedDate = ref(cloneDate(initialFocusedDate));
  let isFocused = ref(false);
  let visibleDate = ref(startOfMonth(initialFocusedDate));

  let calendar = useCalendar({
    isDisabled: options.isDisabled,
    locale: options.locale,
    maxValue: options.maxValue,
    minValue: options.minValue,
    value: valueRef,
    visibleDate
  });

  let value = computed(() => valueRef.value ? cloneDate(valueRef.value) : null);
  let visibleRange = computed(() => ({
    start: startOfMonth(visibleDate.value),
    end: endOfMonth(visibleDate.value)
  }));

  let setValue = (nextValue: Date | null): void => {
    valueRef.value = nextValue ? cloneDate(nextValue) : null;
    options.onChange?.(valueRef.value ? cloneDate(valueRef.value) : null);
  };

  let setFocusedDate = (date: Date): void => {
    focusedDate.value = cloneDate(date);
    options.onFocusChange?.(cloneDate(focusedDate.value));
  };

  let selectDate = (date: Date): void => {
    calendar.selectDate(date);
    setFocusedDate(date);
    options.onChange?.(valueRef.value ? cloneDate(valueRef.value) : null);
  };

  return {
    value,
    setValue,
    visibleRange,
    focusedDate,
    setFocusedDate,
    focusNextDay: () => {
      setFocusedDate(addDays(focusedDate.value, 1));
    },
    focusPreviousDay: () => {
      setFocusedDate(addDays(focusedDate.value, -1));
    },
    focusNextPage: () => {
      calendar.nextPage();
      setFocusedDate(addMonths(focusedDate.value, 1));
    },
    focusPreviousPage: () => {
      calendar.prevPage();
      setFocusedDate(addMonths(focusedDate.value, -1));
    },
    selectFocusedDate: () => {
      selectDate(focusedDate.value);
    },
    selectDate,
    isSelected: (date: Date) => {
      return value.value ? sameDay(value.value, date) : false;
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
