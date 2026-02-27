import {computed, getCurrentScope, onScopeDispose, type ComputedRef, ref, unref, watch} from 'vue';
import type {MaybeRef} from './types';
import {getActiveElement, getEventTarget, nodeContains} from './utils';

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
  let trackedFocusWithinTarget: EventTarget | null = null;
  let removeGlobalFocusListener: null | (() => void) = null;

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

  let clearGlobalFocusListener = () => {
    if (!removeGlobalFocusListener) {
      return;
    }

    removeGlobalFocusListener();
    removeGlobalFocusListener = null;
  };

  let triggerBlurWithin = (event: FocusEvent) => {
    if (!isFocusWithin.value) {
      return;
    }

    isFocusWithin.value = false;
    trackedFocusWithinTarget = null;
    clearGlobalFocusListener();

    props.onBlurWithin?.(event);
    props.onFocusWithinChange?.(false);
  };

  if (getCurrentScope()) {
    onScopeDispose(() => {
      clearGlobalFocusListener();
    });
  }

  let onFocusIn = (event: FocusEvent) => {
    if (isDisabled.value || isFocusWithin.value) {
      return;
    }

    if (!containsNode(event.currentTarget, getEventTarget(event) ?? event.currentTarget)) {
      return;
    }

    let eventTarget = getEventTarget(event);
    let ownerDocument = resolveOwnerDocument(eventTarget ?? event.currentTarget);
    let activeElement = getActiveElement(ownerDocument);
    if (!eventTarget || activeElement !== eventTarget) {
      return;
    }

    isFocusWithin.value = true;
    trackedFocusWithinTarget = event.currentTarget;
    props.onFocusWithin?.(event);
    props.onFocusWithinChange?.(true);

    clearGlobalFocusListener();
    if (!ownerDocument || !trackedFocusWithinTarget) {
      return;
    }

    let focusWithinTarget = trackedFocusWithinTarget;
    let onDocumentFocus = (documentFocusEvent: FocusEvent) => {
      let nextTarget = getEventTarget(documentFocusEvent);
      if (!isFocusWithin.value || containsNode(focusWithinTarget, nextTarget)) {
        return;
      }

      let syntheticEvent = new FocusEvent('blur', {relatedTarget: nextTarget as EventTarget | null});
      triggerBlurWithin(syntheticEvent);
    };

    ownerDocument.addEventListener('focus', onDocumentFocus as EventListener, true);
    removeGlobalFocusListener = () => {
      ownerDocument.removeEventListener('focus', onDocumentFocus as EventListener, true);
    };
  };

  let onFocusOut = (event: FocusEvent) => {
    if (isDisabled.value || !isFocusWithin.value) {
      return;
    }

    if (!containsNode(event.currentTarget, getEventTarget(event) ?? event.currentTarget)) {
      return;
    }

    if (containsNode(event.currentTarget, event.relatedTarget)) {
      return;
    }

    triggerBlurWithin(event);
  };

  watch(
    isDisabled,
    (nextIsDisabled) => {
      if (!nextIsDisabled || !isFocusWithin.value) {
        return;
      }

      let ownerDocument = resolveOwnerDocument(trackedFocusWithinTarget);
      let syntheticEvent = new FocusEvent('blur', {
        relatedTarget: getActiveElement(ownerDocument)
      });
      triggerBlurWithin(syntheticEvent);
    },
    {flush: 'sync'}
  );

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
