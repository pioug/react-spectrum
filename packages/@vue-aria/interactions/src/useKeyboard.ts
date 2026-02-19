import {computed, type ComputedRef, unref} from 'vue';
import {createEventHandler} from './createEventHandler';
import type {MaybeRef} from './types';

export interface KeyboardProps {
  isDisabled?: MaybeRef<boolean>,
  onKeyDown?: (event: KeyboardEvent) => void,
  onKeyUp?: (event: KeyboardEvent) => void
}

export interface KeyboardDOMProps {
  onKeyDown?: (event: KeyboardEvent) => void,
  onKeyUp?: (event: KeyboardEvent) => void
}

export interface KeyboardResult {
  keyboardProps: ComputedRef<KeyboardDOMProps>
}

export function useKeyboard(props: KeyboardProps = {}): KeyboardResult {
  let isDisabled = computed(() => Boolean(unref(props.isDisabled)));

  return {
    keyboardProps: computed<KeyboardDOMProps>(() => {
      if (isDisabled.value) {
        return {};
      }

      return {
        onKeyDown: createEventHandler(props.onKeyDown),
        onKeyUp: createEventHandler(props.onKeyUp)
      };
    })
  };
}
