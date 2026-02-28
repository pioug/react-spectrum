import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';
import {useControlledState} from '@vue-stately/utils';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface AutocompleteState {
  focusedNodeId: Ref<string | null>,
  inputValue: Readonly<Ref<string>>,
  setFocusedNodeId: (value: string | null) => void,
  setInputValue: (value: string) => void
}

export interface AutocompleteStateOptions {
  defaultInputValue?: MaybeRef<string | undefined>,
  inputValue?: MaybeRef<string | undefined>,
  onInputChange?: (value: string) => void
}

/**
 * Provides state management for Vue autocomplete experiences.
 */
export function useAutocompleteState(options: AutocompleteStateOptions = {}): AutocompleteState {
  let focusedNodeId = ref<string | null>(null);
  let controlledInputValue = options.inputValue === undefined
    ? undefined
    : computed<string | undefined>(() => unref(options.inputValue));
  let [inputValue, setInputValueInternal] = useControlledState(
    controlledInputValue,
    unref(options.defaultInputValue) ?? '',
    options.onInputChange
  );

  let setInputValue = (value: string): void => {
    setInputValueInternal(value);
  };

  let setFocusedNodeId = (value: string | null): void => {
    focusedNodeId.value = value;
  };

  return {
    inputValue,
    setInputValue,
    focusedNodeId,
    setFocusedNodeId
  };
}
