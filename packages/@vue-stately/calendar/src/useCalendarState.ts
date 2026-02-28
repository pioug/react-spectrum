import {addDays, addMonths, cloneDate, endOfMonth, sameDay, startOfMonth} from './utils';
import type {CalendarState} from './types';
import {computed, type ComputedRef, type Ref, ref} from 'vue';
import {useCalendar} from '@vue-aria/calendar';
import {useControlledState} from '@vue-stately/utils';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;
export type DateValue = string | number | Date;

export interface CalendarStateOptions<T extends DateValue = DateValue> {
  defaultFocusedValue?: T | null,
  defaultValue?: T | null,
  isDisabled?: MaybeRef<boolean>,
  locale?: MaybeRef<string>,
  maxValue?: MaybeRef<T | null | undefined>,
  minValue?: MaybeRef<T | null | undefined>,
  onChange?: (value: T | null) => void,
  onFocusChange?: (value: T) => void,
  value?: Ref<T | null | undefined>
}

function areDatesEqual(left: Date | null, right: Date | null): boolean {
  if (left == null || right == null) {
    return left === right;
  }

  return sameDay(left, right);
}

export function useCalendarState<T extends DateValue = DateValue>(props: CalendarStateOptions<T>): CalendarState {
  let options = props ?? ({} as CalendarStateOptions<T>);
  let defaultValue = options.defaultValue ? cloneDate(options.defaultValue as unknown as Date) : null;
  let controlledValue = computed<Date | null | undefined>(() => {
    if (options.value?.value === undefined) {
      return undefined;
    }

    return options.value.value ? cloneDate(options.value.value as unknown as Date) : null;
  });
  let [controlledDateValue, setControlledDateValue] = useControlledState<Date | null, T | null>(
    controlledValue,
    defaultValue,
    (nextValue) => {
      options.onChange?.(nextValue ? cloneDate(nextValue) as unknown as T : null);
    }
  );
  let valueRef = computed<Date | null>({
    get: () => controlledDateValue.value ? cloneDate(controlledDateValue.value) : null,
    set: (nextValue) => {
      setControlledDateValue(nextValue ? cloneDate(nextValue) : null);
    }
  }) as Ref<Date | null>;

  let initialFocusedDate = options.defaultFocusedValue
    ?? valueRef.value
    ?? new Date();
  let focusedDate = ref(cloneDate(initialFocusedDate as unknown as Date));
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
    let normalizedNextValue = nextValue ? cloneDate(nextValue) : null;
    let previousValue = valueRef.value ? cloneDate(valueRef.value) : null;
    if (areDatesEqual(previousValue, normalizedNextValue)) {
      return;
    }

    valueRef.value = normalizedNextValue ? cloneDate(normalizedNextValue) : null;
  };

  let setFocusedDate = (date: Date): void => {
    focusedDate.value = cloneDate(date);
    options.onFocusChange?.(cloneDate(focusedDate.value) as unknown as T);
  };

  let selectDate = (date: Date): void => {
    if (calendar.isDateDisabled(date)) {
      return;
    }

    let previousValue = valueRef.value ? cloneDate(valueRef.value) : null;
    let nextValue = cloneDate(date);
    setFocusedDate(nextValue);
    if (areDatesEqual(previousValue, nextValue)) {
      return;
    }

    calendar.selectDate(nextValue);
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
