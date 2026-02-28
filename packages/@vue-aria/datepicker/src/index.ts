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
import {computed, isRef, ref, type Ref} from 'vue';

type AnyRecord = Record<string, unknown>;
type RefObject<T> = {current: T};

function readMaybeRef<T>(value: unknown): T {
  if (isRef(value)) {
    return value.value as T;
  }

  return value as T;
}

function writeMaybeRef(record: AnyRecord, key: string, nextValue: unknown): void {
  let currentValue = record[key];
  if (isRef(currentValue)) {
    currentValue.value = nextValue;
    return;
  }

  record[key] = nextValue;
}

function createStringValueRef(stateRecord: AnyRecord): Ref<string> {
  let stateValue = stateRecord.value ?? stateRecord.inputValue;
  if (isRef(stateValue)) {
    return computed<string>({
      get: () => String(stateValue.value ?? ''),
      set: (nextValue) => {
        if (typeof stateRecord.setValue === 'function') {
          stateRecord.setValue(nextValue);
          return;
        }

        if (typeof stateRecord.setInputValue === 'function') {
          stateRecord.setInputValue(nextValue);
          return;
        }

        stateValue.value = nextValue;
      }
    }) as Ref<string>;
  }

  return ref('');
}

function createNullableStringValueRef(stateRecord: AnyRecord): Ref<string | null> {
  let stateValue = stateRecord.value ?? stateRecord.dateValue;
  if (isRef(stateValue)) {
    return computed<string | null>({
      get: () => {
        let value = stateValue.value;
        if (value == null) {
          return null;
        }

        return String(value);
      },
      set: (nextValue) => {
        if (typeof stateRecord.setValue === 'function') {
          stateRecord.setValue(nextValue);
          return;
        }

        if (typeof stateRecord.setDateValue === 'function') {
          stateRecord.setDateValue(nextValue);
          return;
        }

        stateValue.value = nextValue;
      }
    }) as Ref<string | null>;
  }

  return ref<string | null>(null);
}

function normalizeDateRangeValue(value: unknown): DateRangeValue {
  if (!value || typeof value !== 'object') {
    return {start: null, end: null};
  }

  let rangeRecord = value as AnyRecord;
  let start = rangeRecord.start;
  let end = rangeRecord.end;
  return {
    start: typeof start === 'string' ? start : null,
    end: typeof end === 'string' ? end : null
  };
}

function createDateRangeValueRef(stateRecord: AnyRecord): Ref<DateRangeValue> {
  let stateValue = stateRecord.value ?? stateRecord.dateRange;
  if (isRef(stateValue)) {
    return computed<DateRangeValue>({
      get: () => normalizeDateRangeValue(stateValue.value),
      set: (nextValue) => {
        let normalizedRange = normalizeDateRangeValue(nextValue);
        if (typeof stateRecord.setValue === 'function') {
          stateRecord.setValue(normalizedRange);
          return;
        }

        if (typeof stateRecord.setDateRange === 'function') {
          stateRecord.setDateRange(normalizedRange);
          return;
        }

        stateValue.value = normalizedRange;
      }
    }) as Ref<DateRangeValue>;
  }

  return ref<DateRangeValue>({start: null, end: null});
}

function setStateOpen(stateRecord: AnyRecord, nextOpen: boolean): void {
  if (typeof stateRecord.setOpen === 'function') {
    stateRecord.setOpen(nextOpen);
    return;
  }

  if (nextOpen && typeof stateRecord.open === 'function') {
    stateRecord.open();
    return;
  }

  if (!nextOpen && typeof stateRecord.close === 'function') {
    stateRecord.close();
    return;
  }

  if (typeof stateRecord.toggle === 'function') {
    stateRecord.toggle();
    return;
  }

  writeMaybeRef(stateRecord, 'isOpen', nextOpen);
}

function createDateFieldFromState(options: AriaDateFieldOptions, stateRecord: AnyRecord): DateFieldAria {
  return useDateFieldInternal({
    ...options,
    inputValue: options.inputValue ?? createStringValueRef(stateRecord),
    isDisabled: options.isDisabled ?? stateRecord.isDisabled,
    isReadOnly: options.isReadOnly ?? stateRecord.isReadOnly,
    isRequired: options.isRequired ?? stateRecord.isRequired
  });
}

function createTimeFieldFromState(options: AriaTimeFieldOptions, stateRecord: AnyRecord): DateFieldAria {
  return useTimeFieldInternal({
    ...options,
    inputValue: options.inputValue ?? createStringValueRef(stateRecord),
    isDisabled: options.isDisabled ?? stateRecord.isDisabled,
    isReadOnly: options.isReadOnly ?? stateRecord.isReadOnly,
    isRequired: options.isRequired ?? stateRecord.isRequired
  });
}

function createDatePickerFromState(options: AriaDatePickerOptions, stateRecord: AnyRecord): DatePickerAria {
  let onOpenChange = (isOpen: boolean) => {
    options.onOpenChange?.(isOpen);
    setStateOpen(stateRecord, isOpen);
  };

  return useDatePickerInternal({
    ...options,
    defaultOpen: options.defaultOpen ?? stateRecord.isOpen,
    isDisabled: options.isDisabled ?? stateRecord.isDisabled,
    isReadOnly: options.isReadOnly ?? stateRecord.isReadOnly,
    isRequired: options.isRequired ?? stateRecord.isRequired,
    onOpenChange,
    value: options.value ?? createNullableStringValueRef(stateRecord)
  });
}

function createDateRangePickerFromState(options: AriaDateRangePickerOptions, stateRecord: AnyRecord): DateRangePickerAria {
  let onOpenChange = (isOpen: boolean) => {
    options.onOpenChange?.(isOpen);
    setStateOpen(stateRecord, isOpen);
  };

  return useDateRangePickerInternal({
    ...options,
    defaultOpen: options.defaultOpen ?? stateRecord.isOpen,
    isDisabled: options.isDisabled ?? stateRecord.isDisabled,
    isReadOnly: options.isReadOnly ?? stateRecord.isReadOnly,
    isRequired: options.isRequired ?? stateRecord.isRequired,
    onOpenChange,
    value: options.value ?? createDateRangeValueRef(stateRecord)
  });
}

function isDateStateLike(value: unknown): value is AnyRecord {
  return Boolean(value && typeof value === 'object');
}

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
export function useDateField(
  options: AriaDateFieldOptions,
  state?: DateFieldState,
  refObject?: RefObject<Element | null>
): DateFieldAria {
  if (state && isDateStateLike(state)) {
    void refObject;
    return createDateFieldFromState(options, state as AnyRecord);
  }

  return useDateFieldInternal(options);
}

export function useTimeField<T extends TimeValue>(
  props: AriaTimeFieldOptions<T>,
  state: TimeFieldState,
  ref: RefObject<Element | null>
): DateFieldAria;
export function useTimeField(options: AriaTimeFieldOptions): DateFieldAria;
export function useTimeField(
  options: AriaTimeFieldOptions,
  state?: TimeFieldState,
  refObject?: RefObject<Element | null>
): DateFieldAria {
  if (state && isDateStateLike(state)) {
    void refObject;
    return createTimeFieldFromState(options, state as AnyRecord);
  }

  return useTimeFieldInternal(options);
}

export function useDatePicker<T extends DateValue>(
  props: AriaDatePickerProps<T>,
  state: DatePickerState,
  ref: RefObject<Element | null>
): DatePickerAria;
export function useDatePicker(options: AriaDatePickerOptions): DatePickerAria;
export function useDatePicker(
  options: AriaDatePickerOptions,
  state?: DatePickerState,
  refObject?: RefObject<Element | null>
): DatePickerAria {
  if (state && isDateStateLike(state)) {
    void refObject;
    return createDatePickerFromState(options, state as AnyRecord);
  }

  return useDatePickerInternal(options);
}

export function useDateRangePicker<T extends DateValue>(
  props: AriaDateRangePickerProps<T>,
  state: DateRangePickerState,
  ref: RefObject<Element | null>
): DateRangePickerAria;
export function useDateRangePicker(options: AriaDateRangePickerOptions): DateRangePickerAria;
export function useDateRangePicker(
  options: AriaDateRangePickerOptions,
  state?: DateRangePickerState,
  refObject?: RefObject<Element | null>
): DateRangePickerAria {
  if (state && isDateStateLike(state)) {
    void refObject;
    return createDateRangePickerFromState(options, state as AnyRecord);
  }

  return useDateRangePickerInternal(options);
}

export function useDateSegment(
  segment: DateSegment,
  state: DateFieldState,
  ref: RefObject<HTMLElement | null>
): DateSegmentAria;
export function useDateSegment(): DateSegmentAria;
export function useDateSegment(
  segment?: DateSegment,
  state?: DateFieldState,
  refObject?: RefObject<HTMLElement | null>
): DateSegmentAria {
  void segment;
  void state;
  void refObject;
  return {
    segmentProps: {}
  };
}

export function useDisplayNames(): DisplayNames {
  return {};
}
