import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import {type GridCollection, type GridKey, type GridSelectionMode, type MaybeRef} from './types';
import {GridKeyboardDelegate} from './GridKeyboardDelegate';

export interface GridProps {
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  focusMode?: MaybeRef<'cell' | 'row'>,
  id?: MaybeRef<string | undefined>,
  isVirtualized?: MaybeRef<boolean>
}

export interface AriaGridOptions extends GridProps {
  collection: MaybeRef<GridCollection>,
  disabledKeys?: MaybeRef<Iterable<GridKey>>,
  direction?: MaybeRef<'ltr' | 'rtl'>,
  focusedKey?: Ref<GridKey | null>,
  hasTabbableChild?: MaybeRef<boolean>,
  onCellAction?: (key: GridKey) => void,
  onRowAction?: (key: GridKey) => void,
  selectedKeys?: Ref<Set<GridKey>>,
  selectionMode?: MaybeRef<GridSelectionMode>
}

export interface GridElementProps {
  'aria-colcount'?: number,
  'aria-label'?: string,
  'aria-labelledby'?: string,
  'aria-multiselectable'?: 'true',
  'aria-rowcount'?: number,
  id: string,
  role: 'grid',
  tabindex?: -1 | 0
}

export interface GridAria {
  canSelectItem: (key: GridKey) => boolean,
  collection: ComputedRef<GridCollection>,
  focusedKey: Ref<GridKey | null>,
  gridProps: ComputedRef<GridElementProps>,
  isFocused: Ref<boolean>,
  isSelected: (key: GridKey) => boolean,
  keyboardDelegate: ComputedRef<GridKeyboardDelegate>,
  selectionMode: ComputedRef<GridSelectionMode>,
  setFocused: (focused: boolean) => void,
  setFocusedKey: (key: GridKey | null) => void,
  toggleSelection: (key: GridKey) => void,
  triggerCellAction: (key: GridKey) => void,
  triggerRowAction: (key: GridKey) => void
}

let gridId = 0;

function toKeySet(keys: MaybeRef<Iterable<GridKey>> | undefined): Set<GridKey> {
  let resolved = keys ? unref(keys) : undefined;
  if (!resolved) {
    return new Set();
  }

  return new Set(Array.from(resolved, (key) => String(key)));
}

export function useGrid(options: AriaGridOptions): GridAria {
  gridId += 1;

  let collection = computed(() => unref(options.collection));
  let direction = computed(() => unref(options.direction) ?? 'ltr');
  let focusMode = computed(() => unref(options.focusMode) ?? 'row');
  let isVirtualized = computed(() => Boolean(unref(options.isVirtualized)));
  let hasTabbableChild = computed(() => Boolean(unref(options.hasTabbableChild)));
  let selectionMode = computed(() => unref(options.selectionMode) ?? 'none');
  let disabledKeys = computed(() => toKeySet(options.disabledKeys));
  let selectedKeys = options.selectedKeys ?? ref(new Set<GridKey>());
  let focusedKey = options.focusedKey ?? ref<GridKey | null>(null);
  let isFocused = ref(false);

  let keyboardDelegate = computed(() => {
    return new GridKeyboardDelegate({
      collection: collection.value,
      direction: direction.value,
      focusMode: focusMode.value
    });
  });

  let canSelectItem = (key: GridKey) => {
    return !disabledKeys.value.has(String(key));
  };

  let isSelected = (key: GridKey) => {
    return selectedKeys.value.has(String(key));
  };

  let toggleSelection = (key: GridKey) => {
    if (selectionMode.value === 'none' || !canSelectItem(key)) {
      return;
    }

    let nextSelection = new Set(selectedKeys.value);
    if (selectionMode.value === 'single') {
      if (nextSelection.has(key)) {
        nextSelection.clear();
      } else {
        nextSelection.clear();
        nextSelection.add(key);
      }
    } else if (nextSelection.has(key)) {
      nextSelection.delete(key);
    } else {
      nextSelection.add(key);
    }

    selectedKeys.value = nextSelection;
  };

  let setFocused = (focused: boolean) => {
    isFocused.value = focused;
  };

  let setFocusedKey = (key: GridKey | null) => {
    focusedKey.value = key;
  };

  let triggerRowAction = (key: GridKey) => {
    options.onRowAction?.(key);
  };

  let triggerCellAction = (key: GridKey) => {
    options.onCellAction?.(key);
  };

  let gridProps = computed<GridElementProps>(() => {
    let id = unref(options.id) ?? `vue-grid-${gridId}`;
    let rows = collection.value.rows;
    let resolvedColumnCount = collection.value.columnCount
      ?? rows.reduce((max, row) => Math.max(max, row.cells.length), 0);
    let tabIndex: -1 | 0 | undefined;
    if (rows.length === 0) {
      tabIndex = hasTabbableChild.value ? -1 : 0;
    }

    return {
      role: 'grid' as const,
      id,
      'aria-label': unref(options.ariaLabel),
      'aria-labelledby': unref(options.ariaLabelledby),
      'aria-multiselectable': selectionMode.value === 'multiple' ? 'true' : undefined,
      'aria-rowcount': isVirtualized.value ? rows.length : undefined,
      'aria-colcount': isVirtualized.value ? resolvedColumnCount : undefined,
      tabindex: tabIndex
    };
  });

  return {
    canSelectItem,
    collection,
    focusedKey,
    gridProps,
    isFocused,
    isSelected,
    keyboardDelegate,
    selectionMode,
    setFocused,
    setFocusedKey,
    toggleSelection,
    triggerCellAction,
    triggerRowAction
  };
}
