import {type ComputedRef, type Ref, ref, unref, watch} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export function useMediaQuery(query: MaybeRef<string>, fallbackValue = false): Ref<boolean> {
  let matches = ref(fallbackValue);

  watch(() => unref(query), (nextQuery) => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      matches.value = fallbackValue;
      return;
    }

    matches.value = window.matchMedia(nextQuery).matches;
  }, {immediate: true});

  return matches;
}
