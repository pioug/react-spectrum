import type {FocusableElement} from './types';
import {getActiveElement} from './utils';
import {getInteractionModality} from './useFocusVisible';

function focusWithoutScrolling(element: FocusableElement): void {
  try {
    element.focus({preventScroll: true});
  } catch {
    element.focus();
  }
}

function runAfterTransition(callback: () => void): void {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => {
      callback();
    });
    return;
  }

  setTimeout(callback, 0);
}

export function focusSafely(element: FocusableElement): void;
export function focusSafely(element: FocusableElement | null | undefined): void {
  if (!element) {
    return;
  }

  let ownerDocument = element.ownerDocument ?? (typeof document !== 'undefined' ? document : null);
  if (getInteractionModality() === 'virtual' && ownerDocument) {
    let lastFocusedElement = getActiveElement(ownerDocument);
    runAfterTransition(() => {
      let activeElement = getActiveElement(ownerDocument);
      if ((activeElement === lastFocusedElement || activeElement === ownerDocument.body) && element.isConnected) {
        focusWithoutScrolling(element);
      }
    });
    return;
  }

  focusWithoutScrolling(element);
}
