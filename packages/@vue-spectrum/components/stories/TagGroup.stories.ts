import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {action} from '@storybook/addon-actions';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/TagGroup',
  args: {
    selectionMode: 'none',
    selectionBehavior: 'toggle'
  },
  argTypes: {
    selectionMode: {
      control: 'inline-radio',
      options: ['none', 'single', 'multiple']
    },
    selectionBehavior: {
      control: 'inline-radio',
      options: ['toggle', 'replace']
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TagGroupExample: Story = {
  render: () => ({
    setup() {
      let selected = ref<string[]>([]);

      let toggleTag = (tag: string) => {
        if (selected.value.includes(tag)) {
          selected.value = selected.value.filter((item) => item !== tag);
        } else {
          selected.value = [...selected.value, tag];
        }
      };

      return {
        selected,
        toggleTag
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <label>Categories</label>
        <div style="display: flex; gap: 4px;">
          <button type="button" @click="toggleTag('News')">News</button>
          <button type="button" @click="toggleTag('Travel')">Travel</button>
          <button type="button" @click="toggleTag('Gaming')">Gaming</button>
          <button type="button" @click="toggleTag('Shopping')" title="I am a tooltip">Shopping</button>
        </div>
        <p style="margin: 0;">Selected: {{ selected.join(', ') || 'none' }}</p>
      </div>
    `
  })
};

export const TagGroupExampleWithRemove: Story = {
  render: () => ({
    setup() {
      let tags = ref(['Marsupial', 'Animal', 'Mammal', 'Chordate']);

      let removeTag = (tag: string) => {
        tags.value = tags.value.filter((item) => item !== tag);
        action('onRemove')(tag);
      };

      return {
        removeTag,
        tags
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <label>Categories</label>
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          <span
            v-for="tag in tags"
            :key="tag"
            style="display: inline-flex; align-items: center; gap: 4px; border: 1px solid gray; border-radius: 4px; padding: 0 4px;">
            {{ tag }}
            <button type="button" @click="removeTag(tag)">X</button>
          </span>
        </div>
      </div>
    `
  })
};

export const EmptyTagGroup: Story = {
  render: () => ({
    template: `
      <div aria-label="Categories">
        No categories.
      </div>
    `
  })
};
