import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import {type DragItem, type DropOperation} from './types';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

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
    'aria-grabbed': boolean,
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

  let dragItems = computed(() => {
    let items = unref(options.dragItems);
    return items.map((item) => ({
      id: String(item.id),
      type: String(item.type),
      value: item.value
    }));
  });

  let startDrag = () => {
    if (isDisabled.value || dragItems.value.length === 0) {
      return;
    }

    isDragging.value = true;
    options.onDragStart?.(dragItems.value);
  };

  let moveDrag = (point: {x: number, y: number}) => {
    if (!isDragging.value) {
      return;
    }

    options.onDragMove?.(point, dragItems.value);
  };

  let endDrag = (operation: DropOperation = 'cancel') => {
    if (!isDragging.value) {
      return;
    }

    isDragging.value = false;
    lastDropOperation.value = operation;
    options.onDragEnd?.(operation, dragItems.value);
  };

  let dragProps = computed(() => ({
    draggable: !isDisabled.value,
    'aria-grabbed': isDragging.value
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
