import {useCalendarState as useCalendarStateInternal, type CalendarStateOptions as VueCalendarStateOptions} from './useCalendarState';
import {useRangeCalendarState as useRangeCalendarStateInternal, type RangeCalendarStateOptions as VueRangeCalendarStateOptions} from './useRangeCalendarState';
import type {CalendarState, DateRange, RangeCalendarState as VueRangeCalendarState} from './types';

export type DateValue = string | number | Date;
export type CalendarStateOptions<T extends DateValue = DateValue> = VueCalendarStateOptions;
export type RangeCalendarStateOptions<T extends DateValue = DateValue> = VueRangeCalendarStateOptions;
export type RangeCalendarState<T extends DateValue = DateValue> = VueRangeCalendarState;
export type {CalendarState, DateRange};

export function useCalendarState<T extends DateValue = DateValue>(props: CalendarStateOptions<T>): CalendarState;
export function useCalendarState(options?: VueCalendarStateOptions): CalendarState;
export function useCalendarState(options?: VueCalendarStateOptions): CalendarState {
  return useCalendarStateInternal(options);
}

export function useRangeCalendarState<T extends DateValue = DateValue>(props: RangeCalendarStateOptions<T>): RangeCalendarState<T>;
export function useRangeCalendarState(options?: VueRangeCalendarStateOptions): VueRangeCalendarState;
export function useRangeCalendarState(options?: VueRangeCalendarStateOptions): VueRangeCalendarState {
  return useRangeCalendarStateInternal(options);
}
