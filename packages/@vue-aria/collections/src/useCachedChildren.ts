import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface CachedChildrenOptions<T extends object> {
  addIdAndValue?: MaybeRef<boolean>,
  children?: MaybeRef<unknown | ((item: T) => unknown)>,
  dependencies?: MaybeRef<ReadonlyArray<unknown> | undefined>,
  getKey?: (item: T) => string | number | null | undefined,
  idScope?: MaybeRef<string | number | undefined>,
  items?: MaybeRef<Iterable<T> | undefined>
}

export interface CachedChild<T extends object> {
  id?: string,
  key: string,
  rendered: unknown,
  value?: T
}

export function useCachedChildren<T extends object>(
  options: CachedChildrenOptions<T>
): ComputedRef<Array<CachedChild<T>> | unknown | undefined> {
  let cache = new WeakMap<object, CachedChild<T>>();
  let dependencySignature = '';

  let refreshCache = () => {
    let dependencies = unref(options.dependencies);
    let nextSignature = dependencies?.map((value, index) => `${index}:${String(value)}`).join('|') ?? '';
    if (nextSignature !== dependencySignature) {
      dependencySignature = nextSignature;
      cache = new WeakMap<object, CachedChild<T>>();
    }
  };

  return computed(() => {
    refreshCache();

    let children = unref(options.children);
    let items = unref(options.items);
    let idScope = unref(options.idScope);
    let addIdAndValue = Boolean(unref(options.addIdAndValue));

    if (items && typeof children === 'function') {
      let result: Array<CachedChild<T>> = [];
      for (let item of items) {
        let cached = cache.get(item);
        if (!cached) {
          let key = options.getKey?.(item) ?? (item as {id?: unknown, key?: unknown}).key ?? (item as {id?: unknown, key?: unknown}).id;
          if (key == null) {
            throw new Error('Could not determine key for item');
          }

          let scopedKey = idScope == null ? String(key) : `${idScope}:${key}`;
          cached = {
            key: scopedKey,
            rendered: children(item),
            ...(addIdAndValue ? {id: scopedKey, value: item} : {})
          };
          cache.set(item, cached);
        }

        result.push(cached);
      }

      return result;
    }

    if (typeof children !== 'function') {
      return children;
    }

    return undefined;
  });
}
