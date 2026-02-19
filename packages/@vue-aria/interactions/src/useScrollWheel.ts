import {computed, unref, watch} from 'vue';
import type {MaybeRef} from './types';

export interface ScrollWheelEvent {
  deltaX: number,
  deltaY: number
}

export interface ScrollWheelProps {
  isDisabled?: MaybeRef<boolean>,
  onScroll?: (event: ScrollWheelEvent) => void
}

export function useScrollWheel(props: ScrollWheelProps, ref: MaybeRef<HTMLElement | null>): () => void {
  let isDisabled = computed(() => Boolean(unref(props.isDisabled)));
  let removeListener = () => {};

  let bind = () => {
    let target = unref(ref);
    if (!target || isDisabled.value) {
      return;
    }

    let onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      props.onScroll?.({
        deltaX: event.deltaX,
        deltaY: event.deltaY
      });
    };

    target.addEventListener('wheel', onWheel, {passive: false});
    removeListener = () => {
      target.removeEventListener('wheel', onWheel);
      removeListener = () => {};
    };
  };

  let stopWatch = watch(
    [isDisabled, () => unref(ref)],
    () => {
      removeListener();
      bind();
    },
    {immediate: true}
  );

  return () => {
    stopWatch();
    removeListener();
  };
}
