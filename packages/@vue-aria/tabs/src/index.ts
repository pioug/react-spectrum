import type {AriaTabListProps, AriaTabPanelProps, AriaTabProps} from '@vue-types/tabs';
import {type AriaTabOptions, type TabAria, useTab as useTabInternal} from './useTab';
import {type AriaTabPanelOptions, type TabPanelAria, useTabPanel as useTabPanelInternal} from './useTabPanel';
import {type TabListAria, type TabOrientation, useTabList as useTabListInternal, type AriaTabListOptions as VueAriaTabListOptions, type TabListState as VueTabListAriaState} from './useTabList';
import type {TabListState as VueTabListState} from '@vue-stately/tabs';

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

export type {AriaTabListProps, AriaTabPanelProps, AriaTabProps} from '@vue-types/tabs';
export type {Orientation} from '@vue-types/shared';
