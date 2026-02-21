import {type BaseCollection, CollectionBuilder} from '@vue-aria/collections';
import type {Collection, CollectionStateBase, Node} from '@vue-types/shared';
import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

type VueCollectionFactory<T, C extends BaseCollection<T>> = (collection: BaseCollection<T>) => C;
type CollectionFactory<T, C extends Collection<Node<T>>> = (nodes: Iterable<Node<T>>) => C;

export interface CollectionOptions<T, C extends Collection<Node<T>>> extends Omit<CollectionStateBase<T, C>, 'children'> {
  children?: unknown
}

export interface VueCollectionOptions<T, C extends BaseCollection<T> = BaseCollection<T>> {
  collection?: MaybeRef<C | null | undefined>,
  factory?: VueCollectionFactory<T, C>,
  getChildren?: (item: T, index: number) => Iterable<T> | undefined,
  getKey?: (item: T, index: number) => string,
  getTextValue?: (item: T, index: number) => string,
  items?: MaybeRef<Iterable<T> | undefined>
}

export function useCollection<T extends object, C extends Collection<Node<T>> = Collection<Node<T>>>(
  props: CollectionOptions<T, C>,
  factory: CollectionFactory<T, C>,
  context?: unknown
): C;
export function useCollection<T extends object, C extends BaseCollection<T> = BaseCollection<T>>(
  options: VueCollectionOptions<T, C>
): ComputedRef<C>;
export function useCollection<T extends object, C extends BaseCollection<T> = BaseCollection<T>>(
  optionsOrProps: VueCollectionOptions<T, C>,
  factory?: CollectionFactory<T, Collection<Node<T>>>,
  context?: unknown
): ComputedRef<C> | Collection<Node<T>> {
  void context;

  if (typeof factory === 'function') {
    let props = optionsOrProps as unknown as CollectionOptions<T, Collection<Node<T>>>;
    if (props.collection) {
      return props.collection;
    }

    let builder = new CollectionBuilder<T>();
    let collection = builder.build({
      items: (props.items ?? []) as Iterable<T>
    });

    return factory(collection as unknown as Iterable<Node<T>>);
  }

  let options = optionsOrProps as VueCollectionOptions<T, C>;
  return computed(() => {
    let providedCollection = unref(options.collection);
    if (providedCollection) {
      return providedCollection;
    }

    let builder = new CollectionBuilder<T>();
    let collection = builder.build({
      getChildren: options.getChildren,
      getKey: options.getKey,
      getTextValue: options.getTextValue,
      items: unref(options.items) ?? []
    });

    if (options.factory) {
      return options.factory(collection);
    }

    return collection as C;
  });
}
