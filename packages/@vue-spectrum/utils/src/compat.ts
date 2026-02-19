import {computed, defineComponent, ref, type Ref, type VNodeChild} from 'vue';
import {useResizeObserver as useAriaResizeObserver, useValueEffect as useAriaValueEffect} from '@vue-aria/utils';
import {createDOMRef, type DOMRef, unwrapDOMRef, useDOMRef} from './useDOMRef';

type AnyRecord = Record<string, unknown>;

export type StyleHandlers = Record<string, (value: unknown) => string | number | null | undefined>;

export const baseStyleProps = ['UNSAFE_className', 'UNSAFE_style', 'id'];
export const viewStyleProps = ['backgroundColor', 'borderColor', 'padding', 'margin'];

export function getWrappedElement(element: unknown): unknown {
  return element;
}

export function createFocusableRef<T extends Element = Element>(element: T | null = null): DOMRef<T> {
  return createDOMRef(element);
}

export function useFocusableRef<T extends Element = Element>(initialValue: T | null = null): Ref<T | null> {
  return useDOMRef(initialValue);
}

export function useUnwrapDOMRef<T extends Element = Element>(value: DOMRef<T> | Ref<T | null> | T | null) {
  return computed(() => unwrapDOMRef(value as DOMRef<T> | Ref<T | null> | T | null));
}

export function dimensionValue(value: unknown): string | number | undefined {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string') {
    return value;
  }

  return undefined;
}

export function responsiveDimensionValue(value: unknown): string | number | undefined {
  if (Array.isArray(value)) {
    return dimensionValue(value[0]);
  }

  if (value && typeof value === 'object') {
    let first = Object.values(value as Record<string, unknown>)[0];
    return dimensionValue(first);
  }

  return dimensionValue(value);
}

export function passthroughStyle(style: unknown): Record<string, unknown> {
  return style && typeof style === 'object' ? style as Record<string, unknown> : {};
}

export function getResponsiveProp<T>(value: T | Record<string, T>, breakpoint: string = 'base'): T | undefined {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    let recordValue = value as Record<string, T>;
    return recordValue[breakpoint] ?? Object.values(recordValue)[0];
  }

  return value as T;
}

export function convertStyleProps(props: AnyRecord = {}) {
  return {
    style: passthroughStyle(props.UNSAFE_style),
    className: props.UNSAFE_className
  };
}

export function useStyleProps(props: AnyRecord = {}) {
  return computed(() => convertStyleProps(props));
}

export function cssModuleToSlots(styles: AnyRecord = {}): Record<string, string> {
  let slots: Record<string, string> = {};
  for (let [key, value] of Object.entries(styles)) {
    slots[key] = typeof value === 'string' ? value : '';
  }

  return slots;
}

export function useSlotProps(props: AnyRecord = {}, slotName: string = 'default') {
  return computed(() => ({
    ...props,
    slot: slotName
  }));
}

export function useHasChild(child: VNodeChild | null | undefined) {
  return computed(() => child != null);
}

export const SlotProvider = defineComponent({
  name: 'VueSpectrumSlotProvider',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export const ClearSlots = defineComponent({
  name: 'VueSpectrumClearSlots',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export const BreakpointProvider = defineComponent({
  name: 'VueSpectrumBreakpointProvider',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export function useMatchedBreakpoints() {
  return ref(['base']);
}

export function useBreakpoint() {
  return computed(() => 'base');
}

export function useResizeObserver(...args: Parameters<typeof useAriaResizeObserver>) {
  return useAriaResizeObserver(...args);
}

export function useValueEffect<T>(initialValue: T) {
  return useAriaValueEffect(initialValue);
}
