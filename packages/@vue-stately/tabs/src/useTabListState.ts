import {type Key, type SingleSelectListProps, type SingleSelectListState, useSingleSelectListState} from '@vue-stately/list';
import {ref, watchEffect} from 'vue';

function findDefaultSelectedKey<T>(state: SingleSelectListState<T>): Key | null {
  let selectedKey = state.collection.getFirstKey();
  while (
    selectedKey != null &&
    (state.disabledKeys.has(selectedKey) || Boolean(state.collection.getItem(selectedKey)?.props?.isDisabled)) &&
    selectedKey !== state.collection.getLastKey()
  ) {
    selectedKey = state.collection.getKeyAfter(selectedKey);
  }

  if (
    selectedKey != null &&
    (state.disabledKeys.has(selectedKey) || Boolean(state.collection.getItem(selectedKey)?.props?.isDisabled)) &&
    selectedKey === state.collection.getLastKey()
  ) {
    selectedKey = state.collection.getFirstKey();
  }

  return selectedKey;
}

export interface TabListStateOptions<T> extends Omit<SingleSelectListProps<T>, 'onSelectionChange'> {
  isDisabled?: boolean,
  onSelectionChange?: (key: Key) => void
}

export interface TabListState<T> extends SingleSelectListState<T> {
  isDisabled: boolean
}

/**
 * Provides state management for tab lists with single selection and focus synchronization.
 */
export function useTabListState<T extends object>(props: TabListStateOptions<T>): TabListState<T> {
  let state = useSingleSelectListState<T>({
    ...props,
    onSelectionChange: props.onSelectionChange
      ? (key) => {
        if (key != null) {
          props.onSelectionChange?.(key);
        }
      }
      : undefined,
    suppressTextValueWarning: true
  });

  let lastSelectedKey = ref<Key | null>(state.selectedKey.value);
  watchEffect(() => {
    let selectedKey = state.selectedKey.value;
    if (
      props.selectedKey == null &&
      (state.selectionManager.isEmpty || selectedKey == null || !state.collection.getItem(selectedKey))
    ) {
      let fallbackKey = findDefaultSelectedKey(state);
      if (fallbackKey != null) {
        state.selectionManager.setSelectedKeys(new Set([fallbackKey]));
        selectedKey = fallbackKey;
      }
    }

    if (
      (selectedKey != null && state.selectionManager.focusedKey.value == null)
      || (!state.selectionManager.isFocused.value && selectedKey !== lastSelectedKey.value)
    ) {
      state.selectionManager.setFocusedKey(selectedKey);
    }

    lastSelectedKey.value = selectedKey;
  });

  return {
    ...state,
    isDisabled: Boolean(props.isDisabled)
  };
}
