import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import type {MaybeRef, SelectionKey, SelectionManager} from './types';

export interface AriaSelectableListOptions {
  isDisabled?: MaybeRef<boolean>,
  selectedKeys?: Ref<Set<SelectionKey>>,
  selectionMode?: MaybeRef<'multiple' | 'none' | 'single'>
}

export interface SelectableListAria {
  listProps: ComputedRef<{
    'aria-disabled'?: true,
    role: 'listbox'
  }>,
  selectionManager: SelectionManager
}

export function useSelectableList(options: AriaSelectableListOptions = {}): SelectableListAria {
  let selectedKeys = options.selectedKeys ?? ref(new Set<SelectionKey>());
  let focusedKey = ref<SelectionKey | null>(null);
  let selectionMode = computed(() => unref(options.selectionMode) ?? 'single');
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));

  let selectionManager: SelectionManager = {
    focusedKey,
    selectionMode: selectionMode.value,
    selectedKeys,
    setFocusedKey: (key) => {
      focusedKey.value = key;
    },
    select: (key) => {
      if (isDisabled.value || selectionMode.value === 'none') {
        return;
      }

      if (selectionMode.value === 'single') {
        selectedKeys.value = new Set([key]);
        focusedKey.value = key;
        return;
      }

      let nextKeys = new Set(selectedKeys.value);
      if (nextKeys.has(key)) {
        nextKeys.delete(key);
      } else {
        nextKeys.add(key);
      }
      selectedKeys.value = nextKeys;
      focusedKey.value = key;
    }
  };

  return {
    listProps: computed(() => ({
      role: 'listbox' as const,
      'aria-disabled': isDisabled.value ? true : undefined
    })),
    selectionManager
  };
}
