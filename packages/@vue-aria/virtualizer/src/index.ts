import {computed, defineComponent, ref, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;
type Direction = 'ltr' | 'rtl';
type LayoutInfo = Record<string, unknown>;
type CSSProperties = Record<string, unknown>;
type RefObject<T> = {current: T};
type ScrollViewProps = Record<string, unknown>;
type ScrollViewAria = {
  scrollViewProps: Record<string, unknown>
};

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

export type RTLOffsetType = 'negative' | 'positive-descending' | 'positive-ascending';
export type VirtualizerItemOptions = Record<string, unknown>;

export const Virtualizer = defineComponent({
  name: 'VueAriaVirtualizer',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export const VirtualizerItem = defineComponent({
  name: 'VueAriaVirtualizerItem',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export const ScrollView = defineComponent({
  name: 'VueAriaScrollView',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export function layoutInfoToStyle(
  layoutInfo: LayoutInfo,
  _direction: Direction,
  _parent: LayoutInfo | null
): CSSProperties {
  return {...layoutInfo};
}

export function getRTLOffsetType(_recalculate: boolean = false): RTLOffsetType {
  return 'negative';
}

export function getScrollLeft(element: Element, direction: Direction): number {
  if (!(element instanceof HTMLElement)) {
    return 0;
  }

  if (direction === 'rtl') {
    return Math.abs(element.scrollLeft);
  }

  return element.scrollLeft;
}

export function setScrollLeft(element: Element, direction: Direction, scrollLeft: number): void {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.scrollLeft = direction === 'rtl' ? -Math.abs(scrollLeft) : scrollLeft;
}

export function useScrollView(props: ScrollViewProps, ref: RefObject<HTMLElement | null>): ScrollViewAria;
export function useScrollView() {
  let scrollRef = ref<HTMLElement | null>(null);
  return {
    scrollViewProps: {},
    scrollRef
  };
}

export function useVirtualizerItem(_options: VirtualizerItemOptions): {updateSize: () => void};
export function useVirtualizerItem(_options: VirtualizerItemOptions = {}) {
  return {
    updateSize: () => {},
    virtualizerItemProps: {}
  };
}
