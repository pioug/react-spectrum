import {ActionMenu} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ActionMenu> = {
  title: 'ActionMenu',
  component: ActionMenu
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ActionMenu},
    setup() {
      return {args};
    },
    template: '<ActionMenu v-bind="args">Example</ActionMenu>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {ActionMenu},
    setup() {
      return {args};
    },
    template: '<ActionMenu v-bind="args">Story variant</ActionMenu>'
  })
};
