import {DateField} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DateField> = {
  title: 'Date and Time/TimeField/styling',
  component: DateField
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {DateField},
    setup() {
      return {args};
    },
    template: '<DateField v-bind="args">Example</DateField>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {DateField},
    setup() {
      return {args};
    },
    template: '<DateField v-bind="args">Story variant</DateField>'
  })
};
