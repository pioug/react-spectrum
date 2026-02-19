import type {FocusableElement} from './types';
import {getInteractionModality} from './useFocusVisible';

export function focusSafely(element: FocusableElement): void;
export function focusSafely(element: FocusableElement | null | undefined): void {
  if (!element) {
    return;
  }

  let modality = getInteractionModality();

  try {
    if (modality === 'pointer' || modality === 'virtual') {
      element.focus({preventScroll: true});
      return;
    }

    element.focus();
  } catch {
    element.focus();
  }
}
