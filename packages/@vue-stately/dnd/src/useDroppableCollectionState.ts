import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import {type DragItem, type DropOperation, useDrop} from '@vue-aria/dnd';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export type Key = string | number;

export type DropTarget =
  | {type: 'root'}
  | {dropPosition: 'after' | 'before' | 'on', key: Key, type: 'item'};

export interface DropOperationEvent {
  allowedOperations: DropOperation[],
  draggingKeys: Set<Key>,
  isInternal: boolean,
  items: DragItem[],
  target: DropTarget | null
}

export interface DroppableCollectionStateOptions {
  acceptedDragTypes?: MaybeRef<Iterable<string>>,
  getDropOperation?: (event: DropOperationEvent) => DropOperation,
  isDisabled?: MaybeRef<boolean>,
  onDrop?: (event: {items: DragItem[], operation: DropOperation, target: DropTarget | null}) => void,
  onDropEnter?: (event: {items: DragItem[], target: DropTarget | null}) => void,
  onDropExit?: (event: {target: DropTarget | null}) => void,
  onDropMove?: (event: {items: DragItem[], target: DropTarget | null}) => void
}

export interface DroppableCollectionState {
  isDisabled: ComputedRef<boolean>,
  target: Ref<DropTarget | null>,
  drop: (items: DragItem[], operation?: DropOperation) => DropOperation,
  enter: (items: DragItem[]) => boolean,
  exit: () => void,
  getDropOperation: (event: DropOperationEvent) => DropOperation,
  isDropTarget: (target: DropTarget | null) => boolean,
  move: (items: DragItem[]) => void,
  setTarget: (target: DropTarget | null) => void
}

function isEqualDropTarget(a: DropTarget | null, b: DropTarget | null): boolean {
  if (a == null || b == null) {
    return a == null && b == null;
  }

  if (a.type !== b.type) {
    return false;
  }

  if (a.type === 'root') {
    return true;
  }

  if (b.type === 'root') {
    return false;
  }

  return a.key === b.key && a.dropPosition === b.dropPosition;
}

/**
 * Manages state for a droppable collection.
 */
export function useDroppableCollectionState(options: DroppableCollectionStateOptions = {}): DroppableCollectionState {
  let target = ref<DropTarget | null>(null);
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));

  let getDropOperation = (event: DropOperationEvent): DropOperation => {
    if (isDisabled.value || event.target == null) {
      return 'cancel';
    }

    if (options.getDropOperation) {
      return options.getDropOperation(event);
    }

    return event.allowedOperations[0] ?? 'copy';
  };

  let drop = useDrop({
    acceptedDragTypes: options.acceptedDragTypes,
    isDisabled: options.isDisabled,
    getDropOperation: (items) => {
      return getDropOperation({
        items,
        target: target.value,
        allowedOperations: ['copy', 'move', 'link'],
        draggingKeys: new Set(),
        isInternal: false
      });
    },
    onDrop: (items, operation) => {
      options.onDrop?.({
        items,
        operation,
        target: target.value
      });
    },
    onDropEnter: (items) => {
      options.onDropEnter?.({
        items,
        target: target.value
      });
    },
    onDropExit: () => {
      options.onDropExit?.({
        target: target.value
      });
    },
    onDropMove: (items) => {
      options.onDropMove?.({
        items,
        target: target.value
      });
    }
  });

  let setTarget = (nextTarget: DropTarget | null): void => {
    if (isEqualDropTarget(target.value, nextTarget)) {
      return;
    }

    target.value = nextTarget;
  };

  return {
    isDisabled,
    target,
    setTarget,
    isDropTarget: (nextTarget: DropTarget | null) => isEqualDropTarget(target.value, nextTarget),
    getDropOperation,
    enter: drop.enter,
    move: drop.move,
    exit: drop.exit,
    drop: drop.drop
  };
}
