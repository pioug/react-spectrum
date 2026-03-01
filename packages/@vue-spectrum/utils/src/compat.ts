import {
  createFocusableRef as createFocusableRefInternal,
  type DOMRef,
  type DOMRefValue,
  type FocusableElement,
  type FocusableRef,
  type FocusableRefValue,
  type RefObject,
  unwrapDOMRef as unwrapDOMRefInternal,
  useFocusableRef as useFocusableRefInternal,
  useUnwrapDOMRef as useUnwrapDOMRefInternal
} from './useDOMRef';
import {computed, defineComponent, inject, provide, type ComputedRef, type InjectionKey, type PropType} from 'vue';
import {useResizeObserver as useAriaResizeObserver, useValueEffect as useAriaValueEffect} from '@vue-aria/utils';

type AnyRecord = Record<string, unknown>;
type Direction = 'ltr' | 'rtl';
type Breakpoint = 'base' | 'S' | 'M' | 'L' | string;
type Responsive<T> = T | Record<string, T | undefined>;
type DimensionValue = number | string | null | undefined;
type CSSProperties = Record<string, unknown>;
type HTMLAttributes<T = unknown> = Record<string, unknown> & {
  __elementType__?: T
};
type ViewStyleProps<C extends ColorVersion = ColorVersion> = AnyRecord & {
  UNSAFE_className?: string,
  UNSAFE_style?: Record<string, unknown>,
  colorVersion?: C,
  isHidden?: Responsive<boolean>
};
type ColorVersion = number;
type ReactNode = unknown;
type ReactElement<P = any, T = any> = {
  props?: P,
  type?: T
};
type JSXElementConstructor<P> = (props: P) => unknown;
type SlotProps = {
  slot?: string
};
type Breakpoints = {
  [custom: string]: number | undefined
};
type BreakpointContext = {
  matchedBreakpoints: string[]
};
type SetValueAction<S> = (prev: S) => Generator<S, void, unknown>;
type Dispatch<T> = (value: T) => void;
type useResizeObserverOptionsType<T extends Element> = {
  ref: RefObject<T | undefined | null> | undefined,
  box?: ResizeObserverBoxOptions,
  onResize: () => void
};

type StyleName = string | string[] | ((dir: Direction) => string);
type StyleHandler = (value: any, colorVersion?: number) => string | undefined;
export interface StyleHandlers {
  [key: string]: [StyleName, StyleHandler]
}

const breakpointContextKey: InjectionKey<ComputedRef<BreakpointContext>> = Symbol('vue-spectrum-breakpoint-context');

export const baseStyleProps: StyleHandlers = {
  margin: ['margin', dimensionValue]
};

export const viewStyleProps: StyleHandlers = {
  ...baseStyleProps,
  backgroundColor: ['backgroundColor', passthroughStyle],
  borderColor: ['borderColor', passthroughStyle],
  padding: ['padding', dimensionValue]
};

export function getWrappedElement(children: string | ReactElement | ReactNode): ReactElement<any, JSXElementConstructor<any>> {
  if (typeof children === 'string') {
    return {
      type: ((props: {children?: ReactNode}) => props.children) as JSXElementConstructor<any>,
      props: {
        children
      }
    };
  }

  return children as ReactElement<any, JSXElementConstructor<any>>;
}

export function createFocusableRef<T extends HTMLElement = HTMLElement>(
  domRef: RefObject<T | null>,
  focusableRef: RefObject<FocusableElement | null> = domRef as unknown as RefObject<FocusableElement | null>
): FocusableRefValue<T> {
  return createFocusableRefInternal(domRef, focusableRef);
}

export function useFocusableRef<T extends HTMLElement = HTMLElement>(
  ref: FocusableRef<T>,
  focusableRef?: RefObject<FocusableElement | null>
): RefObject<T | null> {
  return useFocusableRefInternal(ref, focusableRef);
}

export function useUnwrapDOMRef<T extends HTMLElement>(
  ref: RefObject<DOMRefValue<T> | null>
): RefObject<T | null> {
  return useUnwrapDOMRefInternal(ref);
}

export function dimensionValue(value: DimensionValue): string | undefined {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (!value) {
    return undefined;
  }

  return String(value);
}

export function responsiveDimensionValue(value: Responsive<DimensionValue>, matchedBreakpoints: Breakpoint[]): string | undefined {
  let responsiveValue = getResponsiveProp(value, matchedBreakpoints);
  if (responsiveValue != null) {
    return dimensionValue(responsiveValue);
  }
}

export function convertStyleProps<C extends ColorVersion>(
  props: ViewStyleProps<C>,
  handlers: StyleHandlers,
  direction: Direction,
  matchedBreakpoints: Breakpoint[]
): CSSProperties {
  let style: CSSProperties = {};
  for (let key in props) {
    let styleProp = handlers[key];
    if (!styleProp || props[key] == null) {
      continue;
    }

    let [name, convert] = styleProp;
    if (typeof name === 'function') {
      name = name(direction);
    }

    let value = convert(getResponsiveProp(props[key], matchedBreakpoints), props.colorVersion);
    if (Array.isArray(name)) {
      for (let namePart of name) {
        style[namePart] = value;
      }
    } else {
      style[name] = value;
    }
  }

  return style;
}

type StylePropsOptions = {
  matchedBreakpoints?: Breakpoint[]
};

type StyleProps = {
  UNSAFE_className?: string,
  UNSAFE_style?: AnyRecord,
  isHidden?: Responsive<boolean>,
  [key: string]: unknown
};

export function useStyleProps<T extends StyleProps>(
  props: T,
  handlers: StyleHandlers = baseStyleProps,
  options: StylePropsOptions = {}
): {styleProps: HTMLAttributes<HTMLElement>} {
  let breakpointContext = useBreakpoint();
  let matchedBreakpoints = options.matchedBreakpoints ?? breakpointContext?.matchedBreakpoints ?? ['base'];
  let style = {
    ...(props.UNSAFE_style ?? {}),
    ...convertStyleProps(props as ViewStyleProps, handlers, 'ltr', matchedBreakpoints)
  };

  if ((props as AnyRecord).className && process.env.NODE_ENV !== 'production') {
    console.warn(
      'The className prop is unsafe and is unsupported in React Spectrum v3. ' +
      'Please use style props with Spectrum variables, or UNSAFE_className if you absolutely must do something custom. ' +
      'Note that this may break in future versions due to DOM structure changes.'
    );
  }

  if ((props as AnyRecord).style && process.env.NODE_ENV !== 'production') {
    console.warn(
      'The style prop is unsafe and is unsupported in React Spectrum v3. ' +
      'Please use style props with Spectrum variables, or UNSAFE_style if you absolutely must do something custom. ' +
      'Note that this may break in future versions due to DOM structure changes.'
    );
  }

  let styleProps: HTMLAttributes<HTMLElement> = {
    style,
    className: props.UNSAFE_className
  };

  if (getResponsiveProp(props.isHidden, matchedBreakpoints)) {
    styleProps.hidden = true;
  }

  return {
    styleProps
  };
}

export function passthroughStyle<T>(value: T): T {
  return value;
}

export function getResponsiveProp<T>(prop: Responsive<T>, matchedBreakpoints: Breakpoint[]): T | undefined {
  if (prop && typeof prop === 'object' && !Array.isArray(prop)) {
    let responsiveValue = prop as Record<string, T | undefined>;
    for (let breakpoint of matchedBreakpoints) {
      if (responsiveValue[breakpoint] != null) {
        return responsiveValue[breakpoint];
      }
    }

    return responsiveValue.base;
  }

  return prop as T;
}

export function useSlotProps<T>(props: T & {id?: string}, defaultSlot?: string): T {
  let slot = (props as T & SlotProps).slot ?? defaultSlot;
  return {
    ...props,
    slot
  } as T;
}

export function cssModuleToSlots(cssModule: {[cssmodule: string]: string}): {[slot: string]: {UNSAFE_className: string}} {
  let slots: {[slot: string]: {UNSAFE_className: string}} = {};
  for (let [slot, className] of Object.entries(cssModule)) {
    slots[slot] = {
      UNSAFE_className: className
    };
  }

  return slots;
}

export function useHasChild(query: string, ref: RefObject<HTMLElement | null>): boolean {
  return Boolean(ref.current?.querySelector(query));
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
  props: {
    matchedBreakpoints: {
      type: Array as PropType<string[]>,
      default: () => ['base']
    }
  },
  setup(props, {slots}) {
    provide(breakpointContextKey, computed(() => ({
      matchedBreakpoints: props.matchedBreakpoints
    })));

    return () => slots.default ? slots.default() : null;
  }
});

export function useMatchedBreakpoints(breakpoints: Breakpoints): string[] {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return ['base'];
  }

  let entries = Object.entries(breakpoints)
    .filter(([, value]) => typeof value === 'number')
    .sort(([, valueA], [, valueB]) => (valueB as number) - (valueA as number));

  let matchedBreakpoints: string[] = [];
  for (let [name, value] of entries) {
    if (window.matchMedia(`(min-width: ${value}px)`).matches) {
      matchedBreakpoints.push(name);
    }
  }

  matchedBreakpoints.push('base');
  return matchedBreakpoints;
}

export function useBreakpoint(): BreakpointContext | null {
  let context = inject(breakpointContextKey, null);
  return context?.value ?? null;
}

export function useResizeObserver<T extends Element>(options: useResizeObserverOptionsType<T>): void {
  useAriaResizeObserver(options);
}

export function useValueEffect<S>(defaultValue: S | (() => S)): [S, Dispatch<SetValueAction<S>>] {
  return useAriaValueEffect(defaultValue);
}

export const unwrapDOMRef = unwrapDOMRefInternal;
export type {DOMRef};
