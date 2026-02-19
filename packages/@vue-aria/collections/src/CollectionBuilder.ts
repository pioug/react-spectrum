import {BaseCollection, type CollectionNode, ItemNode, type Key, type Mutable} from './BaseCollection';

export interface CollectionBuilderProps<T> {
  getChildren?: (item: T, index: number) => Iterable<T> | undefined,
  getKey?: (item: T, index: number) => Key,
  getTextValue?: (item: T, index: number) => string,
  items: Iterable<T>
}

export type CollectionProps<T> = CollectionBuilderProps<T>;

function defaultGetKey<T>(item: T, index: number): Key {
  if (item && typeof item === 'object') {
    let key = (item as {id?: unknown, key?: unknown}).key ?? (item as {id?: unknown, key?: unknown}).id;
    if (key != null) {
      return String(key);
    }
  }

  return String(index);
}

function defaultGetTextValue<T>(item: T, index: number): string {
  if (item && typeof item === 'object') {
    let textValue = (item as {label?: unknown, textValue?: unknown}).textValue ?? (item as {label?: unknown, textValue?: unknown}).label;
    if (typeof textValue === 'string') {
      return textValue;
    }
  }

  return String(index);
}

function linkNextNode<T>(collection: BaseCollection<T>, previousKey: Key | null, nextKey: Key): void {
  if (previousKey == null) {
    return;
  }

  let previousNode = collection.getItem(previousKey) as Mutable<CollectionNode<T>> | null;
  if (!previousNode) {
    return;
  }

  previousNode.nextKey = nextKey;
}

export class CollectionBuilder<T> {
  build(props: CollectionBuilderProps<T>): BaseCollection<T> {
    let getKey = props.getKey ?? defaultGetKey;
    let getTextValue = props.getTextValue ?? defaultGetTextValue;
    let collection = new BaseCollection<T>();

    let firstKey: Key | null = null;
    let lastKey: Key | null = null;
    let previousKey: Key | null = null;
    let itemIndex = 0;

    for (let item of props.items) {
      let key = getKey(item, itemIndex);
      let node = new ItemNode<T>(key) as Mutable<CollectionNode<T>>;
      node.value = item;
      node.index = itemIndex;
      node.textValue = getTextValue(item, itemIndex);
      node.prevKey = previousKey;

      if (firstKey == null) {
        firstKey = key;
      }

      linkNextNode(collection, previousKey, key);

      collection.addNode(node);
      let children = props.getChildren?.(item, itemIndex);
      if (children) {
        let childIndex = 0;
        let firstChildKey: Key | null = null;
        let lastChildKey: Key | null = null;
        let previousChildKey: Key | null = null;

        for (let child of children) {
          let childKey = `${key}:${childIndex}`;
          let childNode = new ItemNode<T>(childKey) as Mutable<CollectionNode<T>>;
          childNode.value = child;
          childNode.index = childIndex;
          childNode.level = node.level + 1;
          childNode.parentKey = key;
          childNode.textValue = getTextValue(child, childIndex);
          childNode.prevKey = previousChildKey;

          if (firstChildKey == null) {
            firstChildKey = childKey;
          }

          linkNextNode(collection, previousChildKey, childKey);

          collection.addNode(childNode);
          previousChildKey = childKey;
          lastChildKey = childKey;
          childIndex++;
        }

        node.hasChildNodes = firstChildKey != null;
        node.firstChildKey = firstChildKey;
        node.lastChildKey = lastChildKey;
      }

      previousKey = key;
      lastKey = key;
      itemIndex++;
    }

    collection.commit(firstKey, lastKey);
    return collection;
  }
}

export function Collection<T>(props: CollectionProps<T>): BaseCollection<T> {
  return new CollectionBuilder<T>().build(props);
}

export function createLeafComponent<T, TComponent>(
  component: (item: T, index: number) => TComponent
): (item: T, index: number) => TComponent {
  return component;
}

export function createBranchComponent<T, TComponent>(
  component: (item: T, index: number, children: TComponent[]) => TComponent
): (item: T, index: number, children: TComponent[]) => TComponent {
  return component;
}
