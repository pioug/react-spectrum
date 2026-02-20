import {useTab as useTabInternal, type AriaTabOptions, type TabAria} from './useTab';
import {useTabList as useTabListInternal, type AriaTabListOptions as VueAriaTabListOptions, type TabListAria, type TabListState as VueTabListAriaState, type TabOrientation} from './useTabList';
import {useTabPanel as useTabPanelInternal, type AriaTabPanelOptions, type TabPanelAria} from './useTabPanel';
import type {TabListState as VueTabListState} from '@vue-stately/tabs';
import type {AriaTabListProps, AriaTabPanelProps, AriaTabProps} from '@react-types/tabs';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;

export type AriaTabListOptions<T = unknown> = VueAriaTabListOptions;
export type TabListState<T = unknown> = VueTabListState<T>;

export type {
  AriaTabOptions,
  TabAria,
  TabListAria,
  VueTabListAriaState as TabListAriaState,
  TabOrientation,
  AriaTabPanelOptions,
  TabPanelAria
};

export function useTab<T>(
  props: AriaTabProps,
  state: TabListState<T>,
  ref: RefObject<FocusableElement | null>
): TabAria;
export function useTab(options: AriaTabOptions, state: VueTabListAriaState): TabAria;
export function useTab(options: AriaTabOptions, state: VueTabListAriaState): TabAria {
  return useTabInternal(options, state);
}

export function useTabList<T>(
  props: AriaTabListOptions<T>,
  state: TabListState<T>,
  ref: RefObject<HTMLElement | null>
): TabListAria;
export function useTabList(options: VueAriaTabListOptions): TabListAria;
export function useTabList(options: VueAriaTabListOptions): TabListAria {
  return useTabListInternal(options);
}

export function useTabPanel<T>(
  props: AriaTabPanelProps,
  state: TabListState<T> | null,
  ref: RefObject<Element | null>
): TabPanelAria;
export function useTabPanel(options: AriaTabPanelOptions, state: VueTabListAriaState | null): TabPanelAria;
export function useTabPanel(options: AriaTabPanelOptions, state: VueTabListAriaState | null): TabPanelAria {
  return useTabPanelInternal(options, state);
}

export type {AriaTabListProps, AriaTabPanelProps, AriaTabProps} from '@react-types/tabs';
export type {Orientation} from '@react-types/shared';
