import {computed, inject, provide, ref, type ComputedRef, type Ref} from 'vue';

export interface ModalContextValue {
  parent: ModalContextValue | null,
  modalCount: Ref<number>,
  addModal: () => void,
  removeModal: () => void
}

const modalContextSymbol = Symbol('VueAriaModalContext');

export function useModalContext(): ModalContextValue | null {
  return inject(modalContextSymbol, null);
}

export function useCreateModalProvider(): {
  modalProviderProps: ComputedRef<{
    'aria-hidden': true | undefined
  }>,
  parent: ModalContextValue | null
} {
  let parent = inject(modalContextSymbol, null);
  let modalCount = ref(0);

  let context: ModalContextValue = {
    parent,
    modalCount,
    addModal() {
      modalCount.value += 1;
      parent?.addModal();
    },
    removeModal() {
      modalCount.value = Math.max(0, modalCount.value - 1);
      parent?.removeModal();
    }
  };

  provide(modalContextSymbol, context);

  return {
    modalProviderProps: computed(() => ({
      'aria-hidden': modalCount.value > 0 ? true : undefined
    })),
    parent
  };
}
