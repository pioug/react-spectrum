import {defineComponent} from 'vue';

export type {AriaFocusRingProps, FocusRingAria, FocusRingProps} from './useFocusRing';
export {useFocusRing} from './useFocusRing';
export type {AriaHasTabbableChildOptions, MaybeElementRef} from './useHasTabbableChild';
export {useHasTabbableChild} from './useHasTabbableChild';

type AnyRecord = Record<string, unknown>;
type AnyElement = Element | null;

export type FocusManagerOptions = AnyRecord;
export type FocusScopeProps = AnyRecord;
export type FocusableOptions = AnyRecord;
export type FocusableAria = AnyRecord;
export type FocusableProviderProps = AnyRecord;

export interface FocusManager {
  focusNext: () => void,
  focusPrevious: () => void,
  focusFirst: () => void,
  focusLast: () => void
}

export const FocusScope = defineComponent({
  name: 'VueAriaFocusScope',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export const FocusRing = defineComponent({
  name: 'VueAriaFocusRing',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export const FocusableProvider = defineComponent({
  name: 'VueAriaFocusableProvider',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export const Focusable = defineComponent({
  name: 'VueAriaFocusable',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export function createFocusManager(): FocusManager {
  return {
    focusNext: () => {},
    focusPrevious: () => {},
    focusFirst: () => {},
    focusLast: () => {}
  };
}

export function useFocusManager(): FocusManager {
  return createFocusManager();
}

export function getFocusableTreeWalker(): null {
  return null;
}

export function isElementInChildOfActiveScope(): boolean {
  return false;
}

export function dispatchVirtualFocus(): void {}
export function dispatchVirtualBlur(): void {}

export function getVirtuallyFocusedElement(): AnyElement {
  return null;
}

export function moveVirtualFocus(): void {}

export function focusSafely(element: AnyElement): void {
  if (!element) {
    return;
  }

  if (typeof element.focus === 'function') {
    element.focus();
  }
}

export function isFocusable(element: AnyElement): boolean {
  return Boolean(element && typeof element.matches === 'function');
}

export function useFocusable(props: AnyRecord = {}) {
  return {
    focusableProps: props
  };
}
