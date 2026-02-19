import {computed, type ComputedRef, getCurrentInstance, onBeforeUnmount, ref, unref} from 'vue';
import type {
  MaybeRef,
  SpinButtonKeyboardEvent,
  SpinButtonPressEvent
} from './types';

export interface SpinButtonOptions {
  'aria-describedby'?: MaybeRef<string | undefined>,
  'aria-details'?: MaybeRef<string | undefined>,
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaDescribedby?: MaybeRef<string | undefined>,
  ariaDetails?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  maxValue?: MaybeRef<number | undefined>,
  minValue?: MaybeRef<number | undefined>,
  onDecrement?: () => void,
  onDecrementPage?: () => void,
  onDecrementToMin?: () => void,
  onIncrement?: () => void,
  onIncrementPage?: () => void,
  onIncrementToMax?: () => void,
  textValue?: MaybeRef<string | undefined>,
  value?: MaybeRef<number | undefined>
}

export interface SpinButtonProps {
  'aria-describedby'?: string,
  'aria-details'?: string,
  'aria-disabled'?: true,
  'aria-label'?: string,
  'aria-labelledby'?: string,
  'aria-readonly'?: true,
  'aria-required'?: true,
  'aria-valuemax'?: number,
  'aria-valuemin'?: number,
  'aria-valuenow'?: number,
  'aria-valuetext': string,
  onBlur: () => void,
  onFocus: () => void,
  onKeyDown: (event: SpinButtonKeyboardEvent) => void,
  role: 'spinbutton'
}

export interface SpinButtonStepButtonProps {
  isDisabled?: true,
  onBlur: () => void,
  onFocus: () => void,
  onPressEnd: (event: SpinButtonPressEvent) => void,
  onPressStart: (event: SpinButtonPressEvent) => void,
  onPressUp: (event: SpinButtonPressEvent) => void
}

export interface SpinButtonAria {
  decrementButtonProps: ComputedRef<SpinButtonStepButtonProps>,
  incrementButtonProps: ComputedRef<SpinButtonStepButtonProps>,
  isFocused: ComputedRef<boolean>,
  spinButtonProps: ComputedRef<SpinButtonProps>
}

interface StepButtonHandlers {
  onPressEnd: (event: SpinButtonPressEvent) => void,
  onPressStart: (event: SpinButtonPressEvent) => void,
  onPressUp: (event: SpinButtonPressEvent) => void
}

function resolveBoolean(value: MaybeRef<boolean> | undefined): boolean {
  if (value == null) {
    return false;
  }

  return Boolean(unref(value));
}

function resolveNumber(value: MaybeRef<number | undefined> | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  let resolvedValue = unref(value);
  if (resolvedValue == null || Number.isNaN(resolvedValue)) {
    return undefined;
  }

  return resolvedValue;
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

function resolvePointerType(event: SpinButtonPressEvent): 'mouse' | 'touch' {
  return event.pointerType === 'touch' ? 'touch' : 'mouse';
}

export function useSpinButton(options: SpinButtonOptions = {}): SpinButtonAria {
  let isFocused = ref(false);
  let isRepeating = ref(false);
  let repeatTimer: ReturnType<typeof setTimeout> | null = null;

  let clearRepeat = () => {
    if (repeatTimer != null) {
      clearTimeout(repeatTimer);
      repeatTimer = null;
    }
    isRepeating.value = false;
  };

  if (getCurrentInstance()) {
    onBeforeUnmount(() => {
      clearRepeat();
    });
  }

  let value = computed(() => resolveNumber(options.value));
  let minValue = computed(() => resolveNumber(options.minValue));
  let maxValue = computed(() => resolveNumber(options.maxValue));
  let isDisabled = computed(() => resolveBoolean(options.isDisabled));
  let isReadOnly = computed(() => resolveBoolean(options.isReadOnly));
  let isRequired = computed(() => resolveBoolean(options.isRequired));

  let isInteractive = computed(() => !isDisabled.value && !isReadOnly.value);
  let canIncrement = computed(() => {
    if (!isInteractive.value) {
      return false;
    }

    if (value.value == null || maxValue.value == null) {
      return true;
    }

    return value.value < maxValue.value;
  });
  let canDecrement = computed(() => {
    if (!isInteractive.value) {
      return false;
    }

    if (value.value == null || minValue.value == null) {
      return true;
    }

    return value.value > minValue.value;
  });

  let ariaTextValue = computed(() => {
    let explicitTextValue = resolveOptionalString(options.textValue);
    let textValue = explicitTextValue ?? (value.value != null ? `${value.value}` : '');
    if (textValue === '') {
      return 'Empty';
    }

    return textValue.replace('-', '\u2212');
  });

  let onFocus = () => {
    isFocused.value = true;
  };
  let onBlur = () => {
    isFocused.value = false;
  };

  let startRepeating = (
    action: (() => void) | undefined,
    canRun: () => boolean,
    initialDelay: number,
    onRepeat: () => void
  ) => {
    if (!action) {
      return;
    }

    clearRepeat();
    isRepeating.value = true;

    let tick = () => {
      if (!canRun()) {
        clearRepeat();
        return;
      }

      onRepeat();
      action();
      repeatTimer = setTimeout(tick, 60);
    };

    repeatTimer = setTimeout(tick, initialDelay);
  };

  let onKeyDown = (event: SpinButtonKeyboardEvent): void => {
    if (!isInteractive.value || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing) {
      return;
    }

    if (event.key === 'PageUp') {
      let action = options.onIncrementPage ?? options.onIncrement;
      if (action) {
        event.preventDefault();
        action();
      }
      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'Up') {
      if (options.onIncrement) {
        event.preventDefault();
        options.onIncrement();
      }
      return;
    }

    if (event.key === 'PageDown') {
      let action = options.onDecrementPage ?? options.onDecrement;
      if (action) {
        event.preventDefault();
        action();
      }
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'Down') {
      if (options.onDecrement) {
        event.preventDefault();
        options.onDecrement();
      }
      return;
    }

    if (event.key === 'Home') {
      if (options.onDecrementToMin) {
        event.preventDefault();
        options.onDecrementToMin();
      }
      return;
    }

    if (event.key === 'End' && options.onIncrementToMax) {
      event.preventDefault();
      options.onIncrementToMax();
    }
  };

  let createStepButtonHandlers = (
    action: (() => void) | undefined,
    canRun: ComputedRef<boolean>
  ): StepButtonHandlers => {
    let touchPressReleased = false;
    let repeatedWhilePressed = false;

    return {
      onPressStart: (event) => {
        if (!isInteractive.value) {
          return;
        }

        clearRepeat();
        repeatedWhilePressed = false;
        touchPressReleased = false;

        let pointerType = resolvePointerType(event);
        if (pointerType === 'touch') {
          startRepeating(action, () => canRun.value, 600, () => {
            repeatedWhilePressed = true;
          });
          return;
        }

        if (action && canRun.value) {
          action();
        }

        startRepeating(action, () => canRun.value, 400, () => {
          repeatedWhilePressed = true;
        });
      },
      onPressUp: (event) => {
        if (resolvePointerType(event) === 'touch') {
          touchPressReleased = true;
        }

        clearRepeat();
      },
      onPressEnd: (event) => {
        if (resolvePointerType(event) === 'touch' && touchPressReleased && !repeatedWhilePressed && action && canRun.value) {
          action();
        }

        touchPressReleased = false;
        repeatedWhilePressed = false;
        clearRepeat();
      }
    };
  };

  let incrementHandlers = createStepButtonHandlers(options.onIncrement, canIncrement);
  let decrementHandlers = createStepButtonHandlers(options.onDecrement, canDecrement);

  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));
  let ariaDescribedby = computed(() => resolveOptionalString(options.ariaDescribedby) ?? resolveOptionalString(options['aria-describedby']));
  let ariaDetails = computed(() => resolveOptionalString(options.ariaDetails) ?? resolveOptionalString(options['aria-details']));

  return {
    decrementButtonProps: computed(() => ({
      isDisabled: !isInteractive.value ? true : undefined,
      onPressStart: decrementHandlers.onPressStart,
      onPressUp: decrementHandlers.onPressUp,
      onPressEnd: decrementHandlers.onPressEnd,
      onFocus,
      onBlur
    })),
    incrementButtonProps: computed(() => ({
      isDisabled: !isInteractive.value ? true : undefined,
      onPressStart: incrementHandlers.onPressStart,
      onPressUp: incrementHandlers.onPressUp,
      onPressEnd: incrementHandlers.onPressEnd,
      onFocus,
      onBlur
    })),
    isFocused: computed(() => isFocused.value),
    spinButtonProps: computed(() => ({
      role: 'spinbutton' as const,
      'aria-valuenow': value.value,
      'aria-valuetext': ariaTextValue.value,
      'aria-valuemin': minValue.value,
      'aria-valuemax': maxValue.value,
      'aria-label': ariaLabel.value,
      'aria-labelledby': ariaLabelledby.value,
      'aria-describedby': ariaDescribedby.value,
      'aria-details': ariaDetails.value,
      'aria-disabled': isDisabled.value ? true : undefined,
      'aria-readonly': isReadOnly.value ? true : undefined,
      'aria-required': isRequired.value ? true : undefined,
      onFocus,
      onBlur,
      onKeyDown
    }))
  };
}
