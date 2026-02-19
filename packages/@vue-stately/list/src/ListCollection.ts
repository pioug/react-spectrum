export type Key = string | number;

export interface ListNode<T> {
  childNodes?: Iterable<ListNode<T>>,
  hasChildNodes?: boolean,
  index?: number,
  key: Key,
  level?: number,
  nextKey?: Key | null,
  parentKey?: Key | null,
  prevKey?: Key | null,
  props?: Record<string, unknown>,
  rendered?: unknown,
  textValue?: string,
  type: string,
  value?: T | null
}

function getChildNodes<T>(node: ListNode<T>): ListNode<T>[] {
  if (!('childNodes' in node)) {
    return [];
  }

  try {
    return node.childNodes ? Array.from(node.childNodes) : [];
  } catch {
    return [];
  }
}

function cloneNode<T>(node: ListNode<T>, parentKey?: Key | null): ListNode<T> {
  return {
    key: node.key,
    type: node.type,
    value: node.value ?? null,
    textValue: node.textValue ?? '',
    index: node.index ?? 0,
    level: node.level ?? 0,
    parentKey: parentKey ?? node.parentKey ?? null,
    prevKey: node.prevKey ?? null,
    nextKey: node.nextKey ?? null,
    props: node.props ?? {},
    rendered: node.rendered,
    hasChildNodes: Boolean(node.hasChildNodes)
  };
}

function cloneForFilter<T>(node: ListNode<T>): ListNode<T> {
  return {
    ...cloneNode(node),
    parentKey: node.parentKey ?? null,
    prevKey: null,
    nextKey: null,
    hasChildNodes: false
  };
}

function shouldCountForSize(node: ListNode<unknown>): boolean {
  return node.type === 'item' || node.type === 'section';
}

/**
 * Collection implementation for list and section nodes with key traversal helpers.
 */
export class ListCollection<T> implements Iterable<ListNode<T>> {
  private keyMap: Map<Key, ListNode<T>> = new Map();
  private rootKeys: Key[] = [];
  private childrenMap: Map<Key, Key[]> = new Map();
  private firstKey: Key | null = null;
  private lastKey: Key | null = null;
  private _size: number = 0;

  constructor(nodes: Iterable<ListNode<T>>) {
    let visit = (sourceNode: ListNode<T>, parentKey?: Key | null): void => {
      if (this.keyMap.has(sourceNode.key)) {
        return;
      }

      let nextNode = cloneNode(sourceNode, parentKey);
      this.keyMap.set(nextNode.key, nextNode);

      if (nextNode.parentKey == null) {
        this.rootKeys.push(nextNode.key);
      } else {
        let childKeys = this.childrenMap.get(nextNode.parentKey) ?? [];
        childKeys.push(nextNode.key);
        this.childrenMap.set(nextNode.parentKey, childKeys);
      }

      for (let child of getChildNodes(sourceNode)) {
        visit(child, nextNode.key);
      }
    };

    for (let node of nodes) {
      visit(node, node.parentKey ?? null);
    }

    if (this.rootKeys.length === 0) {
      this.rootKeys = Array.from(this.keyMap.keys());
    }

    let previousNode: ListNode<T> | null = null;
    let itemIndex = 0;
    let size = 0;

    for (let [key, node] of this.keyMap) {
      if (previousNode == null) {
        this.firstKey = key;
      } else {
        previousNode.nextKey = key;
      }

      node.prevKey = previousNode?.key ?? null;
      node.nextKey = null;

      if (node.type === 'item') {
        node.index = itemIndex;
        itemIndex += 1;
      }

      if (shouldCountForSize(node)) {
        size += 1;
      }

      let children = this.childrenMap.get(key) ?? [];
      node.hasChildNodes = children.length > 0;
      node.childNodes = children.map((childKey) => this.keyMap.get(childKey)).filter((child): child is ListNode<T> => child != null);

      previousNode = node;
    }

    this._size = size;
    this.lastKey = previousNode?.key ?? null;
  }

  *[Symbol.iterator](): IterableIterator<ListNode<T>> {
    for (let key of this.rootKeys) {
      let node = this.keyMap.get(key);
      if (node) {
        yield node;
      }
    }
  }

  get size(): number {
    return this._size;
  }

  getKeys(): IterableIterator<Key> {
    return this.keyMap.keys();
  }

  getKeyBefore(key: Key): Key | null {
    return this.keyMap.get(key)?.prevKey ?? null;
  }

  getKeyAfter(key: Key): Key | null {
    return this.keyMap.get(key)?.nextKey ?? null;
  }

  getFirstKey(): Key | null {
    return this.firstKey;
  }

  getLastKey(): Key | null {
    return this.lastKey;
  }

  getItem(key: Key): ListNode<T> | null {
    return this.keyMap.get(key) ?? null;
  }

  at(index: number): ListNode<T> | null {
    let keys = Array.from(this.getKeys());
    return this.getItem(keys[index]);
  }

  getChildren(key: Key): Iterable<ListNode<T>> {
    let children = this.childrenMap.get(key) ?? [];
    return children.map((childKey) => this.keyMap.get(childKey)).filter((child): child is ListNode<T> => child != null);
  }

  filter(filterFn: (textValue: string, node: ListNode<T>) => boolean): ListCollection<T> {
    let includedKeys = new Set<Key>();

    for (let node of this.keyMap.values()) {
      let includeNode = filterFn(node.textValue ?? '', node);
      if (!includeNode && node.type !== 'item') {
        continue;
      }

      if (includeNode) {
        includedKeys.add(node.key);
        let parentKey = node.parentKey;
        while (parentKey != null) {
          includedKeys.add(parentKey);
          parentKey = this.keyMap.get(parentKey)?.parentKey ?? null;
        }
      }
    }

    if (includedKeys.size === 0) {
      return new ListCollection<T>([]);
    }

    let filteredNodes = Array.from(this.keyMap.values())
      .filter((node) => includedKeys.has(node.key))
      .map((node) => cloneForFilter(node));

    return new ListCollection(filteredNodes);
  }
}
