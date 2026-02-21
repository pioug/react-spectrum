import {type AriaCalendarCellOptions, type CalendarCellAria, useCalendarCell as useCalendarCellInternal} from './useCalendarCell';
import {type AriaCalendarGridOptions, type CalendarGridAria, useCalendarGrid as useCalendarGridInternal} from './useCalendarGrid';
import {type AriaCalendarOptions, type CalendarAria, useCalendar as useCalendarInternal} from './useCalendar';
import {type AriaRangeCalendarOptions, type RangeCalendarAria, useRangeCalendar as useRangeCalendarInternal} from './useRangeCalendar';
import type {CalendarState, RangeCalendarState} from '@vue-stately/calendar';
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
export function useCalendar(options?: AriaCalendarOptions): CalendarAria {
  return useCalendarInternal(options);
}

export function useRangeCalendar<T extends DateValue>(
  props: AriaRangeCalendarProps<T>,
  state: RangeCalendarState,
  ref: RefObject<FocusableElement | null>
): CalendarAria;
export function useRangeCalendar(options?: AriaRangeCalendarOptions): RangeCalendarAria;
export function useRangeCalendar(options?: AriaRangeCalendarOptions): CalendarAria | RangeCalendarAria {
  return useRangeCalendarInternal(options);
}

export function useCalendarGrid(props: AriaCalendarGridProps, state: CalendarState | RangeCalendarState): CalendarGridAria;
export function useCalendarGrid(options: AriaCalendarGridOptions): CalendarGridAria;
export function useCalendarGrid(options: AriaCalendarGridOptions): CalendarGridAria {
  return useCalendarGridInternal(options);
}

export function useCalendarCell(
  props: AriaCalendarCellProps,
  state: CalendarState | RangeCalendarState,
  ref: RefObject<HTMLElement | null>
): CalendarCellAria;
export function useCalendarCell(options: AriaCalendarCellOptions): CalendarCellAria;
export function useCalendarCell(options: AriaCalendarCellOptions): CalendarCellAria {
  return useCalendarCellInternal(options);
}
