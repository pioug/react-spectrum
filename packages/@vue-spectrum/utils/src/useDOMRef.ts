export type RefObject<T> = {
  current: T
};

export type FocusableElement = HTMLElement | SVGElement;

export interface DOMRefValue<T extends HTMLElement = HTMLElement> {
  UNSAFE_getDOMNode: () => T | null
}

export type DOMRef<T extends HTMLElement = HTMLElement> = RefObject<DOMRefValue<T> | null>;

export interface FocusableRefValue<T extends HTMLElement = HTMLElement> extends DOMRefValue<T> {
  focus: () => void
}

export type FocusableRef<T extends HTMLElement = HTMLElement> = RefObject<FocusableRefValue<T> | null>;

export function createDOMRef<T extends HTMLElement = HTMLElement>(ref: RefObject<T | null>): DOMRefValue<T> {
  return {
    UNSAFE_getDOMNode() {
      return ref.current;
    }
  };
}

export function createFocusableRef<T extends HTMLElement = HTMLElement>(
  domRef: RefObject<T | null>,
  focusableRef: RefObject<FocusableElement | null> = domRef as unknown as RefObject<FocusableElement | null>
): FocusableRefValue<T> {
  return {
    ...createDOMRef(domRef),
    focus() {
      focusableRef.current?.focus();
    }
  };
}

export function useDOMRef<T extends HTMLElement = HTMLElement>(ref: DOMRef<T>): RefObject<T | null> {
  let domRef: RefObject<T | null> = {
    current: null
  };

  ref.current = createDOMRef(domRef);
  return domRef;
}

export function useFocusableRef<T extends HTMLElement = HTMLElement>(
  ref: FocusableRef<T>,
  focusableRef?: RefObject<FocusableElement | null>
): RefObject<T | null> {
  let domRef: RefObject<T | null> = {
    current: null
  };

  ref.current = createFocusableRef(domRef, focusableRef ?? (domRef as unknown as RefObject<FocusableElement | null>));
  return domRef;
}

export function unwrapDOMRef<T extends HTMLElement>(
  ref: RefObject<DOMRefValue<T> | null>
): RefObject<T | null> {
  return {
    get current() {
      return ref.current?.UNSAFE_getDOMNode() ?? null;
    }
  };
}

export function useUnwrapDOMRef<T extends HTMLElement>(
  ref: RefObject<DOMRefValue<T> | null>
): RefObject<T | null> {
  return unwrapDOMRef(ref);
}
