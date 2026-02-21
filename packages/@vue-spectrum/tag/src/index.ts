import {type TagItemData, VueTagGroup} from './VueTagGroup';

export const TagGroup = VueTagGroup;
export {VueTagGroup};
export type {TagItemData} from './VueTagGroup';
export {Item} from '@vue-stately/collections';

export type SpectrumTagGroupProps = {
  allowsRemoving?: boolean,
  emptyStateLabel?: string,
  items?: TagItemData[],
  label?: string,
  modelValue?: string[],
  selectionMode?: 'multiple' | 'none' | 'single'
};
