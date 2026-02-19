import type {Collection, Node} from '@react-types/shared';
import type {BaseCollection, CollectionNode} from '@vue-aria/collections';
import {getChildNodes} from './getChildNodes';

function countItemNodes<T>(nodes: Iterable<CollectionNode<T>>): number {
  let count = 0;

  for (let node of nodes) {
    if (node.type === 'item') {
      count += 1;
    }

    if (node.hasChildNodes) {
      count += countItemNodes(node.childNodes ?? []);
    }
  }

  return count;
}

export function getItemCount<T>(collection: Collection<Node<T>>): number;
export function getItemCount<T>(collection: BaseCollection<T>, parentKey?: string | null): number;
export function getItemCount<T>(collection: Collection<Node<T>> | BaseCollection<T>, parentKey?: string | null): number {
  let nodes = getChildNodes(collection as unknown as BaseCollection<T>, parentKey) as CollectionNode<T>[];
  return countItemNodes(nodes);
}
