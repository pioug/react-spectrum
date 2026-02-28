import {type AriaGridOptions, type GridAria, type GridElementProps, type GridProps, useGrid as useGridInternal} from './useGrid';
import {type AriaGridSelectionCheckboxProps, type GridSelectionCheckboxAria, useGridSelectionCheckbox as useGridSelectionCheckboxInternal} from './useGridSelectionCheckbox';
import {type GridCellAria, type GridCellProps, useGridCell as useGridCellInternal} from './useGridCell';
import type {GridCellNode, GridKey, GridRowNode, GridSelectionBehavior, GridSelectionMode, MaybeRef, GridCollection as VueGridCollection} from './types';
import {GridKeyboardDelegate} from './GridKeyboardDelegate';
import {type GridRowAria, type GridRowProps, useGridRow as useGridRowInternal} from './useGridRow';
import {type GridRowGroupAria, useGridRowGroup} from './useGridRowGroup';
import {computed, isRef, type Ref} from 'vue';
import {
  type GridSelectionAnnouncementAria,
  type GridSelectionAnnouncementProps,
  type GridSelectionAnnouncementState,
  useGridSelectionAnnouncement as useGridSelectionAnnouncementInternal
} from './useGridSelectionAnnouncement';
import type {GridState} from '@vue-stately/grid';
import {type HighlightSelectionDescriptionAria, type HighlightSelectionDescriptionProps, useHighlightSelectionDescription as useHighlightSelectionDescriptionInternal} from './useHighlightSelectionDescription';

type RefObject<T> = {
  current: T
};

type FocusableElement = Element;
type AriaLabelingProps = Record<string, unknown>;
type GridCollection<T> = VueGridCollection & {
  _itemType?: T
};
type GridSelectionState<T> = GridSelectionAnnouncementState & {
  selectedKeys?: Set<GridKey>,
  _itemType?: T
};
type AnyRecord = Record<string, unknown>;

interface GridStateData {
  ariaLabel?: AriaGridOptions['ariaLabel'],
  ariaLabelledby?: AriaGridOptions['ariaLabelledby'],
  dashAriaLabel?: AriaGridOptions['aria-label'],
  dashAriaLabelledby?: AriaGridOptions['aria-labelledby'],
  focusMode?: AriaGridOptions['focusMode'],
  isVirtualized?: AriaGridOptions['isVirtualized'],
  onCellAction?: AriaGridOptions['onCellAction'],
  onRowAction?: AriaGridOptions['onRowAction'],
  selectionMode?: AriaGridOptions['selectionMode']
}

let gridStateData = new WeakMap<object, GridStateData>();

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

function toGridKey(value: unknown): GridKey {
  return String(value);
}

function toGridKeySet(value: unknown): Set<GridKey> {
  let resolvedValue = readMaybeRef<unknown>(value);
  if (!resolvedValue || resolvedValue === 'all') {
    return new Set();
  }

  if (resolvedValue instanceof Set) {
    return new Set(Array.from(resolvedValue, (key) => toGridKey(key)));
  }

  if (resolvedValue && typeof resolvedValue === 'object' && Symbol.iterator in resolvedValue) {
    return new Set(Array.from(resolvedValue as Iterable<unknown>, (key) => toGridKey(key)));
  }

  return new Set();
}

function toOptionalGridKey(value: unknown): GridKey | null {
  if (value == null) {
    return null;
  }

  return toGridKey(value);
}

function createSelectedKeysRef(selectionManager: AnyRecord): Ref<Set<GridKey>> {
  return computed<Set<GridKey>>({
    get: () => toGridKeySet(selectionManager.selectedKeys),
    set: (nextSelectedKeys) => {
      let normalizedKeys = new Set(Array.from(nextSelectedKeys, (key) => toGridKey(key)));
      if (typeof selectionManager.setSelectedKeys === 'function') {
        selectionManager.setSelectedKeys(normalizedKeys);
        return;
      }

      writeMaybeRef(selectionManager, 'selectedKeys', normalizedKeys);
    }
  }) as Ref<Set<GridKey>>;
}

function createFocusedKeyRef(selectionManager: AnyRecord): Ref<GridKey | null> {
  return computed<GridKey | null>({
    get: () => toOptionalGridKey(readMaybeRef<unknown>(selectionManager.focusedKey)),
    set: (nextFocusedKey) => {
      if (typeof selectionManager.setFocusedKey === 'function') {
        selectionManager.setFocusedKey(nextFocusedKey);
        return;
      }

      writeMaybeRef(selectionManager, 'focusedKey', nextFocusedKey);
    }
  }) as Ref<GridKey | null>;
}

function createSelectionModeRef(selectionManager: AnyRecord, stateRecord: AnyRecord): Ref<GridSelectionMode> {
  return computed(() => {
    let selectionMode = readMaybeRef<unknown>(selectionManager.selectionMode);
    if (selectionMode !== 'single' && selectionMode !== 'multiple' && selectionMode !== 'none') {
      selectionMode = readMaybeRef<unknown>(stateRecord.selectionMode);
    }

    if (selectionMode === 'single' || selectionMode === 'multiple' || selectionMode === 'none') {
      return selectionMode;
    }

    // @vue-stately/grid doesn't currently expose selectionMode on GridState.selectionManager.
    // Prefer a selectable default for React-style overload parity when mode cannot be read.
    return 'multiple';
  }) as Ref<GridSelectionMode>;
}

function createFocusModeRef(stateRecord: AnyRecord): Ref<'cell' | 'row'> {
  return computed(() => {
    let focusMode = readMaybeRef<unknown>(stateRecord.focusMode);
    return focusMode === 'cell' ? 'cell' : 'row';
  }) as Ref<'cell' | 'row'>;
}

function createDisabledKeysRef(stateRecord: AnyRecord): Ref<Set<GridKey>> {
  return computed(() => toGridKeySet(stateRecord.disabledKeys)) as Ref<Set<GridKey>>;
}

function getCollectionRecord(stateRecord: AnyRecord): AnyRecord | null {
  let collection = readMaybeRef<unknown>(stateRecord.collection);
  if (!collection || typeof collection !== 'object') {
    return null;
  }

  return collection as AnyRecord;
}

function getCollectionNodes(collection: unknown): AnyRecord[] {
  let resolvedCollection = readMaybeRef<unknown>(collection);
  if (!resolvedCollection || typeof resolvedCollection !== 'object') {
    return [];
  }

  let collectionRecord = resolvedCollection as AnyRecord;
  if (Array.isArray(collectionRecord.rows)) {
    return collectionRecord.rows.filter((row): row is AnyRecord => Boolean(row) && typeof row === 'object');
  }

  if (Array.isArray(collectionRecord.items)) {
    return collectionRecord.items.filter((item): item is AnyRecord => Boolean(item) && typeof item === 'object');
  }

  if (typeof collectionRecord.getKeys === 'function' && typeof collectionRecord.getItem === 'function') {
    let nodes: AnyRecord[] = [];
    for (let key of collectionRecord.getKeys() as Iterable<unknown>) {
      let node = collectionRecord.getItem(key);
      if (!node || typeof node !== 'object') {
        continue;
      }

      let nodeRecord = node as AnyRecord;
      if (nodeRecord.parentKey != null) {
        continue;
      }

      if (nodeRecord.type != null && nodeRecord.type !== 'item' && nodeRecord.type !== 'row') {
        continue;
      }

      nodes.push(nodeRecord);
    }

    if (nodes.length > 0) {
      return nodes;
    }
  }

  if (Symbol.iterator in collectionRecord) {
    return Array.from(collectionRecord as Iterable<unknown>)
      .filter((node): node is AnyRecord => {
        if (!node || typeof node !== 'object') {
          return false;
        }

        let nodeRecord = node as AnyRecord;
        if (nodeRecord.parentKey != null) {
          return false;
        }

        return nodeRecord.type == null || nodeRecord.type === 'item' || nodeRecord.type === 'row';
      });
  }

  return [];
}

function getNodeChildren(node: AnyRecord, collectionRecord: AnyRecord | null): AnyRecord[] {
  let childNodes = readMaybeRef<unknown>(node.childNodes);
  if (Array.isArray(childNodes)) {
    return childNodes.filter((child): child is AnyRecord => Boolean(child) && typeof child === 'object');
  }

  if (childNodes && typeof childNodes === 'object' && Symbol.iterator in childNodes) {
    return Array.from(childNodes as Iterable<unknown>)
      .filter((child): child is AnyRecord => Boolean(child) && typeof child === 'object');
  }

  let getChildren = collectionRecord?.getChildren;
  if (typeof getChildren === 'function') {
    let children = getChildren(node.key);
    if (children && typeof children === 'object' && Symbol.iterator in (children as AnyRecord)) {
      return Array.from(children as Iterable<unknown>)
        .filter((child): child is AnyRecord => Boolean(child) && typeof child === 'object');
    }
  }

  return [];
}

function toGridCellNode(node: AnyRecord, index: number): GridCellNode {
  let rawKey = node.key ?? index;
  let key = toGridKey(rawKey);
  return {
    colIndex: typeof node.colIndex === 'number' ? node.colIndex : index,
    colSpan: typeof node.colSpan === 'number' ? node.colSpan : undefined,
    key,
    textValue: typeof node.textValue === 'string' ? node.textValue : key
  };
}

function toGridRowNode(node: AnyRecord, index: number, collectionRecord: AnyRecord | null): GridRowNode {
  let children = getNodeChildren(node, collectionRecord);
  return {
    cells: children
      .filter((child) => child.type == null || child.type === 'cell' || child.type === 'item')
      .map((child, childIndex) => toGridCellNode(child, childIndex)),
    index: typeof node.index === 'number' ? node.index : index,
    key: toGridKey(node.key ?? index),
    textValue: typeof node.textValue === 'string' ? node.textValue : undefined
  };
}

function createGridCollectionRef(stateRecord: AnyRecord): Ref<VueGridCollection> {
  return computed(() => {
    let collectionRecord = getCollectionRecord(stateRecord);
    let rows = getCollectionNodes(stateRecord.collection)
      .map((node, index) => toGridRowNode(node, index, collectionRecord));
    let columnCountFromState = collectionRecord?.columnCount;
    let columnCount = typeof columnCountFromState === 'number'
      ? columnCountFromState
      : rows.reduce((max, row) => Math.max(max, row.cells.length), 0);
    return {
      columnCount,
      rows
    } satisfies VueGridCollection;
  }) as Ref<VueGridCollection>;
}

function getCollectionItem(stateRecord: AnyRecord, key: unknown): AnyRecord | null {
  let collectionRecord = getCollectionRecord(stateRecord);
  if (!collectionRecord) {
    return null;
  }

  if (typeof collectionRecord.getItem === 'function') {
    let item = collectionRecord.getItem(key);
    return item && typeof item === 'object' ? item as AnyRecord : null;
  }

  let normalizedKey = toGridKey(key);
  let rows = getCollectionNodes(collectionRecord);
  for (let row of rows) {
    if (toGridKey(row.key ?? '') === normalizedKey) {
      return row;
    }

    for (let child of getNodeChildren(row, collectionRecord)) {
      if (toGridKey(child.key ?? '') === normalizedKey) {
        return child;
      }
    }
  }

  return null;
}

function resolveRowNodeFromValue(nodeValue: AnyRecord, stateRecord: AnyRecord): GridRowNode | null {
  let collectionRecord = getCollectionRecord(stateRecord);

  if (nodeValue.parentKey != null) {
    let parentNode = getCollectionItem(stateRecord, nodeValue.parentKey);
    if (parentNode) {
      return toGridRowNode(parentNode, Number(parentNode.index ?? 0), collectionRecord);
    }
  }

  let candidateRow = getCollectionItem(stateRecord, nodeValue.key);
  if (candidateRow) {
    let candidateChildren = getNodeChildren(candidateRow, collectionRecord);
    if (candidateChildren.length > 0 || nodeValue.type === 'item' || nodeValue.type === 'row') {
      return toGridRowNode(candidateRow, Number(candidateRow.index ?? 0), collectionRecord);
    }
  }

  let rows = getCollectionNodes(stateRecord.collection);
  for (let index = 0; index < rows.length; index++) {
    let row = rows[index];
    if (toGridKey(row.key ?? '') === toGridKey(nodeValue.key ?? '')) {
      return toGridRowNode(row, index, collectionRecord);
    }

    let cells = getNodeChildren(row, collectionRecord);
    if (cells.some((cell) => toGridKey(cell.key ?? '') === toGridKey(nodeValue.key ?? ''))) {
      return toGridRowNode(row, index, collectionRecord);
    }
  }

  return null;
}

function resolveRowNode(nodeValue: AnyRecord, stateRecord: AnyRecord): GridRowNode {
  let row = resolveRowNodeFromValue(nodeValue, stateRecord);
  if (row) {
    return row;
  }

  return {
    cells: [],
    index: typeof nodeValue.index === 'number' ? nodeValue.index : 0,
    key: toGridKey(nodeValue.key ?? 'row'),
    textValue: typeof nodeValue.textValue === 'string' ? nodeValue.textValue : undefined
  };
}

function resolveCellNode(nodeValue: AnyRecord, row: GridRowNode): GridCellNode {
  let key = toGridKey(nodeValue.key ?? 'cell');
  let existingCell = row.cells.find((cell) => cell.key === key);
  if (existingCell) {
    return existingCell;
  }

  return {
    colIndex: typeof nodeValue.colIndex === 'number' ? nodeValue.colIndex : 0,
    colSpan: typeof nodeValue.colSpan === 'number' ? nodeValue.colSpan : undefined,
    key,
    textValue: typeof nodeValue.textValue === 'string' ? nodeValue.textValue : key
  };
}

function isGridStateLike(value: unknown): value is AnyRecord {
  return Boolean(value && typeof value === 'object' && 'collection' in (value as AnyRecord) && 'selectionManager' in (value as AnyRecord));
}

function createGridFromState(options: Partial<AriaGridOptions>, stateRecord: AnyRecord): GridAria {
  let selectionManager = (readMaybeRef<unknown>(stateRecord.selectionManager) ?? {}) as AnyRecord;
  let stateData = gridStateData.get(stateRecord as object);
  let resolvedAriaLabel = options.ariaLabel
    ?? options['aria-label']
    ?? stateData?.ariaLabel
    ?? stateData?.dashAriaLabel
    ?? 'grid';
  let resolvedAriaLabelledby = options.ariaLabelledby
    ?? options['aria-labelledby']
    ?? stateData?.ariaLabelledby
    ?? stateData?.dashAriaLabelledby;
  return useGridInternal({
    ...(options as AnyRecord),
    'aria-label': options['aria-label'] ?? stateData?.dashAriaLabel,
    'aria-labelledby': options['aria-labelledby'] ?? stateData?.dashAriaLabelledby,
    ariaLabel: resolvedAriaLabel,
    ariaLabelledby: resolvedAriaLabelledby,
    collection: createGridCollectionRef(stateRecord),
    disabledKeys: options.disabledKeys ?? createDisabledKeysRef(stateRecord),
    focusMode: options.focusMode ?? stateData?.focusMode ?? createFocusModeRef(stateRecord),
    focusedKey: options.focusedKey ?? createFocusedKeyRef(selectionManager),
    isVirtualized: options.isVirtualized ?? stateData?.isVirtualized,
    onCellAction: options.onCellAction ?? stateData?.onCellAction,
    onRowAction: options.onRowAction ?? stateData?.onRowAction,
    selectedKeys: options.selectedKeys ?? createSelectedKeysRef(selectionManager),
    selectionMode: options.selectionMode ?? stateData?.selectionMode ?? createSelectionModeRef(selectionManager, stateRecord)
  } as AriaGridOptions);
}

export {GridKeyboardDelegate};
export type {GridKeyboardDelegateOptions} from './GridKeyboardDelegate';
export {useGridRowGroup};
export type {
  AriaGridOptions,
  GridAria,
  GridElementProps,
  GridProps,
  GridCellAria,
  GridCellProps,
  GridRowAria,
  GridRowProps,
  GridRowGroupAria,
  GridSelectionAnnouncementAria,
  GridSelectionAnnouncementProps,
  GridSelectionAnnouncementState,
  AriaGridSelectionCheckboxProps,
  GridSelectionCheckboxAria,
  HighlightSelectionDescriptionAria,
  HighlightSelectionDescriptionProps,
  GridCellNode,
  VueGridCollection as GridCollection,
  GridKey,
  GridRowNode,
  GridSelectionBehavior,
  GridSelectionMode,
  MaybeRef
};

export function useGrid<T>(
  props: GridProps,
  state: GridState<T, GridCollection<T>>,
  ref: RefObject<HTMLElement | null>
): GridAria;
export function useGrid(options: AriaGridOptions): GridAria;
export function useGrid(
  options: AriaGridOptions,
  state?: GridState<unknown, GridCollection<unknown>>,
  refObject?: RefObject<HTMLElement | null>
): GridAria {
  if (state && isGridStateLike(state)) {
    void refObject;
    let stateRecord = state as unknown as AnyRecord;
    gridStateData.set(stateRecord as object, {
      ariaLabel: options.ariaLabel,
      ariaLabelledby: options.ariaLabelledby,
      dashAriaLabel: options['aria-label'],
      dashAriaLabelledby: options['aria-labelledby'],
      focusMode: options.focusMode,
      isVirtualized: options.isVirtualized,
      onCellAction: options.onCellAction,
      onRowAction: options.onRowAction,
      selectionMode: options.selectionMode
    });
    return createGridFromState(options, stateRecord);
  }

  return useGridInternal(options);
}

export function useGridRow<T, C extends GridCollection<T>, S extends GridState<T, C>>(
  props: GridRowProps<T>,
  state: S,
  ref: RefObject<FocusableElement | null>
): GridRowAria;
export function useGridRow(props: GridRowProps): GridRowAria;
export function useGridRow(
  props: GridRowProps,
  state?: GridState<unknown, GridCollection<unknown>>,
  refObject?: RefObject<FocusableElement | null>
): GridRowAria {
  if (state && isGridStateLike(state)) {
    void refObject;
    let stateRecord = state as unknown as AnyRecord;
    let propsRecord = props as unknown as AnyRecord;
    let nodeValue = (propsRecord.node ?? propsRecord.row ?? {}) as AnyRecord;
    let row = computed(() => resolveRowNode(nodeValue, stateRecord));
    return useGridRowInternal({
      grid: createGridFromState({}, stateRecord),
      isDisabled: propsRecord.isDisabled as GridRowProps['isDisabled'],
      isVirtualized: propsRecord.isVirtualized as GridRowProps['isVirtualized'],
      onAction: propsRecord.onAction as GridRowProps['onAction'],
      row,
      shouldSelectOnPressUp: propsRecord.shouldSelectOnPressUp as GridRowProps['shouldSelectOnPressUp']
    });
  }

  return useGridRowInternal(props);
}

export function useGridCell<T, C extends GridCollection<T>>(
  props: GridCellProps,
  state: GridState<T, C>,
  ref: RefObject<FocusableElement | null>
): GridCellAria;
export function useGridCell(props: GridCellProps): GridCellAria;
export function useGridCell(
  props: GridCellProps,
  state?: GridState<unknown, GridCollection<unknown>>,
  refObject?: RefObject<FocusableElement | null>
): GridCellAria {
  if (state && isGridStateLike(state)) {
    void refObject;
    let stateRecord = state as unknown as AnyRecord;
    let propsRecord = props as unknown as AnyRecord;
    let nodeValue = (propsRecord.node ?? propsRecord.cell ?? {}) as AnyRecord;
    let row = computed(() => resolveRowNode(nodeValue, stateRecord));
    let cell = computed(() => resolveCellNode(nodeValue, row.value));
    return useGridCellInternal({
      cell,
      colSpan: propsRecord.colSpan as GridCellProps['colSpan'],
      focusMode: propsRecord.focusMode as GridCellProps['focusMode'],
      grid: createGridFromState({}, stateRecord),
      isVirtualized: propsRecord.isVirtualized as GridCellProps['isVirtualized'],
      onAction: propsRecord.onAction as GridCellProps['onAction'],
      row,
      shouldSelectOnPressUp: propsRecord.shouldSelectOnPressUp as GridCellProps['shouldSelectOnPressUp']
    });
  }

  return useGridCellInternal(props);
}

export function useGridSelectionCheckbox<T, C extends GridCollection<T>>(
  props: AriaGridSelectionCheckboxProps,
  state: GridState<T, C>
): GridSelectionCheckboxAria;
export function useGridSelectionCheckbox(props: AriaGridSelectionCheckboxProps): GridSelectionCheckboxAria;
export function useGridSelectionCheckbox(
  props: AriaGridSelectionCheckboxProps,
  state?: GridState<unknown, GridCollection<unknown>>
): GridSelectionCheckboxAria {
  if (state && isGridStateLike(state)) {
    let stateRecord = state as unknown as AnyRecord;
    let propsRecord = props as unknown as AnyRecord;
    return useGridSelectionCheckboxInternal({
      ariaLabel: propsRecord.ariaLabel as AriaGridSelectionCheckboxProps['ariaLabel'],
      grid: createGridFromState({}, stateRecord),
      key: toGridKey(propsRecord.key)
    });
  }

  return useGridSelectionCheckboxInternal(props);
}

export function useHighlightSelectionDescription(props: HighlightSelectionDescriptionProps): AriaLabelingProps;
export function useHighlightSelectionDescription(props: HighlightSelectionDescriptionProps): HighlightSelectionDescriptionAria;
export function useHighlightSelectionDescription(props: HighlightSelectionDescriptionProps): HighlightSelectionDescriptionAria {
  return useHighlightSelectionDescriptionInternal(props);
}

export function useGridSelectionAnnouncement<T>(
  props: GridSelectionAnnouncementProps,
  state: GridSelectionState<T>
): void;
export function useGridSelectionAnnouncement(
  props: GridSelectionAnnouncementProps,
  state: GridSelectionAnnouncementState
): GridSelectionAnnouncementAria;
export function useGridSelectionAnnouncement(
  props: GridSelectionAnnouncementProps,
  state: GridSelectionAnnouncementState
): GridSelectionAnnouncementAria {
  return useGridSelectionAnnouncementInternal(props, state);
}
