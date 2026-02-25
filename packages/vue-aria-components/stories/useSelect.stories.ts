import {ref} from 'vue';
import {useSelect} from '@vue-aria/select';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const lotsOfItems = Array.from({length: 50}, (_, index) => ({
  key: `item-${index}`,
  textValue: `Item ${index}`
}));

const meta = {
  title: 'useSelect'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ScrollTesting: Story = {
  render: () => ({
    setup() {
      let selectedKey = ref<string | null>(lotsOfItems[0]?.key ?? null);
      let select = useSelect({
        label: 'Example',
        options: lotsOfItems,
        selectedKey
      });

      return {
        select
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 260px;">
        <label v-bind="select.labelProps">Example</label>
        <button
          v-bind="select.triggerProps"
          type="button"
          style="display: flex; justify-content: space-between; align-items: center; min-height: 32px; border: 1px solid #999; padding: 0 8px;">
          <span v-bind="select.valueProps">{{select.selectedItem?.textValue ?? 'Select an item'}}</span>
          <span aria-hidden="true">▼</span>
        </button>
        <ul
          v-bind="select.menuProps"
          style="border: 1px solid #ccc; max-height: 180px; overflow: auto; list-style: none; margin: 0; padding: 4px;">
          <li
            v-for="option in select.hiddenSelectProps.options"
            :key="option.key"
            role="option"
            :aria-selected="select.selectedKey === option.key"
            :style="{padding: '4px 8px', cursor: 'pointer', background: select.selectedKey === option.key ? '#e8e8e8' : 'transparent'}"
            @click="select.selectKey(option.key)">
            {{option.textValue}}
          </li>
        </ul>
      </div>
    `
  }),
  name: 'Scroll Testing'
};
