import {VueTree} from '@vue-spectrum/components';

export const Tree = VueTree;
export const TreeView = VueTree;
export const TreeViewItem = VueTree;
export const TreeViewItemContent = VueTree;
export const Collection = VueTree;
export {VueTree};

export type SpectrumTreeViewProps<T = unknown> = {
  items?: T[]
} & Record<string, unknown>;
export type SpectrumTreeViewItemProps<T = unknown> = {
  item?: T
} & Record<string, unknown>;
export type SpectrumTreeViewItemContentProps<T = unknown> = {
  item?: T
} & Record<string, unknown>;
