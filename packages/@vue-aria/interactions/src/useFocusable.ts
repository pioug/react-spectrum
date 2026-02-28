import {computed, nextTick, type ComputedRef, unref} from 'vue';
import {createEventHandler} from './createEventHandler';
import {useFocusableRoleWarnings} from './interactiveRoleWarnings';
import type {FocusableElement, MaybeRef} from './types';
import {type FocusProps, useFocus} from './useFocus';
import {focusSafely} from './focusSafely';
import {type KeyboardProps, useKeyboard} from './useKeyboard';

export interface FocusableOptions<T extends FocusableElement = FocusableElement> extends FocusProps<T>, KeyboardProps {
  autoFocus?: MaybeRef<boolean>,
  excludeFromTabOrder?: MaybeRef<boolean>,
  isDisabled?: MaybeRef<boolean>
}

export interface FocusableProviderProps {
  onBlur?: (event: FocusEvent) => void,
  onFocus?: (event: FocusEvent) => void,
  onKeyDown?: (event: KeyboardEvent) => void,
  onKeyUp?: (event: KeyboardEvent) => void
}

export interface FocusableDOMProps extends FocusableProviderProps {
  tabindex?: number
}

export interface FocusableAria {
  focusableProps: ComputedRef<FocusableDOMProps>
}

type RefObject<T> = {current: T};

interface FocusableContextValue extends FocusableProviderProps {
  ref?: FocusableElement | null
}

export let FocusableContext: FocusableContextValue | null = null;

export function FocusableProvider(props: FocusableProviderProps = {}): () => void {
  let previousContext = FocusableContext;
  FocusableContext = {
    ...props
  };

  return () => {
    FocusableContext = previousContext;
  };
}

function resolveFocusableElement(
  domRef: MaybeRef<FocusableElement | null> | RefObject<FocusableElement | null> | undefined
): FocusableElement | null {
  if (!domRef) {
    return null;
  }

  let maybeRefObject = domRef as RefObject<FocusableElement | null>;
  if (typeof maybeRefObject === 'object' && maybeRefObject !== null && 'current' in maybeRefObject) {
    return maybeRefObject.current ?? null;
  }

  return (unref(domRef as MaybeRef<FocusableElement | null>) ?? null) as FocusableElement | null;
}

export function useFocusable<T extends FocusableElement = FocusableElement>(
  props: FocusableOptions<T>,
  domRef: RefObject<FocusableElement | null>
): FocusableAria;
export function useFocusable<T extends FocusableElement = FocusableElement>(
  props?: FocusableOptions<T>,
  domRef?: MaybeRef<FocusableElement | null>
): FocusableAria;
export function useFocusable<T extends FocusableElement = FocusableElement>(
  props: FocusableOptions<T> = {},
  domRef?: MaybeRef<FocusableElement | null> | RefObject<FocusableElement | null>
): FocusableAria {
  let {focusProps} = useFocus(props);
  let {keyboardProps} = useKeyboard(props);
  let shouldAutoFocus = unref(props.autoFocus) === true;

  if (shouldAutoFocus) {
    nextTick(() => {
      let element = resolveFocusableElement(domRef);
      if (element) {
        focusSafely(element);
      }
    });
  }

  let tabIndex = computed(() => {
    if (unref(props.isDisabled) === true) {
      return undefined;
    }

    return unref(props.excludeFromTabOrder) === true ? -1 : 0;
  });

  return {
    focusableProps: computed<FocusableDOMProps>(() => {
      let context = unref(props.isDisabled) === true ? null : FocusableContext;
      let focus = focusProps.value;
      let keyboard = keyboardProps.value;

      return {
        onBlur: createEventHandler(context?.onBlur, focus.onBlur),
        onFocus: createEventHandler(context?.onFocus, focus.onFocus),
        onKeyDown: createEventHandler(context?.onKeyDown, keyboard.onKeyDown),
        onKeyUp: createEventHandler(context?.onKeyUp, keyboard.onKeyUp),
        tabindex: tabIndex.value
      };
    })
  };
}

export interface FocusableComponentProps extends FocusableOptions {
  elementRef?: MaybeRef<FocusableElement | null>
}

export function Focusable(props: FocusableComponentProps = {}): FocusableAria {
  useFocusableRoleWarnings(props.elementRef, props.isDisabled);
  return useFocusable(props, props.elementRef);
}
