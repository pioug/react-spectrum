import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import {beginDragSession, endDragSession, isDragSessionHandled} from './dragSession';
import {type DragItem, type DropOperation} from './types';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;
type AnyRecord = Record<string, unknown>;
const DRAG_TARGET_WARNING = 'Drags initiated from the React Aria useDrag hook may only be dropped on a target created with useDrop. This ensures that a keyboard and screen reader accessible alternative is available.';

export interface AriaDragOptions {
  dragItems: MaybeRef<DragItem[]>,
  isDisabled?: MaybeRef<boolean>,
  onDragEnd?: (operation: DropOperation, items: DragItem[]) => void,
  onDragMove?: (point: {x: number, y: number}, items: DragItem[]) => void,
  onDragStart?: (items: DragItem[]) => void
}

export interface DragAria {
  dragItems: ComputedRef<DragItem[]>,
  dragProps: ComputedRef<{
    draggable: boolean
  }>,
  endDrag: (operation?: DropOperation) => void,
  isDragging: Ref<boolean>,
  lastDropOperation: Ref<DropOperation | null>,
  moveDrag: (point: {x: number, y: number}) => void,
  startDrag: () => void
}

export function useDrag(options: AriaDragOptions): DragAria {
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isDragging = ref(false);
  let lastDropOperation = ref<DropOperation | null>(null);
  let activeSessionId = ref<number | null>(null);
  let lastDragPoint = ref<{x: number, y: number} | null>(null);

  let dragItems = computed(() => {
    let items = unref(options.dragItems);
    return items.map((item) => {
      let dragItem: DragItem & AnyRecord = {
        id: String(item.id),
        type: String(item.type),
        value: item.value
      };
      let itemRecord = item as unknown as AnyRecord;
      if (typeof itemRecord.kind === 'string') {
        dragItem.kind = itemRecord.kind;
      }

      if (itemRecord.types instanceof Set || Array.isArray(itemRecord.types)) {
        dragItem.types = itemRecord.types;
      }

      return dragItem;
    });
  });

  let startDrag = () => {
    if (isDragging.value || isDisabled.value || dragItems.value.length === 0) {
      return;
    }

    isDragging.value = true;
    lastDragPoint.value = null;
    activeSessionId.value = beginDragSession(dragItems.value);
    options.onDragStart?.(dragItems.value);
  };

  let moveDrag = (point: {x: number, y: number}) => {
    if (!isDragging.value) {
      return;
    }

    if (lastDragPoint.value && lastDragPoint.value.x === point.x && lastDragPoint.value.y === point.y) {
      return;
    }

    lastDragPoint.value = point;
    options.onDragMove?.(point, dragItems.value);
  };

  let endDrag = (operation: DropOperation = 'cancel') => {
    if (!isDragging.value) {
      return;
    }

    let isDropHandledByUseDrop = activeSessionId.value != null && isDragSessionHandled(activeSessionId.value);
    if (operation !== 'cancel' && !isDropHandledByUseDrop && process.env.NODE_ENV !== 'production') {
      console.warn(DRAG_TARGET_WARNING);
    }

    if (activeSessionId.value != null) {
      endDragSession(activeSessionId.value);
    }

    isDragging.value = false;
    lastDragPoint.value = null;
    lastDropOperation.value = operation;
    activeSessionId.value = null;
    options.onDragEnd?.(operation, dragItems.value);
  };

  let dragProps = computed(() => ({
    draggable: !isDisabled.value
  }));

  return {
    dragItems,
    dragProps,
    endDrag,
    isDragging,
    lastDropOperation,
    moveDrag,
    startDrag
  };
}
