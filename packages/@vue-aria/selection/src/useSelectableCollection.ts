import {computed, type ComputedRef, unref} from 'vue';
import {getFocusedKey, getSelectedKeys, getSelectionMode} from './selectionManagerAccess';
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
      let focusedKey = getFocusedKey(options.selectionManager);
      let nextKey = focusedKey != null
        ? options.keyboardDelegate.getKeyBelow(focusedKey)
        : options.keyboardDelegate.getFirstKey();
      if (nextKey != null) {
        options.selectionManager.setFocusedKey(nextKey);
        if (getSelectionMode(options.selectionManager) !== 'none') {
          options.selectionManager.select(nextKey);
          options.onSelectionChange?.(new Set(getSelectedKeys(options.selectionManager)));
        }
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      let focusedKey = getFocusedKey(options.selectionManager);
      let previousKey = focusedKey != null
        ? options.keyboardDelegate.getKeyAbove(focusedKey)
        : options.keyboardDelegate.getLastKey();
      if (previousKey != null) {
        options.selectionManager.setFocusedKey(previousKey);
        if (getSelectionMode(options.selectionManager) !== 'none') {
          options.selectionManager.select(previousKey);
          options.onSelectionChange?.(new Set(getSelectedKeys(options.selectionManager)));
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
