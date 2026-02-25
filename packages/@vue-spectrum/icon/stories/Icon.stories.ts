import {Icon} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Icon> = {
  title: 'Icons/Custom',
  component: Icon
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Icon},
    setup() {
      return {args};
    },
    template: '<Icon v-bind="args">Example</Icon>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {Icon},
    setup() {
      return {args};
    },
    template: '<Icon v-bind="args">Story variant</Icon>'
  })
};
