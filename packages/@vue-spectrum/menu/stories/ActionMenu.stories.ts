import {ActionMenu} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ActionMenu> = {
  title: 'ActionMenu',
  component: ActionMenu,
  args: {
    label: 'Actions',
    items: [
      'Edit',
      'Copy',
      'Delete'
    ],
    selectionMode: 'single'
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    ariaLabelledby: {
      control: 'text'
    },
    dataTestid: {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    isExpanded: {
      control: 'boolean'
    },
    items: {
      table: {
        disable: true
      }
    },
    label: {
      control: 'text'
    },
    modelValue: {
      table: {
        disable: true
      }
    },
    openKeys: {
      table: {
        disable: true
      }
    },
    selectionMode: {
      control: 'select',
      options: [
        'none',
        'single',
        'multiple'
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ActionMenu},
    setup() {
      return {args};
    },
    template: '<ActionMenu v-bind="args"></ActionMenu>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const MultipleSelection: Story = {
  ...Default,
  args: {
    selectionMode: 'multiple',
    modelValue: [
      'Edit'
    ]
  }
};

export const Expanded: Story = {
  ...Default,
  args: {
    isExpanded: true,
    items: [
      {
        key: 'view',
        label: 'View',
        children: [
          {
            key: 'grid',
            label: 'Grid view'
          },
          {
            key: 'list',
            label: 'List view'
          }
        ]
      },
      'Help'
    ],
    openKeys: [
      'view'
    ]
  }
};
