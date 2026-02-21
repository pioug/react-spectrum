import {computed, type ComputedRef, unref} from 'vue';
import type {FocusableElement, MaybeRef} from './types';
import {getEventTarget} from './utils';

export interface FocusProps<Target extends FocusableElement = FocusableElement> {
  isDisabled?: MaybeRef<boolean>,
  onBlur?: (event: FocusEvent) => void,
  onFocus?: (event: FocusEvent) => void,
  onFocusChange?: (isFocused: boolean) => void,
  target?: Target
}

export interface FocusDOMProps {
  onBlur?: (event: FocusEvent) => void,
  onFocus?: (event: FocusEvent) => void
}

export interface FocusResult<Target extends FocusableElement = FocusableElement> {
  focusProps: ComputedRef<FocusDOMProps>,
  target?: Target
}

export function useFocus<Target extends FocusableElement = FocusableElement>(props: FocusProps<Target> = {}): FocusResult<Target> {
  let isDisabled = computed(() => Boolean(unref(props.isDisabled)));

  let onFocus = (event: FocusEvent) => {
    if (isDisabled.value || getEventTarget(event) !== event.currentTarget) {
      return;
    }

    props.onFocus?.(event);
    props.onFocusChange?.(true);
  };

  let onBlur = (event: FocusEvent) => {
    if (isDisabled.value || getEventTarget(event) !== event.currentTarget) {
      return;
    }

    props.onBlur?.(event);
    props.onFocusChange?.(false);
  };

  return {
    focusProps: computed<FocusDOMProps>(() => {
      if (isDisabled.value) {
        return {};
      }

      return {
        onBlur,
        onFocus
      };
    })
  };
}
