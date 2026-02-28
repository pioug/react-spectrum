import {ariaHideOutside} from './ariaHideOutside';
import {computed, type ComputedRef, type Ref, unref, watch} from 'vue';
import type {MaybeRef} from './types';
import {useOverlay} from './useOverlay';
import {usePreventScroll} from './usePreventScroll';

export interface AriaModalOverlayOptions {
  isDismissable?: MaybeRef<boolean>,
  isKeyboardDismissDisabled?: MaybeRef<boolean>,
  isOpen?: MaybeRef<boolean>,
  modalRef: Ref<HTMLElement | null>,
  onClose?: () => void,
  shouldCloseOnInteractOutside?: (element: Element) => boolean
}

export interface ModalOverlayAria {
  dispose: () => void,
  modalProps: ComputedRef<{
    'data-ismodal': boolean,
    onKeyDown: (event: KeyboardEvent) => void,
    role: 'dialog'
  }>,
  underlayProps: ComputedRef<{
    onPointerDown: (event: PointerEvent) => void
  }>
}

export function useModalOverlay(options: AriaModalOverlayOptions): ModalOverlayAria {
  let isOpen = computed(() => Boolean(unref(options.isOpen)));
  let overlay = useOverlay({
    isDismissable: options.isDismissable,
    isKeyboardDismissDisabled: options.isKeyboardDismissDisabled,
    isOpen,
    onClose: options.onClose,
    overlayRef: options.modalRef,
    shouldCloseOnInteractOutside: options.shouldCloseOnInteractOutside
  });
  let preventScroll = usePreventScroll({
    isDisabled: computed(() => !isOpen.value)
  });

  let stopWatch = watch(
    isOpen,
    (open, _, onCleanup) => {
      if (!open) {
        return;
      }

      let restoreVisibility = ariaHideOutside([options.modalRef.value]);
      onCleanup(() => {
        restoreVisibility();
      });
    },
    {immediate: true}
  );

  return {
    dispose: () => {
      stopWatch();
      preventScroll.dispose();
      overlay.dispose();
    },
    modalProps: computed(() => ({
      'data-ismodal': isOpen.value,
      role: 'dialog' as const,
      onKeyDown: overlay.overlayProps.value.onKeyDown
    })),
    underlayProps: overlay.underlayProps
  };
}
