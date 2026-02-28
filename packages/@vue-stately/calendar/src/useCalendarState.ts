import {addDays, addMonths, cloneDate, endOfMonth, sameDay, startOfMonth} from './utils';
import type {CalendarState} from './types';
import {computed, type ComputedRef, type Ref, ref, watch} from 'vue';
import {useCalendar} from '@vue-aria/calendar';

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

export function useCalendarState<T extends DateValue = DateValue>(props: CalendarStateOptions<T>): CalendarState {
  let options = props ?? ({} as CalendarStateOptions<T>);
  let internalValue = ref<Date | null>(options.defaultValue ? cloneDate(options.defaultValue as unknown as Date) : null);
  let isControlled = computed(() => options.value !== undefined && options.value.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let valueRef = computed<Date | null>({
    get: () => {
      if (isControlled.value && options.value) {
        return options.value.value ? cloneDate(options.value.value as unknown as Date) : null;
      }

      return internalValue.value ? cloneDate(internalValue.value) : null;
    },
    set: (nextValue) => {
      if (isControlled.value && options.value) {
        options.value.value = nextValue ? cloneDate(nextValue) as unknown as T : null;
      } else {
        internalValue.value = nextValue ? cloneDate(nextValue) : null;
      }
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
    valueRef.value = nextValue ? cloneDate(nextValue) : null;
    options.onChange?.(valueRef.value ? cloneDate(valueRef.value) as unknown as T : null);
  };

  let setFocusedDate = (date: Date): void => {
    focusedDate.value = cloneDate(date);
    options.onFocusChange?.(cloneDate(focusedDate.value) as unknown as T);
  };

  let selectDate = (date: Date): void => {
    calendar.selectDate(date);
    setFocusedDate(date);
    options.onChange?.(valueRef.value ? cloneDate(valueRef.value) as unknown as T : null);
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
