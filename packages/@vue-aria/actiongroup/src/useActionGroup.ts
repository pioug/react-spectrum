import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type ActionGroupSelectionMode = 'none' | 'single' | 'multiple';

export interface ActionGroupOptions {
  disabledKeys?: MaybeRef<Iterable<string>>,
  selectedKeys?: MaybeRef<Iterable<string>>,
  selectionMode?: MaybeRef<ActionGroupSelectionMode>
}

export interface ActionGroupAria {
  disabledKeys: ComputedRef<Set<string>>,
  isDisabled: (key: string) => boolean,
  isSelected: (key: string) => boolean,
  selectionMode: ComputedRef<ActionGroupSelectionMode>,
  selectedKeys: ComputedRef<Set<string>>,
  toggleKey: (key: string) => Set<string>
}

function toKeySet(value: MaybeRef<Iterable<string>> | undefined): Set<string> {
  let currentValue = value === undefined ? undefined : unref(value);
  if (!currentValue) {
    return new Set();
  }

  return new Set(Array.from(currentValue, (entry) => String(entry)));
}

function normalizeSelectionMode(value: ActionGroupSelectionMode | undefined): ActionGroupSelectionMode {
  if (value === 'single' || value === 'multiple') {
    return value;
  }

  return 'none';
}

export function useActionGroup(options: ActionGroupOptions = {}): ActionGroupAria {
  let selectionMode = computed(() => normalizeSelectionMode(unref(options.selectionMode)));
  let selectedKeys = computed(() => toKeySet(options.selectedKeys));
  let disabledKeys = computed(() => toKeySet(options.disabledKeys));

  let isSelected = (key: string) => selectedKeys.value.has(key);
  let isDisabled = (key: string) => disabledKeys.value.has(key);

  let toggleKey = (key: string): Set<string> => {
    let nextSelection = new Set(selectedKeys.value);

    if (isDisabled(key)) {
      return nextSelection;
    }

    if (selectionMode.value === 'none') {
      return nextSelection;
    }

    if (selectionMode.value === 'single') {
      if (nextSelection.has(key)) {
        nextSelection.clear();
      } else {
        nextSelection.clear();
        nextSelection.add(key);
      }

      return nextSelection;
    }

    if (nextSelection.has(key)) {
      nextSelection.delete(key);
    } else {
      nextSelection.add(key);
    }

    return nextSelection;
  };

  return {
    selectionMode,
    selectedKeys,
    disabledKeys,
    isSelected,
    isDisabled,
    toggleKey
  };
}
