import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import {markActiveDragSessionHandled} from './dragSession';
import {DIRECTORY_DRAG_TYPE, type DragItem, type DropOperation} from './types';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;
type AnyRecord = Record<string, unknown>;

export interface AriaDropOptions {
  acceptedDragTypes?: MaybeRef<Iterable<string>>,
  getDropOperation?: (items: DragItem[]) => DropOperation,
  isDisabled?: MaybeRef<boolean>,
  onDrop?: (items: DragItem[], operation: DropOperation) => void,
  onDropEnter?: (items: DragItem[]) => void,
  onDropExit?: () => void,
  onDropMove?: (items: DragItem[]) => void
}

export interface DropAria {
  canDrop: (items: DragItem[]) => boolean,
  drop: (items: DragItem[], operation?: DropOperation) => DropOperation,
  dropProps: ComputedRef<{
    'aria-disabled'?: true,
    'data-drop-target': boolean,
    role: 'group'
  }>,
  enter: (items: DragItem[]) => boolean,
  exit: () => void,
  isDropTarget: Ref<boolean>,
  lastDropItems: Ref<DragItem[]>,
  lastDropOperation: Ref<DropOperation | null>,
  move: (items: DragItem[]) => void
}

function toTypeSet(value: MaybeRef<Iterable<string>> | undefined): Set<string> {
  let resolved = value === undefined ? undefined : unref(value);
  if (!resolved) {
    return new Set();
  }

  return new Set(Array.from(resolved, (type) => String(type)));
}

function getAcceptedItemTypes(item: DragItem): Set<string> {
  let itemRecord = item as unknown as AnyRecord;
  let acceptedTypes = new Set<string>();

  if (typeof item.type === 'string') {
    acceptedTypes.add(item.type);
  }

  if (itemRecord.kind === 'directory') {
    acceptedTypes.add(DIRECTORY_DRAG_TYPE);
  }

  let types = itemRecord.types;
  if (types instanceof Set) {
    for (let type of types) {
      acceptedTypes.add(String(type));
    }
  } else if (Array.isArray(types)) {
    for (let type of types) {
      acceptedTypes.add(String(type));
    }
  }

  return acceptedTypes;
}

export function useDrop(options: AriaDropOptions = {}): DropAria {
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let acceptedDragTypes = computed(() => toTypeSet(options.acceptedDragTypes));

  let isDropTarget = ref(false);
  let lastDropItems = ref<DragItem[]>([]);
  let lastDropOperation = ref<DropOperation | null>(null);

  let canDrop = (items: DragItem[]) => {
    if (isDisabled.value || items.length === 0) {
      return false;
    }

    if (acceptedDragTypes.value.size === 0) {
      return true;
    }

    return items.some((item) => {
      let itemTypes = getAcceptedItemTypes(item);
      for (let type of itemTypes) {
        if (acceptedDragTypes.value.has(type)) {
          return true;
        }
      }

      return false;
    });
  };

  let enter = (items: DragItem[]) => {
    if (!canDrop(items)) {
      isDropTarget.value = false;
      return false;
    }

    if (isDropTarget.value) {
      return true;
    }

    isDropTarget.value = true;
    options.onDropEnter?.(items);
    return true;
  };

  let move = (items: DragItem[]) => {
    if (!isDropTarget.value) {
      return;
    }

    options.onDropMove?.(items);
  };

  let exit = () => {
    if (!isDropTarget.value) {
      return;
    }

    isDropTarget.value = false;
    options.onDropExit?.();
  };

  let drop = (items: DragItem[], operation?: DropOperation) => {
    if (!canDrop(items)) {
      isDropTarget.value = false;
      lastDropOperation.value = 'cancel';
      return 'cancel';
    }

    markActiveDragSessionHandled();
    let resolvedOperation = operation ?? options.getDropOperation?.(items) ?? 'copy';
    lastDropItems.value = items;
    lastDropOperation.value = resolvedOperation;
    isDropTarget.value = false;
    options.onDrop?.(items, resolvedOperation);
    return resolvedOperation;
  };

  let dropProps = computed(() => ({
    role: 'group' as const,
    'data-drop-target': isDropTarget.value,
    'aria-disabled': isDisabled.value ? true as const : undefined
  }));

  return {
    canDrop,
    drop,
    dropProps,
    enter,
    exit,
    isDropTarget,
    lastDropItems,
    lastDropOperation,
    move
  };
}
