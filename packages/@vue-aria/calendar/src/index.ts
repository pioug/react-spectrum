import {type AriaCalendarCellOptions, type CalendarCellAria, useCalendarCell as useCalendarCellInternal} from './useCalendarCell';
import {type AriaCalendarGridOptions, type CalendarGridAria, useCalendarGrid as useCalendarGridInternal} from './useCalendarGrid';
import {type AriaCalendarOptions, type CalendarAria, useCalendar as useCalendarInternal} from './useCalendar';
import {type AriaRangeCalendarOptions, type RangeCalendarAria, useRangeCalendar as useRangeCalendarInternal} from './useRangeCalendar';
import type {DateRange} from './utils';
import type {CalendarState, RangeCalendarState} from '@vue-stately/calendar';
import {computed, ref, type Ref, unref} from 'vue';
export type {DateRange} from './utils';

type AnyRecord = Record<string, unknown>;
type RefObject<T> = {
  current: T
};
type FocusableElement = Element;

export type DateValue = string | number | Date;
export type AriaCalendarProps<T = DateValue> = AnyRecord & {value?: T};
export type AriaRangeCalendarProps<T = DateValue> = AnyRecord & {value?: {start: T, end: T}};
export type CalendarProps<T = DateValue> = AnyRecord & {value?: T};
export type RangeCalendarProps<T = DateValue> = AnyRecord & {value?: {start: T, end: T}};
export type AriaCalendarGridProps = AnyRecord;
export type AriaCalendarCellProps = AnyRecord;

function isRefLike<T>(value: unknown): value is {value: T} {
  return Boolean(value) && typeof value === 'object' && 'value' in (value as AnyRecord);
}

function cloneDate(date: Date): Date {
  return new Date(date.getTime());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, amount: number): Date {
  let nextDate = cloneDate(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

function addMonths(date: Date, amount: number): Date {
  let nextDate = startOfMonth(date);
  nextDate.setMonth(nextDate.getMonth() + amount);
  return nextDate;
}

function readDateValue(value: unknown): Date | null {
  let resolvedValue = isRefLike<unknown>(value) ? value.value : value;
  if (!(resolvedValue instanceof Date)) {
    return null;
  }

  return cloneDate(resolvedValue);
}

function normalizeDateRange(value: unknown): DateRange {
  let resolvedValue = isRefLike<unknown>(value) ? value.value : value;
  if (!resolvedValue || typeof resolvedValue !== 'object') {
    return {
      start: null,
      end: null
    };
  }

  let rangeRecord = resolvedValue as AnyRecord;
  return {
    start: readDateValue(rangeRecord.start),
    end: readDateValue(rangeRecord.end)
  };
}

function getRecordValue(record: AnyRecord, key: string): unknown {
  let value = record[key];
  if (isRefLike<unknown>(value)) {
    return value.value;
  }

  return value;
}

function setRecordValue(record: AnyRecord, key: string, nextValue: unknown): void {
  let value = record[key];
  if (isRefLike<unknown>(value)) {
    value.value = nextValue;
    return;
  }

  record[key] = nextValue;
}

function callStateMethod(stateRecord: AnyRecord, methodName: string, ...args: unknown[]): boolean {
  let method = stateRecord[methodName];
  if (typeof method !== 'function') {
    return false;
  }

  method(...args);
  return true;
}

function getVisibleRange(stateRecord: AnyRecord): {start: Date, end: Date} | null {
  let visibleRange = getRecordValue(stateRecord, 'visibleRange');
  if (!visibleRange || typeof visibleRange !== 'object') {
    return null;
  }

  let rangeRecord = visibleRange as AnyRecord;
  let startDate = readDateValue(rangeRecord.start);
  let endDate = readDateValue(rangeRecord.end);
  if (!startDate || !endDate) {
    return null;
  }

  return {
    start: startDate,
    end: endDate
  };
}

function getVisibleDate(stateRecord: AnyRecord): Date | null {
  let visibleRange = getVisibleRange(stateRecord);
  if (visibleRange) {
    return cloneDate(visibleRange.start);
  }

  return readDateValue(getRecordValue(stateRecord, 'focusedDate'));
}

function createVisibleDateRef(value: unknown, stateRecord?: AnyRecord): Ref<Date> {
  if (isRefLike<Date>(value)) {
    return value as Ref<Date>;
  }

  let fallbackVisibleDate = readDateValue(value)
    ?? (stateRecord ? getVisibleDate(stateRecord) : null)
    ?? startOfMonth(new Date());
  let localVisibleDate = ref(startOfMonth(fallbackVisibleDate));
  if (!stateRecord) {
    return localVisibleDate;
  }

  return computed<Date>({
    get: () => {
      return getVisibleDate(stateRecord) ?? localVisibleDate.value;
    },
    set: (nextDate) => {
      localVisibleDate.value = startOfMonth(nextDate);
    }
  }) as unknown as Ref<Date>;
}

function createCalendarValueRef(stateRecord: AnyRecord): Ref<Date | null> {
  return computed<Date | null>({
    get: () => {
      return readDateValue(getRecordValue(stateRecord, 'value'));
    },
    set: (nextValue) => {
      let normalizedValue = nextValue ? cloneDate(nextValue) : null;
      if (callStateMethod(stateRecord, 'setValue', normalizedValue)) {
        return;
      }

      setRecordValue(stateRecord, 'value', normalizedValue);
    }
  }) as unknown as Ref<Date | null>;
}

function createRangeValueRef(stateRecord: AnyRecord): Ref<DateRange> {
  return computed<DateRange>({
    get: () => {
      return normalizeDateRange(getRecordValue(stateRecord, 'value'));
    },
    set: (nextValue) => {
      let normalizedValue = normalizeDateRange(nextValue);
      if (callStateMethod(stateRecord, 'setValue', normalizedValue)) {
        return;
      }

      setRecordValue(stateRecord, 'value', normalizedValue);
    }
  }) as unknown as Ref<DateRange>;
}

function createHighlightedRangeRef(stateRecord: AnyRecord): Ref<DateRange> {
  return computed<DateRange>(() => {
    let highlightedRange = getRecordValue(stateRecord, 'highlightedRange');
    if (highlightedRange !== undefined) {
      return normalizeDateRange(highlightedRange);
    }

    return normalizeDateRange(getRecordValue(stateRecord, 'value'));
  }) as unknown as Ref<DateRange>;
}

function isRangeCalendarStateRecord(stateRecord: AnyRecord): boolean {
  return 'highlightedRange' in stateRecord || 'anchorDate' in stateRecord;
}

function normalizeFirstDayOfWeek(value: unknown): number | undefined {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    let normalized = Math.trunc(value) % 7;
    return normalized < 0 ? normalized + 7 : normalized;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  let dayByName: Record<string, number> = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6
  };

  return dayByName[value.toLowerCase()];
}

function shiftFocusedDate(stateRecord: AnyRecord, dayOffset: number): void {
  let focusedDate = readDateValue(getRecordValue(stateRecord, 'focusedDate'));
  if (!focusedDate) {
    return;
  }

  let nextDate = addDays(focusedDate, dayOffset);
  if (callStateMethod(stateRecord, 'setFocusedDate', nextDate)) {
    return;
  }

  setRecordValue(stateRecord, 'focusedDate', nextDate);
}

function focusRangeBoundary(stateRecord: AnyRecord, boundary: 'start' | 'end'): void {
  let visibleRange = getVisibleRange(stateRecord);
  if (!visibleRange) {
    return;
  }

  let nextDate = boundary === 'start' ? visibleRange.start : visibleRange.end;
  if (callStateMethod(stateRecord, 'setFocusedDate', nextDate)) {
    return;
  }

  setRecordValue(stateRecord, 'focusedDate', nextDate);
}

function handleCalendarGridKeyDown(event: KeyboardEvent, stateRecord: AnyRecord): void {
  switch (event.key) {
    case 'Enter':
    case ' ':
    case 'Spacebar':
      event.preventDefault();
      callStateMethod(stateRecord, 'selectFocusedDate');
      break;
    case 'PageUp':
      event.preventDefault();
      event.stopPropagation();
      if (callStateMethod(stateRecord, 'focusPreviousSection', event.shiftKey)) {
        break;
      }

      if (event.shiftKey && callStateMethod(stateRecord, 'focusPreviousPage')) {
        break;
      }

      if (callStateMethod(stateRecord, 'focusPreviousRow')) {
        break;
      }

      if (callStateMethod(stateRecord, 'focusPreviousPage')) {
        break;
      }

      shiftFocusedDate(stateRecord, -7);
      break;
    case 'PageDown':
      event.preventDefault();
      event.stopPropagation();
      if (callStateMethod(stateRecord, 'focusNextSection', event.shiftKey)) {
        break;
      }

      if (event.shiftKey && callStateMethod(stateRecord, 'focusNextPage')) {
        break;
      }

      if (callStateMethod(stateRecord, 'focusNextRow')) {
        break;
      }

      if (callStateMethod(stateRecord, 'focusNextPage')) {
        break;
      }

      shiftFocusedDate(stateRecord, 7);
      break;
    case 'Home':
      event.preventDefault();
      event.stopPropagation();
      if (callStateMethod(stateRecord, 'focusSectionStart')) {
        break;
      }

      focusRangeBoundary(stateRecord, 'start');
      break;
    case 'End':
      event.preventDefault();
      event.stopPropagation();
      if (callStateMethod(stateRecord, 'focusSectionEnd')) {
        break;
      }

      focusRangeBoundary(stateRecord, 'end');
      break;
    case 'ArrowLeft':
      event.preventDefault();
      event.stopPropagation();
      if (callStateMethod(stateRecord, 'focusPreviousDay')) {
        break;
      }

      shiftFocusedDate(stateRecord, -1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      event.stopPropagation();
      if (callStateMethod(stateRecord, 'focusPreviousRow')) {
        break;
      }

      shiftFocusedDate(stateRecord, -7);
      break;
    case 'ArrowRight':
      event.preventDefault();
      event.stopPropagation();
      if (callStateMethod(stateRecord, 'focusNextDay')) {
        break;
      }

      shiftFocusedDate(stateRecord, 1);
      break;
    case 'ArrowDown':
      event.preventDefault();
      event.stopPropagation();
      if (callStateMethod(stateRecord, 'focusNextRow')) {
        break;
      }

      shiftFocusedDate(stateRecord, 7);
      break;
    case 'Escape':
      if (callStateMethod(stateRecord, 'setAnchorDate', null)) {
        break;
      }

      if (isRefLike<Date | null>(stateRecord.anchorDate)) {
        stateRecord.anchorDate.value = null;
      }
      break;
  }
}

export type {
  AriaCalendarCellOptions,
  CalendarCellAria,
  AriaCalendarGridOptions,
  CalendarGridAria,
  AriaCalendarOptions,
  CalendarAria,
  AriaRangeCalendarOptions,
  RangeCalendarAria
};

export function useCalendar<T extends DateValue>(props: AriaCalendarProps<T>, state: CalendarState): CalendarAria;
export function useCalendar(options?: AriaCalendarOptions): CalendarAria;
export function useCalendar(options?: AriaCalendarOptions, state?: CalendarState): CalendarAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    let optionsRecord = (options ?? {}) as AnyRecord;
    let visibleDate = createVisibleDateRef(optionsRecord.visibleDate, stateRecord);
    let calendar = useCalendarInternal({
      ...options,
      value: createCalendarValueRef(stateRecord),
      visibleDate
    });

    return {
      ...calendar,
      isDateDisabled: (date: Date) => {
        let isCellDisabled = stateRecord.isCellDisabled;
        if (typeof isCellDisabled === 'function') {
          return Boolean(isCellDisabled(date));
        }

        return calendar.isDateDisabled(date);
      },
      nextPage: () => {
        if (callStateMethod(stateRecord, 'focusNextPage')) {
          return;
        }

        if (callStateMethod(stateRecord, 'nextPage')) {
          return;
        }

        let nextVisibleDate = getVisibleDate(stateRecord);
        if (nextVisibleDate) {
          visibleDate.value = startOfMonth(addMonths(nextVisibleDate, 1));
          return;
        }

        calendar.nextPage();
      },
      prevPage: () => {
        if (callStateMethod(stateRecord, 'focusPreviousPage')) {
          return;
        }

        if (callStateMethod(stateRecord, 'prevPage')) {
          return;
        }

        let nextVisibleDate = getVisibleDate(stateRecord);
        if (nextVisibleDate) {
          visibleDate.value = startOfMonth(addMonths(nextVisibleDate, -1));
          return;
        }

        calendar.prevPage();
      },
      selectDate: (date: Date) => {
        let normalizedDate = cloneDate(date);
        if (callStateMethod(stateRecord, 'selectDate', normalizedDate)) {
          return;
        }

        calendar.selectDate(normalizedDate);
      },
      selectedDate: createCalendarValueRef(stateRecord),
      visibleDate
    };
  }

  return useCalendarInternal(options);
}

export function useRangeCalendar<T extends DateValue>(
  props: AriaRangeCalendarProps<T>,
  state: RangeCalendarState,
  ref: RefObject<FocusableElement | null>
): CalendarAria;
export function useRangeCalendar(options?: AriaRangeCalendarOptions): RangeCalendarAria;
export function useRangeCalendar(options?: AriaRangeCalendarOptions, state?: RangeCalendarState): CalendarAria | RangeCalendarAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    let optionsRecord = (options ?? {}) as AnyRecord;
    let visibleDate = createVisibleDateRef(optionsRecord.visibleDate, stateRecord);
    let rangeCalendar = useRangeCalendarInternal({
      ...options,
      value: createRangeValueRef(stateRecord),
      visibleDate
    });

    return {
      ...rangeCalendar,
      highlightedRange: createHighlightedRangeRef(stateRecord),
      isDateDisabled: (date: Date) => {
        let isCellDisabled = stateRecord.isCellDisabled;
        if (typeof isCellDisabled === 'function') {
          return Boolean(isCellDisabled(date));
        }

        return rangeCalendar.isDateDisabled(date);
      },
      nextPage: () => {
        if (callStateMethod(stateRecord, 'focusNextPage')) {
          return;
        }

        if (callStateMethod(stateRecord, 'nextPage')) {
          return;
        }

        let nextVisibleDate = getVisibleDate(stateRecord);
        if (nextVisibleDate) {
          visibleDate.value = startOfMonth(addMonths(nextVisibleDate, 1));
          return;
        }

        rangeCalendar.nextPage();
      },
      prevPage: () => {
        if (callStateMethod(stateRecord, 'focusPreviousPage')) {
          return;
        }

        if (callStateMethod(stateRecord, 'prevPage')) {
          return;
        }

        let nextVisibleDate = getVisibleDate(stateRecord);
        if (nextVisibleDate) {
          visibleDate.value = startOfMonth(addMonths(nextVisibleDate, -1));
          return;
        }

        rangeCalendar.prevPage();
      },
      selectDate: (date: Date) => {
        let normalizedDate = cloneDate(date);
        if (callStateMethod(stateRecord, 'selectDate', normalizedDate)) {
          return;
        }

        rangeCalendar.selectDate(normalizedDate);
      },
      visibleDate
    };
  }

  return useRangeCalendarInternal(options);
}

export function useCalendarGrid(props: AriaCalendarGridProps, state: CalendarState | RangeCalendarState): CalendarGridAria;
export function useCalendarGrid(options: AriaCalendarGridOptions): CalendarGridAria;
export function useCalendarGrid(
  options: AriaCalendarGridOptions,
  state?: CalendarState | RangeCalendarState
): CalendarGridAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    let optionsRecord = options as AnyRecord;
    let grid = useCalendarGridInternal({
      ...(optionsRecord as AriaCalendarGridOptions),
      firstDayOfWeek: normalizeFirstDayOfWeek(optionsRecord.firstDayOfWeek),
      visibleDate: createVisibleDateRef(optionsRecord.startDate ?? optionsRecord.visibleDate, stateRecord)
    });

    return {
      ...grid,
      gridProps: computed(() => {
        let existingGridProps = grid.gridProps.value as AnyRecord;
        return {
          ...existingGridProps,
          'aria-disabled': Boolean(unref(stateRecord.isDisabled as boolean | undefined)) || undefined,
          'aria-readonly': Boolean(unref(stateRecord.isReadOnly as boolean | undefined)) || undefined,
          'aria-multiselectable': isRangeCalendarStateRecord(stateRecord) || undefined,
          onKeyDown: (event: KeyboardEvent) => {
            let onKeyDown = existingGridProps.onKeyDown;
            if (typeof onKeyDown === 'function') {
              onKeyDown(event);
            }
            handleCalendarGridKeyDown(event, stateRecord);
          },
          onFocus: () => {
            callStateMethod(stateRecord, 'setFocused', true);
          },
          onBlur: () => {
            callStateMethod(stateRecord, 'setFocused', false);
          }
        };
      }),
      headerProps: computed(() => ({
        ...grid.headerProps.value,
        'aria-hidden': true
      }))
    };
  }

  return useCalendarGridInternal(options);
}

export function useCalendarCell(
  props: AriaCalendarCellProps,
  state: CalendarState | RangeCalendarState,
  ref: RefObject<HTMLElement | null>
): CalendarCellAria;
export function useCalendarCell(options: AriaCalendarCellOptions): CalendarCellAria;
export function useCalendarCell(
  options: AriaCalendarCellOptions,
  state?: CalendarState | RangeCalendarState,
  refObject?: RefObject<HTMLElement | null>
): CalendarCellAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    let optionsRecord = options as AnyRecord;
    let calendar = (
      isRangeCalendarStateRecord(stateRecord)
        ? useRangeCalendar({}, state as RangeCalendarState, (refObject as RefObject<FocusableElement | null> | undefined) ?? {current: null})
        : useCalendar({}, state as CalendarState)
    ) as CalendarAria | RangeCalendarAria;

    let calendarCell = useCalendarCellInternal({
      calendar,
      date: (optionsRecord.date as AriaCalendarCellOptions['date']) ?? new Date(),
      visibleDate: optionsRecord.visibleDate as AriaCalendarCellOptions['visibleDate']
    });

    let isOutsideMonth = Boolean(optionsRecord.isOutsideMonth);
    let isDisabled = Boolean(optionsRecord.isDisabled);
    if (!isOutsideMonth && !isDisabled) {
      return calendarCell;
    }

    return {
      ...calendarCell,
      buttonProps: computed(() => ({
        ...calendarCell.buttonProps.value,
        disabled: isDisabled || calendarCell.buttonProps.value.disabled
      })),
      cellProps: computed(() => ({
        ...calendarCell.cellProps.value,
        'aria-disabled': isDisabled || calendarCell.cellProps.value['aria-disabled'] || undefined
      })),
      isDisabled: computed(() => isDisabled || calendarCell.isDisabled.value),
      isOutsideVisibleRange: computed(() => isOutsideMonth || calendarCell.isOutsideVisibleRange.value),
      press: () => {
        if (isDisabled) {
          return;
        }

        calendarCell.press();
      }
    };
  }

  return useCalendarCellInternal(options);
}
