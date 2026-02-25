import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Tabs} from '../src';

const meta: Meta<typeof Tabs> = {
  title: 'Tabs',
  component: Tabs,
  args: {
    ariaLabel: 'Example tabs',
    items: [
      {
        key: 'overview',
        label: 'Overview',
        content: 'Overview tab content'
      },
      {
        key: 'details',
        label: 'Details',
        content: 'Detailed information'
      },
      {
        key: 'history',
        label: 'History',
        content: 'History and activity'
      }
    ],
    modelValue: 'overview',
    orientation: 'horizontal'
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    items: {
      table: {
        disable: true
      }
    },
    modelValue: {
      control: 'text'
    },
    orientation: {
      control: 'select',
      options: [
        'horizontal',
        'vertical'
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Tabs},
    setup() {
      return {args};
    },
    template: '<Tabs v-bind="args"></Tabs>'
  })
};

export const Vertical: Story = {
  ...Default,
  args: {
    orientation: 'vertical'
  }
};

export const SecondTabSelected: Story = {
  ...Default,
  args: {
    modelValue: 'details'
  }
};

export const WithDisabledTab: Story = {
  ...Default,
  args: {
    items: [
      {
        key: 'overview',
        label: 'Overview',
        content: 'Overview tab content'
      },
      {
        key: 'details',
        label: 'Details',
        content: 'Detailed information',
        disabled: true
      },
      {
        key: 'history',
        label: 'History',
        content: 'History and activity'
      }
    ],
    modelValue: 'overview'
  }
};
