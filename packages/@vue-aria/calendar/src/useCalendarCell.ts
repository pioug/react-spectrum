import type {CalendarAria} from './useCalendar';
import {cloneDate, isAfterDay, isBeforeDay, isSameDay, isSameMonth} from './utils';
import {computed, type ComputedRef, type Ref, unref} from 'vue';
import type {RangeCalendarAria} from './useRangeCalendar';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaCalendarCellOptions {
  calendar: CalendarAria | RangeCalendarAria,
  date: MaybeRef<Date>,
  visibleDate?: MaybeRef<Date>
}

export interface CalendarCellAria {
  buttonProps: ComputedRef<{
    disabled: boolean,
    onMouseDown: (event: MouseEvent) => void,
    onPointerDown: (event: PointerEvent) => void,
    tabindex: number
  }>,
  cellProps: ComputedRef<{
    'aria-disabled'?: boolean,
    'aria-selected': boolean,
    role: 'gridcell'
  }>,
  formattedDate: ComputedRef<string>,
  isDisabled: ComputedRef<boolean>,
  isOutsideVisibleRange: ComputedRef<boolean>,
  isSelected: ComputedRef<boolean>,
  press: () => void
}

function isRangeCalendar(calendar: CalendarAria | RangeCalendarAria): calendar is RangeCalendarAria {
  return 'highlightedRange' in calendar;
}

export function useCalendarCell(options: AriaCalendarCellOptions): CalendarCellAria {
  let date = computed(() => cloneDate(unref(options.date)));
  let visibleDate = computed(() => cloneDate(unref(options.visibleDate ?? options.calendar.visibleDate)));
  let isDisabled = computed(() => options.calendar.isDateDisabled(date.value));
  let isOutsideVisibleRange = computed(() => !isSameMonth(date.value, visibleDate.value));

  let isSelected = computed(() => {
    if (isRangeCalendar(options.calendar)) {
      let range = options.calendar.highlightedRange.value;
      if (!range.start) {
        return false;
      }

      if (!range.end) {
        return isSameDay(date.value, range.start);
      }

      return !isBeforeDay(date.value, range.start) && !isAfterDay(date.value, range.end);
    }

    let selectedDate = options.calendar.selectedDate.value;
    if (!selectedDate) {
      return false;
    }

    return isSameDay(date.value, selectedDate);
  });

  let cellProps = computed(() => ({
    role: 'gridcell' as const,
    'aria-selected': isSelected.value,
    'aria-disabled': isDisabled.value || undefined
  }));

  let buttonProps = computed(() => ({
    disabled: isDisabled.value,
    onMouseDown: (event: MouseEvent) => {
      event.preventDefault();
    },
    onPointerDown: (event: PointerEvent) => {
      event.preventDefault();
    },
    tabindex: isSelected.value ? 0 : -1
  }));

  let press = () => {
    if (isDisabled.value) {
      return;
    }

    options.calendar.selectDate(date.value);
  };

  let formattedDate = computed(() => String(date.value.getDate()));

  return {
    buttonProps,
    cellProps,
    formattedDate,
    isDisabled,
    isOutsideVisibleRange,
    isSelected,
    press
  };
}
