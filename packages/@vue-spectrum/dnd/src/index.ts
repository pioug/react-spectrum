import {
  DIRECTORY_DRAG_TYPE as ARIA_DIRECTORY_DRAG_TYPE,
  DragPreview as AriaDragPreview,
  isVirtualDragging,
  useDraggableCollection as useAriaDraggableCollection,
  useDraggableItem as useAriaDraggableItem,
  useDropIndicator as useAriaDropIndicator,
  useDroppableCollection as useAriaDroppableCollection,
  useDroppableItem as useAriaDroppableItem
} from '@vue-aria/dnd';
import {
  useDraggableCollectionState as useStatelyDraggableCollectionState,
  useDroppableCollectionState as useStatelyDroppableCollectionState
} from '@vue-stately/dnd';
import {VueDropZone} from 'vue-aria-components';

export const DropZone = VueDropZone;
export {VueDropZone};

type AnyRecord = Record<string, unknown>;
type Key = number | string;

export type DragAndDropOptions<T = object> = AnyRecord & {
  getItems?: (keys: Set<Key>, items: T[]) => unknown,
  onDrop?: unknown,
  onInsert?: unknown,
  onItemDrop?: unknown,
  onReorder?: unknown,
  onRootDrop?: unknown,
  renderPreview?: (keys: Set<Key>, draggedKey: Key) => unknown,
  _itemType?: T
};
type DragAndDropHookMap = {
  DragPreview?: typeof AriaDragPreview,
  isVirtualDragging?: () => boolean,
  renderPreview?: (keys: Set<Key>, draggedKey: Key) => unknown,
  useDraggableCollection?: typeof useAriaDraggableCollection,
  useDraggableCollectionState?: (props: AnyRecord) => AnyRecord,
  useDraggableItem?: typeof useAriaDraggableItem,
  useDropIndicator?: typeof useAriaDropIndicator,
  useDroppableCollection?: typeof useAriaDroppableCollection,
  useDroppableCollectionState?: (props: AnyRecord) => AnyRecord,
  useDroppableItem?: typeof useAriaDroppableItem
};
export type DragAndDropHooks = {
  dragAndDropHooks: DragAndDropHookMap
};
export type DirectoryDropItem = AnyRecord;
export type DraggableCollectionEndEvent = AnyRecord;
export type DraggableCollectionMoveEvent = AnyRecord;
export type DraggableCollectionStartEvent = AnyRecord;
export type DragPreviewRenderer = AnyRecord;
export type DragTypes = AnyRecord;
export type DropItem = AnyRecord;
export type DropOperation = AnyRecord;
export type DroppableCollectionDropEvent = AnyRecord;
export type DroppableCollectionEnterEvent = AnyRecord;
export type DroppableCollectionExitEvent = AnyRecord;
export type DroppableCollectionInsertDropEvent = AnyRecord;
export type DroppableCollectionMoveEvent = AnyRecord;
export type DroppableCollectionOnItemDropEvent = AnyRecord;
export type DroppableCollectionReorderEvent = AnyRecord;
export type DroppableCollectionRootDropEvent = AnyRecord;
export type DropPosition = AnyRecord;
export type DropTarget = AnyRecord;
export type FileDropItem = AnyRecord;
export type ItemDropTarget = AnyRecord;
export type RootDropTarget = AnyRecord;
export type TextDropItem = AnyRecord;

export const DIRECTORY_DRAG_TYPE = ARIA_DIRECTORY_DRAG_TYPE;

export function useDragAndDrop<T = object>(options?: DragAndDropOptions<T>): DragAndDropHooks {
  let resolvedOptions = options ?? {};
  let hooks: DragAndDropHookMap = {};
  let isDraggable = typeof resolvedOptions.getItems === 'function';
  let isDroppable = Boolean(
    resolvedOptions.onDrop ||
    resolvedOptions.onInsert ||
    resolvedOptions.onItemDrop ||
    resolvedOptions.onReorder ||
    resolvedOptions.onRootDrop
  );

  if (isDraggable) {
    hooks.useDraggableCollectionState = (props) => {
      return useStatelyDraggableCollectionState({
        ...props,
        ...resolvedOptions,
        getItems: resolvedOptions.getItems
      } as never) as AnyRecord;
    };
    hooks.useDraggableCollection = useAriaDraggableCollection;
    hooks.useDraggableItem = useAriaDraggableItem;
    hooks.DragPreview = AriaDragPreview;
    hooks.renderPreview = resolvedOptions.renderPreview;
  }

  if (isDroppable) {
    hooks.useDroppableCollectionState = (props) => {
      return useStatelyDroppableCollectionState({
        ...props,
        ...resolvedOptions
      } as never) as AnyRecord;
    };
    hooks.useDroppableItem = useAriaDroppableItem;
    hooks.useDroppableCollection = ((props, state, ref) => {
      return useAriaDroppableCollection({
        ...props,
        ...resolvedOptions
      }, state, ref);
    }) as typeof useAriaDroppableCollection;
    hooks.useDropIndicator = useAriaDropIndicator;
  }

  if (isDraggable || isDroppable) {
    hooks.isVirtualDragging = isVirtualDragging;
  }

  return {
    dragAndDropHooks: hooks
  };
}
