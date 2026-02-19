export type {AriaDateFieldOptions, AriaTimeFieldOptions, DateFieldAria} from './useDateField';
export type {AriaDatePickerOptions, DatePickerAria} from './useDatePicker';
export type {AriaDateRangePickerOptions, DateRangePickerAria, DateRangeValue} from './useDateRangePicker';
export {useDateField, useTimeField} from './useDateField';
export {useDatePicker} from './useDatePicker';
export {useDateRangePicker} from './useDateRangePicker';

type AnyRecord = Record<string, unknown>;

export type AriaDateFieldProps = AnyRecord;
export type AriaDatePickerProps = AnyRecord;
export type AriaDateRangePickerProps = AnyRecord;
export type AriaTimeFieldProps = AnyRecord;
export type DateValue = string | number | Date;
export type TimeValue = string | number | Date;
export type DateRange = {
  start: DateValue,
  end: DateValue
};
export type DateSegmentAria = AnyRecord;

export function useDateSegment() {
  return {
    segmentProps: {}
  };
}

export function useDisplayNames() {
  return {
    displayNames: {}
  };
}
