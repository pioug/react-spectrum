import {computed, type ComputedRef, unref} from 'vue';
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
  return {
    modalProps: computed(() => ({
      'data-ismodal': !unref(options.isDisabled)
    }))
  };
}
