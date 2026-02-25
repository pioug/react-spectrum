import {ComboBox} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ComboBox> = {
  title: 'ComboBox',
  component: ComboBox,
  args: {
    label: 'Example'
  },
  argTypes: {
    allowsCustomValue: {
      control: 'boolean'
    },
    allowsEmptyCollection: {
      control: 'boolean'
    },
    autoFocus: {
      control: 'boolean'
    },
    disableLocalFilter: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    },
    estimatedItemHeight: {
      control: 'number'
    },
    form: {
      control: 'text'
    },
    formValue: {
      control: 'text'
    },
    id: {
      control: 'text'
    },
    invalid: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    isInvalid: {
      control: 'boolean'
    },
    isQuiet: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    listBoxClassName: {
      control: 'text'
    },
    listBoxItemClassName: {
      control: 'text'
    },
    modelValue: {
      control: 'text'
    },
    name: {
      control: 'text'
    },
    options: {
      table: {
        disable: true
      }
    },
    placeholder: {
      control: 'text'
    },
    selectedKeys: {
      table: {
        disable: true
      }
    },
    selectionMode: {
      control: 'text'
    },
    validationState: {
      control: 'text'
    },
    virtualized: {
      control: 'boolean'
    },
    visibleItemCount: {
      control: 'number'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ComboBox},
    setup() {
      return {args};
    },
    template: '<ComboBox v-bind="args">Example</ComboBox>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const Quiet: Story = {
  ...Default,
  args: {
    isQuiet: true
  }
};

export const ReadOnly: Story = {
  ...Default,
  args: {
    isReadOnly: true
  }
};
