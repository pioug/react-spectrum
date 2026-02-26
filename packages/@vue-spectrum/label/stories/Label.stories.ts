import {Label} from '../src';
import {TextField} from '@vue-spectrum/textfield';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Label> = {
  title: 'Label',
  component: Label,
  args: {
    children: 'Test',
    width: '100%',
    htmlFor: 'test'
  },
  argTypes: {
    labelAlign: {
      control: 'radio',
      options: ['end', 'start']
    },
    labelPosition: {
      control: 'radio',
      options: ['side', 'top']
    },
    necessityIndicator: {
      control: 'radio',
      options: ['icon', 'label']
    },
    isRequired: {
      control: 'boolean'
    },
    htmlFor: {
      control: {disable: true}
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Label, TextField},
    setup() {
      return {args};
    },
    template: `
      <div style="white-space: nowrap;">
        <Label v-bind="args">{{args.children}}</Label>
        <TextField :id="args.htmlFor" :is-required="args.isRequired" />
      </div>
    `
  })
};

export const WidthForLabelAlignSide: Story = {
  args: {
    width: '80px',
    labelPosition: 'side'
  },
  argTypes: {
    labelPosition: {
      control: {disable: true}
    }
  },
  render: Default.render
};
