import {MenuTrigger} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof MenuTrigger> = {
  title: 'MenuTrigger',
  component: MenuTrigger,
  args: {
    label: 'Menu trigger',
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
    components: {MenuTrigger},
    setup() {
      return {args};
    },
    template: '<MenuTrigger v-bind="args"></MenuTrigger>'
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
