import {Item} from '@vue-stately/collections';
import {VueTabs} from './VueTabs';
import {defineComponent, h} from 'vue';

export const Tabs = VueTabs;
export const TabList = defineComponent({
  name: 'VueTabList',
  inheritAttrs: false,
  setup(_, {attrs, slots}) {
    return () => h(VueTabs, {
      ...attrs
    }, slots);
  }
});
export const TabPanels = defineComponent({
  name: 'VueTabPanels',
  inheritAttrs: false,
  setup(_, {attrs, slots}) {
    return () => h(VueTabs, {
      ...attrs
    }, slots);
  }
});
export {Item};
export {VueTabs};
export type {TabItemData, TabsValue} from './VueTabs';

export type SpectrumTabsProps = Record<string, unknown>;
export type SpectrumTabListProps = SpectrumTabsProps;
export type SpectrumTabPanelsProps = SpectrumTabsProps;
