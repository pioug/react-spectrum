import {Card} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Card> = {
  title: 'CardView/Waterfall layout',
  component: Card,
  argTypes: {
    description: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    id: {
      control: 'text'
    },
    isQuiet: {
      control: 'boolean'
    },
    quiet: {
      control: 'boolean'
    },
    selected: {
      control: 'boolean'
    },
    title: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Card},
    setup() {
      return {args};
    },
    template: '<Card v-bind="args">Example</Card>'
  })
};

export const Quiet: Story = {
  ...Default,
  args: {
    isQuiet: true
  }
};

export const Disabled: Story = {
  ...Default,
  args: {
    disabled: true
  }
};
