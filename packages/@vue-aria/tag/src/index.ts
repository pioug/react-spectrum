import {type TagAria, useTag as useTagInternal, type AriaTagOptions as VueAriaTagOptions} from './useTag';
import {type TagGroupAria, type TagGroupItem, type TagGroupItemNode, type TagSelectionMode, useTagGroup as useTagGroupInternal, type AriaTagGroupOptions as VueAriaTagGroupOptions} from './useTagGroup';
import {computed, isRef, type Ref} from 'vue';
import type {ListState as VueListState} from '@vue-stately/list';

type FocusableElement = Element;
type RefObject<T> = {
  current: T
};
type ListState<T> = VueListState<T>;
type AnyRecord = Record<string, unknown>;

let tagGroupStateData = new WeakMap<object, {onRemove?: (keys: Set<string>) => void}>();

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

function toKeySet(value: unknown): Set<string> {
  let resolvedValue = readMaybeRef<unknown>(value);
  if (!resolvedValue || resolvedValue === 'all') {
    return new Set();
  }

  if (resolvedValue instanceof Set) {
    return new Set(Array.from(resolvedValue, (key) => String(key)));
  }

  if (resolvedValue && typeof resolvedValue === 'object' && Symbol.iterator in resolvedValue) {
    return new Set(Array.from(resolvedValue as Iterable<unknown>, (key) => String(key)));
  }

  return new Set();
}

function createSelectedKeysRef(selectionManager: AnyRecord): Ref<Set<string>> {
  return computed<Set<string>>({
    get: () => toKeySet(selectionManager.selectedKeys),
    set: (nextSelectedKeys) => {
      let normalizedKeys = new Set(Array.from(nextSelectedKeys, (key) => String(key)));
      if (typeof selectionManager.setSelectedKeys === 'function') {
        selectionManager.setSelectedKeys(normalizedKeys);
        return;
      }

      writeMaybeRef(selectionManager, 'selectedKeys', normalizedKeys);
    }
  }) as Ref<Set<string>>;
}

function createSelectionModeRef(selectionManager: AnyRecord): Ref<TagSelectionMode> {
  return computed(() => {
    let selectionMode = readMaybeRef<unknown>(selectionManager.selectionMode);
    if (selectionMode === 'single' || selectionMode === 'multiple' || selectionMode === 'none') {
      return selectionMode;
    }

    return 'none';
  }) as Ref<TagSelectionMode>;
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

function toTagGroupItem(node: AnyRecord, index: number, selectionManager: AnyRecord): TagGroupItem {
  let rawKey = node.key ?? index;
  let nodeProps = (node.props && typeof node.props === 'object')
    ? node.props as AnyRecord
    : {};
  let managerDisabled = typeof selectionManager.isDisabled === 'function'
    ? Boolean(selectionManager.isDisabled(rawKey))
    : false;

  return {
    description: typeof node.description === 'string'
      ? node.description
      : (typeof nodeProps.description === 'string' ? nodeProps.description : undefined),
    isDisabled: Boolean(node.isDisabled) || Boolean(nodeProps.isDisabled) || managerDisabled,
    key: String(rawKey),
    textValue: typeof node.textValue === 'string' ? node.textValue : String(rawKey)
  };
}

function toTagGroupItemNode(node: AnyRecord, index: number, selectionManager: AnyRecord): TagGroupItemNode {
  let item = toTagGroupItem(node, index, selectionManager);
  return {
    description: item.description,
    index: typeof node.index === 'number' ? node.index : index,
    isDisabled: item.isDisabled,
    key: item.key,
    textValue: item.textValue
  };
}

function createTagItemsRef(stateRecord: AnyRecord, selectionManager: AnyRecord): Ref<TagGroupItem[]> {
  return computed(() => {
    let nodes = getCollectionNodes(stateRecord.collection);
    return nodes
      .filter((node) => node.type == null || node.type === 'item')
      .map((node, index) => toTagGroupItem(node, index, selectionManager));
  }) as Ref<TagGroupItem[]>;
}

function createTagGroupFromState(
  options: VueAriaTagGroupOptions,
  stateRecord: AnyRecord
): TagGroupAria {
  let selectionManager = (readMaybeRef<unknown>(stateRecord.selectionManager) ?? {}) as AnyRecord;
  let stateData = tagGroupStateData.get(stateRecord as object);
  return useTagGroupInternal({
    ...options,
    items: options.items ?? createTagItemsRef(stateRecord, selectionManager),
    onRemove: options.onRemove ?? stateData?.onRemove,
    selectedKeys: options.selectedKeys ?? createSelectedKeysRef(selectionManager),
    selectionMode: options.selectionMode ?? createSelectionModeRef(selectionManager)
  });
}

export type AriaTagGroupOptions<T = unknown> = VueAriaTagGroupOptions;
export type AriaTagGroupProps<T = unknown> = AriaTagGroupOptions<T>;
export type AriaTagOptions<T = unknown> = VueAriaTagOptions;
export type AriaTagProps<T = unknown> = AriaTagOptions<T>;

export type {
  TagGroupAria,
  TagGroupItem,
  TagGroupItemNode,
  TagSelectionMode,
  TagAria
};

export function useTagGroup<T>(
  props: AriaTagGroupOptions<T>,
  state: ListState<T>,
  ref: RefObject<HTMLElement | null>
): TagGroupAria;
export function useTagGroup(options: VueAriaTagGroupOptions): TagGroupAria;
export function useTagGroup(
  options: VueAriaTagGroupOptions,
  state?: ListState<unknown>,
  refObject?: RefObject<HTMLElement | null>
): TagGroupAria {
  if (state) {
    void refObject;
    let stateRecord = state as unknown as AnyRecord;
    let tagGroup = createTagGroupFromState(options, stateRecord);
    if (typeof (options as AnyRecord).onRemove === 'function') {
      tagGroupStateData.set(stateRecord as object, {onRemove: (options as AnyRecord).onRemove as (keys: Set<string>) => void});
    } else {
      tagGroupStateData.delete(stateRecord as object);
    }
    return tagGroup;
  }

  return useTagGroupInternal(options);
}

export function useTag<T>(
  props: AriaTagProps<T>,
  state: ListState<T>,
  ref: RefObject<FocusableElement | null>
): TagAria;
export function useTag(options: VueAriaTagOptions): TagAria;
export function useTag(
  options: VueAriaTagOptions,
  state?: ListState<unknown>,
  refObject?: RefObject<FocusableElement | null>
): TagAria {
  if (state) {
    void refObject;
    let stateRecord = state as unknown as AnyRecord;
    let optionsRecord = options as AnyRecord;
    let selectionManager = (readMaybeRef<unknown>(stateRecord.selectionManager) ?? {}) as AnyRecord;
    let node = (optionsRecord.item ?? optionsRecord.node ?? {}) as AnyRecord;
    let tagGroup = createTagGroupFromState({
      ariaLabel: (optionsRecord['aria-label'] as string | undefined) ?? (optionsRecord.ariaLabel as string | undefined) ?? 'tag group'
    }, stateRecord);
    let item = computed(() => toTagGroupItemNode(node, Number(node.index ?? 0), selectionManager));
    return useTagInternal({
      'aria-errormessage': optionsRecord['aria-errormessage'] as string | undefined,
      'aria-label': optionsRecord['aria-label'] as string | undefined,
      item,
      tagGroup
    });
  }

  return useTagInternal(options);
}
