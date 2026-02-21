import type {SelectionMode} from '@vue-types/shared';
import {
  useComboBoxState as useComboBoxStateInternal,
  type ComboBoxState as VueComboBoxState,
  type ComboBoxStateOptions as VueComboBoxStateOptions,
  type StatelyComboBoxState as VueStatelyComboBoxState
} from './useComboBoxState';

export type ComboBoxStateOptions<T extends object, M extends SelectionMode = 'single'> = VueComboBoxStateOptions & {
  _itemType?: T,
  _selectionMode?: M
};
export type ComboBoxState<T extends object> = VueComboBoxState & {
  _itemType?: T
};
export type StatelyComboBoxState = VueStatelyComboBoxState;

export function useComboBoxState<T extends object, M extends SelectionMode = 'single'>(
  props: ComboBoxStateOptions<T, M>
): ComboBoxState<T>;
export function useComboBoxState(options: VueComboBoxStateOptions): VueStatelyComboBoxState {
  return useComboBoxStateInternal(options);
}
