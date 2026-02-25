import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {View} from '../src';

const meta: Meta<typeof View> = {
  title: 'View',
  component: View,
  args: {
    padding: 'm',
    border: true
  },
  argTypes: {
    border: {
      control: 'boolean'
    },
    elementType: {
      control: 'text'
    },
    padding: {
      control: 'select',
      options: [
        'none',
        's',
        'm',
        'l'
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {View},
    setup() {
      return {args};
    },
    template: `<View v-bind="args">
  <h3 style="margin: 0 0 8px;">Container Title</h3>
  <p style="margin: 0;">This content is wrapped in View.</p>
</View>`
  })
};

export const Borderless: Story = {
  ...Default,
  args: {
    border: false
  }
};

export const CompactPadding: Story = {
  ...Default,
  args: {
    padding: 's'
  }
};

export const NoPadding: Story = {
  ...Default,
  args: {
    padding: 'none'
  }
};
