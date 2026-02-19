import {VueListBox} from '@vue-spectrum/components';

export const ListView = VueListBox;
export const VueListView = VueListBox;
export {Item} from '@vue-stately/collections';
export type SpectrumListViewProps = InstanceType<typeof VueListBox>['$props'];
