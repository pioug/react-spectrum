import {
  useDraggableCollectionState as useDraggableCollectionStateInternal,
  type CollectionNode,
  type DraggableCollectionState as VueDraggableCollectionState,
  type DraggableCollectionStateOptions as VueDraggableCollectionStateOptions,
  type Key as DraggableKey
} from './useDraggableCollectionState';
import {useDroppableCollectionState} from './useDroppableCollectionState';
import type {
  DropOperationEvent,
  DropTarget,
  DroppableCollectionState,
  DroppableCollectionStateOptions,
  Key as DroppableKey
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
