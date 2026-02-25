import type {SelectionKey, SelectionManager} from './types';

type RefLike<T> = {
  value: T
};

function isRefLike<T>(value: unknown): value is RefLike<T> {
  return value != null && typeof value === 'object' && 'value' in value;
}

function readMaybeRef<T>(value: T | RefLike<T>): T {
  if (isRefLike<T>(value)) {
    return value.value;
  }

  return value;
}

export function getFocusedKey(selectionManager: SelectionManager): SelectionKey | null {
  let focusedKey = readMaybeRef(selectionManager.focusedKey);
  return focusedKey == null ? null : focusedKey;
}

export function getSelectedKeys(selectionManager: SelectionManager): Set<SelectionKey> {
  let selectedKeys = readMaybeRef(selectionManager.selectedKeys);
  if (selectedKeys instanceof Set) {
    return selectedKeys;
  }

  try {
    return new Set(selectedKeys as Iterable<SelectionKey>);
  } catch {
    return new Set();
  }
}

export function getSelectionMode(selectionManager: SelectionManager): 'multiple' | 'none' | 'single' {
  return readMaybeRef(selectionManager.selectionMode);
}

