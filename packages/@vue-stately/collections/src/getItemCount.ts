import type {BaseCollection} from '@vue-aria/collections';
import {getChildNodes} from './getChildNodes';

export function getItemCount<T>(collection: BaseCollection<T>, parentKey?: string | null): number {
  if (parentKey == null) {
    return collection.size;
  }

  let count = 0;
  for (let childNode of getChildNodes(collection, parentKey)) {
    if (childNode.type === 'item') {
      count += 1;
    }

    if (childNode.hasChildNodes) {
      count += getItemCount(collection, childNode.key);
    }
  }

  return count;
}
