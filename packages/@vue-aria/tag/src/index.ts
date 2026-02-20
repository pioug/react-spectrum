import {useTagGroup as useTagGroupInternal, type AriaTagGroupOptions as VueAriaTagGroupOptions, type TagGroupAria, type TagGroupItem, type TagGroupItemNode, type TagSelectionMode} from './useTagGroup';
import {useTag as useTagInternal, type AriaTagOptions as VueAriaTagOptions, type TagAria} from './useTag';
import type {ListState as VueListState} from '@vue-stately/list';

type FocusableElement = Element;
type RefObject<T> = {
  current: T
};
type ListState<T> = VueListState<T>;

export type AriaTagGroupOptions<T = unknown> = VueAriaTagGroupOptions;
export type AriaTagGroupProps<T = unknown> = AriaTagGroupOptions<T>;
export type AriaTagOptions<T = unknown> = VueAriaTagOptions;
export type AriaTagProps<T = unknown> = AriaTagOptions<T>;

export type {
  TagGroupAria,
  TagGroupItem,
  TagGroupItemNode,
  TagSelectionMode,
  TagAria
};

export function useTagGroup<T>(
  props: AriaTagGroupOptions<T>,
  state: ListState<T>,
  ref: RefObject<HTMLElement | null>
): TagGroupAria;
export function useTagGroup(options: VueAriaTagGroupOptions): TagGroupAria;
export function useTagGroup(options: VueAriaTagGroupOptions): TagGroupAria {
  return useTagGroupInternal(options);
}

export function useTag<T>(
  props: AriaTagProps<T>,
  state: ListState<T>,
  ref: RefObject<FocusableElement | null>
): TagAria;
export function useTag(options: VueAriaTagOptions): TagAria;
export function useTag(options: VueAriaTagOptions): TagAria {
  return useTagInternal(options);
}
