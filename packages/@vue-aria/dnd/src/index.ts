import {type AriaDragOptions, type DragAria, useDrag as useAriaDrag} from './useDrag';
import {type AriaDropOptions, type DropAria, useDrop as useAriaDrop} from './useDrop';
import {getInteractionModality} from '@vue-aria/interactions';
import {useLocalizedStringFormatter} from '@vue-aria/i18n';
import {getScrollParent, isIOS, isScrollable, isWebKit, useDescription} from '@vue-aria/utils';
import {computed, defineComponent, getCurrentScope, onScopeDispose, unref, watch} from 'vue';
import type {AriaButtonProps} from '@vue-types/button';
import type {
  Direction,
  DOMAttributes,
  DragEndEvent as SharedDragEndEvent,
  DragMoveEvent as SharedDragMoveEvent,
  DragStartEvent as SharedDragStartEvent,
  DragTypes as SharedDragTypes,
  DraggableCollectionEndEvent as SharedDraggableCollectionEndEvent,
  DraggableCollectionMoveEvent as SharedDraggableCollectionMoveEvent,
  DraggableCollectionStartEvent as SharedDraggableCollectionStartEvent,
  DirectoryDropItem as SharedDirectoryDropItem,
  DropEnterEvent as SharedDropEnterEvent,
  DropEvent as SharedDropEvent,
  DropExitEvent as SharedDropExitEvent,
  DropItem as SharedDropItem,
  DropMoveEvent as SharedDropMoveEvent,
  DropPosition as SharedDropPosition,
  DropTarget as SharedDropTarget,
  DropTargetDelegate as SharedDropTargetDelegate,
  DroppableCollectionDropEvent as SharedDroppableCollectionDropEvent,
  DroppableCollectionEnterEvent as SharedDroppableCollectionEnterEvent,
  DroppableCollectionExitEvent as SharedDroppableCollectionExitEvent,
  DroppableCollectionInsertDropEvent as SharedDroppableCollectionInsertDropEvent,
  DroppableCollectionMoveEvent as SharedDroppableCollectionMoveEvent,
  DroppableCollectionOnItemDropEvent as SharedDroppableCollectionOnItemDropEvent,
  DroppableCollectionReorderEvent as SharedDroppableCollectionReorderEvent,
  DroppableCollectionRootDropEvent as SharedDroppableCollectionRootDropEvent,
  FileDropItem as SharedFileDropItem,
  FocusableElement,
  ItemDropTarget as SharedItemDropTarget,
  Key,
  Node,
  Orientation,
  RefObject,
  RootDropTarget as SharedRootDropTarget,
  TextDropItem as SharedTextDropItem
} from '@vue-types/shared';
import {DIRECTORY_DRAG_TYPE as INTERNAL_DIRECTORY_DRAG_TYPE, type DragItem, type DropOperation} from './types';
import {getActiveDragItems, isVirtualDraggingSessionActive} from './dragSession';
import intlMessages from './intlMessages';

export type {AriaDragOptions, DragAria, AriaDropOptions, DropAria};
export type {DragItem, DropOperation} from './types';

type AnyRecord = Record<string, unknown>;
type DraggingKey = Key;

const DROP_OPERATIONS = new Set<DropOperation>(['cancel', 'copy', 'link', 'move']);
const DEFAULT_DROP_OPERATION: DropOperation = 'copy';
const DEFAULT_ALLOWED_OPERATIONS: DropOperation[] = ['copy', 'move', 'link'];
const DROP_ACTIVATE_TIMEOUT = 800;
const AUTOSCROLL_AREA_SIZE = 20;
const CUSTOM_DRAG_TYPE = 'application/vnd.react-aria.items+json';
const NATIVE_DRAG_TYPES = new Set(['text/html', 'text/plain', 'text/uri-list']);
const noop = () => {};

let draggingCollectionRef: RefObject<HTMLElement | null> | null = null;
let dropCollectionRef: RefObject<HTMLElement | null> | null = null;
let draggingKeys = new Set<DraggingKey>();
let dropIndicatorId = 0;
let droppableCollectionId = 0;
let droppableCollectionIds = new WeakMap<object, string>();
let droppableCollectionRefs = new WeakMap<object, RefObject<HTMLElement | null>>();
let globalClipboardEvents = new Map<string, {
  handlers: Set<(event: Event) => void>,
  listener: (event: Event) => void
}>();

function getDroppableCollectionId(state: DroppableCollectionState): string {
  let id = droppableCollectionIds.get(state as unknown as object);
  if (!id) {
    throw new Error('Droppable item outside a droppable collection');
  }

  return id;
}

function getDroppableCollectionRef(state: DroppableCollectionState): RefObject<HTMLElement | null> {
  let ref = droppableCollectionRefs.get(state as unknown as object);
  if (!ref) {
    throw new Error('Droppable item outside a droppable collection');
  }

  return ref;
}

function mapDragModality(modality: string | null): 'keyboard' | 'touch' | 'virtual' {
  if (!modality) {
    modality = 'virtual';
  }

  if (modality === 'pointer') {
    modality = 'virtual';
  }

  if (modality === 'virtual' && typeof window !== 'undefined' && 'ontouchstart' in window) {
    return 'touch';
  }

  if (modality === 'keyboard' || modality === 'touch') {
    return modality;
  }

  return 'virtual';
}

export interface ClipboardProps {
  getItems?: (details: {action: 'copy' | 'cut'}) => Array<DragItem | Record<string, unknown>>,
  isDisabled?: boolean,
  onCopy?: () => void,
  onCut?: () => void,
  onPaste?: (items: DropItem[]) => void
}

export interface ClipboardResult {
  clipboardProps: DOMAttributes
}

export type DirectoryDropItem = SharedDirectoryDropItem;
export type DragEndEvent = SharedDragEndEvent;
export type DragMoveEvent = SharedDragMoveEvent;
export type DragOptions = AriaDragOptions;
export interface DragPreviewProps {
  children?: (items: DragItem[]) => unknown
}

export type DragPreviewRenderer = (
  items: DragItem[],
  callback: (node: HTMLElement | null, x?: number, y?: number) => void
) => void;

export type DragResult = DragAria;
export type DragStartEvent = SharedDragStartEvent;
export type DragTypes = SharedDragTypes;
export type DraggableCollectionEndEvent = SharedDraggableCollectionEndEvent;
export type DraggableCollectionMoveEvent = SharedDraggableCollectionMoveEvent;
export interface DraggableCollectionOptions {}
type MaybeRefValue<T> = T | {value: T};

export interface DraggableCollectionState {
  draggingKeys: MaybeRefValue<Set<Key>>,
  endDrag?: (operation: DropOperation) => void,
  isDisabled?: MaybeRefValue<boolean>,
  isDragging?: (key: Key) => boolean,
  moveDrag?: (event: {x: number, y: number}) => void,
  selectionManager?: {
    isDisabled?: (key: Key) => boolean
  },
  startDrag?: (key: Key) => void
}

export type DraggableCollectionStartEvent = SharedDraggableCollectionStartEvent;

export interface DraggableItemProps {
  hasAction?: boolean,
  hasDragButton?: boolean,
  key: Key
}

export interface DraggableItemResult {
  dragButtonProps: {value: AriaButtonProps},
  dragProps: {value: AnyRecord}
}

export type DropEnterEvent = SharedDropEnterEvent;
export type DropEvent = SharedDropEvent;
export type DropExitEvent = SharedDropExitEvent;
export interface DropIndicatorAria {
  dropIndicatorProps: {value: AnyRecord},
  isDropTarget: {value: boolean},
  isHidden: {value: boolean}
}

export interface DropIndicatorProps {
  activateButtonRef?: RefObject<FocusableElement | null>,
  target: DropTarget
}

export type DropItem = SharedDropItem;
export type DropMoveEvent = SharedDropMoveEvent;
export type DropOptions = AriaDropOptions;
export type DropPosition = SharedDropPosition;
export type DropResult = DropAria;
export type DropTarget = SharedDropTarget;
export type DropTargetDelegate = SharedDropTargetDelegate;
export type DroppableCollectionDropEvent = SharedDroppableCollectionDropEvent;
export type DroppableCollectionEnterEvent = SharedDroppableCollectionEnterEvent;
export type DroppableCollectionExitEvent = SharedDroppableCollectionExitEvent;
export type DroppableCollectionInsertDropEvent = SharedDroppableCollectionInsertDropEvent;
export type DroppableCollectionMoveEvent = SharedDroppableCollectionMoveEvent;
export type DroppableCollectionOnItemDropEvent = SharedDroppableCollectionOnItemDropEvent;

export interface DroppableCollectionOptions {
  acceptedDragTypes?: 'all' | Array<string | symbol>,
  dropTargetDelegate?: DropTargetDelegate,
  getDropOperation?: (target: DropTarget, types: DragTypes, allowedOperations: DropOperation[]) => DropOperation,
  isDisabled?: boolean,
  onDrop?: (e: DroppableCollectionDropEvent) => void,
  onDropActivate?: (e: {target: DropTarget, type: 'dropactivate', x: number, y: number}) => void,
  onDropEnter?: (e: DroppableCollectionEnterEvent) => void,
  onDropExit?: (e: DroppableCollectionExitEvent) => void,
  onDropMove?: (e: DroppableCollectionMoveEvent) => void,
  onInsert?: (e: DroppableCollectionInsertDropEvent) => void,
  onItemDrop?: (e: DroppableCollectionOnItemDropEvent) => void,
  onKeyDown?: (event: KeyboardEvent) => void,
  onMove?: (e: DroppableCollectionReorderEvent) => void,
  onReorder?: (e: DroppableCollectionReorderEvent) => void,
  onRootDrop?: (e: DroppableCollectionRootDropEvent) => void,
  shouldAcceptItemDrop?: (target: ItemDropTarget, types: Set<string>) => boolean
}

interface DroppableCollectionNode {
  key: Key,
  nextKey?: Key | null,
  prevKey?: Key | null,
  textValue?: string,
  type: string
}

interface DroppableCollectionData {
  getItem?: (key: Key) => DroppableCollectionNode | null | undefined,
  getTextValue?: (key: Key) => string | undefined
}

interface DroppableCollectionOperationEvent {
  allowedOperations: DropOperation[],
  draggingKeys: Set<Key>,
  isInternal: boolean,
  items: DragItem[],
  target: DropTarget | null
}

export interface DroppableCollectionState {
  collection?: DroppableCollectionData,
  drop?: (items: DragItem[], operation: DropOperation) => DropOperation,
  enter?: (items: DragItem[]) => boolean,
  exit?: () => void,
  getDropOperation?: (event: DroppableCollectionOperationEvent) => DropOperation,
  isDisabled?: MaybeRefValue<boolean>,
  isDropTarget?: (target: DropTarget | null) => boolean,
  move?: (items: DragItem[]) => void,
  setTarget?: (target: DropTarget | null) => void,
  target?: MaybeRefValue<DropTarget | null>
}

export type DroppableCollectionReorderEvent = SharedDroppableCollectionReorderEvent;
export interface DroppableCollectionResult {
  collectionProps: {value: AnyRecord}
}

export type DroppableCollectionRootDropEvent = SharedDroppableCollectionRootDropEvent;
export interface DroppableItemOptions {
  activateButtonRef?: RefObject<FocusableElement | null>,
  target: DropTarget
}

export interface DroppableItemResult {
  dropProps: {value: AnyRecord},
  isDropTarget: {value: boolean}
}

export type FileDropItem = SharedFileDropItem;
export type ItemDropTarget = SharedItemDropTarget;
export type RootDropTarget = SharedRootDropTarget;
export type TextDropItem = SharedTextDropItem;

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

export class ListDropTargetDelegate implements DropTargetDelegate {
  private collection: Iterable<Node<unknown>>;
  private ref: RefObject<HTMLElement | null>;
  private layout: 'grid' | 'stack';
  private orientation: Orientation;
  private direction: Direction;

  constructor(
    collection: Iterable<Node<unknown>>,
    ref: RefObject<HTMLElement | null>,
    options: {
      direction?: Direction,
      layout?: 'stack' | 'grid',
      orientation?: Orientation
    } = {}
  ) {
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

function serializeClipboardValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value == null) {
    return '';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function getDataTransferTypes(dataTransfer: DataTransfer): string[] {
  let types = (dataTransfer as AnyRecord).types;
  if (!types) {
    return [];
  }

  if (Array.isArray(types)) {
    return types.map((type) => String(type));
  }

  if (typeof (types as { [Symbol.iterator]?: unknown })[Symbol.iterator] === 'function') {
    return Array.from(types as Iterable<unknown>, (type) => String(type));
  }

  return [];
}

function readDataTransferValue(dataTransfer: DataTransfer, type: string): string {
  if (typeof dataTransfer.getData === 'function') {
    return dataTransfer.getData(type);
  }

  return '';
}

function writeDataTransferValue(dataTransfer: DataTransfer, type: string, value: string): void {
  if (typeof dataTransfer.setData !== 'function') {
    return;
  }

  dataTransfer.setData(type, value);
}

function toClipboardPayload(items: Array<DragItem | Record<string, unknown>>): Array<Record<string, string>> {
  return items.map((item) => {
    let record = item as AnyRecord;
    if ('value' in record) {
      let type = typeof record.type === 'string' && record.type.length > 0
        ? record.type
        : 'text/plain';
      let value = serializeClipboardValue(record.value);
      let dataByType: Record<string, string> = {[type]: value};
      let extraTypes = record.types;
      if (extraTypes instanceof Set) {
        for (let extraType of extraTypes) {
          let key = String(extraType);
          if (!(key in dataByType)) {
            dataByType[key] = value;
          }
        }
      }

      return dataByType;
    }

    let dataByType: Record<string, string> = {};
    for (let [type, value] of Object.entries(record)) {
      dataByType[type] = serializeClipboardValue(value);
    }

    return dataByType;
  });
}

function writeToDataTransfer(dataTransfer: DataTransfer, items: Array<DragItem | Record<string, unknown>>): void {
  let groupedByType = new Map<string, string[]>();
  let needsCustomData = false;
  let customData = toClipboardPayload(items);

  for (let item of customData) {
    let types = Object.keys(item);
    if (types.length > 1) {
      needsCustomData = true;
    }

    for (let type of types) {
      let values = groupedByType.get(type);
      if (!values) {
        values = [];
        groupedByType.set(type, values);
      } else {
        needsCustomData = true;
      }

      values.push(item[type]);
    }
  }

  for (let [type, values] of groupedByType) {
    if (NATIVE_DRAG_TYPES.has(type)) {
      writeDataTransferValue(dataTransfer, type, values.join('\n'));
    } else {
      writeDataTransferValue(dataTransfer, type, values[0]);
    }
  }

  if (needsCustomData) {
    writeDataTransferValue(dataTransfer, CUSTOM_DRAG_TYPE, JSON.stringify(customData));
  }
}

function readFromDataTransfer(dataTransfer: DataTransfer): DropItem[] {
  let types = getDataTransferTypes(dataTransfer);
  if (types.includes(CUSTOM_DRAG_TYPE)) {
    try {
      let data = readDataTransferValue(dataTransfer, CUSTOM_DRAG_TYPE);
      let parsed = JSON.parse(data) as Array<Record<string, string>>;
      return parsed.map((item) => {
        let itemTypes = Object.keys(item);
        return {
          kind: 'text',
          types: new Set(itemTypes),
          getText: (type: string) => Promise.resolve(item[type] ?? '')
        } as TextDropItem;
      });
    } catch {
      // Ignore malformed custom clipboard payloads and fall back to native types.
    }
  }

  let nativeTypes = types.filter((type) => Boolean(type) && type !== CUSTOM_DRAG_TYPE);
  if (nativeTypes.length === 0) {
    return [];
  }

  let dataByType = new Map<string, string>();
  for (let type of nativeTypes) {
    dataByType.set(type, readDataTransferValue(dataTransfer, type));
  }

  return [{
    kind: 'text',
    types: new Set(nativeTypes),
    getText: (type: string) => Promise.resolve(dataByType.get(type) ?? '')
  } satisfies TextDropItem];
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

function createAutoScroll(ref: RefObject<HTMLElement | null>): {move: (x: number, y: number) => void, stop: () => void} {
  let scrollableElement: Element | null = null;
  let scrollableX = true;
  let scrollableY = true;
  let timer: ReturnType<typeof requestAnimationFrame> | undefined;
  let dx = 0;
  let dy = 0;

  let stop = () => {
    if (timer) {
      cancelAnimationFrame(timer);
      timer = undefined;
    }
  };

  let scroll = () => {
    if (scrollableX && scrollableElement) {
      scrollableElement.scrollLeft += dx;
    }
    if (scrollableY && scrollableElement) {
      scrollableElement.scrollTop += dy;
    }

    if (timer) {
      timer = requestAnimationFrame(scroll);
    }
  };

  let ensureScrollableElement = () => {
    if (!ref.current) {
      scrollableElement = null;
      return;
    }

    scrollableElement = isScrollable(ref.current)
      ? ref.current
      : getScrollParent(ref.current);
    let style = window.getComputedStyle(scrollableElement);
    scrollableX = /(auto|scroll)/.test(style.overflowX);
    scrollableY = /(auto|scroll)/.test(style.overflowY);
  };

  return {
    move(x: number, y: number) {
      // Native auto-scroll behavior is missing in macOS WebKit.
      if (!isWebKit() || isIOS()) {
        return;
      }

      ensureScrollableElement();
      if (!scrollableElement) {
        return;
      }

      if (!scrollableElement.isConnected) {
        stop();
        return;
      }

      let box = scrollableElement.getBoundingClientRect();
      if (box.width <= AUTOSCROLL_AREA_SIZE * 2 && box.height <= AUTOSCROLL_AREA_SIZE * 2) {
        stop();
        return;
      }
      let left = AUTOSCROLL_AREA_SIZE;
      let top = AUTOSCROLL_AREA_SIZE;
      let bottom = box.height - AUTOSCROLL_AREA_SIZE;
      let right = box.width - AUTOSCROLL_AREA_SIZE;
      if (x < left || x > right || y < top || y > bottom) {
        if (x < left) {
          dx = x - left;
        } else if (x > right) {
          dx = x - right;
        }
        if (y < top) {
          dy = y - top;
        } else if (y > bottom) {
          dy = y - bottom;
        }

        if (!timer) {
          timer = requestAnimationFrame(scroll);
        }
      } else {
        stop();
      }
    },
    stop
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

function addGlobalEventListener(eventName: string, handler: (event: Event) => void): () => void {
  if (typeof document === 'undefined') {
    return noop;
  }

  let eventData = globalClipboardEvents.get(eventName);
  if (!eventData) {
    let handlers = new Set<(event: Event) => void>();
    let listener = (event: Event) => {
      for (let callback of handlers) {
        callback(event);
      }
    };

    eventData = {
      handlers,
      listener
    };
    globalClipboardEvents.set(eventName, eventData);
    document.addEventListener(eventName, listener);
  }

  eventData.handlers.add(handler);
  return () => {
    let current = globalClipboardEvents.get(eventName);
    if (!current) {
      return;
    }

    current.handlers.delete(handler);
    if (current.handlers.size === 0) {
      document.removeEventListener(eventName, current.listener);
      globalClipboardEvents.delete(eventName);
    }
  };
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

export function useClipboard(props: ClipboardProps): ClipboardResult {
  let isFocused = false;
  let onFocus = () => {
    isFocused = true;
  };
  let onBlur = () => {
    isFocused = false;
  };
  let onBeforeCopy = (event: Event) => {
    if (!isFocused || !props.getItems) {
      return;
    }

    event.preventDefault();
  };
  let onCopy = (event: Event) => {
    if (!isFocused || !props.getItems) {
      return;
    }

    let clipboardEvent = event as ClipboardEvent;
    if (!clipboardEvent.clipboardData) {
      return;
    }

    event.preventDefault();
    let items = props.getItems({action: 'copy'});
    if (Array.isArray(items)) {
      writeToDataTransfer(clipboardEvent.clipboardData, items);
    }
    props.onCopy?.();
  };
  let onBeforeCut = (event: Event) => {
    if (!isFocused || !props.getItems || !props.onCut) {
      return;
    }

    event.preventDefault();
  };
  let onCut = (event: Event) => {
    if (!isFocused || !props.getItems || !props.onCut) {
      return;
    }

    let clipboardEvent = event as ClipboardEvent;
    if (!clipboardEvent.clipboardData) {
      return;
    }

    event.preventDefault();
    let items = props.getItems({action: 'cut'});
    if (Array.isArray(items)) {
      writeToDataTransfer(clipboardEvent.clipboardData, items);
    }
    props.onCut();
  };
  let onBeforePaste = (event: Event) => {
    if (!isFocused || !props.onPaste) {
      return;
    }

    event.preventDefault();
  };
  let onPaste = (event: Event) => {
    if (!isFocused || !props.onPaste) {
      return;
    }

    let clipboardEvent = event as ClipboardEvent;
    if (!clipboardEvent.clipboardData) {
      return;
    }

    event.preventDefault();
    props.onPaste(readFromDataTransfer(clipboardEvent.clipboardData));
  };

  if (!props.isDisabled) {
    let cleanupFns = [
      addGlobalEventListener('beforecopy', onBeforeCopy),
      addGlobalEventListener('copy', onCopy),
      addGlobalEventListener('beforecut', onBeforeCut),
      addGlobalEventListener('cut', onCut),
      addGlobalEventListener('beforepaste', onBeforePaste),
      addGlobalEventListener('paste', onPaste)
    ];
    if (getCurrentScope()) {
      onScopeDispose(() => {
        for (let cleanup of cleanupFns) {
          cleanup();
        }
      });
    }
  }

  return {
    clipboardProps: {
      onBlur,
      onFocus
    }
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
  let stringFormatter = useLocalizedStringFormatter(intlMessages, '@vue-aria/dnd');
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

    return '';
  };
  let labelForTarget = () => {
    let target = propsRecord.target as AnyRecord | undefined;
    if (!target || typeof target !== 'object') {
      return stringFormatter.format('dropOnRoot');
    }

    if (target.type === 'root') {
      return stringFormatter.format('dropOnRoot');
    }

    let key = target.key as DraggingKey | null;
    if (target.dropPosition === 'on') {
      return stringFormatter.format('dropOnItem', {itemText: getText(key)});
    }

    let collection = stateRecord.collection as AnyRecord | undefined;
    let beforeKey: DraggingKey | null = null;
    let afterKey: DraggingKey | null = null;
    if (target.dropPosition === 'before') {
      let prevKey = collection && typeof collection.getItem === 'function'
        ? (collection.getItem(key) as AnyRecord | undefined)?.prevKey as DraggingKey | null | undefined
        : null;
      let prevNode = prevKey != null && collection && typeof collection.getItem === 'function'
        ? collection.getItem(prevKey) as AnyRecord | undefined
        : null;
      beforeKey = prevNode?.type === 'item' ? (prevNode.key as DraggingKey) : null;
      afterKey = key;
    } else {
      beforeKey = key;
      let nextKey = collection && typeof collection.getItem === 'function'
        ? (collection.getItem(key) as AnyRecord | undefined)?.nextKey as DraggingKey | null | undefined
        : null;
      let nextNode = nextKey != null && collection && typeof collection.getItem === 'function'
        ? collection.getItem(nextKey) as AnyRecord | undefined
        : null;
      afterKey = nextNode?.type === 'item' ? (nextNode.key as DraggingKey) : null;
    }

    if (beforeKey != null && afterKey != null) {
      return stringFormatter.format('insertBetween', {
        beforeItemText: getText(beforeKey),
        afterItemText: getText(afterKey)
      });
    }

    if (beforeKey != null) {
      return stringFormatter.format('insertAfter', {
        itemText: getText(beforeKey)
      });
    }

    if (afterKey != null) {
      return stringFormatter.format('insertBefore', {
        itemText: getText(afterKey)
      });
    }

    return '';
  };
  let labelledBy = () => {
    let target = propsRecord.target as AnyRecord | undefined;
    if (!target || target.type !== 'root') {
      return undefined;
    }

    let collectionId = getDroppableCollectionId(state);
    return `${id} ${collectionId}`;
  };
  let dropIndicatorProps = computed(() => {
    let ariaHidden = !isVirtualDragging()
      ? 'true'
      : droppableItem.dropProps.value['aria-hidden'];
    return {
      ...droppableItem.dropProps.value,
      id,
      'aria-roledescription': stringFormatter.format('dropIndicator'),
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
  let stateObject = state as unknown as object;
  let collectionId = droppableCollectionIds.get(stateObject);
  if (!collectionId) {
    collectionId = `vue-aria-droppable-collection-${++droppableCollectionId}`;
    droppableCollectionIds.set(stateObject, collectionId);
  }
  droppableCollectionRefs.set(stateObject, ref);
  let lastDragPoint: {x: number, y: number} | null = null;
  let isDraggingOverCollection = false;
  let dropActivateTimeout: ReturnType<typeof setTimeout> | undefined;
  let autoScroll = createAutoScroll(ref);

  let clearDropActivateTimeout = () => {
    if (dropActivateTimeout) {
      clearTimeout(dropActivateTimeout);
      dropActivateTimeout = undefined;
    }
  };

  let updateTargetFromPoint = (
    items: DragItem[],
    input?: unknown
  ): {
    point: {x: number, y: number},
    didResolveTarget: boolean,
    resolvedTarget: DropTarget | null
  } => {
    let point = readPoint(input, ref);
    let dropTargetDelegate = propsRecord.dropTargetDelegate as AnyRecord | undefined;
    if (!dropTargetDelegate || typeof dropTargetDelegate.getDropTargetFromPoint !== 'function') {
      return {
        point,
        didResolveTarget: false,
        resolvedTarget: null
      };
    }

    let getDropOperationForTarget = (target: DropTarget | null): DropOperation => {
      return getDropOperation(items, target, DEFAULT_DROP_OPERATION);
    };
    let nextTarget = dropTargetDelegate.getDropTargetFromPoint(
      point.x,
      point.y,
      (target: DropTarget) => getDropOperationForTarget(target) !== 'cancel'
    );
    let resolvedTarget = nextTarget && typeof nextTarget === 'object'
      ? nextTarget as DropTarget
      : null;
    if (resolvedTarget && typeof stateRecord.setTarget === 'function') {
      stateRecord.setTarget(resolvedTarget);
    }

    return {
      point,
      didResolveTarget: true,
      resolvedTarget
    };
  };

  let scheduleDropActivate = (target: DropTarget | null, point: {x: number, y: number}) => {
    clearDropActivateTimeout();
    if (!target || target.type !== 'item' || typeof propsRecord.onDropActivate !== 'function') {
      return;
    }

    let targetSnapshot = target;
    let x = point.x;
    let y = point.y;
    dropActivateTimeout = setTimeout(() => {
      propsRecord.onDropActivate({
        type: 'dropactivate',
        target: targetSnapshot,
        x,
        y
      });
    }, DROP_ACTIVATE_TIMEOUT);
  };

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

  let getDropOperationWithRootFallback = (items: DragItem[], fallback: DropOperation): DropOperation => {
    let target = readDropTarget(stateRecord);
    let operation = getDropOperation(items, target, fallback);
    if (operation !== 'cancel' || target == null || target.type === 'root') {
      return operation;
    }

    let rootTarget: DropTarget = {type: 'root'};
    let rootOperation = getDropOperation(items, rootTarget, fallback);
    if (rootOperation === 'cancel') {
      return 'cancel';
    }

    if (typeof stateRecord.setTarget === 'function') {
      stateRecord.setTarget(rootTarget);
    }

    return rootOperation;
  };

  let getItemTypes = (item: DragItem): Set<string> => {
    let itemRecord = item as AnyRecord;
    if (itemRecord.kind === 'directory') {
      return new Set([DIRECTORY_DRAG_TYPE]);
    }

    if (itemRecord.kind === 'file') {
      let fileType = typeof itemRecord.type === 'string' ? itemRecord.type : '';
      return fileType ? new Set([fileType]) : new Set();
    }

    if (itemRecord.types instanceof Set) {
      return new Set(Array.from(itemRecord.types, (type) => String(type)));
    }

    if (Array.isArray(itemRecord.types)) {
      return new Set(itemRecord.types.map((type) => String(type)));
    }

    if (typeof itemRecord.type === 'string') {
      return new Set([itemRecord.type]);
    }

    return new Set();
  };

  let invokeDefaultCollectionDrop = (event: {
    items: DragItem[],
    target: DropTarget,
    dropOperation: DropOperation
  }) => {
    let target = event.target as AnyRecord;
    let isInternal = isInternalDrop(ref);
    let accepted = acceptedTypes.value;
    let shouldAcceptItemDrop = typeof propsRecord.shouldAcceptItemDrop === 'function'
      ? propsRecord.shouldAcceptItemDrop as (target: DropTarget, itemTypes: Set<string>) => boolean
      : null;
    let filteredItems = event.items;

    if (accepted || shouldAcceptItemDrop) {
      filteredItems = event.items.filter((item) => {
        let itemTypes = getItemTypes(item);
        let matchesAcceptedType = !accepted || Array.from(itemTypes).some((type) => accepted.has(type));
        if (!matchesAcceptedType) {
          return false;
        }

        if (
          target.type === 'item' &&
          target.dropPosition === 'on' &&
          shouldAcceptItemDrop
        ) {
          return shouldAcceptItemDrop(target as DropTarget, itemTypes);
        }

        return true;
      });
    }

    if (filteredItems.length === 0) {
      return;
    }

    if (target.type === 'root' && typeof propsRecord.onRootDrop === 'function') {
      void propsRecord.onRootDrop({
        items: filteredItems,
        dropOperation: event.dropOperation
      });
    }

    if (target.type !== 'item') {
      return;
    }

    if (target.dropPosition === 'on' && typeof propsRecord.onItemDrop === 'function') {
      void propsRecord.onItemDrop({
        items: filteredItems,
        dropOperation: event.dropOperation,
        isInternal,
        target: target as DropTarget
      });
    }

    if (isInternal && typeof propsRecord.onMove === 'function') {
      void propsRecord.onMove({
        keys: new Set(draggingKeys),
        dropOperation: event.dropOperation,
        target: target as DropTarget
      });
    }

    if (target.dropPosition === 'on') {
      return;
    }

    if (!isInternal && typeof propsRecord.onInsert === 'function') {
      void propsRecord.onInsert({
        items: filteredItems,
        dropOperation: event.dropOperation,
        target: target as DropTarget
      });
    }

    if (isInternal && typeof propsRecord.onReorder === 'function') {
      void propsRecord.onReorder({
        keys: new Set(draggingKeys),
        dropOperation: event.dropOperation,
        target: target as DropTarget
      });
    }
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
      let {didResolveTarget, resolvedTarget} = updateTargetFromPoint(items, input);
      if (didResolveTarget && !resolvedTarget) {
        onDragLeave(input);
        return false;
      }

      if (getDropOperationWithRootFallback(items, DEFAULT_DROP_OPERATION) === 'cancel') {
        onDragLeave(input);
        return false;
      }

      return true;
    }

    let {point, didResolveTarget, resolvedTarget} = updateTargetFromPoint(items, input);
    if (didResolveTarget && !resolvedTarget && typeof stateRecord.setTarget === 'function') {
      stateRecord.setTarget(null);
      return false;
    }

    if (!didResolveTarget && readDropTarget(stateRecord) == null && typeof stateRecord.setTarget === 'function') {
      stateRecord.setTarget({type: 'root'});
    }

    if (getDropOperationWithRootFallback(items, DEFAULT_DROP_OPERATION) === 'cancel') {
      if (typeof stateRecord.setTarget === 'function') {
        stateRecord.setTarget(null);
      }

      return false;
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

    isDraggingOverCollection = true;
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

    let targetFromPoint = updateTargetFromPoint(items, input);
    if (targetFromPoint.didResolveTarget && !targetFromPoint.resolvedTarget) {
      onDragLeave(input);
      return;
    }

    point = targetFromPoint.point;

    lastDragPoint = point;
    dropCollectionRef = ref;
    if (typeof stateRecord.move === 'function') {
      stateRecord.move(items);
    }

    let target = readDropTarget(stateRecord);
    if (getDropOperationWithRootFallback(items, DEFAULT_DROP_OPERATION) === 'cancel') {
      onDragLeave(input);
      return;
    }

    target = readDropTarget(stateRecord);

    autoScroll.move(point.x, point.y);

    if (typeof propsRecord.onDropMove === 'function') {
      propsRecord.onDropMove({
        items,
        target,
        type: 'dropmove',
        x: point.x,
        y: point.y
      });
    }

    scheduleDropActivate(target, point);
  };

  let onDragLeave = (input?: unknown): void => {
    clearDropActivateTimeout();
    autoScroll.stop();
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
    clearDropActivateTimeout();
    let items = normalizeDropItems(input);
    if (isDisabled.value || !includesAcceptedType(acceptedTypes.value, items)) {
      onDragLeave(input);
      return 'cancel';
    }

    let point = readPoint(input, ref);
    let requestedOperation = resolveDropOperation(input, fallbackOperation);
    let operation = getDropOperationWithRootFallback(items, requestedOperation);
    let target = readDropTarget(stateRecord);
    if (operation === 'cancel' || !target) {
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

    let dropEvent = {
      items,
      target,
      dropOperation: resolvedOperation,
      type: 'drop',
      x: point.x,
      y: point.y
    };

    if (typeof propsRecord.onDrop === 'function') {
      propsRecord.onDrop(dropEvent);
    } else {
      invokeDefaultCollectionDrop({
        items,
        target,
        dropOperation: resolvedOperation
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
    id: collectionId,
    // Keep collection announcements owned by drop indicators, matching React behavior.
    'aria-describedby': null,
    onKeyDown: propsRecord.onKeyDown,
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
  let stringFormatter = useLocalizedStringFormatter(intlMessages, '@vue-aria/dnd');
  let droppableCollectionRef = getDroppableCollectionRef(state);
  let keyboardDropDescription = useDescription(stringFormatter.format('dropDescriptionKeyboard'));
  let touchDropDescription = useDescription(stringFormatter.format('dropDescriptionTouch'));
  let virtualDropDescription = useDescription(stringFormatter.format('dropDescriptionVirtual'));
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
      droppableCollectionRef &&
      draggingCollectionRef.current &&
      draggingCollectionRef.current === droppableCollectionRef.current
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
  let describedBy = computed(() => {
    if (!isVirtualDragging()) {
      return undefined;
    }

    switch (mapDragModality(getInteractionModality())) {
      case 'keyboard':
        return keyboardDropDescription['aria-describedby'];
      case 'touch':
        return touchDropDescription['aria-describedby'];
      default:
        return virtualDropDescription['aria-describedby'];
    }
  });
  let dropProps = computed(() => ({
    'aria-describedby': describedBy.value,
    'aria-hidden': isVirtualDragging() && !isValidDropTarget.value ? 'true' : undefined,
    onClick: noop
  }));
  watch(isDropTarget, (next, previous) => {
    if (!next || previous || !isVirtualDragging()) {
      return;
    }

    if (ref.current && typeof ref.current.focus === 'function') {
      ref.current.focus();
    }
  }, {immediate: true});

  return {
    dropProps,
    isDropTarget
  };
}
