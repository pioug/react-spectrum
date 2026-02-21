import type {ComputedRef, Ref} from 'vue';

type DateValue = string | number | Date;

export interface DateRange {
  end: Date | null,
  start: Date | null
}

type RangeValue<T> = {
  end: T | null,
  start: T | null
};

export interface CalendarState {
  focusNextDay: () => void,
  focusNextPage: () => void,
  focusPreviousDay: () => void,
  focusPreviousPage: () => void,
  focusedDate: Ref<Date>,
  isCellDisabled: (date: Date) => boolean,
  isFocused: Ref<boolean>,
  isSelected: (date: Date) => boolean,
  selectDate: (date: Date) => void,
  selectFocusedDate: () => void,
  setFocused: (value: boolean) => void,
  setFocusedDate: (date: Date) => void,
  setValue: (value: Date | null) => void,
  value: ComputedRef<Date | null>,
  visibleRange: ComputedRef<{end: Date, start: Date}>
}

export interface RangeCalendarState<T extends DateValue = DateValue> {
  anchorDate: Ref<Date | null>,
  focusedDate: Ref<Date>,
  highlightedRange: ComputedRef<DateRange>,
  isCellDisabled: (date: Date) => boolean,
  isFocused: Ref<boolean>,
  isSelected: (date: Date) => boolean,
  selectDate: (date: Date) => void,
  selectFocusedDate: () => void,
  setFocused: (value: boolean) => void,
  setFocusedDate: (date: Date) => void,
  setValue: (value: RangeValue<T>) => void,
  value: ComputedRef<RangeValue<T>>,
  visibleRange: ComputedRef<{end: Date, start: Date}>
}
