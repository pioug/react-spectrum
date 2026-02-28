import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';

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
      if (isControlled.value && props.selectedKeys) {
        return props.selectedKeys.value;
      }

      return uncontrolledSelectedKeys.value;
    },
    set: (nextKeys) => {
      if (isControlled.value && props.selectedKeys) {
        props.selectedKeys.value = nextKeys;
      } else {
        uncontrolledSelectedKeys.value = nextKeys;
      }
    }
  });

  let commitSelectedKeys = (keys: Set<Key>): void => {
    if (Object.is(keys, selectedKeys.value)) {
      return;
    }

    selectedKeys.value = keys;
    props.onSelectionChange?.(keys);
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
