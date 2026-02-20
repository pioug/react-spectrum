import {VueDropZone} from '@vue-spectrum/components';

export const DropZone = VueDropZone;
export {VueDropZone};

type AnyRecord = Record<string, unknown>;

export type DragAndDropOptions<T = object> = AnyRecord & {
  _itemType?: T
};
export type DragAndDropHooks = {
  dragHooks: AnyRecord,
  dropHooks: AnyRecord
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

export const DIRECTORY_DRAG_TYPE = 'application/x-directory';

export function useDragAndDrop<T = object>(options?: DragAndDropOptions<T>): DragAndDropHooks {
  void options;
  return {
    dragHooks: {},
    dropHooks: {}
  };
}
