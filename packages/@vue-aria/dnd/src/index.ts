import {type AriaDragOptions, type DragAria, useDrag as useAriaDrag} from './useDrag';
import {type AriaDropOptions, type DropAria, useDrop as useAriaDrop} from './useDrop';
import {computed, defineComponent, unref, watch} from 'vue';
import {DIRECTORY_DRAG_TYPE as INTERNAL_DIRECTORY_DRAG_TYPE, type DragItem, type DropOperation} from './types';
import {getActiveDragItems, isVirtualDraggingSessionActive} from './dragSession';

export type {AriaDragOptions, DragAria, AriaDropOptions, DropAria};
export type {DragItem, DropOperation} from './types';

type AnyRecord = Record<string, unknown>;
type RefObject<T> = {current: T};
type DraggingKey = number | string;

const DROP_OPERATIONS = new Set<DropOperation>(['cancel', 'copy', 'link', 'move']);
const DEFAULT_DROP_OPERATION: DropOperation = 'copy';
const DEFAULT_ALLOWED_OPERATIONS: DropOperation[] = ['copy', 'move', 'link'];

let draggingCollectionRef: RefObject<HTMLElement | null> | null = null;
let dropCollectionRef: RefObject<HTMLElement | null> | null = null;
let draggingKeys = new Set<DraggingKey>();
let dropIndicatorId = 0;

export type ClipboardProps = AnyRecord;
export type ClipboardResult = {
  clipboardProps: AnyRecord
};
export type DirectoryDropItem = DropItem;
export type DragEndEvent = AnyRecord;
export type DragMoveEvent = AnyRecord;
export type DragOptions = AriaDragOptions;
export type DragPreviewProps = AnyRecord;
export type DragPreviewRenderer = AnyRecord;
export type DragResult = DragAria;
export type DragStartEvent = AnyRecord;
export type DragTypes = AnyRecord;
export type DraggableCollectionEndEvent = AnyRecord;
export type DraggableCollectionMoveEvent = AnyRecord;
export type DraggableCollectionOptions = AnyRecord;
export type DraggableCollectionState = AnyRecord;
export type DraggableCollectionStartEvent = AnyRecord;
export type DraggableItemProps = AnyRecord;
export type DraggableItemResult = AnyRecord;
export type DropEnterEvent = AnyRecord;
export type DropEvent = AnyRecord;
export type DropExitEvent = AnyRecord;
export type DropIndicatorAria = AnyRecord;
export type DropIndicatorProps = AnyRecord;
export type DropItem = DragItem | AnyRecord;
export type DropMoveEvent = AnyRecord;
export type DropOptions = AriaDropOptions;
export type DropPosition = AnyRecord;
export type DropResult = DropAria;
export type DropTarget = AnyRecord;
export type DropTargetDelegate = AnyRecord;
export type DroppableCollectionDropEvent = AnyRecord;
export type DroppableCollectionEnterEvent = AnyRecord;
export type DroppableCollectionExitEvent = AnyRecord;
export type DroppableCollectionInsertDropEvent = AnyRecord;
export type DroppableCollectionMoveEvent = AnyRecord;
export type DroppableCollectionOnItemDropEvent = AnyRecord;
export type DroppableCollectionOptions = AnyRecord;
export type DroppableCollectionState = AnyRecord;
export type DroppableCollectionReorderEvent = AnyRecord;
export type DroppableCollectionResult = AnyRecord;
export type DroppableCollectionRootDropEvent = AnyRecord;
export type DroppableItemOptions = AnyRecord;
export type DroppableItemResult = AnyRecord;
export type FileDropItem = DropItem;
export type ItemDropTarget = AnyRecord;
export type RootDropTarget = AnyRecord;
export type TextDropItem = DropItem;

export const DIRECTORY_DRAG_TYPE = INTERNAL_DIRECTORY_DRAG_TYPE;

export const DragPreview = defineComponent({
  name: 'VueAriaDragPreview',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

function escapeCssSelectorValue(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }

  return value.replace(/["\\]/g, '\\$&');
}

export class ListDropTargetDelegate {
  private collection: Iterable<AnyRecord>;
  private ref: RefObject<HTMLElement | null>;
  private layout: 'grid' | 'stack';
  private orientation: 'horizontal' | 'vertical';
  private direction: 'ltr' | 'rtl';

  constructor(collection: Iterable<AnyRecord>, ref: RefObject<HTMLElement | null>, options: AnyRecord = {}) {
    this.collection = collection;
    this.ref = ref;
    this.layout = options.layout === 'grid' ? 'grid' : 'stack';
    this.orientation = options.orientation === 'horizontal' ? 'horizontal' : 'vertical';
    this.direction = options.direction === 'rtl' ? 'rtl' : 'ltr';
  }

  private getPrimaryStart(rect: DOMRect): number {
    return this.orientation === 'horizontal' ? rect.left : rect.top;
  }

  private getPrimaryEnd(rect: DOMRect): number {
    return this.orientation === 'horizontal' ? rect.right : rect.bottom;
  }

  private getSecondaryStart(rect: DOMRect): number {
    return this.orientation === 'horizontal' ? rect.top : rect.left;
  }

  private getSecondaryEnd(rect: DOMRect): number {
    return this.orientation === 'horizontal' ? rect.bottom : rect.right;
  }

  private getFlowStart(rect: DOMRect): number {
    return this.layout === 'stack' ? this.getPrimaryStart(rect) : this.getSecondaryStart(rect);
  }

  private getFlowEnd(rect: DOMRect): number {
    return this.layout === 'stack' ? this.getPrimaryEnd(rect) : this.getSecondaryEnd(rect);
  }

  private getFlowSize(rect: DOMRect): number {
    return this.getFlowEnd(rect) - this.getFlowStart(rect);
  }

  getDropTargetFromPoint(
    x: number,
    y: number,
    isValidDropTarget: (target: DropTarget) => boolean
  ): DropTarget {
    let container = this.ref.current;
    if (!container) {
      return {type: 'root'};
    }

    let items = Array.from(this.collection).filter((item) => {
      return item && typeof item === 'object' && (item as AnyRecord).type === 'item';
    }) as AnyRecord[];
    if (items.length === 0) {
      return {type: 'root'};
    }

    let collection = container.dataset.collection;
    let selector = collection
      ? `[data-collection="${escapeCssSelectorValue(collection)}"]`
      : '[data-key]';
    let elements = new Map<string, HTMLElement>();
    for (let element of container.querySelectorAll<HTMLElement>(selector)) {
      let key = element.dataset.key;
      if (key != null) {
        elements.set(key, element);
      }
    }

    let containerRect = container.getBoundingClientRect();
    let primary = this.orientation === 'horizontal' ? x : y;
    let secondary = this.orientation === 'horizontal' ? y : x;
    primary += this.getPrimaryStart(containerRect);
    secondary += this.getSecondaryStart(containerRect);

    let flow = this.layout === 'stack' ? primary : secondary;
    let isPrimaryRTL = this.orientation === 'horizontal' && this.direction === 'rtl';
    let isSecondaryRTL = this.layout === 'grid' && this.orientation === 'vertical' && this.direction === 'rtl';
    let isFlowRTL = this.layout === 'stack' ? isPrimaryRTL : isSecondaryRTL;
    let beforePosition = isFlowRTL ? 'after' : 'before';
    let afterPosition = isFlowRTL ? 'before' : 'after';

    let low = 0;
    let high = items.length;
    while (low < high) {
      let mid = Math.floor((low + high) / 2);
      let item = items[mid];
      let element = elements.get(String(item.key));
      if (!element) {
        break;
      }

      let rect = element.getBoundingClientRect();
      let update = (isGreater: boolean) => {
        if (isGreater) {
          low = mid + 1;
        } else {
          high = mid;
        }
      };

      if (primary < this.getPrimaryStart(rect)) {
        update(isPrimaryRTL);
      } else if (primary > this.getPrimaryEnd(rect)) {
        update(!isPrimaryRTL);
      } else if (secondary < this.getSecondaryStart(rect)) {
        update(isSecondaryRTL);
      } else if (secondary > this.getSecondaryEnd(rect)) {
        update(!isSecondaryRTL);
      } else {
        let target = {
          type: 'item' as const,
          key: item.key,
          dropPosition: 'on' as const
        };

        if (isValidDropTarget(target)) {
          if (flow <= this.getFlowStart(rect) + 5 && isValidDropTarget({...target, dropPosition: 'before'})) {
            return {
              ...target,
              dropPosition: beforePosition
            };
          }

          if (flow >= this.getFlowEnd(rect) - 5 && isValidDropTarget({...target, dropPosition: 'after'})) {
            return {
              ...target,
              dropPosition: afterPosition
            };
          }

          return target;
        }

        let flowMid = this.getFlowStart(rect) + this.getFlowSize(rect) / 2;
        if (flow <= flowMid && isValidDropTarget({...target, dropPosition: 'before'})) {
          return {
            ...target,
            dropPosition: beforePosition
          };
        }

        if (flow >= flowMid && isValidDropTarget({...target, dropPosition: 'after'})) {
          return {
            ...target,
            dropPosition: afterPosition
          };
        }

        return target;
      }
    }

    let item = items[Math.min(low, items.length - 1)];
    let element = elements.get(String(item.key));
    let rect = element?.getBoundingClientRect();
    if (rect && (
      primary < this.getPrimaryStart(rect) ||
      Math.abs(flow - this.getFlowStart(rect)) < Math.abs(flow - this.getFlowEnd(rect))
    )) {
      return {
        type: 'item',
        key: item.key,
        dropPosition: beforePosition
      };
    }

    return {
      type: 'item',
      key: item.key,
      dropPosition: afterPosition
    };
  }
}

function readMaybeRef<T>(value: unknown): T {
  return unref(value as T);
}

function toDragItems(items: unknown): DragItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item, index) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      let record = item as AnyRecord;
      let dragItem: DragItem & AnyRecord = {
        id: String(record.id ?? record.key ?? index),
        type: String(record.type ?? 'item'),
        value: 'value' in record ? record.value : record
      };

      if (typeof record.kind === 'string') {
        dragItem.kind = record.kind;
      }

      if (record.types instanceof Set || Array.isArray(record.types)) {
        dragItem.types = record.types;
      }

      return dragItem;
    })
    .filter((item): item is DragItem => item != null);
}

function normalizeDropItems(input: unknown): DragItem[] {
  if (Array.isArray(input)) {
    return toDragItems(input);
  }

  if (!input || typeof input !== 'object') {
    return [];
  }

  let record = input as AnyRecord;
  if (Array.isArray(record.items)) {
    return toDragItems(record.items);
  }

  let detail = record.detail as AnyRecord | undefined;
  if (detail && Array.isArray(detail.items)) {
    return toDragItems(detail.items);
  }

  return [];
}

function normalizeDropOperation(input: unknown): DropOperation {
  if (typeof input === 'string' && DROP_OPERATIONS.has(input as DropOperation)) {
    return input as DropOperation;
  }

  return DEFAULT_DROP_OPERATION;
}

function resolveDropOperation(input: unknown, fallback?: DropOperation): DropOperation {
  if (input && typeof input === 'object') {
    let record = input as AnyRecord;
    if (typeof record.dropOperation === 'string') {
      return normalizeDropOperation(record.dropOperation);
    }

    if (typeof record.operation === 'string') {
      return normalizeDropOperation(record.operation);
    }
  }

  if (fallback) {
    return normalizeDropOperation(fallback);
  }

  return DEFAULT_DROP_OPERATION;
}

function readPoint(input: unknown, ref: RefObject<HTMLElement | null>): {x: number, y: number} {
  if (!input || typeof input !== 'object') {
    return {x: 0, y: 0};
  }

  let record = input as AnyRecord;
  let detail = record.detail;
  let detailRecord = detail && typeof detail === 'object' ? detail as AnyRecord : null;

  let pointSource = detailRecord ?? record;
  let x = typeof pointSource.x === 'number'
    ? pointSource.x
    : typeof pointSource.clientX === 'number'
      ? pointSource.clientX
      : 0;
  let y = typeof pointSource.y === 'number'
    ? pointSource.y
    : typeof pointSource.clientY === 'number'
      ? pointSource.clientY
      : 0;

  let element = ref.current;
  if (!element || typeof element.getBoundingClientRect !== 'function') {
    return {x, y};
  }

  let rect = element.getBoundingClientRect();
  let originX = typeof rect.x === 'number'
    ? rect.x
    : typeof rect.left === 'number'
      ? rect.left
      : 0;
  let originY = typeof rect.y === 'number'
    ? rect.y
    : typeof rect.top === 'number'
      ? rect.top
      : 0;
  return {
    x: x - originX,
    y: y - originY
  };
}

function readDraggingKeys(stateRecord: AnyRecord): Set<DraggingKey> {
  let nextKeys = readMaybeRef<unknown>(stateRecord.draggingKeys);
  if (!(nextKeys instanceof Set)) {
    return new Set();
  }

  let normalized = new Set<DraggingKey>();
  for (let key of nextKeys) {
    if (typeof key === 'number' || typeof key === 'string') {
      normalized.add(key);
    }
  }

  return normalized;
}

function readDropTarget(stateRecord: AnyRecord): DropTarget | null {
  let target = readMaybeRef<unknown>(stateRecord.target);
  if (!target || typeof target !== 'object') {
    return null;
  }

  return target as DropTarget;
}

function isInternalDrop(ref: RefObject<HTMLElement | null>): boolean {
  return Boolean(
    draggingCollectionRef &&
    draggingCollectionRef.current &&
    draggingCollectionRef.current === ref.current
  );
}

function includesAcceptedType(acceptedTypes: Set<string> | null, items: DragItem[]): boolean {
  if (items.length === 0) {
    return false;
  }

  if (acceptedTypes == null) {
    return true;
  }

  return items.some((item) => {
    let itemRecord = item as unknown as AnyRecord;
    let itemTypes = new Set<string>();
    itemTypes.add(item.type);

    if (itemRecord.kind === 'directory') {
      itemTypes.add(DIRECTORY_DRAG_TYPE);
    }

    let types = itemRecord.types;
    if (types instanceof Set) {
      for (let type of types) {
        itemTypes.add(String(type));
      }
    } else if (Array.isArray(types)) {
      for (let type of types) {
        itemTypes.add(String(type));
      }
    }

    for (let type of itemTypes) {
      if (acceptedTypes.has(type)) {
        return true;
      }
    }

    return false;
  });
}

export function useDrag(options: DragOptions): DragResult;
export function useDrag(options: AriaDragOptions): DragAria;
export function useDrag(options: AriaDragOptions): DragAria {
  return useAriaDrag(options);
}

export function useDrop(options: DropOptions): DropResult;
export function useDrop(options: AriaDropOptions): DropAria;
export function useDrop(options: AriaDropOptions = {}): DropAria {
  return useAriaDrop(options);
}

export function isDirectoryDropItem(dropItem: DropItem): dropItem is DirectoryDropItem {
  return Boolean(dropItem) && typeof dropItem === 'object' && (dropItem as AnyRecord).kind === 'directory';
}

export function isFileDropItem(dropItem: DropItem): dropItem is FileDropItem {
  return Boolean(dropItem) && typeof dropItem === 'object' && (dropItem as AnyRecord).kind === 'file';
}

export function isTextDropItem(dropItem: DropItem): dropItem is TextDropItem {
  return Boolean(dropItem) && typeof dropItem === 'object' && (dropItem as AnyRecord).kind === 'text';
}

export function isVirtualDragging(): boolean {
  return isVirtualDraggingSessionActive();
}

export function useClipboard(_props: ClipboardProps): ClipboardResult {
  return {
    clipboardProps: {}
  };
}

export function useDraggableCollection(
  _props: DraggableCollectionOptions,
  state: DraggableCollectionState,
  ref: RefObject<HTMLElement | null>
): void {
  let stateRecord = state as AnyRecord;
  let keys = readDraggingKeys(stateRecord);
  if (keys.size > 0) {
    draggingCollectionRef = ref;
    draggingKeys = keys;
  } else if (draggingCollectionRef?.current === ref.current) {
    draggingCollectionRef = null;
    draggingKeys = new Set();
  }
}

export function useDraggableItem(
  props: DraggableItemProps,
  state: DraggableCollectionState
): DraggableItemResult {
  let propsRecord = props as AnyRecord;
  let stateRecord = state as AnyRecord;
  let key = propsRecord.key as DraggingKey | undefined;
  let selectionManager = (stateRecord.selectionManager ?? {}) as AnyRecord;

  let isDisabled = computed(() => {
    if (Boolean(readMaybeRef<boolean>(stateRecord.isDisabled))) {
      return true;
    }

    if (key == null) {
      return true;
    }

    if (typeof selectionManager.isDisabled === 'function') {
      return Boolean(selectionManager.isDisabled(key));
    }

    return false;
  });

  let isDragging = computed(() => {
    if (key == null || typeof stateRecord.isDragging !== 'function') {
      return false;
    }

    return Boolean(stateRecord.isDragging(key));
  });

  let startDrag = () => {
    if (isDisabled.value || key == null || typeof stateRecord.startDrag !== 'function') {
      return;
    }

    stateRecord.startDrag(key);
    draggingKeys = readDraggingKeys(stateRecord);
  };

  let endDrag = (input?: unknown) => {
    if (key == null || typeof stateRecord.endDrag !== 'function') {
      return;
    }

    let operation = resolveDropOperation(input, 'cancel');
    stateRecord.endDrag(operation);
    draggingCollectionRef = null;
    dropCollectionRef = null;
    draggingKeys = new Set();
  };

  let dragProps = computed(() => {
    if (isDisabled.value) {
      return {};
    }

    return {
      draggable: true,
      'aria-grabbed': isDragging.value,
      onDragStart: () => {
        startDrag();
      },
      onDrag: (event?: unknown) => {
        if (!isDragging.value || typeof stateRecord.moveDrag !== 'function') {
          return;
        }

        let eventRecord = (event ?? {}) as AnyRecord;
        let x = typeof eventRecord.clientX === 'number'
          ? eventRecord.clientX
          : typeof eventRecord.x === 'number'
            ? eventRecord.x
            : 0;
        let y = typeof eventRecord.clientY === 'number'
          ? eventRecord.clientY
          : typeof eventRecord.y === 'number'
            ? eventRecord.y
            : 0;
        stateRecord.moveDrag({x, y});
      },
      onDragEnd: (event?: unknown) => {
        endDrag(event);
      }
    };
  });

  let dragButtonProps = computed(() => ({
    'aria-grabbed': isDragging.value,
    isDisabled: isDisabled.value,
    onClick: () => {
      startDrag();
    }
  }));

  return {
    dragProps,
    dragButtonProps
  };
}

export function useDropIndicator(
  props: DropIndicatorProps,
  state: DroppableCollectionState,
  ref: RefObject<HTMLElement | null>
): DropIndicatorAria {
  let propsRecord = props as AnyRecord;
  let stateRecord = state as AnyRecord;
  let droppableItem = useDroppableItem(props, state, ref) as {
    dropProps: {value: AnyRecord},
    isDropTarget: {value: boolean}
  };
  let id = `vue-aria-drop-indicator-${++dropIndicatorId}`;
  let getText = (key: DraggingKey | null): string => {
    if (key == null) {
      return '';
    }

    let collection = stateRecord.collection as AnyRecord | undefined;
    if (collection && typeof collection.getTextValue === 'function') {
      let textValue = collection.getTextValue(key);
      if (typeof textValue === 'string' && textValue.length > 0) {
        return textValue;
      }
    }

    if (collection && typeof collection.getItem === 'function') {
      let item = collection.getItem(key) as AnyRecord | undefined;
      if (item && typeof item.textValue === 'string' && item.textValue.length > 0) {
        return item.textValue;
      }
    }

    return String(key);
  };
  let labelForTarget = () => {
    let target = propsRecord.target as AnyRecord | undefined;
    if (!target || typeof target !== 'object') {
      return 'Drop on';
    }

    if (target.type === 'root') {
      return 'Drop on';
    }

    let key = target.key as DraggingKey | null;
    if (target.dropPosition === 'on') {
      let itemText = getText(key);
      return itemText ? `Drop on ${itemText}` : 'Drop on';
    }

    let collection = stateRecord.collection as AnyRecord | undefined;
    let beforeKey: DraggingKey | null = null;
    let afterKey: DraggingKey | null = null;
    if (target.dropPosition === 'before') {
      let prevKey = collection && typeof collection.getItem === 'function'
        ? (collection.getItem(key) as AnyRecord | undefined)?.prevKey as DraggingKey | null | undefined
        : null;
      beforeKey = prevKey ?? null;
      afterKey = key;
    } else {
      beforeKey = key;
      let nextKey = collection && typeof collection.getItem === 'function'
        ? (collection.getItem(key) as AnyRecord | undefined)?.nextKey as DraggingKey | null | undefined
        : null;
      afterKey = nextKey ?? null;
    }

    if (beforeKey != null && afterKey != null) {
      return `Insert between ${getText(beforeKey)} and ${getText(afterKey)}`;
    }

    if (beforeKey != null) {
      return `Insert after ${getText(beforeKey)}`;
    }

    if (afterKey != null) {
      return `Insert before ${getText(afterKey)}`;
    }

    return 'Drop on';
  };
  let labelledBy = () => {
    let target = propsRecord.target as AnyRecord | undefined;
    if (!target || target.type !== 'root') {
      return undefined;
    }

    let collectionId = ref.current?.id;
    if (!collectionId) {
      return undefined;
    }

    return `${id} ${collectionId}`;
  };
  let dropIndicatorProps = computed(() => {
    let ariaHidden = !isVirtualDragging()
      ? 'true'
      : droppableItem.dropProps.value['aria-hidden'];
    return {
      ...droppableItem.dropProps.value,
      id,
      'aria-roledescription': 'drop indicator',
      'aria-label': labelForTarget(),
      'aria-labelledby': labelledBy(),
      'aria-hidden': ariaHidden,
      tabIndex: -1
    };
  });
  let isHidden = computed(() => {
    return !droppableItem.isDropTarget.value && Boolean(dropIndicatorProps.value['aria-hidden']);
  });

  return {
    dropIndicatorProps,
    isDropTarget: droppableItem.isDropTarget,
    isHidden
  };
}

export function useDroppableCollection(
  props: DroppableCollectionOptions,
  state: DroppableCollectionState,
  ref: RefObject<HTMLElement | null>
): DroppableCollectionResult {
  let propsRecord = props as AnyRecord;
  let stateRecord = state as AnyRecord;
  let acceptedTypes = computed(() => {
    let accepted = readMaybeRef<unknown>(propsRecord.acceptedDragTypes);
    if (accepted == null || accepted === 'all') {
      return null;
    }

    let maybeIterable = accepted as { [Symbol.iterator]?: () => Iterator<unknown> };
    if (typeof maybeIterable[Symbol.iterator] !== 'function') {
      return null;
    }

    return new Set(Array.from(accepted as Iterable<unknown>, (type) => String(type)));
  });
  let isDisabled = computed(() => {
    return Boolean(readMaybeRef<boolean>(stateRecord.isDisabled)) || Boolean(readMaybeRef<boolean>(propsRecord.isDisabled));
  });
  let isDropTarget = computed(() => readDropTarget(stateRecord) != null);
  let lastDragPoint: {x: number, y: number} | null = null;
  let isDraggingOverCollection = false;

  let getDropOperation = (items: DragItem[], target: DropTarget | null, fallback: DropOperation): DropOperation => {
    if (typeof stateRecord.getDropOperation !== 'function') {
      return fallback;
    }

    return normalizeDropOperation(stateRecord.getDropOperation({
      allowedOperations: DEFAULT_ALLOWED_OPERATIONS,
      draggingKeys: new Set(draggingKeys),
      isInternal: isInternalDrop(ref),
      items,
      target
    }));
  };

  let onDragEnter = (input?: unknown): boolean => {
    let items = normalizeDropItems(input);
    if (isDisabled.value || !includesAcceptedType(acceptedTypes.value, items)) {
      if (isDraggingOverCollection) {
        onDragLeave(input);
      }
      return false;
    }

    if (isDraggingOverCollection) {
      if (getDropOperation(items, readDropTarget(stateRecord), DEFAULT_DROP_OPERATION) === 'cancel') {
        onDragLeave(input);
        return false;
      }

      return true;
    }

    if (readDropTarget(stateRecord) == null && typeof stateRecord.setTarget === 'function') {
      stateRecord.setTarget({type: 'root'});
    }

    let didEnter = true;
    if (typeof stateRecord.enter === 'function') {
      didEnter = stateRecord.enter(items) !== false;
    }
    if (!didEnter) {
      if (typeof stateRecord.setTarget === 'function') {
        stateRecord.setTarget(null);
      }

      return false;
    }

    if (getDropOperation(items, readDropTarget(stateRecord), DEFAULT_DROP_OPERATION) === 'cancel') {
      if (typeof stateRecord.exit === 'function') {
        stateRecord.exit();
      }

      if (typeof stateRecord.setTarget === 'function') {
        stateRecord.setTarget(null);
      }

      return false;
    }

    isDraggingOverCollection = true;
    let point = readPoint(input, ref);
    lastDragPoint = point;
    dropCollectionRef = ref;
    if (typeof propsRecord.onDropEnter === 'function') {
      propsRecord.onDropEnter({
        items,
        target: readDropTarget(stateRecord),
        type: 'dropenter',
        x: point.x,
        y: point.y
      });
    }

    return true;
  };

  let onDragOver = (input?: unknown): void => {
    let items = normalizeDropItems(input);
    if (items.length === 0 || isDisabled.value || !includesAcceptedType(acceptedTypes.value, items)) {
      if (isDraggingOverCollection) {
        onDragLeave(input);
      }
      return;
    }

    if (!isDraggingOverCollection) {
      if (!onDragEnter(input)) {
        return;
      }
    }

    let point = readPoint(input, ref);
    if (lastDragPoint && lastDragPoint.x === point.x && lastDragPoint.y === point.y) {
      return;
    }

    lastDragPoint = point;
    dropCollectionRef = ref;
    if (typeof stateRecord.move === 'function') {
      stateRecord.move(items);
    }

    let target = readDropTarget(stateRecord);
    if (getDropOperation(items, target, DEFAULT_DROP_OPERATION) === 'cancel') {
      onDragLeave(input);
      return;
    }

    if (typeof propsRecord.onDropMove === 'function') {
      propsRecord.onDropMove({
        items,
        target,
        type: 'dropmove',
        x: point.x,
        y: point.y
      });
    }
  };

  let onDragLeave = (input?: unknown): void => {
    isDraggingOverCollection = false;
    let target = readDropTarget(stateRecord);
    if (!target) {
      dropCollectionRef = null;
      lastDragPoint = null;
      return;
    }

    let point = readPoint(input, ref);
    if (typeof stateRecord.exit === 'function') {
      stateRecord.exit();
    }

    if (typeof stateRecord.setTarget === 'function') {
      stateRecord.setTarget(null);
    }

    if (typeof propsRecord.onDropExit === 'function') {
      propsRecord.onDropExit({
        target,
        type: 'dropexit',
        x: point.x,
        y: point.y
      });
    }

    lastDragPoint = null;
    dropCollectionRef = null;
  };

  let onDrop = (input?: unknown, fallbackOperation?: DropOperation): DropOperation => {
    let items = normalizeDropItems(input);
    if (isDisabled.value || !includesAcceptedType(acceptedTypes.value, items)) {
      onDragLeave(input);
      return 'cancel';
    }

    let target = readDropTarget(stateRecord);
    let point = readPoint(input, ref);
    let requestedOperation = resolveDropOperation(input, fallbackOperation);
    let operation = getDropOperation(items, target, requestedOperation);
    if (operation === 'cancel') {
      onDragLeave(input);
      return 'cancel';
    }

    let resolvedOperation = operation;
    if (typeof stateRecord.drop === 'function') {
      resolvedOperation = normalizeDropOperation(stateRecord.drop(items, operation));
    }
    if (resolvedOperation === 'cancel') {
      onDragLeave(input);
      return 'cancel';
    }

    if (typeof propsRecord.onDrop === 'function') {
      propsRecord.onDrop({
        items,
        target,
        dropOperation: resolvedOperation,
        operation: resolvedOperation,
        type: 'drop',
        x: point.x,
        y: point.y
      });
    }

    onDragLeave(input);

    if (!isInternalDrop(ref)) {
      draggingCollectionRef = null;
      draggingKeys = new Set();
    }
    dropCollectionRef = null;

    return resolvedOperation;
  };

  let collectionProps = computed(() => ({
    role: 'group',
    'data-drop-target': isDropTarget.value,
    'aria-disabled': isDisabled.value ? true as const : undefined,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop
  }));

  return {
    collectionProps
  };
}

export function useDroppableItem(
  props: DroppableItemOptions,
  state: DroppableCollectionState,
  ref: RefObject<HTMLElement | null>
): DroppableItemResult {
  let propsRecord = props as AnyRecord;
  let stateRecord = state as AnyRecord;
  let target = computed(() => {
    if (propsRecord.target && typeof propsRecord.target === 'object') {
      return propsRecord.target as DropTarget;
    }

    return readDropTarget(stateRecord);
  });
  let isDropTarget = computed(() => {
    if (!target.value || typeof stateRecord.isDropTarget !== 'function') {
      return false;
    }

    return Boolean(stateRecord.isDropTarget(target.value));
  });
  let isValidDropTarget = computed(() => {
    if (!isVirtualDragging()) {
      return true;
    }

    if (!target.value || typeof stateRecord.getDropOperation !== 'function') {
      return true;
    }

    let items = getActiveDragItems();
    if (items.length === 0) {
      return true;
    }

    let isInternal = Boolean(
      draggingCollectionRef &&
      dropCollectionRef &&
      draggingCollectionRef.current &&
      draggingCollectionRef.current === dropCollectionRef.current
    );
    let operation = normalizeDropOperation(stateRecord.getDropOperation({
      allowedOperations: DEFAULT_ALLOWED_OPERATIONS,
      draggingKeys: new Set(draggingKeys),
      isInternal,
      items,
      target: target.value
    }));
    return operation !== 'cancel';
  });
  let dropProps = computed(() => ({
    'aria-hidden': isVirtualDragging() && !isValidDropTarget.value ? 'true' : undefined
  }));
  watch(isDropTarget, (next, previous) => {
    if (!next || previous || !isVirtualDragging()) {
      return;
    }

    if (ref.current && typeof ref.current.focus === 'function') {
      ref.current.focus();
    }
  });

  return {
    dropProps,
    isDropTarget
  };
}
