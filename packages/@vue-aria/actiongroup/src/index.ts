import {useActionGroup as useActionGroupInternal, type ActionGroupAria, type ActionGroupOptions, type ActionGroupSelectionMode} from './useActionGroup';
import {useActionGroupItem as useActionGroupItemInternal, type ActionGroupItemAria, type AriaActionGroupItemProps} from './useActionGroupItem';
import type {AriaActionGroupProps} from '@react-types/actiongroup';
import type {ListState as VueListState} from '@vue-stately/list';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;
type ListState<T> = VueListState<T>;

export type {ActionGroupAria, ActionGroupOptions, ActionGroupSelectionMode, ActionGroupItemAria, AriaActionGroupItemProps};
export type {AriaActionGroupProps};

export function useActionGroup<T>(
  props: AriaActionGroupProps<T>,
  state: ListState<T>,
  ref: RefObject<FocusableElement | null>
): ActionGroupAria;
export function useActionGroup(options?: ActionGroupOptions): ActionGroupAria;
export function useActionGroup(options?: ActionGroupOptions): ActionGroupAria {
  return useActionGroupInternal(options);
}

export function useActionGroupItem<T>(
  props: AriaActionGroupItemProps,
  state: ListState<T>,
  ref: RefObject<FocusableElement | null>
): ActionGroupItemAria;
export function useActionGroupItem(props: AriaActionGroupItemProps): ActionGroupItemAria;
export function useActionGroupItem(props: AriaActionGroupItemProps): ActionGroupItemAria {
  return useActionGroupItemInternal(props);
}
