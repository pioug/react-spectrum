import {defineComponent} from 'vue';

export type {AriaFocusRingProps, FocusRingAria, FocusRingProps} from './useFocusRing';
export {useFocusRing} from './useFocusRing';
export type {AriaHasTabbableChildOptions, MaybeElementRef} from './useHasTabbableChild';
export {useHasTabbableChild} from './useHasTabbableChild';

type AnyRecord = Record<string, unknown>;

export type FocusManagerOptions = AnyRecord;
export type FocusScopeProps = {
  autoFocus?: boolean,
  contain?: boolean,
  restoreFocus?: boolean
};
export type FocusableElement = Element & {focus?: () => void};
export type RefObject<T> = {current: T};
export type FocusableOptions<T extends FocusableElement = FocusableElement> = AnyRecord;
export type FocusableAria = {
  focusableProps: FocusableOptions
};
export type FocusableProviderProps = AnyRecord;

export interface FocusManager {
  focusNext: () => void,
  focusPrevious: () => void,
  focusFirst: () => void,
  focusLast: () => void
}

export const FocusScope = defineComponent({
  name: 'VueAriaFocusScope',
  props: {
    autoFocus: {
      type: Boolean,
      default: false
    },
    contain: {
      type: Boolean,
      default: false
    },
    restoreFocus: {
      type: Boolean,
      default: false
    }
  },
  setup(_props, {slots}) {
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

function createNoopFocusManager(): FocusManager {
  return {
    focusNext: () => {},
    focusPrevious: () => {},
    focusFirst: () => {},
    focusLast: () => {}
  };
}

export function createFocusManager(_ref: RefObject<Element | null>, _opts: FocusManagerOptions = {}): FocusManager {
  return createNoopFocusManager();
}

export function useFocusManager(): FocusManager | undefined {
  return createNoopFocusManager();
}

export interface ShadowTreeWalker extends TreeWalker {}

export function getFocusableTreeWalker(
  root: Element,
  _opts: FocusManagerOptions = {},
  _scope: Element[] = []
): ShadowTreeWalker | TreeWalker {
  let ownerDocument = root.ownerDocument;
  if (ownerDocument && typeof ownerDocument.createTreeWalker === 'function') {
    let showElement = typeof NodeFilter === 'undefined' ? 1 : NodeFilter.SHOW_ELEMENT;
    return ownerDocument.createTreeWalker(root, showElement);
  }

  return null as unknown as TreeWalker;
}

export function isElementInChildOfActiveScope(element: Element): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  let activeElement = document.activeElement;
  return Boolean(activeElement && element.contains(activeElement));
}

export function dispatchVirtualFocus(_toElement: Element, _fromElement: Element | null): void {}
export function dispatchVirtualBlur(_toElement: Element, _fromElement: Element | null): void {}

export function getVirtuallyFocusedElement(documentRef: Document): Element | null {
  return documentRef.activeElement;
}

export function moveVirtualFocus(element: Element | null): void {
  if (element && typeof (element as FocusableElement).focus === 'function') {
    (element as FocusableElement).focus?.();
  }
}

export function focusSafely(element: FocusableElement): void {
  if (typeof element.focus === 'function') {
    element.focus();
  }
}

export function isFocusable(element: Element): boolean {
  return typeof element.matches === 'function' && !element.hasAttribute('disabled');
}

export function useFocusable<T extends FocusableElement = FocusableElement>(
  props: FocusableOptions<T> = {},
  _ref: RefObject<FocusableElement | null> = {current: null}
): FocusableAria {
  return {
    focusableProps: props
  };
}
