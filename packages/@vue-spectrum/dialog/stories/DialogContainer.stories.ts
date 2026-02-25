import {DialogContainer} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DialogContainer> = {
  title: 'DialogContainer',
  component: DialogContainer
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {DialogContainer},
    setup() {
      return {args};
    },
    template: '<DialogContainer v-bind="args">Example</DialogContainer>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {DialogContainer},
    setup() {
      return {args};
    },
    template: '<DialogContainer v-bind="args">Story variant</DialogContainer>'
  })
};
