import {computed, type ComputedRef, ref, type Ref, unref, watch} from 'vue';
import {getEventTarget, nodeContains} from './utils';
import type {MaybeRef} from './types';

export interface AriaOverlayOptions {
  isDismissable?: MaybeRef<boolean>,
  isKeyboardDismissDisabled?: MaybeRef<boolean>,
  isOpen?: MaybeRef<boolean>,
  onClose?: () => void,
  overlayRef?: Ref<HTMLElement | null>,
  shouldCloseOnBlur?: MaybeRef<boolean>,
  shouldCloseOnInteractOutside?: (element: Element) => boolean
}

export interface OverlayAria {
  dispose: () => void,
  overlayProps: ComputedRef<{
    onKeyDown: (event: KeyboardEvent) => void
  }>,
  overlayRef: Ref<HTMLElement | null>,
  underlayProps: ComputedRef<{
    onPointerDown: (event: PointerEvent) => void
  }>
}

let openOverlayStack: number[] = [];
let overlayCounter = 0;

function containsTarget(overlayElement: HTMLElement | null, target: EventTarget | null): boolean {
  if (!overlayElement) {
    return false;
  }

  return nodeContains(overlayElement, target);
}

export function useOverlay(options: AriaOverlayOptions = {}): OverlayAria {
  overlayCounter += 1;
  let overlayId = overlayCounter;
  let overlayRef = options.overlayRef ?? ref<HTMLElement | null>(null);

  let isOpen = computed(() => Boolean(unref(options.isOpen)));
  let isDismissable = computed(() => Boolean(unref(options.isDismissable)));
  let shouldCloseOnBlur = computed(() => Boolean(unref(options.shouldCloseOnBlur)));
  let isKeyboardDismissDisabled = computed(() => Boolean(unref(options.isKeyboardDismissDisabled)));

  let isTopMostOverlay = () => openOverlayStack[openOverlayStack.length - 1] === overlayId;
  let close = () => {
    if (isTopMostOverlay()) {
      options.onClose?.();
    }
  };

  let onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && !isKeyboardDismissDisabled.value) {
      event.preventDefault();
      close();
    }
  };

  let shouldCloseOnOutsideInteraction = (target: EventTarget | null): boolean => {
    if (!(target instanceof Element)) {
      return false;
    }

    if (containsTarget(overlayRef.value, target)) {
      return false;
    }

    if (!options.shouldCloseOnInteractOutside) {
      return true;
    }

    return options.shouldCloseOnInteractOutside(target);
  };

  let stopWatch = watch(
    isOpen,
    (open, _, onCleanup) => {
      if (!open) {
        return;
      }

      openOverlayStack.push(overlayId);

      let onDocumentPointerDown = (event: PointerEvent) => {
        if (!isDismissable.value || !isTopMostOverlay()) {
          return;
        }

        if (!shouldCloseOnOutsideInteraction(getEventTarget(event))) {
          return;
        }

        event.preventDefault();
        close();
      };

      let onDocumentFocusIn = (event: FocusEvent) => {
        if (!shouldCloseOnBlur.value || !isTopMostOverlay()) {
          return;
        }

        if (!shouldCloseOnOutsideInteraction(getEventTarget(event))) {
          return;
        }

        close();
      };

      let onDocumentKeyDown = (event: KeyboardEvent) => {
        if (!isTopMostOverlay()) {
          return;
        }

        onKeyDown(event);
      };

      if (typeof document !== 'undefined') {
        document.addEventListener('pointerdown', onDocumentPointerDown, true);
        document.addEventListener('focusin', onDocumentFocusIn, true);
        document.addEventListener('keydown', onDocumentKeyDown, true);
      }

      onCleanup(() => {
        if (typeof document !== 'undefined') {
          document.removeEventListener('pointerdown', onDocumentPointerDown, true);
          document.removeEventListener('focusin', onDocumentFocusIn, true);
          document.removeEventListener('keydown', onDocumentKeyDown, true);
        }

        openOverlayStack = openOverlayStack.filter((id) => id !== overlayId);
      });
    },
    {
      immediate: true,
      flush: 'sync'
    }
  );

  return {
    dispose: () => {
      stopWatch();
      openOverlayStack = openOverlayStack.filter((id) => id !== overlayId);
    },
    overlayProps: computed(() => ({
      onKeyDown
    })),
    overlayRef,
    underlayProps: computed(() => ({
      onPointerDown: (event: PointerEvent) => {
        if (getEventTarget(event) === event.currentTarget) {
          event.preventDefault();
        }
      }
    }))
  };
}
