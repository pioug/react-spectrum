import type {Collection, Node} from '@react-types/shared';
import type {BaseCollection, CollectionNode} from '@vue-aria/collections';

type NodeLike<T> = CollectionNode<T> | Node<T> | string;

function isCollectionNode<T>(value: unknown): value is CollectionNode<T> | Node<T> {
  return Boolean(value && typeof value === 'object' && 'key' in (value as Record<string, unknown>));
}

function isReactCollection<T>(value: unknown): value is Collection<Node<T>> {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'getItem' in (value as Record<string, unknown>) &&
    Symbol.iterator in (value as Record<string, unknown>)
  );
}

export function getChildNodes<T>(node: Node<T>, collection: Collection<Node<T>>): Iterable<Node<T>>;
export function getChildNodes<T>(collection: BaseCollection<T>, parentKey?: string | null): CollectionNode<T>[];
export function getChildNodes<T>(
  source: Node<T> | BaseCollection<T>,
  collectionOrParentKey?: Collection<Node<T>> | string | null
): Iterable<Node<T>> | CollectionNode<T>[] {
  if (isCollectionNode<T>(source) && isReactCollection<T>(collectionOrParentKey)) {
    let collection = collectionOrParentKey;
    if (typeof collection.getChildren === 'function') {
      return collection.getChildren(source.key);
    }

    return source.childNodes ?? [];
  }

  let collection = source as BaseCollection<T>;
  let parentKey = collectionOrParentKey as string | null | undefined;

  if (parentKey == null) {
    return Array.from(collection);
  }

  return Array.from(collection.getChildren(parentKey));
}

export function getFirstItem<T>(iterable: Iterable<T>): T | undefined;
export function getFirstItem<T>(collection: BaseCollection<T>, parentKey?: string | null): CollectionNode<T> | null;
export function getFirstItem<T>(source: Iterable<T> | BaseCollection<T>, parentKey?: string | null): T | CollectionNode<T> | null | undefined {
  if (parentKey != null || isReactCollection<T>(source)) {
    let nodes = getChildNodes(source as BaseCollection<T>, parentKey) as CollectionNode<T>[];
    return nodes[0] ?? null;
  }

  for (let item of source as Iterable<T>) {
    return item;
  }

  return undefined;
}

export function getLastItem<T>(iterable: Iterable<T>): T | undefined;
export function getLastItem<T>(collection: BaseCollection<T>, parentKey?: string | null): CollectionNode<T> | null;
export function getLastItem<T>(source: Iterable<T> | BaseCollection<T>, parentKey?: string | null): T | CollectionNode<T> | null | undefined {
  if (parentKey != null || isReactCollection<T>(source)) {
    let nodes = getChildNodes(source as BaseCollection<T>, parentKey) as CollectionNode<T>[];
    return nodes.length > 0 ? nodes[nodes.length - 1] : null;
  }

  let lastItem: T | undefined;
  for (let item of source as Iterable<T>) {
    lastItem = item;
  }

  return lastItem;
}

export function getNthItem<T>(iterable: Iterable<T>, index: number): T | undefined;
export function getNthItem<T>(collection: BaseCollection<T>, index: number, parentKey?: string | null): CollectionNode<T> | null;
export function getNthItem<T>(
  source: Iterable<T> | BaseCollection<T>,
  index: number,
  parentKey?: string | null
): T | CollectionNode<T> | null | undefined {
  if (index < 0) {
    return parentKey != null || isReactCollection<T>(source) ? null : undefined;
  }

  if (parentKey != null || isReactCollection<T>(source)) {
    let nodes = getChildNodes(source as BaseCollection<T>, parentKey) as CollectionNode<T>[];
    return nodes[index] ?? null;
  }

  let i = 0;
  for (let item of source as Iterable<T>) {
    if (i === index) {
      return item;
    }

    i++;
  }

  return undefined;
}

function flattenCollection<T>(collection: BaseCollection<T>, parentKey?: string | null): CollectionNode<T>[] {
  let nodes = getChildNodes(collection, parentKey) as CollectionNode<T>[];
  let flattened: CollectionNode<T>[] = [];

  for (let node of nodes) {
    flattened.push(node);
    if (node.hasChildNodes) {
      flattened.push(...flattenCollection(collection, node.key));
    }
  }

  return flattened;
}

function getNodeKey<T>(node: NodeLike<T>): string {
  if (typeof node === 'string') {
    return node;
  }

  return node.key;
}

export function compareNodeOrder<T>(collection: Collection<Node<T>>, left: Node<T>, right: Node<T>): number;
export function compareNodeOrder<T>(collection: BaseCollection<T>, left: NodeLike<T>, right: NodeLike<T>): number;
export function compareNodeOrder<T>(
  collection: Collection<Node<T>> | BaseCollection<T>,
  left: NodeLike<T>,
  right: NodeLike<T>
): number {
  let baseCollection = collection as unknown as BaseCollection<T>;
  let orderedKeys = flattenCollection(baseCollection).map((node) => node.key);
  let leftIndex = orderedKeys.indexOf(getNodeKey(left));
  let rightIndex = orderedKeys.indexOf(getNodeKey(right));

  if (leftIndex === rightIndex) {
    return 0;
  }

  return leftIndex < rightIndex ? -1 : 1;
}
