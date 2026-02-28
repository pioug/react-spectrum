import {type AriaOptionProps, type OptionAria, useOption as useOptionInternal} from './useOption';
import {getItemId, listData, type ListKey} from './utils';
import {type ListBoxAria, type ListBoxCollection, type ListBoxItemNode, type SelectionMode, useListBox as useListBoxInternal, type AriaListBoxOptions as VueAriaListBoxOptions} from './useListBox';
import {computed, isRef, type Ref} from 'vue';
import type {ListState as VueListState} from '@vue-stately/list';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;
type ListState<T> = VueListState<T>;
type AnyRecord = Record<string, unknown>;

interface ListBoxStateData {
  isVirtualized?: VueAriaListBoxOptions['isVirtualized'],
  onAction?: VueAriaListBoxOptions['onAction'],
  shouldFocusOnHover?: VueAriaListBoxOptions['shouldFocusOnHover'],
  shouldSelectOnPressUp?: VueAriaListBoxOptions['shouldSelectOnPressUp'],
  shouldUseVirtualFocus?: VueAriaListBoxOptions['shouldUseVirtualFocus']
}

let listBoxStateData = new WeakMap<object, ListBoxStateData>();

function readMaybeRef<T>(value: unknown): T {
  if (isRef(value)) {
    return value.value as T;
  }

  return value as T;
}

function writeMaybeRef(record: AnyRecord, key: string, nextValue: unknown): void {
  let currentValue = record[key];
  if (isRef(currentValue)) {
    currentValue.value = nextValue;
    return;
  }

  record[key] = nextValue;
}

function toListKey(value: unknown): ListKey {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  return String(value);
}

function toOptionalListKey(value: unknown): ListKey | null {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  return null;
}

function toListKeySet(value: unknown): Set<ListKey> {
  let resolvedValue = readMaybeRef<unknown>(value);
  if (!resolvedValue || resolvedValue === 'all') {
    return new Set();
  }

  if (resolvedValue instanceof Set) {
    return new Set(Array.from(resolvedValue, (key) => toListKey(key)));
  }

  if (resolvedValue && typeof resolvedValue === 'object' && Symbol.iterator in resolvedValue) {
    return new Set(Array.from(resolvedValue as Iterable<unknown>, (key) => toListKey(key)));
  }

  return new Set();
}

function createSelectedKeysRef(selectionManager: AnyRecord): Ref<Set<ListKey>> {
  return computed<Set<ListKey>>({
    get: () => toListKeySet(selectionManager.selectedKeys),
    set: (nextSelectedKeys) => {
      let normalizedKeys = new Set(Array.from(nextSelectedKeys, (key) => toListKey(key)));
      if (typeof selectionManager.setSelectedKeys === 'function') {
        selectionManager.setSelectedKeys(normalizedKeys);
        return;
      }

      writeMaybeRef(selectionManager, 'selectedKeys', normalizedKeys);
    }
  }) as Ref<Set<ListKey>>;
}

function createSelectionModeRef(selectionManager: AnyRecord): Ref<SelectionMode> {
  return computed(() => {
    let selectionMode = readMaybeRef<unknown>(selectionManager.selectionMode);
    if (selectionMode === 'multiple' || selectionMode === 'single' || selectionMode === 'none') {
      return selectionMode;
    }

    return 'none';
  }) as Ref<SelectionMode>;
}

function createFocusedKeyRef(selectionManager: AnyRecord): Ref<ListKey | null> {
  return computed<ListKey | null>({
    get: () => toOptionalListKey(readMaybeRef<unknown>(selectionManager.focusedKey)),
    set: (nextFocusedKey) => {
      if (typeof selectionManager.setFocusedKey === 'function') {
        selectionManager.setFocusedKey(nextFocusedKey);
        return;
      }

      writeMaybeRef(selectionManager, 'focusedKey', nextFocusedKey);
    }
  }) as Ref<ListKey | null>;
}

function getCollectionNodes(collection: unknown): AnyRecord[] {
  let resolvedCollection = readMaybeRef<unknown>(collection);
  if (!resolvedCollection || typeof resolvedCollection !== 'object') {
    return [];
  }

  let collectionRecord = resolvedCollection as AnyRecord;
  let nodes: AnyRecord[] = [];

  if (typeof collectionRecord.getKeys === 'function' && typeof collectionRecord.getItem === 'function') {
    for (let key of collectionRecord.getKeys() as Iterable<unknown>) {
      let node = collectionRecord.getItem(key);
      if (node && typeof node === 'object') {
        nodes.push(node as AnyRecord);
      }
    }
    return nodes;
  }

  if (Symbol.iterator in collectionRecord) {
    for (let node of collectionRecord as Iterable<unknown>) {
      if (node && typeof node === 'object') {
        nodes.push(node as AnyRecord);
      }
    }
  }

  return nodes;
}

function createListBoxCollectionRef(stateRecord: AnyRecord, selectionManager: AnyRecord): Ref<ListBoxCollection> {
  return computed(() => {
    let nodes = getCollectionNodes(stateRecord.collection);
    let disabledKeys = toListKeySet(stateRecord.disabledKeys);
    return {
      items: nodes
        .filter((node) => node.type == null || node.type === 'item')
        .map((node, index) => {
          let rawKey = node.key ?? index;
          let nodeProps = (node.props && typeof node.props === 'object')
            ? node.props as AnyRecord
            : {};
          let managerDisabled = typeof selectionManager.isDisabled === 'function'
            ? Boolean(selectionManager.isDisabled(rawKey))
            : false;
          let key = toListKey(rawKey);

          return {
            description: typeof node.description === 'string'
              ? node.description
              : (typeof nodeProps.description === 'string' ? nodeProps.description : undefined),
            index: typeof node.index === 'number' ? node.index : index,
            isDisabled: Boolean(node.isDisabled) || Boolean(nodeProps.isDisabled) || managerDisabled || disabledKeys.has(key),
            key,
            textValue: typeof node.textValue === 'string' ? node.textValue : String(key)
          } satisfies ListBoxItemNode;
        })
    };
  }) as Ref<ListBoxCollection>;
}

function isListStateLike(value: unknown): value is AnyRecord {
  return Boolean(value && typeof value === 'object' && 'collection' in (value as AnyRecord) && 'selectionManager' in (value as AnyRecord));
}

function createListBoxFromState(options: VueAriaListBoxOptions, stateRecord: AnyRecord): ListBoxAria {
  let selectionManager = (readMaybeRef<unknown>(stateRecord.selectionManager) ?? {}) as AnyRecord;
  let stateData = listBoxStateData.get(stateRecord as object);
  let listBox = useListBoxInternal({
    ...options,
    isVirtualized: options.isVirtualized ?? stateData?.isVirtualized,
    onAction: options.onAction ?? stateData?.onAction,
    selectionMode: options.selectionMode ?? createSelectionModeRef(selectionManager),
    shouldFocusOnHover: options.shouldFocusOnHover ?? stateData?.shouldFocusOnHover,
    shouldSelectOnPressUp: options.shouldSelectOnPressUp ?? stateData?.shouldSelectOnPressUp,
    shouldUseVirtualFocus: options.shouldUseVirtualFocus ?? stateData?.shouldUseVirtualFocus
  }, createListBoxCollectionRef(stateRecord, selectionManager), createSelectedKeysRef(selectionManager));
  (listBox as unknown as AnyRecord).focusedKey = createFocusedKeyRef(selectionManager);

  let data = listData.get(listBox as unknown as ListState<unknown>);
  if (data) {
    listData.set(stateRecord as unknown as ListState<unknown>, data);
  }

  return listBox;
}

export {getItemId, listData};
export {useListBoxSection} from './useListBoxSection';
export type {AriaListBoxSectionProps, ListBoxSectionAria} from './useListBoxSection';
export type {AriaListBoxProps} from '@vue-types/listbox';

export type AriaListBoxOptions<T = unknown> = VueAriaListBoxOptions;
export type {
  ListBoxAria,
  ListBoxCollection,
  ListBoxItemNode,
  SelectionMode,
  AriaOptionProps,
  OptionAria,
  ListKey
};

export function useListBox<T>(
  props: AriaListBoxOptions<T>,
  state: ListState<T>,
  ref: RefObject<HTMLElement | null>
): ListBoxAria;
export function useListBox(
  options: VueAriaListBoxOptions,
  collection: Parameters<typeof useListBoxInternal>[1],
  selectedKeys?: Ref<Set<ListKey>>
): ListBoxAria;
export function useListBox(
  options: VueAriaListBoxOptions,
  collection: Parameters<typeof useListBoxInternal>[1],
  selectedKeys?: Parameters<typeof useListBoxInternal>[2]
): ListBoxAria {
  if (isListStateLike(collection)) {
    void selectedKeys;
    let stateRecord = collection as AnyRecord;
    listBoxStateData.set(stateRecord as object, {
      isVirtualized: options.isVirtualized,
      onAction: options.onAction,
      shouldFocusOnHover: options.shouldFocusOnHover,
      shouldSelectOnPressUp: options.shouldSelectOnPressUp,
      shouldUseVirtualFocus: options.shouldUseVirtualFocus
    });
    return createListBoxFromState(options, stateRecord);
  }

  return useListBoxInternal(options, collection, selectedKeys);
}

export function useOption<T>(
  props: AriaOptionProps,
  state: ListState<T>,
  ref: RefObject<FocusableElement | null>
): OptionAria;
export function useOption(props: AriaOptionProps, listBox: ListBoxAria): OptionAria;
export function useOption(
  props: AriaOptionProps,
  listBoxOrState: ListBoxAria | ListState<unknown>,
  refObject?: RefObject<FocusableElement | null>
): OptionAria {
  if (isListStateLike(listBoxOrState)) {
    void refObject;
    return useOptionInternal(props, createListBoxFromState({} as VueAriaListBoxOptions, listBoxOrState as unknown as AnyRecord));
  }

  let listBox = listBoxOrState as ListBoxAria;
  return useOptionInternal(props, listBox);
}
