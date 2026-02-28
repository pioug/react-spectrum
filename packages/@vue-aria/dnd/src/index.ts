import {type AriaDragOptions, type DragAria, useDrag as useAriaDrag} from './useDrag';
import {type AriaDropOptions, type DropAria, useDrop as useAriaDrop} from './useDrop';
import {computed, defineComponent, unref} from 'vue';
import {type DragItem, type DropOperation} from './types';
import {isVirtualDraggingSessionActive} from './dragSession';

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

export const DIRECTORY_DRAG_TYPE = 'application/x-directory';

export const DragPreview = defineComponent({
  name: 'VueAriaDragPreview',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export class ListDropTargetDelegate {
  getDropTarget(): null {
    return null;
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
      return {
        id: String(record.id ?? record.key ?? index),
        type: String(record.type ?? 'item'),
        value: 'value' in record ? record.value : record
      } satisfies DragItem;
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

  return items.every((item) => acceptedTypes.has(item.type));
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

  let dragItems = computed(() => {
    if (key == null || typeof stateRecord.getItems !== 'function') {
      return [];
    }

    return toDragItems(stateRecord.getItems(key));
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
    dragButtonProps,
    draggableItemProps: dragProps,
    dragItems
  };
}

export function useDropIndicator(
  props: DropIndicatorProps,
  state: DroppableCollectionState,
  ref: RefObject<HTMLElement | null>
): DropIndicatorAria {
  let droppableItem = useDroppableItem(props, state, ref) as {
    dropProps: {value: AnyRecord},
    isDropTarget: {value: boolean}
  };
  let dropIndicatorProps = computed(() => ({
    ...droppableItem.dropProps.value,
    'aria-roledescription': 'drop indicator',
    tabIndex: -1
  }));
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

  let onDragEnter = (input?: unknown): boolean => {
    let items = normalizeDropItems(input);
    if (isDisabled.value || !includesAcceptedType(acceptedTypes.value, items)) {
      return false;
    }

    let point = readPoint(input, ref);
    dropCollectionRef = ref;
    if (typeof stateRecord.enter === 'function') {
      stateRecord.enter(items);
    }

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
      return;
    }

    let point = readPoint(input, ref);
    dropCollectionRef = ref;
    if (typeof stateRecord.move === 'function') {
      stateRecord.move(items);
    }

    if (typeof propsRecord.onDropMove === 'function') {
      propsRecord.onDropMove({
        items,
        target: readDropTarget(stateRecord),
        type: 'dropmove',
        x: point.x,
        y: point.y
      });
    }
  };

  let onDragLeave = (input?: unknown): void => {
    let point = readPoint(input, ref);
    if (typeof stateRecord.exit === 'function') {
      stateRecord.exit();
    }

    if (typeof propsRecord.onDropExit === 'function') {
      propsRecord.onDropExit({
        target: readDropTarget(stateRecord),
        type: 'dropexit',
        x: point.x,
        y: point.y
      });
    }

    dropCollectionRef = null;
  };

  let onDrop = (input?: unknown, fallbackOperation?: DropOperation): DropOperation => {
    let items = normalizeDropItems(input);
    if (isDisabled.value || !includesAcceptedType(acceptedTypes.value, items)) {
      onDragLeave(input);
      return 'cancel';
    }

    let point = readPoint(input, ref);
    let requestedOperation = resolveDropOperation(input, fallbackOperation);
    let operation = requestedOperation;
    if (typeof stateRecord.getDropOperation === 'function') {
      operation = normalizeDropOperation(stateRecord.getDropOperation({
        allowedOperations: DEFAULT_ALLOWED_OPERATIONS,
        draggingKeys: new Set(draggingKeys),
        isInternal: isInternalDrop(ref),
        items,
        target: readDropTarget(stateRecord)
      }));
    }

    let resolvedOperation = operation;
    if (typeof stateRecord.drop === 'function') {
      resolvedOperation = normalizeDropOperation(stateRecord.drop(items, operation));
    }

    if (typeof propsRecord.onDrop === 'function') {
      propsRecord.onDrop({
        items,
        target: readDropTarget(stateRecord),
        dropOperation: resolvedOperation,
        operation: resolvedOperation,
        type: 'drop',
        x: point.x,
        y: point.y
      });
    }

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
  _ref: RefObject<HTMLElement | null>
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
  let dropProps = computed(() => ({
    'aria-hidden': isVirtualDragging() && !isDropTarget.value ? 'true' : undefined
  }));

  return {
    dropProps,
    isDropTarget,
    droppableItemProps: dropProps
  };
}
