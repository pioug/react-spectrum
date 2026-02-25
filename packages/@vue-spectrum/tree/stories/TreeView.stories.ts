import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {TreeView} from '../src';

const meta: Meta<typeof TreeView> = {
  title: 'TreeView',
  component: TreeView,
  args: {
    items: [
      {
        id: 'projects',
        label: 'Projects',
        children: [
          {
            id: 'alpha',
            label: 'Alpha'
          },
          {
            id: 'beta',
            label: 'Beta'
          }
        ]
      },
      {
        id: 'settings',
        label: 'Settings'
      }
    ]
  },
  argTypes: {
    childrenKey: {
      control: 'text'
    },
    defaultExpanded: {
      control: 'boolean'
    },
    hidden: {
      control: 'boolean'
    },
    idKey: {
      control: 'text'
    },
    items: {
      table: {
        disable: true
      }
    },
    labelKey: {
      control: 'text'
    },
    modelValue: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {TreeView},
    setup() {
      return {args};
    },
    template: '<TreeView v-bind="args"></TreeView>'
  })
};

export const Collapsed: Story = {
  ...Default,
  args: {
    defaultExpanded: false
  }
};

export const Selected: Story = {
  ...Default,
  args: {
    modelValue: 'projects'
  }
};

export const Hidden: Story = {
  ...Default,
  args: {
    hidden: true
  }
};
