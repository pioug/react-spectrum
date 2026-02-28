import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import {type GridCollection, type GridKey, type GridSelectionMode, type MaybeRef} from './types';
import {GridKeyboardDelegate} from './GridKeyboardDelegate';

export interface GridProps {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
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
  onFocusin: () => void,
  onFocusout: (event: FocusEvent) => void,
  onKeyDown: (event: KeyboardEvent) => void,
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

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
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
  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));

  if (!ariaLabel.value && !ariaLabelledby.value && process.env.NODE_ENV !== 'production') {
    console.warn('An aria-label or aria-labelledby prop is required for accessibility.');
  }

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

  let getRowKey = (key: GridKey): GridKey | null => {
    let row = collection.value.rows.find((entry) => entry.key === key);
    if (row) {
      return row.key;
    }

    for (let candidate of collection.value.rows) {
      if (candidate.cells.some((cell) => cell.key === key)) {
        return candidate.key;
      }
    }

    return null;
  };

  let onKeyDown = (event: KeyboardEvent) => {
    let delegate = keyboardDelegate.value;
    let currentKey = focusedKey.value;
    let nextKey: GridKey | null = null;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        nextKey = currentKey != null ? delegate.getKeyBelow(currentKey) : delegate.getFirstKey();
        break;
      case 'ArrowUp':
        event.preventDefault();
        nextKey = currentKey != null ? delegate.getKeyAbove(currentKey) : delegate.getLastKey();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        nextKey = currentKey != null ? delegate.getKeyLeftOf(currentKey) : delegate.getFirstKey();
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextKey = currentKey != null ? delegate.getKeyRightOf(currentKey) : delegate.getFirstKey();
        break;
      case 'Home':
        event.preventDefault();
        nextKey = delegate.getFirstKey();
        break;
      case 'End':
        event.preventDefault();
        nextKey = delegate.getLastKey();
        break;
      case ' ':
      case 'Spacebar': {
        event.preventDefault();
        if (selectionMode.value === 'none' || currentKey == null) {
          return;
        }

        let rowKey = getRowKey(currentKey);
        if (rowKey != null) {
          toggleSelection(rowKey);
        }
        return;
      }
      default:
        return;
    }

    if (nextKey != null) {
      setFocused(true);
      setFocusedKey(nextKey);
    }
  };

  let onFocusin = () => {
    setFocused(true);
    if (focusedKey.value == null) {
      setFocusedKey(keyboardDelegate.value.getFirstKey());
    }
  };

  let onFocusout = (event: FocusEvent) => {
    let currentTarget = event.currentTarget as HTMLElement | null;
    let relatedTarget = event.relatedTarget as Node | null;
    if (!currentTarget || !relatedTarget || !currentTarget.contains(relatedTarget)) {
      setFocused(false);
    }
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
    let tabIndex: -1 | 0 | undefined = hasTabbableChild.value ? -1 : 0;
    if (rows.length === 0 && hasTabbableChild.value) {
      tabIndex = -1;
    }

    return {
      role: 'grid' as const,
      id,
      'aria-label': ariaLabel.value,
      'aria-labelledby': ariaLabelledby.value,
      'aria-multiselectable': selectionMode.value === 'multiple' ? 'true' : undefined,
      'aria-rowcount': isVirtualized.value ? rows.length : undefined,
      'aria-colcount': isVirtualized.value ? resolvedColumnCount : undefined,
      tabindex: tabIndex,
      onKeyDown,
      onFocusin,
      onFocusout
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
