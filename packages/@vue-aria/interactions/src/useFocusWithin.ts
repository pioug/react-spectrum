import {computed, type ComputedRef, ref, unref} from 'vue';
import type {MaybeRef} from './types';
import {nodeContains} from './utils';

export interface FocusWithinProps {
  isDisabled?: MaybeRef<boolean>,
  onBlurWithin?: (event: FocusEvent) => void,
  onFocusWithin?: (event: FocusEvent) => void,
  onFocusWithinChange?: (isFocusWithin: boolean) => void
}

export interface FocusWithinDOMProps {
  onFocusin?: (event: FocusEvent) => void,
  onFocusout?: (event: FocusEvent) => void
}

export interface FocusWithinResult {
  focusWithinProps: ComputedRef<FocusWithinDOMProps>,
  isFocusWithin: ComputedRef<boolean>
}

function containsNode(target: EventTarget | null, node: EventTarget | null): boolean {
  return nodeContains(target, node);
}

export function useFocusWithin(props: FocusWithinProps = {}): FocusWithinResult {
  let isDisabled = computed(() => Boolean(unref(props.isDisabled)));
  let isFocusWithin = ref(false);

  let onFocusIn = (event: FocusEvent) => {
    if (isDisabled.value || isFocusWithin.value) {
      return;
    }

    isFocusWithin.value = true;
    props.onFocusWithin?.(event);
    props.onFocusWithinChange?.(true);
  };

  let onFocusOut = (event: FocusEvent) => {
    if (isDisabled.value || !isFocusWithin.value) {
      return;
    }

    if (containsNode(event.currentTarget, event.relatedTarget)) {
      return;
    }

    isFocusWithin.value = false;
    props.onBlurWithin?.(event);
    props.onFocusWithinChange?.(false);
  };

  return {
    focusWithinProps: computed<FocusWithinDOMProps>(() => {
      if (isDisabled.value) {
        return {};
      }

      return {
        onFocusin: onFocusIn,
        onFocusout: onFocusOut
      };
    }),
    isFocusWithin: computed(() => isFocusWithin.value)
  };
}
