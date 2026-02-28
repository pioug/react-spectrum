import {type AriaGridListItemOptions, type GridListItemAria, useGridListItem as useGridListItemInternal} from './useGridListItem';
import {type AriaGridListSectionProps, type GridListSectionAria, useGridListSection as useGridListSectionInternal} from './useGridListSection';
import {
  type AriaGridListSelectionCheckboxProps,
  type GridListSelectionCheckboxAria,
  useGridListSelectionCheckbox as useGridListSelectionCheckboxInternal
} from './useGridListSelectionCheckbox';
import {computed, isRef, unref, type Ref} from 'vue';
import {
  type GridListAria,
  useGridList as useGridListInternal,
  type AriaGridListOptions as VueAriaGridListOptions,
  type AriaGridListProps as VueAriaGridListProps
} from './useGridList';
import type {GridListCollection, GridListItemNode, MaybeRef} from './types';
import type {
  AriaGridSelectionCheckboxProps as ReactAriaGridSelectionCheckboxProps,
  GridSelectionCheckboxAria as ReactGridSelectionCheckboxAria
} from '@vue-aria/grid';
import type {ListState as VueListState} from '@vue-stately/list';
import type {TreeState as VueTreeState} from '@vue-stately/tree';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;
type ListState<T> = VueListState<T>;
type TreeState<T> = VueTreeState<T>;
type AriaGridSelectionCheckboxProps = ReactAriaGridSelectionCheckboxProps;
type GridSelectionCheckboxAria = ReactGridSelectionCheckboxAria;
type AnyRecord = Record<string, unknown>;

function isRefLike<T>(value: unknown): value is {value: T} {
  return isRef(value);
}

function readMaybeRef<T>(value: unknown): T {
  if (isRefLike<T>(value)) {
    return value.value;
  }

  return value as T;
}

function setMaybeRef(record: AnyRecord, key: string, value: unknown): void {
  let currentValue = record[key];
  if (isRefLike<unknown>(currentValue)) {
    currentValue.value = value;
    return;
  }

  record[key] = value;
}

function toKeySet(value: unknown): Set<string> {
  let resolvedValue = readMaybeRef<unknown>(value);
  if (resolvedValue == null || resolvedValue === 'all') {
    return new Set();
  }

  if (resolvedValue instanceof Set) {
    return new Set(Array.from(resolvedValue, (key) => String(key)));
  }

  if (Array.isArray(resolvedValue)) {
    return new Set(resolvedValue.map((key) => String(key)));
  }

  if (typeof resolvedValue === 'object' && Symbol.iterator in resolvedValue) {
    return new Set(Array.from(resolvedValue as Iterable<unknown>, (key) => String(key)));
  }

  return new Set();
}

function normalizeSelectionMode(value: unknown): 'multiple' | 'none' | 'single' {
  if (value === 'single' || value === 'multiple' || value === 'none') {
    return value;
  }

  return 'none';
}

function getCollectionNodes(collection: unknown): AnyRecord[] {
  let resolvedCollection = readMaybeRef<unknown>(collection);
  if (!resolvedCollection || typeof resolvedCollection !== 'object') {
    return [];
  }

  let collectionRecord = resolvedCollection as AnyRecord;
  if (Array.isArray(collectionRecord.items)) {
    return collectionRecord.items.filter((item): item is AnyRecord => Boolean(item) && typeof item === 'object');
  }

  let getKeys = collectionRecord.getKeys;
  let getItem = collectionRecord.getItem;
  if (typeof getKeys === 'function' && typeof getItem === 'function') {
    let nodes: AnyRecord[] = [];
    for (let key of (collectionRecord.getKeys as () => Iterable<unknown>)()) {
      let node = (collectionRecord.getItem as (key: unknown) => unknown)(key);
      if (node && typeof node === 'object') {
        nodes.push(node as AnyRecord);
      }
    }
    return nodes;
  }

  if (Symbol.iterator in collectionRecord) {
    return Array.from(collectionRecord as Iterable<unknown>)
      .filter((node): node is AnyRecord => Boolean(node) && typeof node === 'object');
  }

  return [];
}

function toGridListItemNode(
  node: AnyRecord,
  index: number,
  selectionManager?: AnyRecord
): GridListItemNode | null {
  if (node.type != null && node.type !== 'item') {
    return null;
  }

  let rawKey = node.key ?? index;
  let key = String(rawKey);
  let textValue = typeof node.textValue === 'string'
    ? node.textValue
    : key;
  let propsRecord = (node.props && typeof node.props === 'object')
    ? node.props as AnyRecord
    : {};
  let managerDisabled = typeof selectionManager?.isDisabled === 'function'
    ? Boolean(selectionManager.isDisabled(rawKey))
    : false;

  return {
    description: typeof node.description === 'string'
      ? node.description
      : (typeof propsRecord.description === 'string' ? propsRecord.description : undefined),
    hasChildItems: Boolean(node.hasChildItems ?? node.hasChildNodes),
    index: typeof node.index === 'number' ? node.index : index,
    isDisabled: managerDisabled || Boolean(node.isDisabled) || Boolean(propsRecord.isDisabled),
    key,
    textValue
  };
}

function createGridListCollectionRef(stateRecord: AnyRecord, selectionManager: AnyRecord): Ref<GridListCollection> {
  return computed<GridListCollection>(() => {
    let nodes = getCollectionNodes(stateRecord.collection);
    let items = nodes
      .map((node, index) => toGridListItemNode(node, index, selectionManager))
      .filter((item): item is GridListItemNode => item != null);
    return {items};
  }) as Ref<GridListCollection>;
}

function createSelectedKeysRef(selectionManager: AnyRecord): Ref<Set<string>> {
  return computed<Set<string>>({
    get: () => toKeySet(selectionManager.selectedKeys),
    set: (nextKeys) => {
      let normalizedKeys = new Set(Array.from(nextKeys, (key) => String(key)));
      let setSelectedKeys = selectionManager.setSelectedKeys;
      if (typeof setSelectedKeys === 'function') {
        setSelectedKeys(normalizedKeys);
        return;
      }

      setMaybeRef(selectionManager, 'selectedKeys', normalizedKeys);
    }
  }) as Ref<Set<string>>;
}

function createSelectionModeRef(selectionManager: AnyRecord): Ref<'multiple' | 'none' | 'single'> {
  return computed(() => {
    return normalizeSelectionMode(readMaybeRef<unknown>(selectionManager.selectionMode));
  }) as Ref<'multiple' | 'none' | 'single'>;
}

function createGridListFromState(
  options: Partial<VueAriaGridListOptions>,
  stateRecord: AnyRecord
): GridListAria {
  let selectionManager = (stateRecord.selectionManager ?? {}) as AnyRecord;
  return useGridListInternal({
    ...(options as AnyRecord),
    collection: createGridListCollectionRef(stateRecord, selectionManager),
    selectedKeys: createSelectedKeysRef(selectionManager),
    selectionMode: createSelectionModeRef(selectionManager)
  } as VueAriaGridListOptions);
}

export type AriaGridListProps<T = unknown> = VueAriaGridListProps;
export type AriaGridListOptions<T = unknown> = VueAriaGridListOptions;
export type GridListProps<T = unknown> = AriaGridListOptions<T>;

export type {
  GridListAria,
  AriaGridListItemOptions,
  GridListItemAria,
  AriaGridListSectionProps,
  GridListSectionAria,
  AriaGridListSelectionCheckboxProps,
  GridListSelectionCheckboxAria,
  GridListCollection,
  GridListItemNode,
  MaybeRef
};
export type {
  AriaGridSelectionCheckboxProps,
  GridSelectionCheckboxAria
};

export function useGridList<T>(
  props: AriaGridListOptions<T>,
  state: ListState<T>,
  ref: RefObject<HTMLElement | null>
): GridListAria;
export function useGridList(options: VueAriaGridListOptions): GridListAria;
export function useGridList(
  options: VueAriaGridListOptions,
  state?: ListState<unknown>,
  refObject?: RefObject<HTMLElement | null>
): GridListAria {
  if (state) {
    void refObject;
    return createGridListFromState(options, state as AnyRecord);
  }

  return useGridListInternal(options);
}

export function useGridListItem<T>(
  props: AriaGridListItemOptions,
  state: ListState<T> | TreeState<T>,
  ref: RefObject<FocusableElement | null>
): GridListItemAria;
export function useGridListItem(options: AriaGridListItemOptions): GridListItemAria;
export function useGridListItem(
  options: AriaGridListItemOptions,
  state?: ListState<unknown> | TreeState<unknown>,
  refObject?: RefObject<FocusableElement | null>
): GridListItemAria {
  if (state) {
    void refObject;
    let optionsRecord = options as AnyRecord;
    let stateRecord = state as AnyRecord;
    let node = (optionsRecord.node ?? optionsRecord.item ?? {}) as AnyRecord;
    let selectionManager = (stateRecord.selectionManager ?? {}) as AnyRecord;
    let gridList = createGridListFromState({
      ariaLabel: (optionsRecord['aria-label'] as string | undefined) ?? (optionsRecord.ariaLabel as string | undefined) ?? 'gridlist',
      selectionMode: createSelectionModeRef(selectionManager)
    }, stateRecord);
    let item = computed(() => {
      return toGridListItemNode(node, Number(node.index ?? 0), selectionManager) ?? {
        index: 0,
        key: String(node.key ?? 'item'),
        textValue: String(node.textValue ?? node.key ?? 'item')
      };
    });

    return useGridListItemInternal({
      gridList,
      isVirtualized: optionsRecord.isVirtualized as boolean | undefined,
      item,
      shouldSelectOnPressUp: optionsRecord.shouldSelectOnPressUp as boolean | undefined
    });
  }

  return useGridListItemInternal(options);
}

export function useGridListSelectionCheckbox<T>(
  props: AriaGridSelectionCheckboxProps,
  state: ListState<T>
): GridSelectionCheckboxAria;
export function useGridListSelectionCheckbox(
  props: AriaGridSelectionCheckboxProps | AriaGridListSelectionCheckboxProps,
  state?: ListState<unknown>
): GridSelectionCheckboxAria {
  if (state) {
    let key = (props as ReactAriaGridSelectionCheckboxProps).key;

    return {
      checkboxProps: computed(() => ({
        'aria-label': 'Select row',
        checked: state.selectionManager.isSelected(key),
        disabled: state.selectionManager.isDisabled(key)
      })),
      toggleSelection: () => {
        state.selectionManager.toggleSelection(key);
      }
    };
  }

  return useGridListSelectionCheckboxInternal(props as AriaGridListSelectionCheckboxProps) as unknown as GridSelectionCheckboxAria;
}

export function useGridListSection<T>(
  props: AriaGridListSectionProps,
  state: ListState<T>,
  ref: RefObject<HTMLElement | null>
): GridListSectionAria;
export function useGridListSection(props?: AriaGridListSectionProps): GridListSectionAria;
export function useGridListSection(
  props: AriaGridListSectionProps = {},
  state?: ListState<unknown>,
  refObject?: RefObject<HTMLElement | null>
): GridListSectionAria {
  void state;
  void refObject;
  return useGridListSectionInternal(props);
}
