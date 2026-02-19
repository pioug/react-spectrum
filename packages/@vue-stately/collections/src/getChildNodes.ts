import type {BaseCollection, CollectionNode} from '@vue-aria/collections';

type NodeLike<T> = CollectionNode<T> | string;

export function getChildNodes<T>(collection: BaseCollection<T>, parentKey?: string | null): CollectionNode<T>[] {
  if (parentKey == null) {
    return Array.from(collection);
  }

  return Array.from(collection.getChildren(parentKey));
}

export function getFirstItem<T>(collection: BaseCollection<T>, parentKey?: string | null): CollectionNode<T> | null {
  let nodes = getChildNodes(collection, parentKey);
  return nodes.length > 0 ? nodes[0] : null;
}

export function getLastItem<T>(collection: BaseCollection<T>, parentKey?: string | null): CollectionNode<T> | null {
  let nodes = getChildNodes(collection, parentKey);
  return nodes.length > 0 ? nodes[nodes.length - 1] : null;
}

export function getNthItem<T>(collection: BaseCollection<T>, index: number, parentKey?: string | null): CollectionNode<T> | null {
  let nodes = getChildNodes(collection, parentKey);
  if (index < 0 || index >= nodes.length) {
    return null;
  }

  return nodes[index] ?? null;
}

function flattenCollection<T>(collection: BaseCollection<T>, parentKey?: string | null): CollectionNode<T>[] {
  let nodes = getChildNodes(collection, parentKey);
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

export function compareNodeOrder<T>(collection: BaseCollection<T>, left: NodeLike<T>, right: NodeLike<T>): number {
  let orderedKeys = flattenCollection(collection).map((node) => node.key);
  let leftIndex = orderedKeys.indexOf(getNodeKey(left));
  let rightIndex = orderedKeys.indexOf(getNodeKey(right));

  if (leftIndex === rightIndex) {
    return 0;
  }

  return leftIndex < rightIndex ? -1 : 1;
}
