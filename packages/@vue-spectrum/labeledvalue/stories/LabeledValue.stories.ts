import {LabeledValue} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof LabeledValue> = {
  title: 'LabeledValue',
  component: LabeledValue
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {LabeledValue},
    setup() {
      return {args};
    },
    template: '<LabeledValue v-bind="args">Example</LabeledValue>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {LabeledValue},
    setup() {
      return {args};
    },
    template: '<LabeledValue v-bind="args">Story variant</LabeledValue>'
  })
};
