import {computed, type ComputedRef, unref} from 'vue';
import type {KeyboardDelegate, MaybeRef, SelectionKey, SelectionManager} from './types';

export interface AriaSelectableCollectionOptions {
  disallowEmptySelection?: MaybeRef<boolean>,
  isDisabled?: MaybeRef<boolean>,
  keyboardDelegate: KeyboardDelegate,
  onSelectionChange?: (keys: Set<SelectionKey>) => void,
  selectionManager: SelectionManager
}

export interface SelectableCollectionAria {
  collectionProps: ComputedRef<{
    onKeyDown: (event: KeyboardEvent) => void,
    tabIndex: number
  }>
}

export function useSelectableCollection(options: AriaSelectableCollectionOptions): SelectableCollectionAria {
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));

  let onKeyDown = (event: KeyboardEvent) => {
    if (isDisabled.value) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      let fromKey = options.selectionManager.focusedKey.value ?? options.keyboardDelegate.getFirstKey();
      let nextKey = fromKey == null ? null : options.keyboardDelegate.getKeyBelow(fromKey);
      if (nextKey != null) {
        options.selectionManager.setFocusedKey(nextKey);
        if (options.selectionManager.selectionMode !== 'none') {
          options.selectionManager.select(nextKey);
          options.onSelectionChange?.(new Set(options.selectionManager.selectedKeys.value));
        }
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      let fromKey = options.selectionManager.focusedKey.value ?? options.keyboardDelegate.getLastKey();
      let previousKey = fromKey == null ? null : options.keyboardDelegate.getKeyAbove(fromKey);
      if (previousKey != null) {
        options.selectionManager.setFocusedKey(previousKey);
        if (options.selectionManager.selectionMode !== 'none') {
          options.selectionManager.select(previousKey);
          options.onSelectionChange?.(new Set(options.selectionManager.selectedKeys.value));
        }
      }
    }
  };

  return {
    collectionProps: computed(() => ({
      tabIndex: isDisabled.value ? -1 : 0,
      onKeyDown
    }))
  };
}
