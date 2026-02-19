import type {ComputedRef, Ref} from 'vue';

export interface DateRange {
  end: Date | null,
  start: Date | null
}

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

export interface RangeCalendarState {
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
  setValue: (value: DateRange) => void,
  value: ComputedRef<DateRange>,
  visibleRange: ComputedRef<{end: Date, start: Date}>
}
