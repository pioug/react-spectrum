import {useSearchFieldState as useSearchFieldStateInternal, type SearchFieldState, type SearchFieldStateOptions} from './useSearchFieldState';
import type {SearchFieldProps} from '@react-types/searchfield';

export type {SearchFieldState, SearchFieldStateOptions};
export type {SearchFieldProps} from '@react-types/searchfield';

export function useSearchFieldState(props: SearchFieldProps): SearchFieldState;
export function useSearchFieldState(options: SearchFieldStateOptions = {}): SearchFieldState {
  return useSearchFieldStateInternal(options);
}
