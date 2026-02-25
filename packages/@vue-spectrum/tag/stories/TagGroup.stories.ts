import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {TagGroup} from '../src';

const meta: Meta<typeof TagGroup> = {
  title: 'TagGroup',
  component: TagGroup,
  args: {
    label: 'Selected tags',
    items: [
      {
        key: 'design',
        label: 'Design'
      },
      {
        key: 'engineering',
        label: 'Engineering'
      },
      {
        key: 'research',
        label: 'Research'
      }
    ],
    modelValue: [
      'design'
    ],
    selectionMode: 'multiple',
    allowsRemoving: true
  },
  argTypes: {
    allowsRemoving: {
      control: 'boolean'
    },
    emptyStateLabel: {
      control: 'text'
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
    selectionMode: {
      control: 'select',
      options: [
        'multiple',
        'none',
        'single'
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {TagGroup},
    setup() {
      return {args};
    },
    template: '<TagGroup v-bind="args"></TagGroup>'
  })
};

export const SingleSelection: Story = {
  ...Default,
  args: {
    selectionMode: 'single',
    modelValue: [
      'engineering'
    ]
  }
};

export const NoRemoving: Story = {
  ...Default,
  args: {
    allowsRemoving: false
  }
};

export const EmptyState: Story = {
  ...Default,
  args: {
    items: [],
    modelValue: [],
    emptyStateLabel: 'Nothing selected'
  }
};
