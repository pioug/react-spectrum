import {type AriaSearchFieldOptions, type SearchFieldAria, useSearchField as useSearchFieldInternal} from './useSearchField';
import type {AriaSearchFieldProps} from '@vue-types/searchfield';
import type {SearchFieldState} from '@vue-stately/searchfield';

type RefObject<T> = {
  current: T
};

export type {AriaSearchFieldOptions, SearchFieldAria};
export type {MaybeRef} from './types';
export type {AriaSearchFieldProps} from '@vue-types/searchfield';

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
