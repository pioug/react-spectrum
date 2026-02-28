import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';
import {type FormValidationState, useFormValidationState, type ValidationErrors} from '@vue-stately/form';
import {useNumberField as useAriaNumberField} from '@vue-aria/numberfield';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

function clamp(value: number, minValue: number | undefined, maxValue: number | undefined): number {
  if (minValue != null && value < minValue) {
    return minValue;
  }

  if (maxValue != null && value > maxValue) {
    return maxValue;
  }

  return value;
}

function getPrecision(value: number): number {
  let valueAsString = String(value);
  let decimalIndex = valueAsString.indexOf('.');
  if (decimalIndex === -1) {
    return 0;
  }

  return valueAsString.length - decimalIndex - 1;
}

function snapValueToStep(value: number, minValue: number | undefined, maxValue: number | undefined, step: number): number {
  if (!Number.isFinite(step) || step <= 0) {
    return clamp(value, minValue, maxValue);
  }

  let origin = minValue != null ? minValue : 0;
  let snappedValue = Math.round((value - origin) / step) * step + origin;
  let precision = Math.max(getPrecision(step), getPrecision(origin), getPrecision(snappedValue));
  let roundedValue = Number(snappedValue.toFixed(Math.min(precision, 10)));
  return clamp(roundedValue, minValue, maxValue);
}

function parseInputValue(value: string): number {
  let normalizedValue = value.trim().replace(/,/g, '');
  if (normalizedValue.length === 0) {
    return Number.NaN;
  }

  let parsedValue = Number.parseFloat(normalizedValue);
  if (!Number.isFinite(parsedValue)) {
    return Number.NaN;
  }

  return parsedValue;
}

function normalizeValue(
  value: number,
  minValue: number | undefined,
  maxValue: number | undefined,
  step: number
): number {
  if (!Number.isFinite(value)) {
    return minValue ?? 0;
  }

  return snapValueToStep(value, minValue, maxValue, step);
}

export interface NumberFieldStateOptions {
  defaultValue?: number,
  formatOptions?: MaybeRef<Intl.NumberFormatOptions | undefined>,
  isDisabled?: MaybeRef<boolean>,
  isInvalid?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  maxValue?: MaybeRef<number | undefined>,
  minValue?: MaybeRef<number | undefined>,
  name?: string | string[],
  onChange?: (value: number) => void,
  onInputChange?: (value: string) => void,
  step?: MaybeRef<number | undefined>,
  validate?: (value: number) => boolean | null | string | string[] | undefined,
  validationBehavior?: MaybeRef<'aria' | 'native'>,
  validationErrors?: MaybeRef<ValidationErrors>,
  value?: Ref<number | undefined>
}

export interface NumberFieldState extends FormValidationState {
  canDecrement: ComputedRef<boolean>,
  canIncrement: ComputedRef<boolean>,
  defaultNumberValue: number,
  inputValue: Ref<string>,
  maxValue: ComputedRef<number | undefined>,
  minValue: ComputedRef<number | undefined>,
  numberValue: ComputedRef<number>,
  commit: (value?: string) => void,
  decrement: () => void,
  decrementToMin: () => void,
  increment: () => void,
  incrementToMax: () => void,
  setInputValue: (value: string) => void,
  setNumberValue: (value: number) => void,
  validate: (value: string) => boolean
}

/**
 * Provides state management for number fields in Vue.
 */
export function useNumberFieldState(options: NumberFieldStateOptions): NumberFieldState {
  let minValue = computed(() => {
    let value = unref(options.minValue);
    if (value == null || !Number.isFinite(value)) {
      return undefined;
    }

    return value;
  });

  let maxValue = computed(() => {
    let value = unref(options.maxValue);
    if (value == null || !Number.isFinite(value)) {
      return undefined;
    }

    if (minValue.value != null && value < minValue.value) {
      return minValue.value;
    }

    return value;
  });

  let step = computed(() => {
    let value = unref(options.step);
    if (value == null || !Number.isFinite(value) || value <= 0) {
      return 1;
    }

    return value;
  });

  let initialValue = normalizeValue(
    options.defaultValue ?? 0,
    minValue.value,
    maxValue.value,
    step.value
  );

  let uncontrolledValue = ref(initialValue);
  let isControlled = computed(() => options.value !== undefined && options.value.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let value = computed<number>({
    get: () => {
      if (isControlled.value && options.value) {
        return options.value.value as number;
      }

      return uncontrolledValue.value;
    },
    set: (nextValue) => {
      if (!isControlled.value) {
        uncontrolledValue.value = nextValue;
      }
    }
  }) as Ref<number>;
  let numberFormatter = computed(() => new Intl.NumberFormat(undefined, unref(options.formatOptions)));
  let inputValue = ref(numberFormatter.value.format(value.value));

  let validationState = useFormValidationState<number>({
    isInvalid: options.isInvalid,
    name: options.name,
    validate: options.validate,
    validationBehavior: options.validationBehavior,
    validationErrors: options.validationErrors,
    value
  });

  let ariaNumberField = useAriaNumberField({
    formatOptions: options.formatOptions,
    inputValue,
    isDisabled: options.isDisabled,
    isReadOnly: options.isReadOnly,
    maxValue,
    minValue,
    onChange: options.onChange,
    onInputChange: options.onInputChange,
    step,
    value
  });

  let numberValue = computed(() => parseInputValue(inputValue.value));
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));

  let canIncrement = computed(() => {
    if (isDisabled.value || isReadOnly.value) {
      return false;
    }

    if (maxValue.value == null) {
      return true;
    }

    return value.value < maxValue.value;
  });

  let canDecrement = computed(() => {
    if (isDisabled.value || isReadOnly.value) {
      return false;
    }

    if (minValue.value == null) {
      return true;
    }

    return value.value > minValue.value;
  });

  let setInputValue = (nextValue: string): void => {
    ariaNumberField.setInputValue(nextValue);
  };

  let setNumberValue = (nextValue: number): void => {
    let normalizedValue = normalizeValue(nextValue, minValue.value, maxValue.value, step.value);
    ariaNumberField.setNumberValue(normalizedValue);
    validationState.commitValidation();
  };

  let commit = (nextValue?: string): void => {
    if (nextValue !== undefined) {
      setInputValue(nextValue);
    }

    ariaNumberField.commit();
    validationState.commitValidation();
  };

  let increment = (): void => {
    ariaNumberField.increment();
    validationState.commitValidation();
  };

  let decrement = (): void => {
    ariaNumberField.decrement();
    validationState.commitValidation();
  };

  let incrementToMax = (): void => {
    if (maxValue.value == null) {
      return;
    }

    setNumberValue(maxValue.value);
  };

  let decrementToMin = (): void => {
    if (minValue.value == null) {
      return;
    }

    setNumberValue(minValue.value);
  };

  let validate = (valueToValidate: string): boolean => {
    let parsedValue = parseInputValue(valueToValidate);
    if (Number.isNaN(parsedValue)) {
      return valueToValidate.trim().length === 0;
    }

    if (minValue.value != null && parsedValue < minValue.value) {
      return false;
    }

    if (maxValue.value != null && parsedValue > maxValue.value) {
      return false;
    }

    return true;
  };

  return {
    ...validationState,
    canIncrement,
    canDecrement,
    defaultNumberValue: initialValue,
    minValue,
    maxValue,
    inputValue,
    numberValue,
    setInputValue,
    setNumberValue,
    commit,
    increment,
    decrement,
    incrementToMax,
    decrementToMin,
    validate
  };
}
