import {type ComputedRef, type Ref, ref, unref} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface DOMRef<T extends Element = Element> {
  current: T | null
}

export function createDOMRef<T extends Element = Element>(element: T | null = null): DOMRef<T> {
  return {
    current: element
  };
}

export function useDOMRef<T extends Element = Element>(initialValue: T | null = null): Ref<T | null> {
  return ref(initialValue) as Ref<T | null>;
}

export function unwrapDOMRef<T extends Element = Element>(value: DOMRef<T> | MaybeRef<T | null> | null): T | null {
  if (value == null) {
    return null;
  }

  if (typeof value === 'object' && 'current' in value) {
    return value.current;
  }

  return unref(value);
}
