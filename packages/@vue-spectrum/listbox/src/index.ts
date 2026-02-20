import {VueListBox} from '@vue-spectrum/components';

export const ListBox = VueListBox;
export const ListBoxBase = VueListBox;
export const Item = VueListBox;
export const Section = VueListBox;
export {VueListBox};

export type SpectrumListBoxProps<T = unknown> = Record<string, unknown> & {
  item?: T
};

export type ListBoxLayout<T = unknown> = {
  layout: 'stack'
  _itemType?: T
};

export function useListBoxLayout<T>(): ListBoxLayout<T> {
  return {
    layout: 'stack'
  } as ListBoxLayout<T>;
}
