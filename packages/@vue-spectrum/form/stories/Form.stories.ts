import {Form} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Form> = {
  title: 'Form',
  component: Form,
  argTypes: {
    labelPosition: {
      control: 'text'
    },
    labelAlign: {
      control: 'text'
    },
    necessityIndicator: {
      control: 'text'
    },
    validationBehavior: {
      control: 'select',
      options: ['aria', 'native']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Form},
    setup() {
      return {args};
    },
    template: '<Form v-bind="args">Example</Form>'
  })
};

export const AlternateValidationBehavior: Story = {
  ...Default,
  args: {
    validationBehavior: 'native'
  }
};

export const SideLabels: Story = {
  ...Default,
  args: {
    labelPosition: 'side',
    labelAlign: 'end'
  }
};
