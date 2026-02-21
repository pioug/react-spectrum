import {type AriaTreeItemOptions, type TreeItemAria, type TreeItemNode, useTreeItem as useTreeItemInternal} from './useTreeItem';
import {type TreeAria, useTree as useTreeInternal, type AriaTreeOptions as VueAriaTreeOptions} from './useTree';
import type {TreeState as VueTreeState} from '@vue-stately/tree';

type FocusableElement = Element;
type RefObject<T> = {
  current: T
};

export type AriaTreeOptions<T = unknown> = VueAriaTreeOptions;
export type AriaTreeProps<T = unknown> = AriaTreeOptions<T>;
export type {TreeProps} from '@vue-stately/tree';
export type {TreeAria, AriaTreeItemOptions, TreeItemAria, TreeItemNode};

export function useTree<T>(
  props: AriaTreeOptions<T>,
  state: VueTreeState<T>,
  ref: RefObject<HTMLElement | null>
): TreeAria;
export function useTree(options: VueAriaTreeOptions): TreeAria;
export function useTree(options: VueAriaTreeOptions): TreeAria {
  return useTreeInternal(options);
}

export function useTreeItem<T>(
  options: AriaTreeItemOptions,
  state: VueTreeState<T>,
  ref: RefObject<FocusableElement | null>
): TreeItemAria;
export function useTreeItem(options: AriaTreeItemOptions): TreeItemAria;
export function useTreeItem(options: AriaTreeItemOptions): TreeItemAria {
  return useTreeItemInternal(options);
}
