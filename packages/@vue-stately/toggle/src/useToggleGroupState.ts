import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;
export type Key = string | number;

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
  let isControlled = computed(() => props.selectedKeys !== undefined && props.selectedKeys.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let uncontrolledSelectedKeys = ref(new Set<Key>(props.defaultSelectedKeys ?? []));
  let selectedKeys = computed<Set<Key>>({
    get: () => {
      if (props.selectedKeys && props.selectedKeys.value !== undefined) {
        return props.selectedKeys.value;
      }

      return uncontrolledSelectedKeys.value;
    },
    set: (nextKeys) => {
      if (props.selectedKeys) {
        props.selectedKeys.value = nextKeys;
      } else {
        uncontrolledSelectedKeys.value = nextKeys;
      }
    }
  });

  let commitSelectedKeys = (keys: Set<Key>): void => {
    let nextKeys = new Set(keys);
    if (selectionMode.value === 'single' && nextKeys.size > 1) {
      let firstKey = nextKeys.values().next().value;
      nextKeys = firstKey == null ? new Set() : new Set([firstKey]);
    }

    if (disallowEmptySelection.value && nextKeys.size === 0 && selectedKeys.value.size > 0) {
      return;
    }

    if (equalSets(nextKeys, selectedKeys.value)) {
      return;
    }

    selectedKeys.value = nextKeys;
    props.onSelectionChange?.(new Set(nextKeys));
  };

  let toggleKey = (key: Key): void => {
    if (isDisabled.value) {
      return;
    }

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
