import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Provider} from '@vue-spectrum/provider';
import {TextField} from '@vue-spectrum/textfield';

type TextFieldStoryArgs = {
  modelValue: string,
  validationState?: 'invalid' | 'valid',
  description: string,
  disabled: boolean
};

const meta = {
  title: 'TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    modelValue: 'Avery',
    validationState: undefined,
    description: 'Owner is required',
    disabled: false
  },
  argTypes: {
    modelValue: {
      control: 'text'
    },
    validationState: {
      control: 'select',
      options: [undefined, 'invalid', 'valid']
    },
    description: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    }
  },
  render: (args: TextFieldStoryArgs) => ({
    components: {
      Provider,
      TextField
    },
    setup() {
      return {
        args,
        theme: defaultTheme
      };
    },
    template: `
      <Provider :theme="theme" color-scheme="light" scale="medium" style="padding: 24px; max-width: 360px;">
        <TextField
          label="Owner"
          :model-value="args.modelValue"
          :validation-state="args.validationState"
          :description="args.description"
          :disabled="args.disabled"
        />
      </Provider>
    `
  })
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Invalid: Story = {
  args: {
    modelValue: '',
    validationState: 'invalid'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Valid: Story = {
  args: {
    modelValue: 'Avery',
    validationState: 'valid'
  }
};
