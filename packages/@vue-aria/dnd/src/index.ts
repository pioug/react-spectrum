import {type AriaDragOptions, type DragAria, useDrag as useAriaDrag} from './useDrag';
import {type AriaDropOptions, type DropAria, useDrop as useAriaDrop} from './useDrop';
import {defineComponent} from 'vue';
import {type DragItem, type DropOperation} from './types';
import {isVirtualDraggingSessionActive} from './dragSession';

export type {AriaDragOptions, DragAria, AriaDropOptions, DropAria};
export type {DragItem, DropOperation} from './types';

type AnyRecord = Record<string, unknown>;
type RefObject<T> = {current: T};

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
  return Boolean(dropItem) && typeof dropItem === 'object' && 'kind' in (dropItem as AnyRecord);
}

export function isFileDropItem(dropItem: DropItem): dropItem is FileDropItem {
  return Boolean(dropItem) && typeof dropItem === 'object' && 'name' in (dropItem as AnyRecord);
}

export function isTextDropItem(dropItem: DropItem): dropItem is TextDropItem {
  return Boolean(dropItem) && typeof dropItem === 'object' && 'text' in (dropItem as AnyRecord);
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
  _state: DraggableCollectionState,
  _ref: RefObject<HTMLElement | null>
): void {
  // Compatibility no-op.
}

export function useDraggableItem(
  _props: DraggableItemProps,
  _state: DraggableCollectionState
): DraggableItemResult {
  return {
    draggableItemProps: {}
  };
}

export function useDropIndicator(
  _props: DropIndicatorProps,
  _state: DroppableCollectionState,
  _ref: RefObject<HTMLElement | null>
): DropIndicatorAria {
  return {
    dropIndicatorProps: {}
  };
}

export function useDroppableCollection(
  _props: DroppableCollectionOptions,
  _state: DroppableCollectionState,
  _ref: RefObject<HTMLElement | null>
): DroppableCollectionResult {
  return {
    collectionProps: {}
  };
}

export function useDroppableItem(
  _props: DroppableItemOptions,
  _state: DroppableCollectionState,
  _ref: RefObject<HTMLElement | null>
): DroppableItemResult {
  return {
    droppableItemProps: {}
  };
}
