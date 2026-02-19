export type Key = string;
export type FilterFn<T> = (textValue: string, node: CollectionNode<T>) => boolean;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
};

export class CollectionNode<T> {
  static type: string = 'node';
  readonly type: string;
  readonly key: Key;
  readonly value: T | null = null;
  readonly level: number = 0;
  readonly hasChildNodes: boolean = false;
  readonly rendered: unknown = null;
  readonly textValue: string = '';
  readonly ariaLabel: string | undefined = undefined;
  readonly index: number = 0;
  readonly parentKey: Key | null = null;
  readonly prevKey: Key | null = null;
  readonly nextKey: Key | null = null;
  readonly firstChildKey: Key | null = null;
  readonly lastChildKey: Key | null = null;
  readonly props: Record<string, unknown> = {};

  constructor(key: Key) {
    this.type = (this.constructor as typeof CollectionNode).type;
    this.key = key;
  }

  get childNodes(): Iterable<CollectionNode<T>> {
    throw new Error('childNodes is not supported');
  }

  clone(): this {
    let NodeClass = this.constructor as new (key: Key) => this;
    let node = new NodeClass(this.key) as Mutable<this>;
    node.value = this.value;
    node.level = this.level;
    node.hasChildNodes = this.hasChildNodes;
    node.rendered = this.rendered;
    node.textValue = this.textValue;
    node.ariaLabel = this.ariaLabel;
    node.index = this.index;
    node.parentKey = this.parentKey;
    node.prevKey = this.prevKey;
    node.nextKey = this.nextKey;
    node.firstChildKey = this.firstChildKey;
    node.lastChildKey = this.lastChildKey;
    node.props = this.props;
    return node;
  }

  filter(collection: BaseCollection<T>, newCollection: BaseCollection<T>, filterFn: FilterFn<T>): CollectionNode<T> | null {
    void filterFn;
    let clone = this.clone();
    newCollection.addDescendants(clone, collection);
    return clone;
  }
}

export class FilterableNode<T> extends CollectionNode<T> {
  filter(collection: BaseCollection<T>, newCollection: BaseCollection<T>, filterFn: FilterFn<T>): CollectionNode<T> | null {
    let [firstKey, lastKey] = filterChildren(collection, newCollection, this.firstChildKey, filterFn);
    let clone: Mutable<CollectionNode<T>> = this.clone();
    clone.firstChildKey = firstKey;
    clone.lastChildKey = lastKey;
    return clone;
  }
}

export class HeaderNode extends CollectionNode<unknown> {
  static type: string = 'header';
}

export class LoaderNode extends CollectionNode<unknown> {
  static type: string = 'loader';
}

export class ItemNode<T> extends FilterableNode<T> {
  static type: string = 'item';

  filter(collection: BaseCollection<T>, newCollection: BaseCollection<T>, filterFn: FilterFn<T>): ItemNode<T> | null {
    if (!filterFn(this.textValue, this)) {
      return null;
    }

    let clone = this.clone();
    newCollection.addDescendants(clone, collection);
    return clone;
  }
}

export class SectionNode<T> extends FilterableNode<T> {
  static type: string = 'section';

  filter(collection: BaseCollection<T>, newCollection: BaseCollection<T>, filterFn: FilterFn<T>): SectionNode<T> | null {
    let filteredSection = super.filter(collection, newCollection, filterFn);
    if (!filteredSection) {
      return null;
    }

    if (filteredSection.lastChildKey !== null) {
      let lastChild = collection.getItem(filteredSection.lastChildKey);
      if (lastChild && lastChild.type !== 'header') {
        return filteredSection as SectionNode<T>;
      }
    }

    return null;
  }
}

export class BaseCollection<T> implements Iterable<CollectionNode<T>> {
  private keyMap: Map<Key, CollectionNode<T>> = new Map();
  private firstKey: Key | null = null;
  private lastKey: Key | null = null;
  private frozen: boolean = false;
  private itemCount: number = 0;

  get size(): number {
    return this.itemCount;
  }

  getKeys(): IterableIterator<Key> {
    return this.keyMap.keys();
  }

  *[Symbol.iterator](): IterableIterator<CollectionNode<T>> {
    let node = this.firstKey != null ? this.keyMap.get(this.firstKey) : undefined;
    while (node) {
      yield node;
      node = node.nextKey != null ? this.keyMap.get(node.nextKey) : undefined;
    }
  }

  getChildren(key: Key): Iterable<CollectionNode<T>> {
    let keyMap = this.keyMap;
    return {
      *[Symbol.iterator]() {
        let parent = keyMap.get(key);
        let node = parent?.firstChildKey != null ? keyMap.get(parent.firstChildKey) : null;
        while (node) {
          yield node;
          node = node.nextKey != null ? keyMap.get(node.nextKey) : undefined;
        }
      }
    };
  }

  getKeyBefore(key: Key): Key | null {
    let node = this.keyMap.get(key);
    if (!node) {
      return null;
    }

    if (node.prevKey != null) {
      node = this.keyMap.get(node.prevKey);
      while (node && node.type !== 'item' && node.lastChildKey != null) {
        node = this.keyMap.get(node.lastChildKey);
      }
      return node?.key ?? null;
    }

    return node.parentKey;
  }

  getKeyAfter(key: Key): Key | null {
    let node = this.keyMap.get(key);
    if (!node) {
      return null;
    }

    if (node.type !== 'item' && node.firstChildKey != null) {
      return node.firstChildKey;
    }

    while (node) {
      if (node.nextKey != null) {
        return node.nextKey;
      }

      if (node.parentKey != null) {
        node = this.keyMap.get(node.parentKey);
      } else {
        return null;
      }
    }

    return null;
  }

  getFirstKey(): Key | null {
    return this.firstKey;
  }

  getLastKey(): Key | null {
    let node = this.lastKey != null ? this.keyMap.get(this.lastKey) : null;
    while (node?.lastChildKey != null) {
      node = this.keyMap.get(node.lastChildKey);
    }

    return node?.key ?? null;
  }

  getItem(key: Key): CollectionNode<T> | null {
    return this.keyMap.get(key) ?? null;
  }

  clone(): this {
    let Constructor = this.constructor as new () => this;
    let collection = new Constructor();
    collection.keyMap = new Map(this.keyMap);
    collection.firstKey = this.firstKey;
    collection.lastKey = this.lastKey;
    collection.itemCount = this.itemCount;
    return collection;
  }

  addNode(node: CollectionNode<T>): void {
    if (this.frozen) {
      throw new Error('Cannot add a node to a frozen collection');
    }

    if (node.type === 'item' && this.keyMap.get(node.key) == null) {
      this.itemCount++;
    }

    this.keyMap.set(node.key, node);
  }

  addDescendants(node: CollectionNode<T>, oldCollection: BaseCollection<T>): void {
    this.addNode(node);
    for (let child of oldCollection.getChildren(node.key)) {
      this.addDescendants(child, oldCollection);
    }
  }

  removeNode(key: Key): void {
    if (this.frozen) {
      throw new Error('Cannot remove a node from a frozen collection');
    }

    let node = this.keyMap.get(key);
    if (node && node.type === 'item') {
      this.itemCount--;
    }

    this.keyMap.delete(key);
  }

  commit(firstKey: Key | null, lastKey: Key | null, isSSR = false): void {
    if (this.frozen) {
      throw new Error('Cannot commit a frozen collection');
    }

    this.firstKey = firstKey;
    this.lastKey = lastKey;
    this.frozen = !isSSR;
  }

  filter(filterFn: FilterFn<T>): this {
    let Constructor = this.constructor as new () => this;
    let newCollection = new Constructor();
    let [firstKey, lastKey] = filterChildren(this, newCollection, this.firstKey, filterFn);
    newCollection.commit(firstKey, lastKey);
    return newCollection;
  }
}

function filterChildren<T>(
  collection: BaseCollection<T>,
  newCollection: BaseCollection<T>,
  firstChildKey: Key | null,
  filterFn: FilterFn<T>
): [Key | null, Key | null] {
  if (firstChildKey == null) {
    return [null, null];
  }

  let firstNode: CollectionNode<T> | null = null;
  let lastNode: CollectionNode<T> | null = null;
  let currentNode = collection.getItem(firstChildKey);

  while (currentNode != null) {
    let newNode = currentNode.filter(collection, newCollection, filterFn) as Mutable<CollectionNode<T>> | null;
    if (newNode != null) {
      newNode.nextKey = null;
      newNode.prevKey = lastNode?.key ?? null;

      if (lastNode != null) {
        (lastNode as Mutable<CollectionNode<T>>).nextKey = newNode.key;
      }

      if (firstNode == null) {
        firstNode = newNode;
      }

      lastNode = newNode;
      newCollection.addNode(newNode);
    }

    currentNode = currentNode.nextKey != null ? collection.getItem(currentNode.nextKey) : null;
  }

  return [firstNode?.key ?? null, lastNode?.key ?? null];
}
