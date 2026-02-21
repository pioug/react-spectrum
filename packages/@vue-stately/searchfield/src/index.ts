import type {SearchFieldProps} from '@vue-types/searchfield';
import {type SearchFieldState, type SearchFieldStateOptions, useSearchFieldState as useSearchFieldStateInternal} from './useSearchFieldState';

export type {SearchFieldState, SearchFieldStateOptions};
export type {SearchFieldProps} from '@vue-types/searchfield';

export function useSearchFieldState(props: SearchFieldProps): SearchFieldState;
export function useSearchFieldState(options: SearchFieldStateOptions = {}): SearchFieldState {
  return useSearchFieldStateInternal(options);
}
