import {Item} from '@vue-stately/collections';
import {VueTabs} from './VueTabs';

export const Tabs = VueTabs;
export const TabList = VueTabs;
export const TabPanels = VueTabs;
export {Item};
export {VueTabs};
export type {TabItemData, TabsValue} from './VueTabs';

export type SpectrumTabsProps = Record<string, unknown>;
export type SpectrumTabListProps = SpectrumTabsProps;
export type SpectrumTabPanelsProps = SpectrumTabsProps;
