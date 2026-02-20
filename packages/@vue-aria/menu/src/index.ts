import {useMenuTrigger as useMenuTriggerInternal, type AriaMenuTriggerProps, type MenuTriggerAria as VueMenuTriggerAria} from './useMenuTrigger';
import {useMenu as useMenuInternal, type AriaMenuOptions as VueAriaMenuOptions, type MenuAria} from './useMenu';
import {useMenuItem as useMenuItemInternal, type AriaMenuItemProps, type MenuItemAria} from './useMenuItem';
import {useSubmenuTrigger as useSubmenuTriggerInternal, type AriaSubmenuTriggerProps, type SubmenuTriggerAria as VueSubmenuTriggerAria} from './useSubmenuTrigger';
import type {MenuTriggerState, SubmenuTriggerState} from '@vue-stately/menu';
import type {TreeState as VueTreeState} from '@vue-stately/tree';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;
type TreeState<T> = VueTreeState<T>;

export type MenuTriggerAria<T = unknown> = VueMenuTriggerAria;
export type AriaMenuOptions<T = unknown> = VueAriaMenuOptions;
export type SubmenuTriggerAria<T = unknown> = VueSubmenuTriggerAria;
export type {AriaMenuTriggerProps, MenuAria, AriaMenuItemProps, MenuItemAria, AriaSubmenuTriggerProps};

export function useMenuTrigger<T>(
  props: AriaMenuTriggerProps,
  state: MenuTriggerState,
  ref: RefObject<Element | null>
): MenuTriggerAria<T>;
export function useMenuTrigger(props?: AriaMenuTriggerProps): VueMenuTriggerAria;
export function useMenuTrigger(props?: AriaMenuTriggerProps): VueMenuTriggerAria {
  return useMenuTriggerInternal(props);
}

export function useMenu<T>(
  props: AriaMenuOptions<T>,
  state: TreeState<T>,
  ref: RefObject<HTMLElement | null>
): MenuAria;
export function useMenu(options?: VueAriaMenuOptions): MenuAria;
export function useMenu(options?: VueAriaMenuOptions): MenuAria {
  return useMenuInternal(options);
}

export function useMenuItem<T>(
  props: AriaMenuItemProps,
  state: TreeState<T>,
  ref: RefObject<FocusableElement | null>
): MenuItemAria;
export function useMenuItem(props: AriaMenuItemProps, menu: MenuAria): MenuItemAria;
export function useMenuItem(props: AriaMenuItemProps, menu: MenuAria): MenuItemAria {
  return useMenuItemInternal(props, menu);
}

export {useMenuSection} from './useMenuSection';
export type {AriaMenuSectionProps, MenuSectionAria} from './useMenuSection';
export type {MenuKey, MaybeRef, SelectionMode} from './types';
export type {AriaMenuProps} from '@react-types/menu';

export function useSubmenuTrigger<T>(
  props: AriaSubmenuTriggerProps,
  state: SubmenuTriggerState,
  ref: RefObject<FocusableElement | null>
): SubmenuTriggerAria<T>;
export function useSubmenuTrigger(props?: AriaSubmenuTriggerProps): VueSubmenuTriggerAria;
export function useSubmenuTrigger(props?: AriaSubmenuTriggerProps): VueSubmenuTriggerAria {
  return useSubmenuTriggerInternal(props);
}
