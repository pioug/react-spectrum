import {computed, type ComputedRef, unref, watch} from 'vue';
import {useModalContext} from './modalContext';
import type {MaybeRef} from './types';

export interface AriaModalOptions {
  isDisabled?: MaybeRef<boolean>
}

export interface ModalAria {
  modalProps: ComputedRef<{
    'data-ismodal': boolean
  }>
}

export function useModal(options: AriaModalOptions = {}): ModalAria {
  let context = useModalContext();
  if (!context) {
    throw new Error('Modal is not contained within a provider');
  }

  watch(
    () => Boolean(unref(options.isDisabled)),
    (isDisabled, _, onCleanup) => {
      if (isDisabled || !context.parent) {
        return;
      }

      // Only mark ancestor providers hidden. The current provider must stay visible.
      context.parent.addModal();
      onCleanup(() => {
        context.parent?.removeModal();
      });
    },
    {
      immediate: true
    }
  );

  return {
    modalProps: computed(() => ({
      'data-ismodal': !unref(options.isDisabled)
    }))
  };
}
