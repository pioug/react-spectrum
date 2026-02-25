import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Well} from '../src';

const meta: Meta<typeof Well> = {
  title: 'Well',
  component: Well,
  argTypes: {
    role: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Well},
    setup() {
      return {args};
    },
    template: '<Well v-bind="args">Example</Well>'
  })
};

export const CustomRole: Story = {
  ...Default,
  args: {
    role: 'Story variant'
  }
};

export const RegionRole: Story = {
  ...Default,
  args: {
    role: 'region'
  }
};
