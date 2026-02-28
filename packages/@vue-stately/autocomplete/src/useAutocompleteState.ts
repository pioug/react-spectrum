import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';

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
  let uncontrolledInputValue = ref(unref(options.defaultInputValue) ?? '');
  let focusedNodeId = ref<string | null>(null);
  let isControlled = computed(() => options.inputValue !== undefined && unref(options.inputValue) !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let inputValue = computed(() => {
    if (isControlled.value) {
      return unref(options.inputValue) ?? '';
    }

    return uncontrolledInputValue.value;
  });

  let setInputValue = (value: string): void => {
    if (inputValue.value === value) {
      return;
    }

    if (!isControlled.value) {
      uncontrolledInputValue.value = value;
    }

    options.onInputChange?.(value);
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
