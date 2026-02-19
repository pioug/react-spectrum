import {type AriaAutocompleteOptions, type AutocompleteAria, useAutocomplete} from './useAutocomplete';
import {computed, type ComputedRef, type Ref} from 'vue';

export interface AriaSearchAutocompleteOptions extends Omit<AriaAutocompleteOptions, 'inputValue'> {
  inputValue: Ref<string>,
  onClear?: () => void,
  onSubmit?: (value: string, focusedKey: string | null) => void
}

export interface SearchAutocompleteAria extends AutocompleteAria {
  clear: () => void,
  clearButtonProps: ComputedRef<{
    'aria-label': string,
    disabled: boolean
  }>,
  submit: () => void
}

export function useSearchAutocomplete(options: AriaSearchAutocompleteOptions): SearchAutocompleteAria {
  let autocomplete = useAutocomplete({
    ...options,
    inputValue: options.inputValue
  });

  let clear = () => {
    options.inputValue.value = '';
    options.onClear?.();
  };

  let submit = () => {
    options.onSubmit?.(options.inputValue.value, autocomplete.focusedKey.value);
  };

  let clearButtonProps = computed(() => ({
    disabled: options.inputValue.value.length === 0,
    'aria-label': 'Clear search'
  }));

  return {
    ...autocomplete,
    clear,
    clearButtonProps,
    submit
  };
}
