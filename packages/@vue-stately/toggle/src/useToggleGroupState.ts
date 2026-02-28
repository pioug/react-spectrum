import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {useControlledState} from '@vue-stately/utils';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;
export type Key = string | number;

export interface ToggleGroupProps {
  defaultSelectedKeys?: Iterable<Key>,
  disallowEmptySelection?: MaybeRef<boolean>,
  isDisabled?: MaybeRef<boolean>,
  onSelectionChange?: (keys: Set<Key>) => void,
  selectedKeys?: Ref<Set<Key> | undefined>,
  selectionMode?: MaybeRef<'multiple' | 'single'>
}

export interface ToggleGroupState {
  isDisabled: ComputedRef<boolean>,
  selectedKeys: ComputedRef<Set<Key>>,
  selectionMode: ComputedRef<'multiple' | 'single'>,
  setSelected: (key: Key, isSelected: boolean) => void,
  setSelectedKeys: (keys: Set<Key>) => void,
  toggleKey: (key: Key) => void
}

/**
 * Provides state management for groups of toggles.
 */
export function useToggleGroupState(props: ToggleGroupProps): ToggleGroupState {
  let selectionMode = computed(() => unref(props.selectionMode) ?? 'single');
  let disallowEmptySelection = computed(() => Boolean(unref(props.disallowEmptySelection)));
  let isDisabled = computed(() => Boolean(unref(props.isDisabled)));
  let [selectedKeys, setSelectedKeysInternal] = useControlledState<Set<Key>>(
    props.selectedKeys,
    new Set<Key>(props.defaultSelectedKeys ?? []),
    props.onSelectionChange
  );

  let commitSelectedKeys = (keys: Set<Key>): void => {
    setSelectedKeysInternal(keys);
  };

  let toggleKey = (key: Key): void => {
    let keys: Set<Key>;
    if (selectionMode.value === 'multiple') {
      keys = new Set(selectedKeys.value);
      if (keys.has(key) && (!disallowEmptySelection.value || keys.size > 1)) {
        keys.delete(key);
      } else {
        keys.add(key);
      }
    } else {
      let hasKey = selectedKeys.value.has(key);
      keys = new Set(hasKey && !disallowEmptySelection.value ? [] : [key]);
    }

    commitSelectedKeys(keys);
  };

  let setSelected = (key: Key, selected: boolean): void => {
    if (selected !== selectedKeys.value.has(key)) {
      toggleKey(key);
    }
  };

  let setSelectedKeys = (keys: Set<Key>): void => {
    commitSelectedKeys(keys);
  };

  return {
    selectionMode,
    isDisabled,
    selectedKeys,
    toggleKey,
    setSelected,
    setSelectedKeys
  };
}
