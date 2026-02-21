import {
  type CollectionNode,
  type Key as DraggableKey,
  useDraggableCollectionState as useDraggableCollectionStateInternal,
  type DraggableCollectionState as VueDraggableCollectionState,
  type DraggableCollectionStateOptions as VueDraggableCollectionStateOptions
} from './useDraggableCollectionState';
import {
  type DropOperationEvent,
  type DroppableCollectionState,
  type DroppableCollectionStateOptions,
  type Key as DroppableKey,
  type DropTarget,
  useDroppableCollectionState
} from './useDroppableCollectionState';

export type DraggableCollectionStateOptions<T = object> = VueDraggableCollectionStateOptions<T>;
export type DraggableCollectionState = VueDraggableCollectionState;
export type {
  CollectionNode,
  DraggableKey,
  DropOperationEvent,
  DropTarget,
  DroppableCollectionState,
  DroppableCollectionStateOptions,
  DroppableKey
};
export {useDroppableCollectionState};

export function useDraggableCollectionState<T = object>(props: DraggableCollectionStateOptions<T>): DraggableCollectionState;
export function useDraggableCollectionState<T = object>(options: VueDraggableCollectionStateOptions<T>): VueDraggableCollectionState {
  return useDraggableCollectionStateInternal(options) as VueDraggableCollectionState;
}
