import {computed} from 'vue';
import type {FocusableElement, MaybeRef} from './types';
import {useFocusable} from './useFocusable';
import {type PressDOMProps, type PressHookProps, type PressResult, usePress} from './usePress';

function chainHandlers<T extends (...args: any[]) => void>(first?: T, second?: T): T | undefined {
  if (!first) {
    return second;
  }

  if (!second) {
    return first;
  }

  return ((...args: Parameters<T>) => {
    first(...args);
    second(...args);
  }) as T;
}

export function Pressable(props: PressHookProps = {}): PressResult {
  let press = usePress(props);
  let focusable = useFocusable(props, props.ref as MaybeRef<FocusableElement | null>);

  return {
    isPressed: press.isPressed,
    pressProps: computed<PressDOMProps>(() => {
      let pressProps = press.pressProps.value;
      let focusableProps = focusable.focusableProps.value;

      return {
        ...focusableProps,
        ...pressProps,
        onBlur: chainHandlers(pressProps.onBlur, focusableProps.onBlur),
        onFocus: chainHandlers(pressProps.onFocus, focusableProps.onFocus),
        onKeyDown: chainHandlers(pressProps.onKeyDown, focusableProps.onKeyDown),
        onKeyUp: chainHandlers(pressProps.onKeyUp, focusableProps.onKeyUp),
        tabindex: focusableProps.tabindex
      };
    })
  };
}
