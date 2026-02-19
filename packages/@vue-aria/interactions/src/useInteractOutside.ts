import {computed, unref, watch} from 'vue';
import {getEventTarget, nodeContains} from './utils';
import type {MaybeRef} from './types';

export interface InteractOutsideProps {
  isDisabled?: MaybeRef<boolean>,
  onInteractOutside?: (event: MouseEvent | PointerEvent) => void,
  onInteractOutsideStart?: (event: MouseEvent | PointerEvent) => void,
  ref: MaybeRef<Element | null>
}

function isTargetInDocument(target: EventTarget | null): boolean {
  return target instanceof Node && nodeContains(target.ownerDocument?.documentElement ?? null, target);
}

function isValidEvent(event: MouseEvent | PointerEvent, refValue: Element | null): boolean {
  if (!refValue || event.button > 0) {
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
  let isPointerDown = false;
  let removeListeners = () => {};

  let attachListeners = () => {
    if (isDisabled.value || typeof document === 'undefined') {
      return;
    }

    let onPointerDown = (event: PointerEvent) => {
      let target = unref(props.ref);
      if (isValidEvent(event, target)) {
        props.onInteractOutsideStart?.(event);
        isPointerDown = true;
      } else {
        isPointerDown = false;
      }
    };

    let onClick = (event: MouseEvent) => {
      let target = unref(props.ref);
      if (isPointerDown && isValidEvent(event, target)) {
        props.onInteractOutside?.(event);
      }

      isPointerDown = false;
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('click', onClick, true);

    removeListeners = () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('click', onClick, true);
      removeListeners = () => {};
      isPointerDown = false;
    };
  };

  let stopWatch = watch(
    isDisabled,
    (nextIsDisabled) => {
      removeListeners();
      if (!nextIsDisabled) {
        attachListeners();
      }
    },
    {immediate: true}
  );

  return () => {
    stopWatch();
    removeListeners();
  };
}
