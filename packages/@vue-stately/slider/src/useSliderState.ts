import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;
type Orientation = 'horizontal' | 'vertical';

const DEFAULT_MIN_VALUE = 0;
const DEFAULT_MAX_VALUE = 100;
const DEFAULT_STEP_VALUE = 1;

function clamp(value: number, minValue: number, maxValue: number): number {
  return Math.min(maxValue, Math.max(minValue, value));
}

function getPrecision(value: number): number {
  let valueAsString = String(value);
  let decimalIndex = valueAsString.indexOf('.');
  if (decimalIndex === -1) {
    return 0;
  }

  return valueAsString.length - decimalIndex - 1;
}

function snapValueToStep(value: number, minValue: number, maxValue: number, step: number): number {
  if (!Number.isFinite(step) || step <= 0) {
    return clamp(value, minValue, maxValue);
  }

  let snappedValue = Math.round((value - minValue) / step) * step + minValue;
  let precision = Math.max(getPrecision(minValue), getPrecision(step), getPrecision(snappedValue));
  let roundedValue = Number(snappedValue.toFixed(Math.min(precision, 10)));
  return clamp(roundedValue, minValue, maxValue);
}

function replaceIndex<T>(array: T[], index: number, value: T): T[] {
  if (array[index] === value) {
    return array;
  }

  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}

function convertValue(value?: number | number[]): number[] | undefined {
  if (value == null) {
    return undefined;
  }

  return Array.isArray(value) ? value : [value];
}

function equalArrays(a: number[], b: number[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) {
      return false;
    }
  }

  return true;
}

export interface SliderState {
  defaultValues: number[],
  focusedThumb: Ref<number | undefined>,
  isDisabled: ComputedRef<boolean>,
  orientation: ComputedRef<Orientation>,
  pageSize: number,
  step: number,
  values: ComputedRef<number[]>,
  decrementThumb: (index: number, stepSize?: number) => void,
  getFormattedValue: (value: number) => string,
  getPercentValue: (percent: number) => number,
  getThumbMaxValue: (index: number) => number,
  getThumbMinValue: (index: number) => number,
  getThumbPercent: (index: number) => number,
  getThumbValue: (index: number) => number,
  getThumbValueLabel: (index: number) => string,
  getValuePercent: (value: number) => number,
  incrementThumb: (index: number, stepSize?: number) => void,
  isThumbDragging: (index: number) => boolean,
  isThumbEditable: (index: number) => boolean,
  setFocusedThumb: (index: number | undefined) => void,
  setThumbDragging: (index: number, dragging: boolean) => void,
  setThumbEditable: (index: number, editable: boolean) => void,
  setThumbPercent: (index: number, percent: number) => void,
  setThumbValue: (index: number, value: number) => void
}

export interface SliderStateOptions<T extends number | number[]> {
  defaultValue?: T,
  isDisabled?: MaybeRef<boolean>,
  maxValue?: number,
  minValue?: number,
  numberFormatter?: Intl.NumberFormat,
  onChange?: (value: T) => void,
  onChangeEnd?: (value: T) => void,
  orientation?: MaybeRef<Orientation>,
  step?: number,
  value?: Ref<T | undefined>
}

/**
 * Provides state management for slider thumbs, values, and drag interactions.
 */
export function useSliderState<T extends number | number[]>(options: SliderStateOptions<T>): SliderState {
  let minValue = options.minValue ?? DEFAULT_MIN_VALUE;
  let maxValue = options.maxValue ?? DEFAULT_MAX_VALUE;
  let step = Number.isFinite(options.step) && (options.step as number) > 0
    ? options.step as number
    : DEFAULT_STEP_VALUE;
  let formatter = options.numberFormatter ?? new Intl.NumberFormat();
  let orientation = computed<Orientation>(() => unref(options.orientation) === 'vertical' ? 'vertical' : 'horizontal');
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));

  let restrictValues = (values: number[] | undefined): number[] | undefined => {
    return values?.map((value, index) => {
      let min = index === 0 ? minValue : values[index - 1] ?? minValue;
      let max = index === values.length - 1 ? maxValue : values[index + 1] ?? maxValue;
      return snapValueToStep(value, min, max, step);
    });
  };

  let defaultValues = restrictValues(convertValue(options.defaultValue)) ?? [minValue];
  let uncontrolledValues = ref(defaultValues);
  let initialValues = options.value?.value != null
    ? restrictValues(convertValue(options.value.value)) ?? defaultValues
    : uncontrolledValues.value;

  let isSingleValue = computed(() => {
    let controlledValue = options.value?.value;
    return typeof controlledValue === 'number' || typeof options.defaultValue === 'number';
  });
  let isControlled = computed(() => options.value !== undefined && options.value.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let values = computed<number[]>(() => {
    if (isControlled.value && options.value) {
      return restrictValues(convertValue(options.value.value)) ?? defaultValues;
    }

    return uncontrolledValues.value;
  });

  let toOutputValue = (nextValues: number[]): T => {
    if (isSingleValue.value) {
      return (nextValues[0] ?? minValue) as T;
    }

    return nextValues as T;
  };

  let setValues = (nextValues: number[]): void => {
    if (equalArrays(nextValues, values.value)) {
      return;
    }

    if (isControlled.value && options.value) {
      options.value.value = toOutputValue(nextValues);
    } else {
      uncontrolledValues.value = nextValues;
    }

    options.onChange?.(toOutputValue(nextValues));
  };

  let isDraggings = ref<boolean[]>(new Array(values.value.length).fill(false));
  let isEditables = ref<boolean[]>(new Array(values.value.length).fill(true));
  let focusedThumb = ref<number | undefined>(undefined);

  let ensureThumbStateLength = (): void => {
    let thumbCount = values.value.length;
    if (isDraggings.value.length !== thumbCount) {
      isDraggings.value = [
        ...isDraggings.value.slice(0, thumbCount),
        ...new Array(Math.max(0, thumbCount - isDraggings.value.length)).fill(false)
      ];
    }

    if (isEditables.value.length !== thumbCount) {
      isEditables.value = [
        ...isEditables.value.slice(0, thumbCount),
        ...new Array(Math.max(0, thumbCount - isEditables.value.length)).fill(true)
      ];
    }
  };

  let pageSize = (() => {
    let calcPageSize = (maxValue - minValue) / 10;
    calcPageSize = snapValueToStep(calcPageSize, 0, calcPageSize + step, step);
    return Math.max(calcPageSize, step);
  })();

  let getValuePercent = (value: number): number => {
    if (maxValue === minValue) {
      return 0;
    }

    return (value - minValue) / (maxValue - minValue);
  };

  let getThumbMinValue = (index: number): number => {
    return index === 0 ? minValue : values.value[index - 1] ?? minValue;
  };

  let getThumbMaxValue = (index: number): number => {
    return index === values.value.length - 1 ? maxValue : values.value[index + 1] ?? maxValue;
  };

  let getRoundedValue = (value: number): number => {
    return Math.round((value - minValue) / step) * step + minValue;
  };

  let getPercentValue = (percent: number): number => {
    let value = percent * (maxValue - minValue) + minValue;
    return clamp(getRoundedValue(value), minValue, maxValue);
  };

  let isThumbEditable = (index: number): boolean => {
    ensureThumbStateLength();
    return isEditables.value[index] ?? true;
  };

  let setThumbEditable = (index: number, editable: boolean): void => {
    ensureThumbStateLength();
    isEditables.value = replaceIndex(isEditables.value, index, editable);
  };

  let setThumbValue = (index: number, value: number): void => {
    ensureThumbStateLength();
    if (isDisabled.value || !isThumbEditable(index)) {
      return;
    }

    let min = getThumbMinValue(index);
    let max = getThumbMaxValue(index);
    let snappedValue = snapValueToStep(value, min, max, step);
    let nextValues = replaceIndex(values.value, index, snappedValue);
    setValues(nextValues);
  };

  let setThumbPercent = (index: number, percent: number): void => {
    setThumbValue(index, getPercentValue(percent));
  };

  let setThumbDragging = (index: number, dragging: boolean): void => {
    ensureThumbStateLength();
    if (isDisabled.value || !isThumbEditable(index)) {
      return;
    }

    let wasDragging = isDraggings.value[index] ?? false;
    isDraggings.value = replaceIndex(isDraggings.value, index, dragging);

    if (options.onChangeEnd && wasDragging && !isDraggings.value.some(Boolean)) {
      options.onChangeEnd(toOutputValue(values.value));
    }
  };

  let isThumbDragging = (index: number): boolean => {
    ensureThumbStateLength();
    return isDraggings.value[index] ?? false;
  };

  let setFocusedThumb = (index: number | undefined): void => {
    focusedThumb.value = index;
  };

  let getThumbValue = (index: number): number => {
    return values.value[index] ?? minValue;
  };

  let getThumbPercent = (index: number): number => {
    return getValuePercent(getThumbValue(index));
  };

  let getFormattedValue = (value: number): string => {
    return formatter.format(value);
  };

  let getThumbValueLabel = (index: number): string => {
    return getFormattedValue(getThumbValue(index));
  };

  let incrementThumb = (index: number, stepSize: number = 1): void => {
    let increment = Math.max(stepSize, step);
    setThumbValue(index, getThumbValue(index) + increment);
  };

  let decrementThumb = (index: number, stepSize: number = 1): void => {
    let decrement = Math.max(stepSize, step);
    setThumbValue(index, getThumbValue(index) - decrement);
  };

  return {
    values,
    defaultValues: options.defaultValue !== undefined ? defaultValues : initialValues,
    getThumbValue,
    setThumbValue,
    setThumbPercent,
    isThumbDragging,
    setThumbDragging,
    focusedThumb,
    setFocusedThumb,
    getThumbPercent,
    getValuePercent,
    getThumbValueLabel,
    getFormattedValue,
    getThumbMinValue,
    getThumbMaxValue,
    getPercentValue,
    isThumbEditable,
    setThumbEditable,
    incrementThumb,
    decrementThumb,
    step,
    pageSize,
    orientation,
    isDisabled
  };
}
