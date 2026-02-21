export type ReactText = string | number;
export type ReactChild = ReactElement | ReactText;
export type ReactNode = ReactChild | boolean | null | undefined | ReactNode[];
export type ElementType = string | JSXElementConstructor<any>;
export type JSXElementConstructor<P> = ((props: P) => unknown) | (new (props: P) => unknown);
export type CSSProperties = Record<string, unknown>;
export type AriaRole = string;
export interface AriaAttributes {
  [key: string]: unknown;
}
export interface DOMAttributes<T = Element> {
  [key: string]: unknown;
}
export interface HTMLAttributes<T = HTMLElement> extends DOMAttributes<T> {
  [key: string]: unknown;
}
export interface ButtonHTMLAttributes<T = HTMLButtonElement> extends HTMLAttributes<T> {}
export interface FormHTMLAttributes<T = HTMLFormElement> extends HTMLAttributes<T> {}
export interface LabelHTMLAttributes<T = HTMLLabelElement> extends HTMLAttributes<T> {}
export type HTMLAttributeAnchorTarget = string;
export type HTMLAttributeReferrerPolicy = string;
export interface MutableRefObject<T> {
  current: T;
}
export type RefCallback<T> = (instance: T | null) => void;
export type RefObject<T> = MutableRefObject<T | null>;
export type Ref<T> = RefCallback<T> | RefObject<T> | null;
export interface RefAttributes<T> {
  ref?: Ref<T>;
}
export interface ReactElement<P = any, T = any> {
  type: T;
  props: P;
  key?: string | number | null;
}
export interface SyntheticEvent<T = Element, E = Event> {
  nativeEvent: E;
  currentTarget: T;
  target: EventTarget | null;
  preventDefault(): void;
  stopPropagation(): void;
}
export interface UIEvent<T = Element, E = globalThis.UIEvent> extends SyntheticEvent<T, E> {}
export interface FocusEvent<T = Element> extends SyntheticEvent<T, globalThis.FocusEvent> {}
export interface MouseEvent<T = Element> extends SyntheticEvent<T, globalThis.MouseEvent> {}
export interface KeyboardEvent<T = Element> extends SyntheticEvent<T, globalThis.KeyboardEvent> {}
export type EventHandler<E extends SyntheticEvent<any, any>> = (event: E) => void;
export type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type ClipboardEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type CompositionEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type FormEvent<T = Element> = SyntheticEvent<T, Event>;
export type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
export type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
export type PointerEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type TouchEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type WheelEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type AnimationEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type TransitionEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
export namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}
