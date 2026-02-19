import {type BaseCollection, CollectionBuilder} from '@vue-aria/collections';
import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

type CollectionFactory<T, C extends BaseCollection<T>> = (collection: BaseCollection<T>) => C;

export interface CollectionOptions<T, C extends BaseCollection<T> = BaseCollection<T>> {
  collection?: MaybeRef<C | null | undefined>,
  factory?: CollectionFactory<T, C>,
  getChildren?: (item: T, index: number) => Iterable<T> | undefined,
  getKey?: (item: T, index: number) => string,
  getTextValue?: (item: T, index: number) => string,
  items?: MaybeRef<Iterable<T> | undefined>
}

export function useCollection<T extends object, C extends BaseCollection<T> = BaseCollection<T>>(
  options: CollectionOptions<T, C>
): ComputedRef<C> {
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
