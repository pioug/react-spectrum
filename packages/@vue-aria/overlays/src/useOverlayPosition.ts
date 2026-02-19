import {computed, type ComputedRef, ref, type Ref, unref, watch} from 'vue';
import type {MaybeRef} from './types';

export type OverlayPlacement =
  | 'bottom'
  | 'bottom end'
  | 'bottom start'
  | 'left'
  | 'right'
  | 'top'
  | 'top end'
  | 'top start';

export interface AriaOverlayPositionOptions {
  crossOffset?: MaybeRef<number | undefined>,
  isOpen?: MaybeRef<boolean>,
  offset?: MaybeRef<number | undefined>,
  overlayRef: Ref<HTMLElement | null>,
  placement?: MaybeRef<OverlayPlacement | undefined>,
  targetRef: Ref<HTMLElement | null>
}

export interface PositionAria {
  arrowProps: ComputedRef<{
    style: {
      left: string,
      top: string
    }
  }>,
  dispose: () => void,
  overlayProps: ComputedRef<{
    style: {
      left: string,
      position: 'absolute',
      top: string
    }
  }>,
  placement: ComputedRef<OverlayPlacement>,
  triggerAnchorPoint: ComputedRef<{x: number, y: number} | null>,
  updatePosition: () => void
}

interface PositionState {
  left: number,
  placement: OverlayPlacement,
  top: number,
  triggerAnchorPoint: {x: number, y: number} | null
}

function resolvePlacement(placement: OverlayPlacement | undefined): OverlayPlacement {
  return placement ?? 'bottom';
}

export function useOverlayPosition(options: AriaOverlayPositionOptions): PositionAria {
  let positionState = ref<PositionState>({
    left: 0,
    placement: resolvePlacement(unref(options.placement)),
    top: 0,
    triggerAnchorPoint: null
  });

  let isOpen = computed(() => Boolean(unref(options.isOpen)));
  let offset = computed(() => unref(options.offset) ?? 8);
  let crossOffset = computed(() => unref(options.crossOffset) ?? 0);
  let placement = computed(() => resolvePlacement(unref(options.placement)));

  let updatePosition = () => {
    if (typeof window === 'undefined') {
      return;
    }

    let targetElement = options.targetRef.value;
    let overlayElement = options.overlayRef.value;
    if (!targetElement || !overlayElement) {
      return;
    }

    let targetRect = targetElement.getBoundingClientRect();
    let overlayRect = overlayElement.getBoundingClientRect();

    let nextTop = targetRect.bottom + offset.value + window.scrollY;
    let nextLeft = targetRect.left + window.scrollX;
    let nextPlacement = placement.value;

    if (placement.value.startsWith('top')) {
      nextTop = targetRect.top - overlayRect.height - offset.value + window.scrollY;
    }

    if (placement.value === 'left') {
      nextTop = targetRect.top + window.scrollY;
      nextLeft = targetRect.left - overlayRect.width - offset.value + window.scrollX;
    } else if (placement.value === 'right') {
      nextTop = targetRect.top + window.scrollY;
      nextLeft = targetRect.right + offset.value + window.scrollX;
    } else if (placement.value.endsWith('end')) {
      nextLeft = targetRect.right - overlayRect.width + window.scrollX;
    } else if (!placement.value.endsWith('start')) {
      nextLeft = targetRect.left + (targetRect.width - overlayRect.width) / 2 + window.scrollX;
    }

    if (placement.value.startsWith('top') || placement.value.startsWith('bottom')) {
      nextLeft += crossOffset.value;
    } else {
      nextTop += crossOffset.value;
    }

    positionState.value = {
      left: Math.round(nextLeft),
      placement: nextPlacement,
      top: Math.round(nextTop),
      triggerAnchorPoint: {
        x: Math.round(targetRect.left + targetRect.width / 2 + window.scrollX),
        y: Math.round(targetRect.top + targetRect.height / 2 + window.scrollY)
      }
    };
  };

  let stopWatch = watch(
    [isOpen, placement, offset, crossOffset],
    ([open], _, onCleanup) => {
      if (!open || typeof window === 'undefined') {
        return;
      }

      updatePosition();

      let onWindowChange = () => {
        updatePosition();
      };

      window.addEventListener('resize', onWindowChange);
      window.addEventListener('scroll', onWindowChange, true);

      onCleanup(() => {
        window.removeEventListener('resize', onWindowChange);
        window.removeEventListener('scroll', onWindowChange, true);
      });
    },
    {immediate: true}
  );

  return {
    arrowProps: computed(() => ({
      style: {
        left: '50%',
        top: '50%'
      }
    })),
    dispose: () => {
      stopWatch();
    },
    overlayProps: computed(() => ({
      style: {
        position: 'absolute' as const,
        top: `${positionState.value.top}px`,
        left: `${positionState.value.left}px`
      }
    })),
    placement: computed(() => positionState.value.placement),
    triggerAnchorPoint: computed(() => positionState.value.triggerAnchorPoint),
    updatePosition
  };
}
