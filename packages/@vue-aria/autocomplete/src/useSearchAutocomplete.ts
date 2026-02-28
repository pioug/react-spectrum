import {type AriaAutocompleteOptions, type AutocompleteAria, useAutocomplete} from './useAutocomplete';
import {computed, type ComputedRef, type Ref, unref} from 'vue';

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
    if (autocomplete.focusedKey.value === null) {
      options.onSubmit?.(options.inputValue.value, null);
    }
  };

  let clearButtonProps = computed(() => ({
    disabled: Boolean(unref(options.disabled)),
    'aria-label': 'Clear search'
  }));

  return {
    ...autocomplete,
    clear,
    clearButtonProps,
    submit
  };
}
