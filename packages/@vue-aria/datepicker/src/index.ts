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
import {useLocale} from '@vue-aria/i18n';
import {type SpinButtonAria, useSpinButton} from '@vue-aria/spinbutton';
import {mergeProps, useLabels} from '@vue-aria/utils';
import {computed, isRef, ref, type Ref} from 'vue';

type AnyRecord = Record<string, unknown>;
type RefObject<T> = {current: T};
type DateSegmentType = 'day' | 'dayPeriod' | 'era' | 'hour' | 'literal' | 'minute' | 'month' | 'second' | 'timeZoneName' | 'year';
type DateSegmentLike = {
  isEditable?: boolean | Ref<boolean>,
  isPlaceholder?: boolean | Ref<boolean>,
  maxValue?: number | Ref<number | undefined>,
  minValue?: number | Ref<number | undefined>,
  placeholder?: string | Ref<string | undefined>,
  text?: string | Ref<string | undefined>,
  type?: DateSegmentType | Ref<DateSegmentType>,
  value?: number | null | Ref<number | null | undefined>
};
type DateSegmentAriaProps = {
  [key: string]: unknown
};

const NUMERIC_SEGMENT_TYPES = new Set<DateSegmentType>(['day', 'hour', 'minute', 'month', 'second', 'year']);
const FALLBACK_DATE_FIELD_LABELS: Record<string, string> = {
  day: 'day',
  dayPeriod: 'AM/PM',
  era: 'era',
  hour: 'hour',
  literal: '',
  minute: 'minute',
  month: 'month',
  second: 'second',
  timeZoneName: 'time zone',
  year: 'year'
};

function readMaybeRef<T>(value: unknown): T {
  if (isRef(value)) {
    return value.value as T;
  }

  return value as T;
}

function readBoolean(value: unknown): boolean {
  return Boolean(readMaybeRef<boolean>(value));
}

function readOptionalNumber(value: unknown): number | undefined {
  let resolvedValue = readMaybeRef<number | undefined>(value);
  if (typeof resolvedValue !== 'number' || Number.isNaN(resolvedValue)) {
    return undefined;
  }

  return resolvedValue;
}

function readOptionalString(value: unknown): string | undefined {
  let resolvedValue = readMaybeRef<string | undefined>(value);
  if (typeof resolvedValue !== 'string' || resolvedValue.length === 0) {
    return undefined;
  }

  return resolvedValue;
}

function readSegmentType(segmentRecord: DateSegmentLike): DateSegmentType {
  let segmentType = readMaybeRef<DateSegmentType | undefined>(segmentRecord.type);
  if (!segmentType) {
    return 'literal';
  }

  return segmentType;
}

function callStateMethod(stateRecord: AnyRecord, method: string, ...args: unknown[]): boolean {
  let callback = stateRecord[method];
  if (typeof callback !== 'function') {
    return false;
  }

  callback(...args);
  return true;
}

function callSegmentStateMethod(stateRecord: AnyRecord, method: string, segmentType: DateSegmentType): boolean {
  let callback = stateRecord[method];
  if (typeof callback !== 'function') {
    return false;
  }

  if (callback.length >= 1) {
    callback(segmentType);
    return true;
  }

  callback();
  return true;
}

function isSegmentReadOnly(stateRecord: AnyRecord, segmentRecord: DateSegmentLike): boolean {
  return readBoolean(stateRecord.isReadOnly) || !readBoolean(segmentRecord.isEditable ?? true);
}

function getSegmentText(segmentRecord: DateSegmentLike): string {
  let text = readOptionalString(segmentRecord.text);
  if (text != null) {
    return text;
  }

  let value = readMaybeRef<unknown>(segmentRecord.value);
  if (value == null) {
    return '';
  }

  return String(value);
}

function getSegmentDisplayName(displayNames: DisplayNames, segmentType: string): string {
  return displayNames.of(segmentType) ?? FALLBACK_DATE_FIELD_LABELS[segmentType] ?? segmentType;
}

function toSegmentValue(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
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
export type DisplayNames = {
  of: (field: string) => string | undefined
};
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
  let segmentRecord = (segment ?? {}) as DateSegmentLike;
  let stateRecord = (state ?? {}) as AnyRecord;
  let segmentType = readSegmentType(segmentRecord);

  if (segmentType === 'literal') {
    return {
      segmentProps: computed(() => ({
        'aria-hidden': true
      }))
    };
  }

  let displayNames = useDisplayNames();
  let {direction} = useLocale();
  let enteredKeys = ref('');

  let spinButton = useSpinButton({
    isDisabled: computed(() => readBoolean(stateRecord.isDisabled)),
    isReadOnly: computed(() => isSegmentReadOnly(stateRecord, segmentRecord)),
    isRequired: computed(() => readBoolean(stateRecord.isRequired)),
    maxValue: computed(() => readOptionalNumber(segmentRecord.maxValue)),
    minValue: computed(() => readOptionalNumber(segmentRecord.minValue)),
    onDecrement: () => {
      enteredKeys.value = '';
      if (!callSegmentStateMethod(stateRecord, 'decrement', segmentType)) {
        callStateMethod(stateRecord, 'decrement');
      }
    },
    onDecrementPage: () => {
      enteredKeys.value = '';
      if (!callSegmentStateMethod(stateRecord, 'decrementPage', segmentType)) {
        callStateMethod(stateRecord, 'decrementPage');
      }
    },
    onDecrementToMin: () => {
      enteredKeys.value = '';
      if (!callSegmentStateMethod(stateRecord, 'decrementToMin', segmentType)) {
        callStateMethod(stateRecord, 'decrementToMin');
      }
    },
    onIncrement: () => {
      enteredKeys.value = '';
      if (!callSegmentStateMethod(stateRecord, 'increment', segmentType)) {
        callStateMethod(stateRecord, 'increment');
      }
    },
    onIncrementPage: () => {
      enteredKeys.value = '';
      if (!callSegmentStateMethod(stateRecord, 'incrementPage', segmentType)) {
        callStateMethod(stateRecord, 'incrementPage');
      }
    },
    onIncrementToMax: () => {
      enteredKeys.value = '';
      if (!callSegmentStateMethod(stateRecord, 'incrementToMax', segmentType)) {
        callStateMethod(stateRecord, 'incrementToMax');
      }
    },
    textValue: computed(() => readBoolean(segmentRecord.isPlaceholder) ? '' : getSegmentText(segmentRecord)),
    value: computed(() => readOptionalNumber(segmentRecord.value))
  });

  let ariaLabel = readOptionalString(stateRecord.ariaLabel) ?? readOptionalString(stateRecord['aria-label']);
  let ariaLabelledBy = readOptionalString(stateRecord.ariaLabelledBy) ?? readOptionalString(stateRecord['aria-labelledby']);
  let segmentName = getSegmentDisplayName(displayNames, segmentType);
  let labelProps = useLabels({
    'aria-label': `${segmentName}${ariaLabel ? `, ${ariaLabel}` : ''}${ariaLabelledBy ? ', ' : ''}`,
    'aria-labelledby': ariaLabelledBy
  });

  let backspace = () => {
    let text = getSegmentText(segmentRecord);
    let placeholder = readOptionalString(segmentRecord.placeholder);
    if (placeholder && text === placeholder) {
      callStateMethod(stateRecord, 'focusPrevious');
    }

    if (callStateMethod(stateRecord, 'clearSegment', segmentType)) {
      enteredKeys.value = '';
      return;
    }

    let nextText = text.slice(0, -1);
    let parsed = Number.parseInt(nextText, 10);
    if (nextText.length === 0 || !Number.isFinite(parsed) || parsed === 0) {
      if (!callStateMethod(stateRecord, 'clearSegment', segmentType)) {
        callStateMethod(stateRecord, 'setSegment', segmentType, 0);
      }
      enteredKeys.value = '';
      return;
    }

    if (callStateMethod(stateRecord, 'setSegment', segmentType, parsed)) {
      enteredKeys.value = nextText;
    }
  };

  let onInput = (data: string) => {
    if (!NUMERIC_SEGMENT_TYPES.has(segmentType) || readBoolean(stateRecord.isDisabled) || isSegmentReadOnly(stateRecord, segmentRecord)) {
      return;
    }

    if (!/^[0-9]$/.test(data)) {
      return;
    }

    let rawValue = `${enteredKeys.value}${data}`;
    let nextValue = Number.parseInt(rawValue, 10);
    if (!Number.isFinite(nextValue)) {
      return;
    }

    let segmentMaxValue = readOptionalNumber(segmentRecord.maxValue);
    if (segmentMaxValue != null && nextValue > segmentMaxValue) {
      rawValue = data;
      nextValue = Number.parseInt(rawValue, 10);
      if (!Number.isFinite(nextValue)) {
        return;
      }
    }

    if (!callStateMethod(stateRecord, 'setSegment', segmentType, toSegmentValue(nextValue))) {
      return;
    }

    let shouldCommitAndMove = segmentMaxValue != null
      && (rawValue.length >= String(segmentMaxValue).length || Number.parseInt(`${nextValue}0`, 10) > segmentMaxValue);
    if (shouldCommitAndMove) {
      enteredKeys.value = '';
      callStateMethod(stateRecord, 'focusNext');
      return;
    }

    enteredKeys.value = rawValue;
  };

  let onKeyDown = (event: AnyRecord) => {
    let key = String(event.key ?? '');
    if ((event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) && key !== 'Backspace' && key !== 'Delete') {
      return;
    }

    if (key === 'Backspace' || key === 'Delete') {
      event.preventDefault?.();
      event.stopPropagation?.();
      backspace();
      return;
    }

    if (NUMERIC_SEGMENT_TYPES.has(segmentType) && key.length === 1) {
      onInput(key);
    }
  };

  let segmentProps = computed(() => {
    let isDisabled = readBoolean(stateRecord.isDisabled);
    let readOnly = isSegmentReadOnly(stateRecord, segmentRecord);
    let isEditable = !isDisabled && !readOnly;
    let segmentStyle: DateSegmentAriaProps = {caretColor: 'transparent'};
    if (direction === 'rtl') {
      segmentStyle.unicodeBidi = 'embed';
      if (NUMERIC_SEGMENT_TYPES.has(segmentType)) {
        segmentStyle.direction = 'ltr';
      }
    }

    return mergeProps(
      (spinButton as SpinButtonAria).spinButtonProps.value as DateSegmentAriaProps,
      labelProps as DateSegmentAriaProps,
      {
        'aria-describedby': readOptionalString(stateRecord.ariaDescribedBy) ?? readOptionalString(stateRecord['aria-describedby']),
        'aria-invalid': readBoolean(stateRecord.isInvalid) ? 'true' : undefined,
        'aria-readonly': readOnly ? 'true' : undefined,
        'data-placeholder': readBoolean(segmentRecord.isPlaceholder) || undefined,
        autoCorrect: isEditable ? 'off' : undefined,
        contentEditable: isEditable,
        enterKeyHint: isEditable ? 'next' : undefined,
        inputMode: !isEditable || segmentType === 'dayPeriod' || segmentType === 'era' ? undefined : 'numeric',
        onBeforeInput: (event: AnyRecord) => {
          event.preventDefault?.();
          let inputType = String(event.inputType ?? '');
          if (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') {
            backspace();
            return;
          }

          if (event.data != null) {
            onInput(String(event.data));
          }
        },
        onFocus: () => {
          enteredKeys.value = '';
          let selection = window.getSelection?.();
          if (refObject?.current) {
            selection?.collapse?.(refObject.current);
          }
        },
        onInput: (event: AnyRecord) => {
          if (event.inputType === 'insertText' && event.data != null) {
            onInput(String(event.data));
          }
        },
        onKeyDown,
        onMouseDown: (event: AnyRecord) => {
          event.stopPropagation?.();
        },
        onPointerDown: (event: AnyRecord) => {
          event.stopPropagation?.();
        },
        spellCheck: isEditable ? 'false' : undefined,
        style: segmentStyle,
        suppressContentEditableWarning: isEditable,
        tabIndex: isDisabled ? undefined : 0
      }
    ) as DateSegmentAriaProps;
  });

  return {
    segmentProps
  };
}

export function useDisplayNames(): DisplayNames {
  let {locale} = useLocale();
  try {
    let displayNames = new Intl.DisplayNames(locale, {type: 'dateTimeField'});
    return {
      of: (field: string) => {
        return displayNames.of(field);
      }
    };
  } catch {
    return {
      of: (field: string) => {
        return FALLBACK_DATE_FIELD_LABELS[field] ?? field;
      }
    };
  }
}
