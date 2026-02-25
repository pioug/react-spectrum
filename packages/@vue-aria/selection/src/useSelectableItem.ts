import {computed, type ComputedRef, unref} from 'vue';
import {getFocusedKey, getSelectedKeys} from './selectionManagerAccess';
import type {MaybeRef, SelectionKey, SelectionManager} from './types';

export interface SelectableItemStates {
  allowsSelection?: MaybeRef<boolean>,
  isDisabled?: MaybeRef<boolean>,
  isPressed?: MaybeRef<boolean>,
  isSelected?: MaybeRef<boolean>
}

export interface SelectableItemOptions {
  key: MaybeRef<SelectionKey>,
  onAction?: (key: SelectionKey) => void
}

export interface SelectableItemAria {
  itemProps: ComputedRef<{
    'aria-disabled'?: true,
    'aria-selected': boolean,
    onClick: () => void,
    role: 'option'
  }>,
  states: ComputedRef<{
    allowsSelection: boolean,
    isDisabled: boolean,
    isFocused: boolean,
    isPressed: boolean,
    isSelected: boolean
  }>
}

export function useSelectableItem(
  options: SelectableItemOptions,
  selectionManager: SelectionManager,
  states: SelectableItemStates = {}
): SelectableItemAria {
  let key = computed(() => unref(options.key));
  let isDisabled = computed(() => Boolean(unref(states.isDisabled)));
  let isSelected = computed(() => unref(states.isSelected) ?? getSelectedKeys(selectionManager).has(key.value));
  let isPressed = computed(() => Boolean(unref(states.isPressed)));
  let allowsSelection = computed(() => unref(states.allowsSelection) ?? true);

  let select = () => {
    if (isDisabled.value) {
      return;
    }

    if (allowsSelection.value) {
      selectionManager.select(key.value);
    }
    options.onAction?.(key.value);
  };

  return {
    itemProps: computed(() => ({
      role: 'option' as const,
      'aria-selected': isSelected.value,
      'aria-disabled': isDisabled.value ? true : undefined,
      onClick: select
    })),
    states: computed(() => ({
      allowsSelection: allowsSelection.value,
      isDisabled: isDisabled.value,
      isFocused: getFocusedKey(selectionManager) === key.value,
      isPressed: isPressed.value,
      isSelected: isSelected.value
    }))
  };
}
