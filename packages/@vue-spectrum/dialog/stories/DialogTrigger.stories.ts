import {DialogTrigger} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DialogTrigger> = {
  title: 'DialogTrigger',
  component: DialogTrigger
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {DialogTrigger},
    setup() {
      return {args};
    },
    template: '<DialogTrigger v-bind="args">Example</DialogTrigger>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {DialogTrigger},
    setup() {
      return {args};
    },
    template: '<DialogTrigger v-bind="args">Story variant</DialogTrigger>'
  })
};
