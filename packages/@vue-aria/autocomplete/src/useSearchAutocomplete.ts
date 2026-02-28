import {type AriaAutocompleteOptions, type AutocompleteAria, useAutocomplete} from './useAutocomplete';
import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';

export interface AriaSearchAutocompleteOptions extends Omit<AriaAutocompleteOptions, 'inputValue'> {
  inputRef?: Ref<HTMLInputElement | null>,
  inputValue: Ref<string>,
  onClear?: () => void,
  onSubmit?: (value: string, focusedKey: string | null) => void
}

export interface SearchAutocompleteAria extends AutocompleteAria {
  clear: () => void,
  clearButtonProps: ComputedRef<{
    'aria-label': string,
    disabled: boolean,
    onClick: () => void,
    onMouseDown: (event: MouseEvent) => void,
    onPointerDown: (event: PointerEvent) => void,
    onTouchStart: (event: TouchEvent) => void,
    tabIndex: -1
  }>,
  submit: () => void
}

export function useSearchAutocomplete(options: AriaSearchAutocompleteOptions): SearchAutocompleteAria {
  let inputRef = options.inputRef ?? ref<HTMLInputElement | null>(null);

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

  let focusInputWithoutBlurring = (event: Event) => {
    event.preventDefault();
    inputRef.value?.focus();
  };

  let clearButtonProps = computed(() => ({
    disabled: Boolean(unref(options.disabled)),
    'aria-label': 'Clear search',
    tabIndex: -1 as const,
    onClick: clear,
    onMouseDown: focusInputWithoutBlurring,
    onPointerDown: focusInputWithoutBlurring,
    onTouchStart: focusInputWithoutBlurring
  }));

  return {
    ...autocomplete,
    clear,
    clearButtonProps,
    submit
  };
}
