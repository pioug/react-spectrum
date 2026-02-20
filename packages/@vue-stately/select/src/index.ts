import {
  useSelectState as useSelectStateInternal,
  type FocusStrategy,
  type SelectSelectionMode,
  type SelectState as VueSelectState,
  type SelectStateOptions as VueSelectStateOptions
} from './useSelectState';
import type {SelectProps} from '@react-types/select';

type SelectionMode = SelectSelectionMode;

export type SelectStateOptions<T, M extends SelectionMode = 'single'> = VueSelectStateOptions<T, M>;
export type SelectState<T, M extends SelectionMode = 'single'> = VueSelectState<T, M>;
export type {FocusStrategy};
export type {SelectProps} from '@react-types/select';

export function useSelectState<T extends object, M extends SelectionMode = 'single'>(
  props: SelectStateOptions<T, M>
): SelectState<T, M>;
export function useSelectState<T extends object, M extends SelectionMode = 'single'>(
  options: VueSelectStateOptions<T, M>
): VueSelectState<T, M> {
  return useSelectStateInternal(options);
}
