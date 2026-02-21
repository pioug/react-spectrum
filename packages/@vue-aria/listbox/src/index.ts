import {type AriaOptionProps, type OptionAria, useOption as useOptionInternal} from './useOption';
import {getItemId, listData, type ListKey} from './utils';
import {type ListBoxAria, type ListBoxCollection, type ListBoxItemNode, type SelectionMode, useListBox as useListBoxInternal, type AriaListBoxOptions as VueAriaListBoxOptions} from './useListBox';
import type {Ref} from 'vue';
import type {ListState as VueListState} from '@vue-stately/list';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;
type ListState<T> = VueListState<T>;

export {getItemId, listData};
export {useListBoxSection} from './useListBoxSection';
export type {AriaListBoxSectionProps, ListBoxSectionAria} from './useListBoxSection';
export type {AriaListBoxProps} from '@vue-types/listbox';

export type AriaListBoxOptions<T = unknown> = VueAriaListBoxOptions;
export type {
  ListBoxAria,
  ListBoxCollection,
  ListBoxItemNode,
  SelectionMode,
  AriaOptionProps,
  OptionAria,
  ListKey
};

export function useListBox<T>(
  props: AriaListBoxOptions<T>,
  state: ListState<T>,
  ref: RefObject<HTMLElement | null>
): ListBoxAria;
export function useListBox(
  options: VueAriaListBoxOptions,
  collection: Parameters<typeof useListBoxInternal>[1],
  selectedKeys?: Ref<Set<ListKey>>
): ListBoxAria;
export function useListBox(
  options: VueAriaListBoxOptions,
  collection: Parameters<typeof useListBoxInternal>[1],
  selectedKeys?: Parameters<typeof useListBoxInternal>[2]
): ListBoxAria {
  return useListBoxInternal(options, collection, selectedKeys);
}

export function useOption<T>(
  props: AriaOptionProps,
  state: ListState<T>,
  ref: RefObject<FocusableElement | null>
): OptionAria;
export function useOption(props: AriaOptionProps, listBox: ListBoxAria): OptionAria;
export function useOption(props: AriaOptionProps, listBox: ListBoxAria): OptionAria {
  return useOptionInternal(props, listBox);
}
