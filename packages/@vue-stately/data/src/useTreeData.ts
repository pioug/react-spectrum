import {computed, shallowRef, type Ref} from 'vue';
import {type Key} from './types';

export interface TreeOptions<T extends object> {
  /** Initial root items in the tree. */
  initialItems?: T[],
  /** The keys for the initially selected items. */
  initialSelectedKeys?: Iterable<Key>,
  /** A function that returns a unique key for an item object. */
  getKey?: (item: T) => Key,
  /** A function that returns the children for an item object. */
  getChildren?: (item: T) => T[] | null | undefined
}

export interface TreeNode<T extends object> {
  /** A unique key for the tree node. */
  key: Key,
  /** The key of the parent node. */
  parentKey?: Key | null,
  /** The value object for the tree node. */
  value: T,
  /** Children of the tree node. */
  children: TreeNode<T>[] | null
}

export interface TreeData<T extends object> {
  /** The root nodes in the tree. */
  items: Readonly<Ref<TreeNode<T>[]>>,

  /** The keys of the currently selected items in the tree. */
  selectedKeys: Ref<Set<Key>>,

  /** Sets the selected keys. */
  setSelectedKeys(keys: Iterable<Key>): void,

  /**
   * Gets a node from the tree by key.
   * @param key - The key of the item to retrieve.
   */
  getItem(key: Key): TreeNode<T> | undefined,

  /**
   * Inserts an item into a parent node as a child.
   * @param parentKey - The key of the parent item to insert into. `null` for the root.
   * @param index - The index within the parent to insert into.
   * @param values - The values to insert.
   */
  insert(parentKey: Key | null, index: number, ...values: T[]): void,

  /**
   * Inserts items into the list before the item at the given key.
   * @param key - The key of the item to insert before.
   * @param values - The values to insert.
   */
  insertBefore(key: Key, ...values: T[]): void,

  /**
   * Inserts items into the list after the item at the given key.
   * @param key - The key of the item to insert after.
   * @param values - The values to insert.
   */
  insertAfter(key: Key, ...values: T[]): void,

  /**
   * Appends items into a parent node as children.
   * @param parentKey - The key of the parent item to insert into. `null` for the root.
   * @param values - The values to insert.
   */
  append(parentKey: Key | null, ...values: T[]): void,

  /**
   * Prepends items into a parent node as children.
   * @param parentKey - The key of the parent item to insert into. `null` for the root.
   * @param values - The values to insert.
   */
  prepend(parentKey: Key | null, ...values: T[]): void,

  /**
   * Removes items from the tree by their keys.
   * @param keys - The keys of the items to remove.
   */
  remove(...keys: Key[]): void,

  /**
   * Removes all items from the tree that are currently
   * in the set of selected items.
   */
  removeSelectedItems(): void,

  /**
   * Moves an item within the tree.
   * @param key - The key of the item to move.
   * @param toParentKey - The key of the new parent to insert into. `null` for the root.
   * @param index - The index within the new parent to insert at.
   */
  move(key: Key, toParentKey: Key | null, index: number): void,

  /**
   * Moves one or more items before a given key.
   * @param key - The key of the item to move the items before.
   * @param keys - The keys of the items to move.
   */
  moveBefore(key: Key, keys: Iterable<Key>): void,

  /**
   * Moves one or more items after a given key.
   * @param key - The key of the item to move the items after.
   * @param keys - The keys of the items to move.
   */
  moveAfter(key: Key, keys: Iterable<Key>): void,

  /**
   * Updates an item in the tree.
   * @param key - The key of the item to update.
   * @param newValue - The new value for the item.
   */
  update(key: Key, newValue: T): void
}

interface TreeDataState<T extends object> {
  items: TreeNode<T>[],
  nodeMap: Map<Key, TreeNode<T>>
}

/**
 * Manages state for an immutable tree data structure, and provides convenience methods to
 * update the data over time.
 */
export function useTreeData<T extends object>(options: TreeOptions<T>): TreeData<T> {
  let {
    initialItems = [],
    initialSelectedKeys,
    getKey = (item: any) => item.id ?? item.key,
    getChildren = (item: any) => item.children
  } = options;

  function buildTree(items: T[] | null = [], map: Map<Key, TreeNode<T>>, parentKey?: Key | null): TreeDataState<T> {
    if (items == null) {
      items = [];
    }

    return {
      items: items.map((item) => {
        let node: TreeNode<T> = {
          key: getKey(item),
          parentKey: parentKey ?? null,
          value: item,
          children: null
        };

        node.children = buildTree(getChildren(item) ?? [], map, node.key).items;
        map.set(node.key, node);
        return node;
      }),
      nodeMap: map
    };
  }

  function addNode(node: TreeNode<T>, map: Map<Key, TreeNode<T>>): void {
    map.set(node.key, node);
    if (node.children) {
      for (let child of node.children) {
        addNode(child, map);
      }
    }
  }

  function deleteNode(node: TreeNode<T>, map: Map<Key, TreeNode<T>>): void {
    map.delete(node.key);
    if (node.children) {
      for (let child of node.children) {
        deleteNode(child, map);
      }
    }
  }

  function updateTree(
    items: TreeNode<T>[],
    key: Key | null,
    update: (node: TreeNode<T>) => TreeNode<T> | null,
    originalMap: Map<Key, TreeNode<T>>
  ): TreeDataState<T> {
    let node = key == null ? null : originalMap.get(key);
    if (node == null) {
      return {items, nodeMap: originalMap};
    }

    let map = new Map<Key, TreeNode<T>>(originalMap);

    let newNode = update(node);
    if (newNode == null) {
      deleteNode(node, map);
    } else {
      addNode(newNode, map);
    }

    while (node && node.parentKey != null) {
      let nextParent: TreeNode<T> = map.get(node.parentKey)!;
      let copy: TreeNode<T> = {
        key: nextParent.key,
        parentKey: nextParent.parentKey,
        value: nextParent.value,
        children: null
      };

      let children = nextParent.children;
      if (newNode == null && children) {
        children = children.filter((child: TreeNode<T>) => child !== node);
      }

      copy.children = children?.map((child: TreeNode<T>) => {
        if (child === node) {
          return newNode!;
        }

        return child;
      }) ?? null;

      map.set(copy.key, copy);
      newNode = copy;
      node = nextParent;
    }

    if (newNode == null) {
      items = items.filter((child) => child !== node);
    }

    return {
      items: items.map((item) => {
        if (item === node) {
          return newNode!;
        }

        return item;
      }),
      nodeMap: map
    };
  }

  let tree = shallowRef<TreeDataState<T>>(buildTree(initialItems, new Map<Key, TreeNode<T>>()));

  let selectedKeys = shallowRef(new Set<Key>(initialSelectedKeys ?? []));

  let setSelectedKeys = (keys: Iterable<Key>): void => {
    selectedKeys.value = new Set(keys);
  };

  let getItem = (key: Key): TreeNode<T> | undefined => {
    return tree.value.nodeMap.get(key);
  };

  let insert = (parentKey: Key | null, index: number, ...values: T[]): void => {
    let {items, nodeMap: originalMap} = tree.value;
    let {items: newNodes, nodeMap: newMap} = buildTree(values, originalMap, parentKey);

    if (parentKey == null) {
      tree.value = {
        items: [
          ...items.slice(0, index),
          ...newNodes,
          ...items.slice(index)
        ],
        nodeMap: newMap
      };
      return;
    }

    tree.value = updateTree(items, parentKey, (parentNode) => ({
      key: parentNode.key,
      parentKey: parentNode.parentKey,
      value: parentNode.value,
      children: [
        ...parentNode.children!.slice(0, index),
        ...newNodes,
        ...parentNode.children!.slice(index)
      ]
    }), newMap);
  };

  let insertBefore = (key: Key, ...values: T[]): void => {
    let node = tree.value.nodeMap.get(key);
    if (!node) {
      return;
    }

    let parentNode = node.parentKey == null ? undefined : tree.value.nodeMap.get(node.parentKey);
    let nodes = parentNode ? parentNode.children : tree.value.items;
    let index = nodes?.indexOf(node) ?? -1;

    if (index === -1) {
      return;
    }

    insert(parentNode?.key ?? null, index, ...values);
  };

  let insertAfter = (key: Key, ...values: T[]): void => {
    let node = tree.value.nodeMap.get(key);
    if (!node) {
      return;
    }

    let parentNode = node.parentKey == null ? undefined : tree.value.nodeMap.get(node.parentKey);
    let nodes = parentNode ? parentNode.children : tree.value.items;
    let index = nodes?.indexOf(node) ?? -1;

    if (index === -1) {
      return;
    }

    insert(parentNode?.key ?? null, index + 1, ...values);
  };

  let prepend = (parentKey: Key | null, ...values: T[]): void => {
    insert(parentKey, 0, ...values);
  };

  let append = (parentKey: Key | null, ...values: T[]): void => {
    if (parentKey == null) {
      insert(null, tree.value.items.length, ...values);
      return;
    }

    let parentNode = tree.value.nodeMap.get(parentKey);
    if (!parentNode) {
      return;
    }

    insert(parentKey, parentNode.children?.length ?? 0, ...values);
  };

  let remove = (...keys: Key[]): void => {
    if (keys.length === 0) {
      return;
    }

    let newItems = tree.value.items;
    let prevMap = tree.value.nodeMap;
    let newTree: TreeDataState<T> | undefined;

    for (let key of keys) {
      newTree = updateTree(newItems, key, () => null, prevMap);
      prevMap = newTree.nodeMap;
      newItems = newTree.items;
    }

    if (!newTree) {
      return;
    }

    tree.value = newTree;

    let selection = new Set(selectedKeys.value);
    for (let key of selection) {
      if (!newTree.nodeMap.has(key)) {
        selection.delete(key);
      }
    }

    selectedKeys.value = selection;
  };

  let removeSelectedItems = (): void => {
    remove(...selectedKeys.value);
  };

  let move = (key: Key, toParentKey: Key | null, index: number): void => {
    let {items, nodeMap: originalMap} = tree.value;
    let node = originalMap.get(key);
    if (!node) {
      return;
    }

    let {items: newItems, nodeMap: newMap} = updateTree(items, key, () => null, originalMap);
    let movedNode = {
      ...node,
      parentKey: toParentKey
    };

    if (toParentKey == null) {
      addNode(movedNode, newMap);
      tree.value = {
        items: [
          ...newItems.slice(0, index),
          movedNode,
          ...newItems.slice(index)
        ],
        nodeMap: newMap
      };
      return;
    }

    tree.value = updateTree(newItems, toParentKey, (parentNode) => ({
      key: parentNode.key,
      parentKey: parentNode.parentKey,
      value: parentNode.value,
      children: [
        ...parentNode.children!.slice(0, index),
        movedNode,
        ...parentNode.children!.slice(index)
      ]
    }), newMap);
  };

  let moveBefore = (key: Key, keys: Iterable<Key>): void => {
    let {items, nodeMap} = tree.value;
    let node = nodeMap.get(key);
    if (!node) {
      return;
    }

    let toParent = node.parentKey == null ? null : nodeMap.get(node.parentKey) ?? null;
    let toIndex = toParent?.children ? toParent.children.indexOf(node) : items.indexOf(node);

    tree.value = moveItems(tree.value, keys, toParent, toIndex, updateTree, addNode);
  };

  let moveAfter = (key: Key, keys: Iterable<Key>): void => {
    let {items, nodeMap} = tree.value;
    let node = nodeMap.get(key);
    if (!node) {
      return;
    }

    let toParent = node.parentKey == null ? null : nodeMap.get(node.parentKey) ?? null;
    let toIndex = toParent?.children ? toParent.children.indexOf(node) : items.indexOf(node);

    tree.value = moveItems(tree.value, keys, toParent, toIndex + 1, updateTree, addNode);
  };

  let update = (oldKey: Key, newValue: T): void => {
    let {items, nodeMap: originalMap} = tree.value;
    tree.value = updateTree(items, oldKey, (oldNode) => {
      let node: TreeNode<T> = {
        key: oldNode.key,
        parentKey: oldNode.parentKey,
        value: newValue,
        children: null
      };

      let nextTree = buildTree(getChildren(newValue) ?? [], originalMap, node.key);
      node.children = nextTree.items;
      return node;
    }, originalMap);
  };

  return {
    items: computed(() => tree.value.items),
    selectedKeys,
    setSelectedKeys,
    getItem,
    insert,
    insertBefore,
    insertAfter,
    append,
    prepend,
    remove,
    removeSelectedItems,
    move,
    moveBefore,
    moveAfter,
    update
  };
}

function moveItems<T extends object>(
  state: TreeDataState<T>,
  keys: Iterable<Key>,
  toParent: TreeNode<T> | null,
  toIndex: number,
  updateTree: (
    items: TreeNode<T>[],
    key: Key | null,
    update: (node: TreeNode<T>) => TreeNode<T> | null,
    originalMap: Map<Key, TreeNode<T>>
  ) => TreeDataState<T>,
  addNode: (node: TreeNode<T>, map: Map<Key, TreeNode<T>>) => void
): TreeDataState<T> {
  let {items, nodeMap} = state;

  let parent = toParent;
  let removeKeys = new Set(keys);
  while (parent?.parentKey != null) {
    if (removeKeys.has(parent.key)) {
      throw new Error('Cannot move an item to be a child of itself.');
    }

    parent = nodeMap.get(parent.parentKey) ?? null;
  }

  let originalToIndex = toIndex;
  let keyArray = Array.isArray(keys) ? keys : [...keys];

  let inOrderKeys = new Map<Key, number>();
  let removedItems: Array<TreeNode<T>> = [];
  let newItems = items;
  let newMap = nodeMap;
  let i = 0;

  let traversal = (
    node: {children: TreeNode<T>[] | null},
    handlers: {
      inorder?: (node: TreeNode<T>) => void,
      postorder?: (node: TreeNode<T>) => void
    }
  ): void => {
    if (node.children == null) {
      return;
    }

    for (let child of node.children) {
      handlers.inorder?.(child);
      traversal(child, handlers);
      handlers.postorder?.(child);
    }
  };

  let inorder = (child: TreeNode<T>): void => {
    if (keyArray.includes(child.key)) {
      inOrderKeys.set(child.key, i++);
    }
  };

  let postorder = (child: TreeNode<T>): void => {
    if (keyArray.includes(child.key)) {
      removedItems.push({...newMap.get(child.key)!, parentKey: toParent?.key ?? null});
      let {items: nextItems, nodeMap: nextMap} = updateTree(newItems, child.key, () => null, newMap);
      newItems = nextItems;
      newMap = nextMap;
    }

    let toParentKey = toParent?.key ?? null;
    let siblingIndex = -1;
    if (child.parentKey === toParentKey) {
      if (toParent?.children) {
        siblingIndex = toParent.children.indexOf(child);
      } else {
        siblingIndex = items.indexOf(child);
      }
    }

    if (keyArray.includes(child.key) && siblingIndex !== -1 && siblingIndex < originalToIndex) {
      toIndex--;
    }
  };

  traversal({children: items}, {inorder, postorder});

  let inOrderItems = removedItems.sort((a, b) => {
    return inOrderKeys.get(a.key)! > inOrderKeys.get(b.key)! ? 1 : -1;
  });

  if (toParent == null || toParent.key == null) {
    inOrderItems.forEach((movedNode) => {
      addNode(movedNode, newMap);
    });

    return {
      items: [
        ...newItems.slice(0, toIndex),
        ...inOrderItems,
        ...newItems.slice(toIndex)
      ],
      nodeMap: newMap
    };
  }

  return updateTree(newItems, toParent.key, (parentNode) => ({
    key: parentNode.key,
    parentKey: parentNode.parentKey,
    value: parentNode.value,
    children: [
      ...parentNode.children!.slice(0, toIndex),
      ...inOrderItems,
      ...parentNode.children!.slice(toIndex)
    ]
  }), newMap);
}
