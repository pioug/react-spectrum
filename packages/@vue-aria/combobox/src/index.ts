import {
  type ComboBoxItem,
  useComboBox as useComboBoxInternal,
  type AriaComboBoxOptions as VueAriaComboBoxOptions,
  type ComboBoxAria as VueComboBoxAria
} from './useComboBox';
import type {ComboBoxState as VueComboBoxState} from '@vue-stately/combobox';

type SelectionMode = 'multiple' | 'single';
type ComboBoxState<T, M extends SelectionMode = 'single'> = VueComboBoxState & {
  _itemType?: T,
  _selectionMode?: M
};

export type AriaComboBoxOptions<T = unknown, M extends SelectionMode = 'single'> = VueAriaComboBoxOptions & {
  _itemType?: T,
  _selectionMode?: M
};
export type ComboBoxAria<T = unknown> = VueComboBoxAria & {
  _itemType?: T
};
export type {ComboBoxItem};
export type {AriaComboBoxProps} from '@vue-types/combobox';

export function useComboBox<T, M extends SelectionMode = 'single'>(
  props: AriaComboBoxOptions<T, M>,
  state: ComboBoxState<T, M>
): ComboBoxAria<T>;
export function useComboBox(
  options: VueAriaComboBoxOptions,
  state?: ComboBoxState<unknown, SelectionMode>
): VueComboBoxAria {
  void state;
  return useComboBoxInternal(options);
}
