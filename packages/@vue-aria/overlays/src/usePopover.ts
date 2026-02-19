import {ariaHideOutside} from './ariaHideOutside';
import {computed, type ComputedRef, type Ref, unref, watch} from 'vue';
import type {MaybeRef} from './types';
import {type OverlayPlacement, useOverlayPosition} from './useOverlayPosition';
import {useOverlay} from './useOverlay';
import {usePreventScroll} from './usePreventScroll';

export interface AriaPopoverOptions {
  isKeyboardDismissDisabled?: MaybeRef<boolean>,
  isNonModal?: MaybeRef<boolean>,
  isOpen?: MaybeRef<boolean>,
  offset?: MaybeRef<number | undefined>,
  onClose?: () => void,
  placement?: MaybeRef<OverlayPlacement | undefined>,
  popoverRef: Ref<HTMLElement | null>,
  shouldCloseOnInteractOutside?: (element: Element) => boolean,
  triggerRef: Ref<HTMLElement | null>
}

export interface PopoverAria {
  arrowProps: ComputedRef<{
    style: {
      left: string,
      top: string
    }
  }>,
  dispose: () => void,
  placement: ComputedRef<OverlayPlacement>,
  popoverProps: ComputedRef<{
    onKeyDown: (event: KeyboardEvent) => void,
    role: 'dialog',
    style: {
      left: string,
      position: 'absolute',
      top: string
    }
  }>,
  triggerAnchorPoint: ComputedRef<{x: number, y: number} | null>,
  underlayProps: ComputedRef<{
    onPointerDown: (event: PointerEvent) => void
  }>
}

export function usePopover(options: AriaPopoverOptions): PopoverAria {
  let isOpen = computed(() => Boolean(unref(options.isOpen)));
  let isNonModal = computed(() => Boolean(unref(options.isNonModal)));

  let overlay = useOverlay({
    isDismissable: computed(() => !isNonModal.value),
    isKeyboardDismissDisabled: options.isKeyboardDismissDisabled,
    isOpen,
    onClose: options.onClose,
    overlayRef: options.popoverRef,
    shouldCloseOnBlur: true,
    shouldCloseOnInteractOutside: options.shouldCloseOnInteractOutside
  });

  let position = useOverlayPosition({
    isOpen,
    offset: options.offset,
    overlayRef: options.popoverRef,
    placement: options.placement,
    targetRef: options.triggerRef
  });

  let preventScroll = usePreventScroll({
    isDisabled: computed(() => isNonModal.value || !isOpen.value)
  });

  let stopWatch = watch(
    [isOpen, isNonModal],
    ([open, nonModal], _, onCleanup) => {
      if (!open || nonModal) {
        return;
      }

      let restoreVisibility = ariaHideOutside([options.popoverRef.value]);
      onCleanup(() => {
        restoreVisibility();
      });
    },
    {immediate: true}
  );

  return {
    arrowProps: position.arrowProps,
    dispose: () => {
      stopWatch();
      preventScroll.dispose();
      position.dispose();
      overlay.dispose();
    },
    placement: position.placement,
    popoverProps: computed(() => ({
      role: 'dialog' as const,
      onKeyDown: overlay.overlayProps.value.onKeyDown,
      style: position.overlayProps.value.style
    })),
    triggerAnchorPoint: position.triggerAnchorPoint,
    underlayProps: overlay.underlayProps
  };
}
