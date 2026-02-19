export type {AriaCalendarCellOptions, CalendarCellAria} from './useCalendarCell';
export type {AriaCalendarGridOptions, CalendarGridAria} from './useCalendarGrid';
export type {AriaCalendarOptions, CalendarAria} from './useCalendar';
export type {AriaRangeCalendarOptions, RangeCalendarAria} from './useRangeCalendar';
export type {DateRange} from './utils';
export {useCalendarCell} from './useCalendarCell';
export {useCalendarGrid} from './useCalendarGrid';
export {useCalendar} from './useCalendar';
export {useRangeCalendar} from './useRangeCalendar';

type AnyRecord = Record<string, unknown>;

export type DateValue = string | number | Date;
export type AriaCalendarProps = AnyRecord;
export type AriaRangeCalendarProps = AnyRecord;
export type CalendarProps<T = DateValue> = AnyRecord & {value?: T};
export type RangeCalendarProps<T = DateValue> = AnyRecord & {value?: {start: T, end: T}};
export type AriaCalendarGridProps = AnyRecord;
export type AriaCalendarCellProps = AnyRecord;
