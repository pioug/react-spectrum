import {computed, type ComputedRef, unref, watch} from 'vue';
import type {MaybeRef} from './types';

export interface PreventScrollOptions {
  isDisabled?: MaybeRef<boolean>
}

export interface PreventScrollAria {
  dispose: () => void,
  isPreventingScroll: ComputedRef<boolean>
}

let preventScrollCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

function lockDocumentScroll(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  if (preventScrollCount === 0) {
    let documentElement = document.documentElement;
    previousOverflow = documentElement.style.overflow;
    previousPaddingRight = documentElement.style.paddingRight;

    let scrollbarWidth = Math.max(window.innerWidth - documentElement.clientWidth, 0);
    if (scrollbarWidth > 0) {
      documentElement.style.paddingRight = `${scrollbarWidth}px`;
    }
    documentElement.style.overflow = 'hidden';
  }

  preventScrollCount += 1;
}

function unlockDocumentScroll(): void {
  if (typeof document === 'undefined') {
    return;
  }

  preventScrollCount = Math.max(0, preventScrollCount - 1);
  if (preventScrollCount !== 0) {
    return;
  }

  let documentElement = document.documentElement;
  documentElement.style.overflow = previousOverflow;
  documentElement.style.paddingRight = previousPaddingRight;
}

export function usePreventScroll(options: PreventScrollOptions = {}): PreventScrollAria {
  let stopWatch = watch(
    () => Boolean(unref(options.isDisabled)),
    (isDisabled, _, onCleanup) => {
      if (isDisabled) {
        return;
      }

      lockDocumentScroll();
      onCleanup(() => {
        unlockDocumentScroll();
      });
    },
    {immediate: true}
  );

  return {
    dispose: () => {
      stopWatch();
    },
    isPreventingScroll: computed(() => preventScrollCount > 0)
  };
}
