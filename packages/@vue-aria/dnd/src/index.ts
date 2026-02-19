import {defineComponent} from 'vue';

export type {AriaDragOptions, DragAria} from './useDrag';
export type {AriaDropOptions, DropAria} from './useDrop';
export type {DragItem, DropOperation} from './types';
export {useDrag} from './useDrag';
export {useDrop} from './useDrop';

type AnyRecord = Record<string, unknown>;

export type ClipboardProps = AnyRecord;
export type ClipboardResult = AnyRecord;
export type DirectoryDropItem = AnyRecord;
export type DragEndEvent = AnyRecord;
export type DragMoveEvent = AnyRecord;
export type DragOptions = AnyRecord;
export type DragPreviewProps = AnyRecord;
export type DragPreviewRenderer = AnyRecord;
export type DragResult = AnyRecord;
export type DragStartEvent = AnyRecord;
export type DragTypes = AnyRecord;
export type DraggableCollectionEndEvent = AnyRecord;
export type DraggableCollectionMoveEvent = AnyRecord;
export type DraggableCollectionOptions = AnyRecord;
export type DraggableCollectionStartEvent = AnyRecord;
export type DraggableItemProps = AnyRecord;
export type DraggableItemResult = AnyRecord;
export type DropEnterEvent = AnyRecord;
export type DropEvent = AnyRecord;
export type DropExitEvent = AnyRecord;
export type DropIndicatorAria = AnyRecord;
export type DropIndicatorProps = AnyRecord;
export type DropItem = AnyRecord;
export type DropMoveEvent = AnyRecord;
export type DropOptions = AnyRecord;
export type DropPosition = AnyRecord;
export type DropResult = AnyRecord;
export type DropTarget = AnyRecord;
export type DropTargetDelegate = AnyRecord;
export type DroppableCollectionDropEvent = AnyRecord;
export type DroppableCollectionEnterEvent = AnyRecord;
export type DroppableCollectionExitEvent = AnyRecord;
export type DroppableCollectionInsertDropEvent = AnyRecord;
export type DroppableCollectionMoveEvent = AnyRecord;
export type DroppableCollectionOnItemDropEvent = AnyRecord;
export type DroppableCollectionOptions = AnyRecord;
export type DroppableCollectionReorderEvent = AnyRecord;
export type DroppableCollectionResult = AnyRecord;
export type DroppableCollectionRootDropEvent = AnyRecord;
export type DroppableItemOptions = AnyRecord;
export type DroppableItemResult = AnyRecord;
export type FileDropItem = AnyRecord;
export type ItemDropTarget = AnyRecord;
export type RootDropTarget = AnyRecord;
export type TextDropItem = AnyRecord;

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

export function isDirectoryDropItem(item: unknown): item is DirectoryDropItem {
  return Boolean(item) && typeof item === 'object' && 'kind' in (item as AnyRecord);
}

export function isFileDropItem(item: unknown): item is FileDropItem {
  return Boolean(item) && typeof item === 'object' && 'name' in (item as AnyRecord);
}

export function isTextDropItem(item: unknown): item is TextDropItem {
  return Boolean(item) && typeof item === 'object' && 'text' in (item as AnyRecord);
}

export function isVirtualDragging(): boolean {
  return false;
}

export function useClipboard() {
  return {
    clipboardProps: {}
  };
}

export function useDraggableCollection() {
  return {
    collectionProps: {}
  };
}

export function useDraggableItem() {
  return {
    draggableItemProps: {}
  };
}

export function useDropIndicator() {
  return {
    dropIndicatorProps: {}
  };
}

export function useDroppableCollection() {
  return {
    collectionProps: {}
  };
}

export function useDroppableItem() {
  return {
    droppableItemProps: {}
  };
}
