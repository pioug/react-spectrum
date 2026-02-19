import {computed, type ComputedRef, unref} from 'vue';
import {createEventHandler} from './createEventHandler';
import type {FocusableElement, MaybeRef} from './types';
import {type FocusProps, useFocus} from './useFocus';
import {focusSafely} from './focusSafely';
import {type KeyboardProps, useKeyboard} from './useKeyboard';

export interface FocusableOptions extends FocusProps, KeyboardProps {
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

export function useFocusable(
  props: FocusableOptions = {},
  domRef?: MaybeRef<FocusableElement | null>
): FocusableAria {
  let {focusProps} = useFocus(props);
  let {keyboardProps} = useKeyboard(props);

  if (unref(props.autoFocus) === true) {
    let element = unref(domRef ?? null);
    if (element) {
      focusSafely(element);
    }
  }

  let tabIndex = computed(() => {
    if (unref(props.isDisabled) === true) {
      return undefined;
    }

    return unref(props.excludeFromTabOrder) === true ? -1 : 0;
  });

  return {
    focusableProps: computed<FocusableDOMProps>(() => {
      let context = FocusableContext;
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
  return useFocusable(props, props.elementRef);
}
