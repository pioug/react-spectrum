import {IllustratedMessage} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof IllustratedMessage> = {
  title: 'IllustratedMessage',
  component: IllustratedMessage,
  argTypes: {
    description: {
      control: 'text'
    },
    elementType: {
      control: 'text'
    },
    hidden: {
      control: 'boolean'
    },
    title: {
      control: 'text'
    },
    variant: {
      control: 'select',
      options: ['info', 'negative', 'neutral', 'notice', 'positive']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {IllustratedMessage},
    setup() {
      return {args};
    },
    template: '<IllustratedMessage v-bind="args">Example</IllustratedMessage>'
  })
};

export const AlternateVariant: Story = {
  ...Default,
  args: {
    variant: 'info'
  }
};
