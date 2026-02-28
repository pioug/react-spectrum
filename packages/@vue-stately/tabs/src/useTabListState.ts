import {type Key, type SingleSelectListProps, type SingleSelectListState, useSingleSelectListState} from '@vue-stately/list';
import {ref, watchEffect} from 'vue';

type TabCollection = {
  getFirstKey: () => Key | null,
  getLastKey: () => Key | null,
  getKeyAfter: (key: Key) => Key | null,
  getItem: (key: Key) => {props?: {isDisabled?: boolean}} | null | undefined
};

function findDefaultSelectedKey(collection: TabCollection | undefined, disabledKeys: Set<Key>): Key | null {
  if (collection == null) {
    return null;
  }

  let selectedKey = collection.getFirstKey();
  while (
    selectedKey != null &&
    (disabledKeys.has(selectedKey) || Boolean(collection.getItem(selectedKey)?.props?.isDisabled)) &&
    selectedKey !== collection.getLastKey()
  ) {
    selectedKey = collection.getKeyAfter(selectedKey);
  }

  if (
    selectedKey != null &&
    (disabledKeys.has(selectedKey) || Boolean(collection.getItem(selectedKey)?.props?.isDisabled)) &&
    selectedKey === collection.getLastKey()
  ) {
    selectedKey = collection.getFirstKey();
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
    get collection() {
      return props.collection;
    },
    get disabledKeys() {
      return props.disabledKeys;
    },
    get filter() {
      return props.filter;
    },
    get items() {
      return props.items;
    },
    get layoutDelegate() {
      return props.layoutDelegate;
    },
    get selectedKey() {
      return props.selectedKey;
    },
    onSelectionChange: props.onSelectionChange
      ? (key) => {
        if (key != null) {
          props.onSelectionChange?.(key);
        }
      }
      : undefined,
    suppressTextValueWarning: true,
    defaultSelectedKey:
      props.defaultSelectedKey
      ?? findDefaultSelectedKey(props.collection, props.disabledKeys ? new Set(props.disabledKeys) : new Set())
      ?? undefined
  });

  let lastSelectedKey = ref<Key | null>(state.selectedKey.value);
  watchEffect(() => {
    let selectedKey = state.selectedKey.value;
    if (
      props.selectedKey == null &&
      (state.selectionManager.isEmpty || selectedKey == null || !state.collection.getItem(selectedKey))
    ) {
      let fallbackKey = findDefaultSelectedKey(state.collection, state.disabledKeys);
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
    get collection() {
      return state.collection;
    },
    get disabledKeys() {
      return state.disabledKeys;
    },
    get selectionManager() {
      return state.selectionManager;
    },
    selectedItem: state.selectedItem,
    selectedKey: state.selectedKey,
    setSelectedKey: state.setSelectedKey,
    isDisabled: Boolean(props.isDisabled)
  };
}
