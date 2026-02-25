import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {StepList} from '../src';

const meta: Meta<typeof StepList> = {
  title: 'StepList',
  component: StepList
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {StepList},
    setup() {
      return {args};
    },
    template: '<StepList v-bind="args">Example</StepList>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {StepList},
    setup() {
      return {args};
    },
    template: '<StepList v-bind="args">Story variant</StepList>'
  })
};
