export type Key = string | number;

export interface TreeNode<T> {
  childNodes?: Iterable<TreeNode<T>>,
  index?: number,
  key: Key,
  nextKey?: Key,
  parentKey?: Key | null,
  prevKey?: Key,
  textValue?: string,
  type?: string,
  value?: T
}

/**
 * Represents a flattened tree collection based on an expanded-keys set.
 */
export class TreeCollection<T> {
  private keyMap: Map<Key, TreeNode<T>> = new Map();
  private iterable: TreeNode<T>[];
  private firstKey: Key | null = null;
  private lastKey: Key | null = null;

  constructor(nodes: Iterable<TreeNode<T>>, {expandedKeys}: {expandedKeys?: Set<Key>} = {}) {
    this.iterable = Array.from(nodes, (node) => this.cloneNode(node));
    let visibleNodes: TreeNode<T>[] = [];
    let expanded = expandedKeys ?? new Set<Key>();

    let visit = (node: TreeNode<T>): void => {
      this.keyMap.set(node.key, node);
      visibleNodes.push(node);

      if (node.childNodes && (node.type === 'section' || expanded.has(node.key))) {
        for (let childNode of node.childNodes) {
          visit(childNode);
        }
      }
    };

    for (let node of this.iterable) {
      visit(node);
    }

    let previousNode: TreeNode<T> | null = null;
    let itemIndex = 0;
    for (let node of visibleNodes) {
      if (previousNode) {
        previousNode.nextKey = node.key;
        node.prevKey = previousNode.key;
      } else {
        this.firstKey = node.key;
        node.prevKey = undefined;
      }

      if (!node.type || node.type === 'item') {
        node.index = itemIndex;
        itemIndex += 1;
      }

      node.nextKey = undefined;
      previousNode = node;
    }

    this.lastKey = previousNode?.key ?? null;
  }

  private cloneNode(node: TreeNode<T>, parentKey: Key | null = null): TreeNode<T> {
    let clonedChildren = node.childNodes
      ? Array.from(node.childNodes, (childNode) => this.cloneNode(childNode, node.key))
      : undefined;

    return {
      ...node,
      childNodes: clonedChildren,
      parentKey: node.parentKey ?? parentKey
    };
  }

  *[Symbol.iterator](): IterableIterator<TreeNode<T>> {
    yield* this.iterable;
  }

  get size(): number {
    return this.keyMap.size;
  }

  getKeys(): IterableIterator<Key> {
    return this.keyMap.keys();
  }

  getKeyBefore(key: Key): Key | null {
    let node = this.keyMap.get(key);
    return node ? node.prevKey ?? null : null;
  }

  getKeyAfter(key: Key): Key | null {
    let node = this.keyMap.get(key);
    return node ? node.nextKey ?? null : null;
  }

  getFirstKey(): Key | null {
    return this.firstKey;
  }

  getLastKey(): Key | null {
    return this.lastKey;
  }

  getItem(key: Key): TreeNode<T> | null {
    return this.keyMap.get(key) ?? null;
  }

  at(index: number): TreeNode<T> | null {
    let keys = Array.from(this.keyMap.keys());
    let keyAtIndex = keys[index];
    if (keyAtIndex == null) {
      return null;
    }

    return this.getItem(keyAtIndex);
  }
}
