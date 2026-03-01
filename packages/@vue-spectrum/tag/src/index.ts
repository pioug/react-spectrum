import {type TagItemData, VueTagGroup} from './VueTagGroup';

export const TagGroup = VueTagGroup;
export {VueTagGroup};
export type {TagItemData} from './VueTagGroup';
export {Item} from '@vue-stately/collections';

export type SpectrumTagGroupProps = {
  actionLabel?: string,
  allowsRemoving?: boolean,
  contextualHelp?: unknown,
  description?: string,
  emptyStateLabel?: string,
  errorMessage?: string,
  isInvalid?: boolean,
  isRequired?: boolean,
  items?: TagItemData[],
  label?: string,
  labelAlign?: 'end' | 'start',
  labelPosition?: 'side' | 'top',
  maxRows?: number,
  modelValue?: Iterable<string>,
  necessityIndicator?: 'icon' | 'label',
  onAction?: () => void,
  renderEmptyState?: () => unknown,
  selectionMode?: 'multiple' | 'none' | 'single'
};
