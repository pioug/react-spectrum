import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {TooltipTrigger} from '../src';

const meta: Meta<typeof TooltipTrigger> = {
  title: 'TooltipTrigger',
  component: TooltipTrigger
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {TooltipTrigger},
    setup() {
      return {args};
    },
    template: '<TooltipTrigger v-bind="args">Example</TooltipTrigger>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {TooltipTrigger},
    setup() {
      return {args};
    },
    template: '<TooltipTrigger v-bind="args">Story variant</TooltipTrigger>'
  })
};
