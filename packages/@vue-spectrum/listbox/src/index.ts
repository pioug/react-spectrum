import {VueListBox} from '@vue-spectrum/components';

export const ListBox = VueListBox;
export const ListBoxBase = VueListBox;
export const Item = VueListBox;
export const Section = VueListBox;
export {VueListBox};

export type SpectrumListBoxProps<T = unknown> = Record<string, unknown> & {
  item?: T
};

export function useListBoxLayout() {
  return {
    layout: 'stack'
  } as const;
}
