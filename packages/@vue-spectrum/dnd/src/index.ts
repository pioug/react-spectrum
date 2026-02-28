import {
  DIRECTORY_DRAG_TYPE as ARIA_DIRECTORY_DRAG_TYPE,
  DragPreview as AriaDragPreview,
  type DragItem,
  type DraggableCollectionOptions,
  type DraggableItemProps,
  type DraggableItemResult,
  type DropIndicatorAria,
  type DropIndicatorProps,
  type DroppableCollectionOptions,
  type DroppableCollectionResult,
  type DroppableItemOptions,
  type DroppableItemResult,
  isVirtualDragging,
  useDraggableCollection as useAriaDraggableCollection,
  useDraggableItem as useAriaDraggableItem,
  useDropIndicator as useAriaDropIndicator,
  useDroppableCollection as useAriaDroppableCollection,
  useDroppableItem as useAriaDroppableItem
} from '@vue-aria/dnd';
import {
  type DraggableCollectionState,
  type DraggableCollectionStateOptions,
  type DroppableCollectionState,
  type DroppableCollectionStateOptions,
  useDraggableCollectionState as useStatelyDraggableCollectionState,
  useDroppableCollectionState as useStatelyDroppableCollectionState
} from '@vue-stately/dnd';
import type {DraggableCollectionProps, DroppableCollectionProps, Key, RefObject} from '@vue-types/shared';
import {VueDropZone} from 'vue-aria-components';

export const DropZone = VueDropZone;
export {VueDropZone};

interface DraggableCollectionStateOpts<T> extends Omit<DraggableCollectionStateOptions<T>, 'getItems'> {}

interface DragHooks<T = object> {
  DragPreview?: typeof AriaDragPreview,
  useDraggableCollection?: (props: DraggableCollectionOptions, state: DraggableCollectionState, ref: RefObject<HTMLElement | null>) => void,
  useDraggableCollectionState?: (props: DraggableCollectionStateOpts<T>) => DraggableCollectionState,
  useDraggableItem?: (props: DraggableItemProps, state: DraggableCollectionState) => DraggableItemResult
}

interface DropHooks {
  useDropIndicator?: (props: DropIndicatorProps, state: DroppableCollectionState, ref: RefObject<HTMLElement | null>) => DropIndicatorAria,
  useDroppableCollection?: (props: DroppableCollectionOptions, state: DroppableCollectionState, ref: RefObject<HTMLElement | null>) => DroppableCollectionResult,
  useDroppableCollectionState?: (props: DroppableCollectionStateOptions) => DroppableCollectionState,
  useDroppableItem?: (options: DroppableItemOptions, state: DroppableCollectionState, ref: RefObject<HTMLElement | null>) => DroppableItemResult
}

export interface DragAndDropHooks<T = object> {
  dragAndDropHooks: DragHooks<T> & DropHooks & {
    isVirtualDragging?: () => boolean,
    renderPreview?: (keys: Set<Key>, draggedKey: Key) => unknown
  }
}

export interface DragAndDropOptions<T = object> extends Omit<DraggableCollectionProps<T>, 'preview' | 'getItems'>, Omit<DroppableCollectionProps, 'onMove'> {
  getItems?: (keys: Set<Key>, items: T[]) => DragItem[],
  renderPreview?: (keys: Set<Key>, draggedKey: Key) => unknown
}

export type {
  DirectoryDropItem,
  DraggableCollectionEndEvent,
  DraggableCollectionMoveEvent,
  DraggableCollectionStartEvent,
  DragPreviewRenderer,
  DragTypes,
  DropItem,
  DropOperation,
  DroppableCollectionDropEvent,
  DroppableCollectionEnterEvent,
  DroppableCollectionExitEvent,
  DroppableCollectionInsertDropEvent,
  DroppableCollectionMoveEvent,
  DroppableCollectionOnItemDropEvent,
  DroppableCollectionReorderEvent,
  DroppableCollectionRootDropEvent,
  DropPosition,
  DropTarget,
  FileDropItem,
  ItemDropTarget,
  RootDropTarget,
  TextDropItem
} from '@vue-types/shared';

export const DIRECTORY_DRAG_TYPE = ARIA_DIRECTORY_DRAG_TYPE;

export function useDragAndDrop<T = object>(options?: DragAndDropOptions<T>): DragAndDropHooks {
  let resolvedOptions = options ?? {};
  let hooks: DragHooks<T> & DropHooks & {
    isVirtualDragging?: () => boolean,
    renderPreview?: (keys: Set<Key>, draggedKey: Key) => unknown
  } = {};
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
      } as unknown as DraggableCollectionStateOptions<T>);
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
      } as unknown as DroppableCollectionStateOptions);
    };
    hooks.useDroppableItem = useAriaDroppableItem;
    hooks.useDroppableCollection = ((props, state, ref) => {
      return useAriaDroppableCollection({
        ...props,
        ...resolvedOptions
      } as DroppableCollectionOptions, state, ref);
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
