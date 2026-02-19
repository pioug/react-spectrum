import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import {type DragItem, type DropOperation, useDrag} from '@vue-aria/dnd';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export type Key = string | number;

export interface CollectionNode<T = unknown> {
  key: Key,
  parentKey?: Key | null,
  value: T
}

export interface DraggableCollectionStateOptions<T = unknown> {
  collection: MaybeRef<CollectionNode<T>[]>,
  getItems?: (keys: Set<Key>, items: T[]) => DragItem[],
  isDisabled?: MaybeRef<boolean>,
  onDragEnd?: (event: {isInternal: boolean, items: DragItem[], keys: Set<Key>, operation: DropOperation}) => void,
  onDragMove?: (event: {items: DragItem[], keys: Set<Key>, point: {x: number, y: number}}) => void,
  onDragStart?: (event: {items: DragItem[], keys: Set<Key>}) => void,
  selectedKeys?: Ref<Set<Key>>
}

export interface DraggableCollectionState<T = unknown> {
  collection: ComputedRef<CollectionNode<T>[]>,
  draggedKey: Ref<Key | null>,
  draggingKeys: Ref<Set<Key>>,
  isDisabled: ComputedRef<boolean>,
  isDragging: (key: Key) => boolean,
  selectedKeys: Ref<Set<Key>>,
  endDrag: (operation?: DropOperation) => void,
  getItems: (key: Key) => DragItem[],
  getKeysForDrag: (key: Key) => Set<Key>,
  moveDrag: (point: {x: number, y: number}) => void,
  startDrag: (key: Key) => void
}

function hasSelectedAncestor(node: CollectionNode, selectedKeys: Set<Key>, nodeMap: Map<Key, CollectionNode>): boolean {
  let parentKey = node.parentKey ?? null;
  while (parentKey != null) {
    if (selectedKeys.has(parentKey)) {
      return true;
    }

    let parentNode = nodeMap.get(parentKey);
    parentKey = parentNode?.parentKey ?? null;
  }

  return false;
}

/**
 * Manages state for a draggable collection.
 */
export function useDraggableCollectionState<T = unknown>(options: DraggableCollectionStateOptions<T>): DraggableCollectionState<T> {
  let collection = computed(() => unref(options.collection));
  let selectedKeys = options.selectedKeys ?? ref(new Set<Key>());
  let draggedKey = ref<Key | null>(null);
  let draggingKeys = ref(new Set<Key>());
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let activeDragItems = ref<DragItem[]>([]);

  let nodeMap = computed(() => {
    let map = new Map<Key, CollectionNode<T>>();
    for (let node of collection.value) {
      map.set(node.key, node);
    }

    return map;
  });

  let getKeysForDrag = (key: Key): Set<Key> => {
    if (!selectedKeys.value.has(key)) {
      return new Set([key]);
    }

    let keys = new Set<Key>();
    for (let selectedKey of selectedKeys.value) {
      let node = nodeMap.value.get(selectedKey);
      if (!node) {
        continue;
      }

      if (!hasSelectedAncestor(node, selectedKeys.value, nodeMap.value)) {
        keys.add(selectedKey);
      }
    }

    return keys;
  };

  let buildItems = (keys: Set<Key>): DragItem[] => {
    let nodes = Array.from(keys)
      .map((key) => nodeMap.value.get(key))
      .filter((node): node is CollectionNode<T> => Boolean(node));

    let values = nodes.map((node) => node.value);
    if (options.getItems) {
      return options.getItems(keys, values);
    }

    return nodes.map((node) => ({
      id: String(node.key),
      type: 'item',
      value: node.value
    }));
  };

  let drag = useDrag({
    dragItems: activeDragItems,
    isDisabled,
    onDragEnd: (operation, items) => {
      options.onDragEnd?.({
        operation,
        items,
        keys: new Set(draggingKeys.value),
        isInternal: true
      });
    },
    onDragMove: (point, items) => {
      options.onDragMove?.({
        point,
        items,
        keys: new Set(draggingKeys.value)
      });
    },
    onDragStart: (items) => {
      options.onDragStart?.({
        items,
        keys: new Set(draggingKeys.value)
      });
    }
  });

  let startDrag = (key: Key): void => {
    let keys = getKeysForDrag(key);
    draggingKeys.value = keys;
    draggedKey.value = key;
    activeDragItems.value = buildItems(keys);
    drag.startDrag();
  };

  let endDrag = (operation: DropOperation = 'cancel'): void => {
    drag.endDrag(operation);
    draggingKeys.value = new Set();
    draggedKey.value = null;
    activeDragItems.value = [];
  };

  return {
    collection,
    selectedKeys,
    draggedKey,
    draggingKeys,
    isDisabled,
    isDragging: (key: Key) => draggingKeys.value.has(key),
    getKeysForDrag,
    getItems: (key: Key) => buildItems(getKeysForDrag(key)),
    startDrag,
    moveDrag: drag.moveDrag,
    endDrag
  };
}
