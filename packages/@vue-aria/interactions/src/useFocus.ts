import {computed, type ComputedRef, unref} from 'vue';
import type {FocusableElement, MaybeRef} from './types';
import {getActiveElement, getEventTarget} from './utils';

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
  let resolveOwnerDocument = (target: EventTarget | null): Document | null => {
    if (
      target == null ||
      typeof target !== 'object' ||
      !('ownerDocument' in target)
    ) {
      return typeof document !== 'undefined' ? document : null;
    }

    let ownerDocument = (target as Node).ownerDocument;
    return ownerDocument ?? (typeof document !== 'undefined' ? document : null);
  };

  let onFocus = (event: FocusEvent) => {
    let eventTarget = getEventTarget(event);
    if (isDisabled.value || eventTarget !== event.currentTarget) {
      return;
    }

    let ownerDocument = resolveOwnerDocument(eventTarget);
    let activeElement = getActiveElement(ownerDocument);
    if (activeElement !== eventTarget) {
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
