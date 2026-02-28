import {computed, type ComputedRef, ref, type Ref, unref, watch} from 'vue';
import type {MaybeRef} from './types';

export interface AriaNumberFieldOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  decrementAriaLabel?: MaybeRef<string | undefined>,
  description?: MaybeRef<string | undefined>,
  errorMessage?: MaybeRef<string | undefined>,
  formatOptions?: MaybeRef<Intl.NumberFormatOptions | undefined>,
  id?: MaybeRef<string | undefined>,
  incrementAriaLabel?: MaybeRef<string | undefined>,
  inputValue?: Ref<string>,
  isDisabled?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  label?: MaybeRef<string | undefined>,
  maxValue?: MaybeRef<number | undefined>,
  minValue?: MaybeRef<number | undefined>,
  onChange?: (value: number) => void,
  onInputChange?: (value: string) => void,
  step?: MaybeRef<number | undefined>,
  value?: Ref<number>
}

export interface NumberFieldAria {
  commit: () => void,
  decrement: () => void,
  decrementButtonProps: ComputedRef<{
    'aria-controls'?: string,
    'aria-label': string,
    'aria-labelledby'?: string,
    disabled?: true,
    id?: string,
    onClick: () => void,
    onMouseDown: (event: MouseEvent) => void,
    onPointerDown: (event: PointerEvent) => void,
    tabIndex: -1,
    type: 'button'
  }>,
  descriptionProps: ComputedRef<{
    id?: string
  }>,
  errorMessageProps: ComputedRef<{
    id?: string
  }>,
  groupProps: ComputedRef<{
    'aria-disabled'?: true,
    role: 'group'
  }>,
  increment: () => void,
  incrementButtonProps: ComputedRef<{
    'aria-controls'?: string,
    'aria-label': string,
    'aria-labelledby'?: string,
    disabled?: true,
    id?: string,
    onClick: () => void,
    onMouseDown: (event: MouseEvent) => void,
    onPointerDown: (event: PointerEvent) => void,
    tabIndex: -1,
    type: 'button'
  }>,
  inputProps: ComputedRef<{
    'aria-describedby'?: string,
    'aria-invalid'?: true,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-valuemax'?: number,
    'aria-valuemin'?: number,
    'aria-valuenow': number,
    disabled: boolean,
    id: string,
    inputmode: 'decimal' | 'numeric',
    onBlur: () => void,
    onInput: (valueOrEvent: Event | string) => void,
    onKeyDown: (event: KeyboardEvent) => void,
    readonly: boolean,
    required: boolean,
    role: 'spinbutton',
    step: number,
    type: 'text',
    value: string
  }>,
  inputValue: Ref<string>,
  isInvalid: ComputedRef<boolean>,
  labelProps: ComputedRef<{
    id?: string
  }>,
  numberValue: Ref<number>,
  setInputValue: (value: string) => void,
  setNumberValue: (value: number) => void
}

let numberFieldCounter = 0;

function clamp(value: number, minValue: number | undefined, maxValue: number | undefined): number {
  if (minValue != null && value < minValue) {
    return minValue;
  }

  if (maxValue != null && value > maxValue) {
    return maxValue;
  }

  return value;
}

function parseInputValue(inputValue: string): number | null {
  let normalizedValue = inputValue.trim().replace(/,/g, '');
  if (normalizedValue.length === 0) {
    return null;
  }

  let parsedValue = Number.parseFloat(normalizedValue);
  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return parsedValue;
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

function resolveStepValue(stepValue: number | undefined): number {
  if (stepValue == null || !Number.isFinite(stepValue) || stepValue <= 0) {
    return 1;
  }

  return stepValue;
}

function formatStepperLabel(prefix: string, fieldLabel: string): string {
  let joined = `${prefix} ${fieldLabel}`.trim();
  return joined.length > 0 ? joined : prefix;
}

export function useNumberField(options: AriaNumberFieldOptions = {}): NumberFieldAria {
  numberFieldCounter += 1;

  let generatedId = `vue-number-field-${numberFieldCounter}`;
  let inputId = computed(() => resolveOptionalString(options.id) ?? generatedId);
  let label = computed(() => resolveOptionalString(options.label));
  let description = computed(() => resolveOptionalString(options.description));
  let errorMessage = computed(() => resolveOptionalString(options.errorMessage));

  let minValue = computed(() => {
    let resolvedMinValue = unref(options.minValue);
    if (resolvedMinValue == null || !Number.isFinite(resolvedMinValue)) {
      return undefined;
    }

    return resolvedMinValue;
  });
  let maxValue = computed(() => {
    let resolvedMaxValue = unref(options.maxValue);
    if (resolvedMaxValue == null || !Number.isFinite(resolvedMaxValue)) {
      return undefined;
    }

    if (minValue.value != null && resolvedMaxValue < minValue.value) {
      return minValue.value;
    }

    return resolvedMaxValue;
  });
  let step = computed(() => resolveStepValue(unref(options.step)));

  let formatter = computed(() => new Intl.NumberFormat(undefined, unref(options.formatOptions) ?? {maximumFractionDigits: 3}));
  let formatNumber = (value: number): string => formatter.value.format(value);

  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let isRequired = computed(() => Boolean(unref(options.isRequired)));

  let numberValue = options.value ?? ref(clamp(0, minValue.value, maxValue.value));
  let inputValue = options.inputValue ?? ref(formatNumber(numberValue.value));

  let setInputValue = (value: string) => {
    inputValue.value = value;
    options.onInputChange?.(value);
  };

  let setNumberValue = (value: number) => {
    let clampedValue = clamp(value, minValue.value, maxValue.value);
    numberValue.value = clampedValue;
    let formattedValue = formatNumber(clampedValue);
    if (inputValue.value !== formattedValue) {
      inputValue.value = formattedValue;
      options.onInputChange?.(formattedValue);
    }
    options.onChange?.(clampedValue);
  };

  watch(
    () => numberValue.value,
    (nextValue) => {
      let clampedValue = clamp(nextValue, minValue.value, maxValue.value);
      if (clampedValue !== nextValue) {
        numberValue.value = clampedValue;
        return;
      }

      let formattedValue = formatNumber(clampedValue);
      if (inputValue.value !== formattedValue) {
        inputValue.value = formattedValue;
      }
    }
  );

  let parsedInputValue = computed(() => parseInputValue(inputValue.value));
  let isInvalid = computed(() => {
    if (isRequired.value && inputValue.value.trim().length === 0) {
      return true;
    }

    if (parsedInputValue.value == null) {
      return inputValue.value.trim().length > 0;
    }

    if (minValue.value != null && parsedInputValue.value < minValue.value) {
      return true;
    }

    if (maxValue.value != null && parsedInputValue.value > maxValue.value) {
      return true;
    }

    return false;
  });

  let canIncrement = computed(() => {
    if (isDisabled.value || isReadOnly.value) {
      return false;
    }

    if (maxValue.value == null) {
      return true;
    }

    return numberValue.value < maxValue.value;
  });

  let canDecrement = computed(() => {
    if (isDisabled.value || isReadOnly.value) {
      return false;
    }

    if (minValue.value == null) {
      return true;
    }

    return numberValue.value > minValue.value;
  });

  let increment = () => {
    if (!canIncrement.value) {
      return;
    }

    setNumberValue(numberValue.value + step.value);
  };

  let decrement = () => {
    if (!canDecrement.value) {
      return;
    }

    setNumberValue(numberValue.value - step.value);
  };

  let commit = () => {
    let parsedValue = parseInputValue(inputValue.value);
    if (parsedValue == null) {
      if (inputValue.value.trim().length > 0) {
        inputValue.value = formatNumber(numberValue.value);
      }
      return;
    }

    setNumberValue(parsedValue);
  };

  let labelId = computed(() => label.value ? `${inputId.value}-label` : undefined);
  let descriptionId = computed(() => description.value ? `${inputId.value}-description` : undefined);
  let errorId = computed(() => errorMessage.value ? `${inputId.value}-error` : undefined);

  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));
  let combinedAriaLabelledBy = computed(() => {
    let ids = new Set<string>();
    if (labelId.value) {
      ids.add(labelId.value);
    }

    let labelledBy = ariaLabelledby.value;
    if (labelledBy) {
      for (let id of labelledBy.trim().split(/\s+/)) {
        if (id) {
          ids.add(id);
        }
      }
    }

    if (ariaLabel.value && ids.size > 0) {
      ids.add(inputId.value);
    }

    return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
  });
  let fieldLabel = computed(() => ariaLabel.value ?? label.value ?? '');
  let stepperAriaLabelledBy = computed(() => {
    if (fieldLabel.value) {
      return undefined;
    }

    return labelId.value ?? ariaLabelledby.value;
  });
  let incrementButtonId = computed(() => `${inputId.value}-increment`);
  let decrementButtonId = computed(() => `${inputId.value}-decrement`);
  let describedBy = computed(() => [descriptionId.value, errorId.value].filter(Boolean).join(' ') || undefined);

  let onInput = (valueOrEvent: Event | string) => {
    if (typeof valueOrEvent === 'string') {
      setInputValue(valueOrEvent);
      return;
    }

    let eventTarget = valueOrEvent.target;
    if (eventTarget instanceof HTMLInputElement) {
      setInputValue(eventTarget.value);
    }
  };

  let onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      increment();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      decrement();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    }
  };

  let onStepperPointerDown = (event: Event) => {
    event.preventDefault();
  };

  return {
    commit,
    decrement,
    decrementButtonProps: computed(() => ({
      type: 'button' as const,
      'aria-label': resolveOptionalString(options.decrementAriaLabel)
        ?? formatStepperLabel('Decrease', fieldLabel.value),
      id: stepperAriaLabelledBy.value && !resolveOptionalString(options.decrementAriaLabel)
        ? decrementButtonId.value
        : undefined,
      'aria-labelledby': stepperAriaLabelledBy.value && !resolveOptionalString(options.decrementAriaLabel)
        ? `${decrementButtonId.value} ${stepperAriaLabelledBy.value}`
        : undefined,
      'aria-controls': inputId.value,
      tabIndex: -1 as const,
      disabled: canDecrement.value ? undefined : true,
      onMouseDown: onStepperPointerDown,
      onPointerDown: onStepperPointerDown,
      onClick: decrement
    })),
    descriptionProps: computed(() => ({
      id: descriptionId.value
    })),
    errorMessageProps: computed(() => ({
      id: errorId.value
    })),
    groupProps: computed(() => ({
      role: 'group' as const,
      'aria-disabled': isDisabled.value ? true : undefined,
      'aria-invalid': isInvalid.value ? true : undefined
    })),
    increment,
    incrementButtonProps: computed(() => ({
      type: 'button' as const,
      'aria-label': resolveOptionalString(options.incrementAriaLabel)
        ?? formatStepperLabel('Increase', fieldLabel.value),
      id: stepperAriaLabelledBy.value && !resolveOptionalString(options.incrementAriaLabel)
        ? incrementButtonId.value
        : undefined,
      'aria-labelledby': stepperAriaLabelledBy.value && !resolveOptionalString(options.incrementAriaLabel)
        ? `${incrementButtonId.value} ${stepperAriaLabelledBy.value}`
        : undefined,
      'aria-controls': inputId.value,
      tabIndex: -1 as const,
      disabled: canIncrement.value ? undefined : true,
      onMouseDown: onStepperPointerDown,
      onPointerDown: onStepperPointerDown,
      onClick: increment
    })),
    inputProps: computed(() => ({
      id: inputId.value,
      role: 'spinbutton' as const,
      type: 'text' as const,
      inputmode: minValue.value != null && minValue.value >= 0 ? 'numeric' as const : 'decimal' as const,
      value: inputValue.value,
      disabled: isDisabled.value,
      readonly: isReadOnly.value,
      required: isRequired.value,
      step: step.value,
      'aria-label': ariaLabel.value,
      'aria-labelledby': combinedAriaLabelledBy.value,
      'aria-describedby': describedBy.value,
      'aria-invalid': isInvalid.value ? true : undefined,
      'aria-valuemin': minValue.value,
      'aria-valuemax': maxValue.value,
      'aria-valuenow': numberValue.value,
      onBlur: commit,
      onInput,
      onKeyDown
    })),
    inputValue,
    isInvalid,
    labelProps: computed(() => ({
      id: labelId.value
    })),
    numberValue,
    setInputValue,
    setNumberValue
  };
}
