import {defineComponent} from 'vue';
import {focusSafely as focusSafelyInteractions} from '@vue-aria/interactions';
import {isFocusable as isFocusableUtils, isTabbable as isTabbableUtils, nodeContains as nodeContainsUtils} from '@vue-aria/utils';

export type {AriaFocusRingProps, FocusRingAria, FocusRingProps} from './useFocusRing';
export {useFocusRing} from './useFocusRing';
export type {AriaHasTabbableChildOptions, MaybeElementRef} from './useHasTabbableChild';
export {useHasTabbableChild} from './useHasTabbableChild';

export type FocusManagerOptions = {
  accept?: (node: Element) => boolean,
  from?: Element,
  tabbable?: boolean,
  wrap?: boolean
};
export type FocusScopeProps = {
  autoFocus?: boolean,
  contain?: boolean,
  restoreFocus?: boolean
};
export type FocusableElement = Element & {focus?: () => void};
export type RefObject<T> = {current: T};
export type FocusableOptions<T extends FocusableElement = FocusableElement> = Record<string, unknown>;
export type FocusableAria = {
  focusableProps: FocusableOptions
};
export type FocusableProviderProps = Record<string, unknown>;

export interface FocusManager {
  focusNext: (opts?: FocusManagerOptions) => FocusableElement | null,
  focusPrevious: (opts?: FocusManagerOptions) => FocusableElement | null,
  focusFirst: (opts?: FocusManagerOptions) => FocusableElement | null,
  focusLast: (opts?: FocusManagerOptions) => FocusableElement | null
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

function focusElement(element: Element | null): FocusableElement | null {
  if (!element) {
    return null;
  }

  focusSafelyInteractions(element as unknown as HTMLElement | SVGElement);
  return element as FocusableElement;
}

function getLastFocusableElement(root: Element, opts: FocusManagerOptions): FocusableElement | null {
  let walker = getFocusableTreeWalker(root, opts);
  let lastFocusableElement: FocusableElement | null = null;
  let nextNode = walker.nextNode() as Element | null;
  while (nextNode) {
    lastFocusableElement = nextNode as FocusableElement;
    nextNode = walker.nextNode() as Element | null;
  }

  return lastFocusableElement;
}

export function createFocusManager(ref: RefObject<Element | null>, defaultOptions: FocusManagerOptions = {}): FocusManager {
  return {
    focusNext(opts: FocusManagerOptions = {}) {
      let root = ref.current;
      if (!root) {
        return null;
      }

      let mergedOptions = {
        ...defaultOptions,
        ...opts
      };
      let node = mergedOptions.from ?? root.ownerDocument?.activeElement ?? null;
      let walker = getFocusableTreeWalker(root, {
        accept: mergedOptions.accept,
        tabbable: mergedOptions.tabbable
      });
      if (node && nodeContainsUtils(root, node)) {
        walker.currentNode = node;
      }

      let nextNode = walker.nextNode() as Element | null;
      if (!nextNode && mergedOptions.wrap) {
        walker.currentNode = root;
        nextNode = walker.nextNode() as Element | null;
      }

      return focusElement(nextNode);
    },
    focusPrevious(opts: FocusManagerOptions = {}) {
      let root = ref.current;
      if (!root) {
        return null;
      }

      let mergedOptions = {
        ...defaultOptions,
        ...opts
      };
      let node = mergedOptions.from ?? root.ownerDocument?.activeElement ?? null;
      let walker = getFocusableTreeWalker(root, {
        accept: mergedOptions.accept,
        tabbable: mergedOptions.tabbable
      });

      if (node && nodeContainsUtils(root, node)) {
        walker.currentNode = node;
        let previousNode = walker.previousNode() as Element | null;
        if (!previousNode && mergedOptions.wrap) {
          return focusElement(getLastFocusableElement(root, mergedOptions));
        }

        return focusElement(previousNode);
      }

      return focusElement(getLastFocusableElement(root, mergedOptions));
    },
    focusFirst(opts: FocusManagerOptions = {}) {
      let root = ref.current;
      if (!root) {
        return null;
      }

      let mergedOptions = {
        ...defaultOptions,
        ...opts
      };
      let walker = getFocusableTreeWalker(root, {
        accept: mergedOptions.accept,
        tabbable: mergedOptions.tabbable
      });
      return focusElement(walker.nextNode() as Element | null);
    },
    focusLast(opts: FocusManagerOptions = {}) {
      let root = ref.current;
      if (!root) {
        return null;
      }

      let mergedOptions = {
        ...defaultOptions,
        ...opts
      };
      return focusElement(getLastFocusableElement(root, mergedOptions));
    }
  };
}

export function useFocusManager(): FocusManager | undefined {
  return undefined;
}

export interface ShadowTreeWalker extends TreeWalker {}

export function getFocusableTreeWalker(
  root: Element,
  opts: FocusManagerOptions = {},
  scope: Element[] = []
): ShadowTreeWalker | TreeWalker {
  let ownerDocument = root.ownerDocument;
  if (!ownerDocument || typeof ownerDocument.createTreeWalker !== 'function') {
    return null as unknown as TreeWalker;
  }

  let showElement = typeof NodeFilter === 'undefined' ? 1 : NodeFilter.SHOW_ELEMENT;
  let filterAccept = typeof NodeFilter === 'undefined' ? 1 : NodeFilter.FILTER_ACCEPT;
  let filterReject = typeof NodeFilter === 'undefined' ? 2 : NodeFilter.FILTER_REJECT;
  let filterSkip = typeof NodeFilter === 'undefined' ? 3 : NodeFilter.FILTER_SKIP;
  let hasScope = scope.length > 0;
  let isValidNode = opts.tabbable ? isTabbableUtils : isFocusableUtils;

  let walker = ownerDocument.createTreeWalker(root, showElement, {
    acceptNode(node) {
      if (!(node instanceof Element)) {
        return filterSkip;
      }

      if (opts.from && nodeContainsUtils(opts.from, node)) {
        return filterReject;
      }

      if (hasScope && !scope.some((scopeElement) => nodeContainsUtils(scopeElement, node))) {
        return filterSkip;
      }

      if (!isValidNode(node)) {
        return filterSkip;
      }

      if (opts.accept && !opts.accept(node)) {
        return filterSkip;
      }

      return filterAccept;
    }
  });
  if (opts.from) {
    walker.currentNode = opts.from;
  }

  return walker;
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
  focusSafelyInteractions(element as unknown as HTMLElement | SVGElement);
}

export function isFocusable(element: Element): boolean {
  return isFocusableUtils(element);
}

export function useFocusable<T extends FocusableElement = FocusableElement>(
  props: FocusableOptions<T> = {},
  _ref: RefObject<FocusableElement | null> = {current: null}
): FocusableAria {
  return {
    focusableProps: props
  };
}
