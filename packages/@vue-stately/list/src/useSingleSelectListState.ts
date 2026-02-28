import {computed, type ComputedRef, type Ref, ref, watch} from 'vue';
import {type Key, type ListNode} from './ListCollection';
import {type ListProps, type ListState, useListState} from './useListState';
import {useControlledState} from '@vue-stately/utils';

function equalSets(a: Set<Key>, b: Set<Key>): boolean {
  if (a.size !== b.size) {
    return false;
  }

  for (let key of a) {
    if (!b.has(key)) {
      return false;
    }
  }

  return true;
}

export interface SingleSelectListProps<T> extends Omit<ListProps<T>, 'defaultSelectedKeys' | 'disallowEmptySelection' | 'onSelectionChange' | 'selectedKeys' | 'selectionMode'> {
  defaultSelectedKey?: Key | null,
  onSelectionChange?: (key: Key | null) => void,
  selectedKey?: Ref<Key | null | undefined>
}

export interface SingleSelectListState<T> extends ListState<T> {
  selectedItem: ComputedRef<ListNode<T> | null>,
  selectedKey: Ref<Key | null>,
  setSelectedKey: (key: Key | null) => void
}

/**
 * Provides state management for list-like components with single selection.
 */
export function useSingleSelectListState<T extends object>(props: SingleSelectListProps<T>): SingleSelectListState<T> {
  let [selectedKey, setSelectedKeyInternal] = useControlledState<Key | null>(
    props.selectedKey,
    props.defaultSelectedKey ?? null,
    props.onSelectionChange
  );

  let selectedKeys = ref(selectedKey.value == null ? new Set<Key>() : new Set<Key>([selectedKey.value]));
  let isSyncingSelection = false;

  let listState = useListState({
    ...props,
    allowDuplicateSelectionEvents: true,
    disallowEmptySelection: true,
    selectedKeys,
    selectionMode: 'single',
    onSelectionChange: (keys) => {
      if (isSyncingSelection) {
        return;
      }

      let key = keys.values().next().value ?? null;
      if (key === selectedKey.value && props.onSelectionChange) {
        props.onSelectionChange(key);
      }

      setSelectedKeyInternal(key);
    }
  });

  watch(selectedKey, (nextKey) => {
    let nextKeys = nextKey == null ? new Set<Key>() : new Set<Key>([nextKey]);
    if (!equalSets(nextKeys, listState.selectionManager.selectedKeys.value)) {
      isSyncingSelection = true;
      try {
        listState.selectionManager.setSelectedKeys(nextKeys);
      } finally {
        isSyncingSelection = false;
      }
    }
  }, {flush: 'sync'});

  let setSelectedKey = (key: Key | null): void => {
    setSelectedKeyInternal(key);
  };

  let selectedItem = computed(() => {
    return selectedKey.value == null
      ? null
      : listState.collection.getItem(selectedKey.value);
  });

  return {
    ...listState,
    selectedKey,
    setSelectedKey,
    selectedItem
  };
}
