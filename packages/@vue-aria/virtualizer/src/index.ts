import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface VirtualizerOptions {
  itemCount: MaybeRef<number>,
  itemHeight: MaybeRef<number>,
  viewportHeight: MaybeRef<number>,
  scrollTop: MaybeRef<number>,
  overscan?: MaybeRef<number>
}

export interface VirtualizerState {
  startIndex: ComputedRef<number>,
  endIndex: ComputedRef<number>,
  visibleCount: ComputedRef<number>,
  visibleIndexes: ComputedRef<number[]>,
  totalHeight: ComputedRef<number>,
  offsetTop: ComputedRef<number>
}

function toClampedInteger(value: number, minimum: number): number {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.max(minimum, Math.floor(value));
}

export function useVirtualizer(options: VirtualizerOptions): VirtualizerState {
  let itemCount = computed(() => toClampedInteger(Number(unref(options.itemCount)), 0));
  let itemHeight = computed(() => toClampedInteger(Number(unref(options.itemHeight)), 1));
  let viewportHeight = computed(() => toClampedInteger(Number(unref(options.viewportHeight)), 0));
  let scrollTop = computed(() => toClampedInteger(Number(unref(options.scrollTop)), 0));
  let overscan = computed(() => toClampedInteger(Number(unref(options.overscan ?? 2)), 0));

  let startIndex = computed(() => {
    let baseIndex = Math.floor(scrollTop.value / itemHeight.value) - overscan.value;
    return Math.max(0, Math.min(itemCount.value, baseIndex));
  });

  let visibleCount = computed(() => {
    let baseVisibleCount = Math.ceil(viewportHeight.value / itemHeight.value);
    let withOverscan = baseVisibleCount + (overscan.value * 2);
    let available = Math.max(itemCount.value - startIndex.value, 0);
    return Math.min(available, withOverscan);
  });

  let endIndex = computed(() => startIndex.value + visibleCount.value);
  let totalHeight = computed(() => itemCount.value * itemHeight.value);
  let offsetTop = computed(() => startIndex.value * itemHeight.value);
  let visibleIndexes = computed(() => Array.from({length: visibleCount.value}, (_value, index) => startIndex.value + index));

  return {
    startIndex,
    endIndex,
    visibleCount,
    visibleIndexes,
    totalHeight,
    offsetTop
  };
}
