import {useAutocomplete as useAutocompleteInternal, type AriaAutocompleteOptions as VueAriaAutocompleteOptions, type AutocompleteAria as VueAutocompleteAria, type AutocompleteItem, type AutocompleteItemInput} from './useAutocomplete';
import {useSearchAutocomplete as useSearchAutocompleteInternal, type AriaSearchAutocompleteOptions as VueAriaSearchAutocompleteOptions, type SearchAutocompleteAria as VueSearchAutocompleteAria} from './useSearchAutocomplete';
import type {AutocompleteState} from '@vue-stately/autocomplete';
import type {ComboBoxState} from '@vue-stately/combobox';

export type AriaAutocompleteOptions<T = unknown> = VueAriaAutocompleteOptions;
export type AriaSearchAutocompleteOptions<T = unknown> = VueAriaSearchAutocompleteOptions;
export type AutocompleteAria<T = unknown> = VueAutocompleteAria;
export type SearchAutocompleteAria<T = unknown> = VueSearchAutocompleteAria;
export type {
  AutocompleteItem,
  AutocompleteItemInput
};
export type {
  AriaAutocompleteOptions as AriaAutocompleteProps,
  AriaAutocompleteOptions as CollectionOptions
};
export type {AriaSearchAutocompleteOptions as AriaSearchAutocompleteProps};
export type {AutocompleteAria as InputProps};

export function useAutocomplete<T>(
  options: AriaAutocompleteOptions<T>,
  state: AutocompleteState
): AutocompleteAria<T>;
export function useAutocomplete(options: VueAriaAutocompleteOptions): VueAutocompleteAria;
export function useAutocomplete(options: VueAriaAutocompleteOptions): VueAutocompleteAria {
  return useAutocompleteInternal(options);
}

export function useSearchAutocomplete<T>(
  options: AriaSearchAutocompleteOptions<T>,
  state: ComboBoxState<T>
): SearchAutocompleteAria<T>;
export function useSearchAutocomplete(options: VueAriaSearchAutocompleteOptions): VueSearchAutocompleteAria;
export function useSearchAutocomplete(options: VueAriaSearchAutocompleteOptions): VueSearchAutocompleteAria {
  return useSearchAutocompleteInternal(options);
}
