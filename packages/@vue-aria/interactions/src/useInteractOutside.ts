import {computed, getCurrentScope, onScopeDispose, unref, watch} from 'vue';
import {getEventTarget, nodeContains} from './utils';
import type {MaybeRef} from './types';

export interface InteractOutsideProps {
  isDisabled?: MaybeRef<boolean>,
  onInteractOutside?: (event: MouseEvent | PointerEvent | TouchEvent) => void,
  onInteractOutsideStart?: (event: MouseEvent | PointerEvent | TouchEvent) => void,
  ref: MaybeRef<Element | null>
}

function isTargetInDocument(target: EventTarget | null): boolean {
  return target instanceof Node && nodeContains(target.ownerDocument?.documentElement ?? null, target);
}

function getOwnerDocument(target: Element | null): Document {
  if (target?.ownerDocument) {
    return target.ownerDocument;
  }

  return document;
}

function isValidEvent(event: MouseEvent | PointerEvent | TouchEvent, refValue: Element | null): boolean {
  if (!refValue || ('button' in event && event.button > 0)) {
    return false;
  }

  if (!isTargetInDocument(getEventTarget(event))) {
    return false;
  }

  let target = getEventTarget(event);
  if (target instanceof Element && target.closest('[data-react-aria-top-layer]')) {
    return false;
  }

  return !event.composedPath().includes(refValue);
}

export function useInteractOutside(props: InteractOutsideProps): void;
export function useInteractOutside(props: InteractOutsideProps): () => void;
export function useInteractOutside(props: InteractOutsideProps): () => void {
  let isDisabled = computed(() => Boolean(unref(props.isDisabled)));
  let state = {
    ignoreEmulatedMouseEvents: false,
    isPointerDown: false
  };
  let removeListeners = () => {};
  let ownerDocument = computed(() => {
    if (typeof document === 'undefined') {
      return null;
    }

    return getOwnerDocument(unref(props.ref));
  });

  let attachListeners = () => {
    if (isDisabled.value || ownerDocument.value == null) {
      return;
    }
    let documentObject = ownerDocument.value;

    let onPointerDown = (event: MouseEvent | PointerEvent | TouchEvent) => {
      let target = unref(props.ref);
      if (props.onInteractOutside && isValidEvent(event, target)) {
        props.onInteractOutsideStart?.(event);
        state.isPointerDown = true;
      } else {
        state.isPointerDown = false;
      }
    };

    if (typeof PointerEvent !== 'undefined') {
      let onClick = (event: MouseEvent) => {
        let target = unref(props.ref);
        if (state.isPointerDown && isValidEvent(event, target)) {
          props.onInteractOutside?.(event);
        }

        state.isPointerDown = false;
      };

      documentObject.addEventListener('pointerdown', onPointerDown as EventListener, true);
      documentObject.addEventListener('click', onClick, true);

      removeListeners = () => {
        documentObject.removeEventListener('pointerdown', onPointerDown as EventListener, true);
        documentObject.removeEventListener('click', onClick, true);
        removeListeners = () => {};
        state.isPointerDown = false;
        state.ignoreEmulatedMouseEvents = false;
      };
      return;
    }

    let onMouseUp = (event: MouseEvent) => {
      let target = unref(props.ref);
      if (state.ignoreEmulatedMouseEvents) {
        state.ignoreEmulatedMouseEvents = false;
      } else if (state.isPointerDown && isValidEvent(event, target)) {
        props.onInteractOutside?.(event);
      }

      state.isPointerDown = false;
    };

    let onTouchEnd = (event: TouchEvent) => {
      let target = unref(props.ref);
      state.ignoreEmulatedMouseEvents = true;
      if (state.isPointerDown && isValidEvent(event, target)) {
        props.onInteractOutside?.(event);
      }

      state.isPointerDown = false;
    };

    documentObject.addEventListener('mousedown', onPointerDown as EventListener, true);
    documentObject.addEventListener('mouseup', onMouseUp, true);
    documentObject.addEventListener('touchstart', onPointerDown as EventListener, true);
    documentObject.addEventListener('touchend', onTouchEnd, true);

    removeListeners = () => {
      documentObject.removeEventListener('mousedown', onPointerDown as EventListener, true);
      documentObject.removeEventListener('mouseup', onMouseUp, true);
      documentObject.removeEventListener('touchstart', onPointerDown as EventListener, true);
      documentObject.removeEventListener('touchend', onTouchEnd, true);
      removeListeners = () => {};
      state.isPointerDown = false;
      state.ignoreEmulatedMouseEvents = false;
    };
  };

  let stopWatch = watch(
    [isDisabled, ownerDocument],
    ([nextIsDisabled]) => {
      removeListeners();
      if (!nextIsDisabled) {
        attachListeners();
      }
    },
    {immediate: true}
  );

  let stop = () => {
    stopWatch();
    removeListeners();
  };
  if (getCurrentScope()) {
    onScopeDispose(stop);
  }

  return stop;
}
