import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {ToastContainer} from '../src';

const meta: Meta<typeof ToastContainer> = {
  title: 'Toast',
  component: ToastContainer
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ToastContainer},
    setup() {
      return {args};
    },
    template: '<ToastContainer v-bind="args">Example</ToastContainer>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {ToastContainer},
    setup() {
      return {args};
    },
    template: '<ToastContainer v-bind="args">Story variant</ToastContainer>'
  })
};
