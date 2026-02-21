import {
  type AriaDateFieldOptions,
  type AriaTimeFieldOptions,
  type DateFieldAria,
  useDateField as useDateFieldInternal,
  useTimeField as useTimeFieldInternal
} from './useDateField';
import {
  type AriaDatePickerOptions,
  type DatePickerAria,
  useDatePicker as useDatePickerInternal
} from './useDatePicker';
import {
  type AriaDateRangePickerOptions,
  type DateRangePickerAria,
  type DateRangeValue,
  useDateRangePicker as useDateRangePickerInternal
} from './useDateRangePicker';

type AnyRecord = Record<string, unknown>;
type RefObject<T> = {current: T};

export type DateValue = string | number | Date;
export type TimeValue = string | number | Date;
export type DateRange = {
  start: DateValue,
  end: DateValue
};
export type DateSegment = AnyRecord;
export type DateFieldState = AnyRecord;
export type TimeFieldState = AnyRecord;
export type DatePickerState = AnyRecord;
export type DateRangePickerState = AnyRecord;
export type DisplayNames = Record<string, string>;
export type DateSegmentAria = AnyRecord;

export type {AriaDateFieldOptions, AriaTimeFieldOptions, DateFieldAria};
export type {AriaDatePickerOptions, DatePickerAria};
export type {AriaDateRangePickerOptions, DateRangePickerAria, DateRangeValue};

export type AriaDateFieldProps<T extends DateValue = DateValue> = AriaDateFieldOptions;
export type AriaDatePickerProps<T extends DateValue = DateValue> = AriaDatePickerOptions;
export type AriaDateRangePickerProps<T extends DateValue = DateValue> = AriaDateRangePickerOptions;
export type AriaTimeFieldProps<T extends TimeValue = TimeValue> = AriaTimeFieldOptions;

export function useDateField<T extends DateValue>(
  props: AriaDateFieldOptions<T>,
  state: DateFieldState,
  ref: RefObject<Element | null>
): DateFieldAria;
export function useDateField(options: AriaDateFieldOptions): DateFieldAria;
export function useDateField(options: AriaDateFieldOptions): DateFieldAria {
  return useDateFieldInternal(options);
}

export function useTimeField<T extends TimeValue>(
  props: AriaTimeFieldOptions<T>,
  state: TimeFieldState,
  ref: RefObject<Element | null>
): DateFieldAria;
export function useTimeField(options: AriaTimeFieldOptions): DateFieldAria;
export function useTimeField(options: AriaTimeFieldOptions): DateFieldAria {
  return useTimeFieldInternal(options);
}

export function useDatePicker<T extends DateValue>(
  props: AriaDatePickerProps<T>,
  state: DatePickerState,
  ref: RefObject<Element | null>
): DatePickerAria;
export function useDatePicker(options: AriaDatePickerOptions): DatePickerAria;
export function useDatePicker(options: AriaDatePickerOptions): DatePickerAria {
  return useDatePickerInternal(options);
}

export function useDateRangePicker<T extends DateValue>(
  props: AriaDateRangePickerProps<T>,
  state: DateRangePickerState,
  ref: RefObject<Element | null>
): DateRangePickerAria;
export function useDateRangePicker(options: AriaDateRangePickerOptions): DateRangePickerAria;
export function useDateRangePicker(options: AriaDateRangePickerOptions): DateRangePickerAria {
  return useDateRangePickerInternal(options);
}

export function useDateSegment(
  segment: DateSegment,
  state: DateFieldState,
  ref: RefObject<HTMLElement | null>
): DateSegmentAria;
export function useDateSegment(): DateSegmentAria;
export function useDateSegment(): DateSegmentAria {
  return {
    segmentProps: {}
  };
}

export function useDisplayNames(): DisplayNames {
  return {};
}
