import {useSearchField as useSearchFieldInternal, type AriaSearchFieldOptions, type SearchFieldAria} from './useSearchField';
import type {AriaSearchFieldProps} from '@react-types/searchfield';
import type {SearchFieldState} from '@vue-stately/searchfield';

type RefObject<T> = {
  current: T
};

export type {AriaSearchFieldOptions, SearchFieldAria};
export type {MaybeRef} from './types';
export type {AriaSearchFieldProps} from '@react-types/searchfield';

export function useSearchField(
  props: AriaSearchFieldProps,
  state: SearchFieldState,
  inputRef: RefObject<HTMLInputElement | null>
): SearchFieldAria;
export function useSearchField(
  options: AriaSearchFieldOptions = {},
  state?: SearchFieldState,
  inputRef?: RefObject<HTMLInputElement | null>
): SearchFieldAria {
  void state;
  void inputRef;
  return useSearchFieldInternal(options);
}
