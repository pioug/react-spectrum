import {type AriaTreeItemOptions, type TreeItemAria, type TreeItemNode, useTreeItem as useTreeItemInternal} from './useTreeItem';
import {type TreeAria, useTree as useTreeInternal, type AriaTreeOptions as VueAriaTreeOptions} from './useTree';
import {useGridList} from '@vue-aria/gridlist';
import {computed, isRef, ref, type Ref} from 'vue';
import type {TreeState as VueTreeState} from '@vue-stately/tree';

type FocusableElement = Element;
type RefObject<T> = {
  current: T
};
type AnyRecord = Record<string, unknown>;

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

function hasChildItems(node: AnyRecord): boolean {
  if (node.hasChildItems != null) {
    return Boolean(node.hasChildItems);
  }

  if (node.hasChildNodes != null) {
    return Boolean(node.hasChildNodes);
  }

  let childNodes = node.childNodes;
  if (Array.isArray(childNodes)) {
    return childNodes.length > 0;
  }

  if (childNodes && typeof childNodes === 'object' && Symbol.iterator in childNodes) {
    for (let _node of childNodes as Iterable<unknown>) {
      void _node;
      return true;
    }
  }

  return false;
}

function readExpandedKeys(stateRecord: AnyRecord): Set<string | number> {
  let expandedKeys = readMaybeRef<unknown>(stateRecord.expandedKeys);
  if (!expandedKeys || typeof expandedKeys !== 'object') {
    return new Set();
  }

  if (expandedKeys instanceof Set) {
    return new Set(expandedKeys) as Set<string | number>;
  }

  if (Symbol.iterator in expandedKeys) {
    return new Set(expandedKeys as Iterable<string | number>);
  }

  return new Set();
}

function createExpandedKeysRef(stateRecord: AnyRecord): Ref<Set<string | number>> {
  let expandedKeysRef = ref<Set<string | number>>(readExpandedKeys(stateRecord));

  return computed<Set<string | number>>({
    get: () => {
      return expandedKeysRef.value;
    },
    set: (nextExpandedKeys) => {
      let normalizedExpandedKeys = new Set(nextExpandedKeys);
      expandedKeysRef.value = normalizedExpandedKeys;
      let setExpandedKeys = stateRecord.setExpandedKeys;
      if (typeof setExpandedKeys === 'function') {
        setExpandedKeys(normalizedExpandedKeys);
        return;
      }

      writeMaybeRef(stateRecord, 'expandedKeys', normalizedExpandedKeys);
    }
  }) as Ref<Set<string | number>>;
}

function createTreeFromState(
  options: VueAriaTreeOptions,
  stateRecord: AnyRecord,
  refObject?: RefObject<HTMLElement | null>
): TreeAria {
  let gridList = useGridList(options as unknown as Parameters<typeof useGridList>[0], stateRecord as unknown as Parameters<typeof useGridList>[1], refObject as unknown as Parameters<typeof useGridList>[2]);
  let gridProps = computed(() => ({
    ...gridList.gridProps.value,
    role: 'treegrid' as const
  })) as TreeAria['gridProps'];

  return {
    ...gridList,
    gridProps
  } as TreeAria;
}

function toTreeItemNode(
  nodeRecord: AnyRecord,
  index: number,
  expandedKeys: Set<string | number>,
  selectionManager: AnyRecord
): TreeItemNode {
  let rawKey = nodeRecord.key ?? index;
  let key = rawKey as unknown as string;
  let textValue = typeof nodeRecord.textValue === 'string'
    ? nodeRecord.textValue
    : String(rawKey);
  let propsRecord = (nodeRecord.props && typeof nodeRecord.props === 'object')
    ? nodeRecord.props as AnyRecord
    : {};
  let isDisabledByManager = typeof selectionManager.isDisabled === 'function'
    ? Boolean(selectionManager.isDisabled(rawKey))
    : false;

  return {
    description: typeof nodeRecord.description === 'string'
      ? nodeRecord.description
      : (typeof propsRecord.description === 'string' ? propsRecord.description : undefined),
    hasChildItems: hasChildItems(nodeRecord),
    index: typeof nodeRecord.index === 'number' ? nodeRecord.index : index,
    isDisabled: isDisabledByManager || Boolean(nodeRecord.isDisabled) || Boolean(propsRecord.isDisabled),
    isExpanded: expandedKeys.has(rawKey),
    key,
    textValue
  };
}

export type AriaTreeOptions<T = unknown> = VueAriaTreeOptions;
export type AriaTreeProps<T = unknown> = AriaTreeOptions<T>;
export type {TreeProps} from '@vue-stately/tree';
export type {TreeAria, AriaTreeItemOptions, TreeItemAria, TreeItemNode};

export function useTree<T>(
  props: AriaTreeOptions<T>,
  state: VueTreeState<T>,
  ref: RefObject<HTMLElement | null>
): TreeAria;
export function useTree(options: VueAriaTreeOptions): TreeAria;
export function useTree(
  options: VueAriaTreeOptions,
  state?: VueTreeState<unknown>,
  refObject?: RefObject<HTMLElement | null>
): TreeAria {
  if (state) {
    return createTreeFromState(options, state as unknown as AnyRecord, refObject);
  }

  return useTreeInternal(options);
}

export function useTreeItem<T>(
  options: AriaTreeItemOptions,
  state: VueTreeState<T>,
  ref: RefObject<FocusableElement | null>
): TreeItemAria;
export function useTreeItem(options: AriaTreeItemOptions): TreeItemAria;
export function useTreeItem(
  options: AriaTreeItemOptions,
  state?: VueTreeState<unknown>,
  refObject?: RefObject<FocusableElement | null>
): TreeItemAria {
  if (state) {
    let stateRecord = state as unknown as AnyRecord;
    let optionsRecord = options as unknown as AnyRecord;
    let nodeRecord = (optionsRecord.node ?? optionsRecord.item ?? {}) as AnyRecord;
    let selectionManager = (readMaybeRef<unknown>(stateRecord.selectionManager) ?? {}) as AnyRecord;
    let expandedKeys = createExpandedKeysRef(stateRecord);
    let key = nodeRecord.key as string | number | undefined;
    let tree = createTreeFromState({
      ...optionsRecord,
      ariaLabel: (optionsRecord['aria-label'] as string | undefined) ?? (optionsRecord.ariaLabel as string | undefined) ?? 'tree'
    }, stateRecord, refObject as RefObject<HTMLElement | null> | undefined);
    let item = computed(() => {
      return toTreeItemNode(nodeRecord, Number(nodeRecord.index ?? 0), expandedKeys.value, selectionManager);
    });

    return useTreeItemInternal({
      expandedKeys: expandedKeys as unknown as Ref<Set<string>>,
      isVirtualized: optionsRecord.isVirtualized as boolean | undefined,
      item,
      onExpandedChange: () => {
        if (typeof selectionManager.setFocused === 'function') {
          selectionManager.setFocused(true);
        }

        if (typeof selectionManager.setFocusedKey === 'function') {
          selectionManager.setFocusedKey(key ?? item.value.key);
        }
      },
      shouldSelectOnPressUp: optionsRecord.shouldSelectOnPressUp as boolean | undefined,
      tree
    });
  }

  return useTreeItemInternal(options);
}
