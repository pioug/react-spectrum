import {computed, type Ref, ref, watch, watchEffect} from 'vue';
import {type Key, Selection as SelectionSet} from './Selection';
import {
  type MultipleSelectionState,
  type MultipleSelectionStateProps,
  type SelectionBehavior,
  type SelectionMode,
  type SelectionValue
} from './types';
import {useControlledState} from '@vue-stately/utils';

function selectionAsSet(selection: SelectionValue): Set<Key> {
  if (selection === 'all') {
    return new Set();
  }

  return selection;
}

function normalizeIncomingSelection(
  selection: SelectionValue | Iterable<Key> | null | undefined
): SelectionValue {
  if (selection == null) {
    return new SelectionSet();
  }

  if (selection === 'all') {
    return 'all';
  }

  return new SelectionSet(selection);
}

function normalizeSelection(
  selection: SelectionValue,
  selectionMode: SelectionMode,
  disallowEmptySelection: boolean,
  previousSelection: SelectionValue
): SelectionValue {
  if (selectionMode === 'none') {
    return new SelectionSet();
  }

  if (selection === 'all') {
    if (selectionMode === 'multiple') {
      return 'all';
    }

    let previousKeys = selectionAsSet(previousSelection);
    let firstKey = previousKeys.values().next().value;
    if (firstKey == null) {
      return new SelectionSet();
    }

    return new SelectionSet([firstKey], firstKey, firstKey);
  }

  let nextSelection = selection;
  if (selectionMode === 'single' && nextSelection.size > 1) {
    let firstKey = nextSelection.values().next().value;
    nextSelection = firstKey == null
      ? new SelectionSet()
      : new SelectionSet([firstKey], firstKey, firstKey);
  }

  if (disallowEmptySelection && nextSelection.size === 0) {
    if (previousSelection === 'all') {
      return previousSelection;
    }

    let previousKeys = selectionAsSet(previousSelection);
    if (previousKeys.size > 0) {
      return previousSelection;
    }
  }

  return nextSelection;
}

function equalSelections(a: SelectionValue, b: SelectionValue): boolean {
  if (a === 'all' || b === 'all') {
    return a === b;
  }

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

/**
 * Manages state for multiple selection and focus in a collection.
 */
export function useMultipleSelectionState(props: MultipleSelectionStateProps): MultipleSelectionState {
  let selectionBehaviorProp = computed<SelectionBehavior>(() => props.selectionBehavior ?? 'toggle');
  let selectionBehavior = ref<SelectionBehavior>(selectionBehaviorProp.value);
  let disabledKeysRef = computed(() => {
    return props.disabledKeys ? new Set(props.disabledKeys) : new Set<Key>();
  });
  let isFocused = ref(false);
  let focusedKey = ref<Key | null>(null);
  let childFocusStrategy = ref<'first' | 'last' | null>(null);

  let controlledSelectedKeys = props.selectedKeys === undefined
    ? undefined
    : computed<SelectionValue | undefined>(() => {
      let nextSelection = props.selectedKeys?.value;
      if (nextSelection === undefined) {
        return undefined;
      }

      return normalizeIncomingSelection(nextSelection);
    });
  let [selectedKeys, setSelectedKeysInternal] = useControlledState<SelectionValue>(
    controlledSelectedKeys,
    normalizeIncomingSelection(props.defaultSelectedKeys),
    props.onSelectionChange
  );

  watch(selectionBehaviorProp, (nextBehavior, previousBehavior) => {
    if (nextBehavior !== previousBehavior) {
      selectionBehavior.value = nextBehavior;
    }
  });

  watchEffect(() => {
    if (
      selectionBehaviorProp.value === 'replace'
      && selectionBehavior.value === 'toggle'
      && selectedKeys.value !== 'all'
      && selectedKeys.value.size === 0
    ) {
      selectionBehavior.value = 'replace';
    }
  });

  let setSelectionBehavior = (nextBehavior: SelectionBehavior): void => {
    selectionBehavior.value = nextBehavior;
  };

  let setSelectedKeys = (nextSelection: SelectionValue): void => {
    let previousSelection = selectedKeys.value;
    let normalizedSelection = normalizeSelection(
      nextSelection,
      props.selectionMode ?? 'none',
      Boolean(props.disallowEmptySelection),
      previousSelection
    );
    let hasChanged = !equalSelections(normalizedSelection, previousSelection);

    if (hasChanged || props.allowDuplicateSelectionEvents) {
      setSelectedKeysInternal(normalizedSelection);
    }
  };

  let setFocused = (nextFocused: boolean): void => {
    isFocused.value = nextFocused;
  };

  let setFocusedKey = (key: Key | null, child: 'first' | 'last' = 'first'): void => {
    focusedKey.value = key;
    childFocusStrategy.value = key == null ? null : child;
  };

  return {
    get selectionMode() {
      return props.selectionMode ?? 'none';
    },
    get disallowEmptySelection() {
      return Boolean(props.disallowEmptySelection);
    },
    selectionBehavior,
    setSelectionBehavior,
    isFocused,
    setFocused,
    focusedKey,
    childFocusStrategy,
    setFocusedKey,
    selectedKeys,
    setSelectedKeys,
    get disabledKeys() {
      return disabledKeysRef.value;
    },
    get disabledBehavior() {
      return props.disabledBehavior ?? 'all';
    }
  };
}
