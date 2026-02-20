import {computed} from 'vue';
import {
  useGridList as useGridListInternal,
  type AriaGridListOptions as VueAriaGridListOptions,
  type AriaGridListProps as VueAriaGridListProps,
  type GridListAria
} from './useGridList';
import {useGridListItem as useGridListItemInternal, type AriaGridListItemOptions, type GridListItemAria} from './useGridListItem';
import {useGridListSection as useGridListSectionInternal, type AriaGridListSectionProps, type GridListSectionAria} from './useGridListSection';
import {
  useGridListSelectionCheckbox as useGridListSelectionCheckboxInternal,
  type AriaGridListSelectionCheckboxProps,
  type GridListSelectionCheckboxAria
} from './useGridListSelectionCheckbox';
import type {GridListCollection, GridListItemNode, MaybeRef} from './types';
import type {ListState as VueListState} from '@vue-stately/list';
import type {TreeState as VueTreeState} from '@vue-stately/tree';
import type {
  AriaGridSelectionCheckboxProps as ReactAriaGridSelectionCheckboxProps,
  GridSelectionCheckboxAria as ReactGridSelectionCheckboxAria
} from '@react-aria/grid';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;
type ListState<T> = VueListState<T>;
type TreeState<T> = VueTreeState<T>;

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
  ReactAriaGridSelectionCheckboxProps as AriaGridSelectionCheckboxProps,
  ReactGridSelectionCheckboxAria as GridSelectionCheckboxAria
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
  props: ReactAriaGridSelectionCheckboxProps,
  state: ListState<T>
): ReactGridSelectionCheckboxAria;
export function useGridListSelectionCheckbox(props: AriaGridListSelectionCheckboxProps): GridListSelectionCheckboxAria;
export function useGridListSelectionCheckbox(
  props: AriaGridListSelectionCheckboxProps | ReactAriaGridSelectionCheckboxProps,
  state?: ListState<unknown>
): GridListSelectionCheckboxAria | ReactGridSelectionCheckboxAria {
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

  return useGridListSelectionCheckboxInternal(props as AriaGridListSelectionCheckboxProps);
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
