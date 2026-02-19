import {computed, type ComputedRef, unref} from 'vue';
import {getEventTarget} from './utils';
import type {MaybeRef} from './types';

export interface FocusProps {
  isDisabled?: MaybeRef<boolean>,
  onBlur?: (event: FocusEvent) => void,
  onFocus?: (event: FocusEvent) => void,
  onFocusChange?: (isFocused: boolean) => void
}

export interface FocusDOMProps {
  onBlur?: (event: FocusEvent) => void,
  onFocus?: (event: FocusEvent) => void
}

export interface FocusResult {
  focusProps: ComputedRef<FocusDOMProps>
}

export function useFocus(props: FocusProps = {}): FocusResult {
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
