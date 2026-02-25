import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {SubmenuTrigger} from '../src';

const meta: Meta<typeof SubmenuTrigger> = {
  title: 'MenuTrigger/Submenu',
  component: SubmenuTrigger,
  args: {
    label: 'Submenu',
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
    selectionMode: 'single',
    isExpanded: true,
    openKeys: [
      'view'
    ]
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
    components: {SubmenuTrigger},
    setup() {
      return {args};
    },
    template: '<SubmenuTrigger v-bind="args"></SubmenuTrigger>'
  })
};

export const Collapsed: Story = {
  ...Default,
  args: {
    isExpanded: false,
    openKeys: []
  }
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
      'Help'
    ]
  }
};
