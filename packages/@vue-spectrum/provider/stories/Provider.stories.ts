import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Provider} from '../src';

const meta: Meta<typeof Provider> = {
  title: 'Provider',
  component: Provider,
  argTypes: {
    theme: {
      table: {
        disable: true
      }
    },
    scale: {
      control: 'text'
    },
    colorScheme: {
      control: 'text'
    },
    locale: {
      control: 'text'
    },
    dir: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Provider},
    setup() {
      return {args};
    },
    template: '<Provider v-bind="args">Example</Provider>'
  })
};

export const CustomScale: Story = {
  ...Default,
  args: {
    scale: 'Story variant'
  }
};

export const DarkScheme: Story = {
  ...Default,
  args: {
    colorScheme: 'dark'
  }
};
