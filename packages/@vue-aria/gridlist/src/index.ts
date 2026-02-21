import {type AriaGridListItemOptions, type GridListItemAria, useGridListItem as useGridListItemInternal} from './useGridListItem';
import {type AriaGridListSectionProps, type GridListSectionAria, useGridListSection as useGridListSectionInternal} from './useGridListSection';
import {
  type AriaGridListSelectionCheckboxProps,
  type GridListSelectionCheckboxAria,
  useGridListSelectionCheckbox as useGridListSelectionCheckboxInternal
} from './useGridListSelectionCheckbox';
import {computed} from 'vue';
import {
  type GridListAria,
  useGridList as useGridListInternal,
  type AriaGridListOptions as VueAriaGridListOptions,
  type AriaGridListProps as VueAriaGridListProps
} from './useGridList';
import type {GridListCollection, GridListItemNode, MaybeRef} from './types';
import type {
  AriaGridSelectionCheckboxProps as ReactAriaGridSelectionCheckboxProps,
  GridSelectionCheckboxAria as ReactGridSelectionCheckboxAria
} from '@vue-aria/grid';
import type {ListState as VueListState} from '@vue-stately/list';
import type {TreeState as VueTreeState} from '@vue-stately/tree';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;
type ListState<T> = VueListState<T>;
type TreeState<T> = VueTreeState<T>;
type AriaGridSelectionCheckboxProps = ReactAriaGridSelectionCheckboxProps;
type GridSelectionCheckboxAria = ReactGridSelectionCheckboxAria;

export type AriaGridListProps<T = unknown> = VueAriaGridListProps;
export type AriaGridListOptions<T = unknown> = VueAriaGridListOptions;
export type GridListProps<T = unknown> = AriaGridListOptions<T>;

export type {
  GridListAria,
  AriaGridListItemOptions,
  GridListItemAria,
  AriaGridListSectionProps,
  GridListSectionAria,
  AriaGridListSelectionCheckboxProps,
  GridListSelectionCheckboxAria,
  GridListCollection,
  GridListItemNode,
  MaybeRef
};
export type {
  AriaGridSelectionCheckboxProps,
  GridSelectionCheckboxAria
};

export function useGridList<T>(
  props: AriaGridListOptions<T>,
  state: ListState<T>,
  ref: RefObject<HTMLElement | null>
): GridListAria;
export function useGridList(options: VueAriaGridListOptions): GridListAria;
export function useGridList(options: VueAriaGridListOptions): GridListAria {
  return useGridListInternal(options);
}

export function useGridListItem<T>(
  props: AriaGridListItemOptions,
  state: ListState<T> | TreeState<T>,
  ref: RefObject<FocusableElement | null>
): GridListItemAria;
export function useGridListItem(options: AriaGridListItemOptions): GridListItemAria;
export function useGridListItem(options: AriaGridListItemOptions): GridListItemAria {
  return useGridListItemInternal(options);
}

export function useGridListSelectionCheckbox<T>(
  props: AriaGridSelectionCheckboxProps,
  state: ListState<T>
): GridSelectionCheckboxAria;
export function useGridListSelectionCheckbox(
  props: AriaGridSelectionCheckboxProps | AriaGridListSelectionCheckboxProps,
  state?: ListState<unknown>
): GridSelectionCheckboxAria {
  if (state) {
    let key = (props as ReactAriaGridSelectionCheckboxProps).key;

    return {
      checkboxProps: computed(() => ({
        'aria-label': 'Select row',
        checked: state.selectionManager.isSelected(key),
        disabled: state.selectionManager.isDisabled(key)
      })),
      toggleSelection: () => {
        state.selectionManager.toggleSelection(key);
      }
    };
  }

  return useGridListSelectionCheckboxInternal(props as AriaGridListSelectionCheckboxProps) as unknown as GridSelectionCheckboxAria;
}

export function useGridListSection<T>(
  props: AriaGridListSectionProps,
  state: ListState<T>,
  ref: RefObject<HTMLElement | null>
): GridListSectionAria;
export function useGridListSection(props?: AriaGridListSectionProps): GridListSectionAria;
export function useGridListSection(props: AriaGridListSectionProps = {}): GridListSectionAria {
  return useGridListSectionInternal(props);
}
