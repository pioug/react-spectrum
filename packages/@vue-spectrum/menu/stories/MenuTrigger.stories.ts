import {MenuTrigger} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof MenuTrigger> = {
  title: 'MenuTrigger',
  component: MenuTrigger
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {MenuTrigger},
    setup() {
      return {args};
    },
    template: '<MenuTrigger v-bind="args">Example</MenuTrigger>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {MenuTrigger},
    setup() {
      return {args};
    },
    template: '<MenuTrigger v-bind="args">Story variant</MenuTrigger>'
  })
};
