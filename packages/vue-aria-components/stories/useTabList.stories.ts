import {computed, ref} from 'vue';
import {useTab, useTabList, useTabPanel} from '@vue-aria/tabs';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type TabItem = {
  content: string,
  key: string,
  label: string
};

const lotsOfItems: TabItem[] = Array.from({length: 50}, (_, index) => ({
  key: `item-${index}`,
  label: `Item ${index}`,
  content: `Contents ${index}`
}));

const meta = {
  title: 'useTabList'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderTabList(args: {shouldSelectOnPressUp?: boolean}) {
  return {
    setup() {
      let selectedKey = ref<string | null>(lotsOfItems[0]?.key ?? null);
      let focusedKey = ref<string | null>(selectedKey.value);
      let keys = lotsOfItems.map((item) => item.key);

      let tabList = useTabList({
        'aria-label': 'example',
        focusedKey,
        selectedKey,
        tabs: keys
      });

      let tabAriaByKey = new Map(
        keys.map((key) => [
          key,
          useTab(
            {
              key,
              shouldSelectOnPressUp: args.shouldSelectOnPressUp
            },
            tabList.state
          )
        ])
      );

      let selectedTab = computed(() => lotsOfItems.find((item) => item.key === selectedKey.value) ?? lotsOfItems[0]);
      let tabPanel = useTabPanel({}, tabList.state);

      let getTabProps = (key: string) => tabAriaByKey.get(key)?.tabProps.value ?? {};
      let isSelected = (key: string) => tabAriaByKey.get(key)?.isSelected.value ?? false;

      return {
        getTabProps,
        items: lotsOfItems,
        isSelected,
        selectedTab,
        tabListProps: tabList.tabListProps,
        tabPanelProps: tabPanel.tabPanelProps
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 720px;">
        <div
          v-bind="tabListProps"
          style="display: flex; gap: 4px; overflow-x: auto; padding-bottom: 6px; border-bottom: 1px solid #ccc;">
          <button
            v-for="item in items"
            :key="item.key"
            v-bind="getTabProps(item.key)"
            type="button"
            :style="{padding: '6px 10px', border: '1px solid #999', background: isSelected(item.key) ? '#e8e8e8' : 'white', whiteSpace: 'nowrap'}">
            {{item.label}}
          </button>
        </div>
        <div v-bind="tabPanelProps" style="padding: 8px; border: 1px solid #ddd;">
          {{selectedTab?.content}}
        </div>
      </div>
    `
  };
}

export const ScrollTesting: Story = {
  render: (args) => renderTabList(args),
  name: 'Scroll Testing'
};

export const OnPressEndSelection: Story = {
  render: (args) => renderTabList(args),
  args: {
    shouldSelectOnPressUp: true
  },
  name: 'On Press End Selection'
};
