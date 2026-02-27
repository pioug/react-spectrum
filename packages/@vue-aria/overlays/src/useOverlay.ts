import {computed, type ComputedRef, getCurrentScope, onScopeDispose, ref, type Ref, unref, watch} from 'vue';
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
    if (event.key === 'Escape' && !isKeyboardDismissDisabled.value && !event.isComposing) {
      event.stopPropagation();
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
      let documentObject = overlayRef.value?.ownerDocument ?? (typeof document !== 'undefined' ? document : null);
      let isPointerDown = false;
      let ignoreEmulatedMouseEvents = false;
      let lastTopOverlayOnPressStart: number | null = null;

      let onOutsidePressStart = (event: MouseEvent | PointerEvent | TouchEvent) => {
        if (!isDismissable.value || !isTopMostOverlay()) {
          isPointerDown = false;
          lastTopOverlayOnPressStart = null;
          return;
        }

        if (!shouldCloseOnOutsideInteraction(getEventTarget(event))) {
          isPointerDown = false;
          lastTopOverlayOnPressStart = null;
          return;
        }

        isPointerDown = true;
        lastTopOverlayOnPressStart = openOverlayStack[openOverlayStack.length - 1] ?? null;
        event.stopPropagation();
        event.preventDefault();
      };

      let onOutsidePressEnd = (event: MouseEvent | PointerEvent | TouchEvent) => {
        if (!isPointerDown) {
          return;
        }

        isPointerDown = false;
        if (!isDismissable.value) {
          return;
        }

        if (!shouldCloseOnOutsideInteraction(getEventTarget(event))) {
          return;
        }

        if (isTopMostOverlay()) {
          event.stopPropagation();
          event.preventDefault();
        }

        if (lastTopOverlayOnPressStart === overlayId) {
          close();
        }
        lastTopOverlayOnPressStart = null;
      };

      let onDocumentClick = (event: MouseEvent) => {
        onOutsidePressEnd(event);
      };

      let onDocumentMouseUp = (event: MouseEvent) => {
        if (ignoreEmulatedMouseEvents) {
          ignoreEmulatedMouseEvents = false;
          isPointerDown = false;
          lastTopOverlayOnPressStart = null;
          return;
        }

        onOutsidePressEnd(event);
      };

      let onDocumentTouchEnd = (event: TouchEvent) => {
        ignoreEmulatedMouseEvents = true;
        onOutsidePressEnd(event);
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

      if (documentObject) {
        if (typeof PointerEvent !== 'undefined') {
          documentObject.addEventListener('pointerdown', onOutsidePressStart as EventListener, true);
          documentObject.addEventListener('click', onDocumentClick, true);
        } else {
          documentObject.addEventListener('mousedown', onOutsidePressStart as EventListener, true);
          documentObject.addEventListener('mouseup', onDocumentMouseUp, true);
          documentObject.addEventListener('touchstart', onOutsidePressStart as EventListener, true);
          documentObject.addEventListener('touchend', onDocumentTouchEnd, true);
        }
        documentObject.addEventListener('focusin', onDocumentFocusIn, true);
        documentObject.addEventListener('keydown', onDocumentKeyDown, true);
      }

      onCleanup(() => {
        if (documentObject) {
          if (typeof PointerEvent !== 'undefined') {
            documentObject.removeEventListener('pointerdown', onOutsidePressStart as EventListener, true);
            documentObject.removeEventListener('click', onDocumentClick, true);
          } else {
            documentObject.removeEventListener('mousedown', onOutsidePressStart as EventListener, true);
            documentObject.removeEventListener('mouseup', onDocumentMouseUp, true);
            documentObject.removeEventListener('touchstart', onOutsidePressStart as EventListener, true);
            documentObject.removeEventListener('touchend', onDocumentTouchEnd, true);
          }
          documentObject.removeEventListener('focusin', onDocumentFocusIn, true);
          documentObject.removeEventListener('keydown', onDocumentKeyDown, true);
        }

        isPointerDown = false;
        ignoreEmulatedMouseEvents = false;
        lastTopOverlayOnPressStart = null;
        openOverlayStack = openOverlayStack.filter((id) => id !== overlayId);
      });
    },
    {
      immediate: true,
      flush: 'sync'
    }
  );
  let dispose = () => {
    stopWatch();
    openOverlayStack = openOverlayStack.filter((id) => id !== overlayId);
  };
  if (getCurrentScope()) {
    onScopeDispose(dispose);
  }

  return {
    dispose,
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
