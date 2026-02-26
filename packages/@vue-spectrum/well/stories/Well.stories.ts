import {Well} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'Well',
  component: Well
} satisfies Meta<typeof Well>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {children: 'This is a React Spectrum Well'},
  render: (args) => ({
    components: {Well},
    setup() {
      return {args};
    },
    template: '<Well v-bind="args">{{ args.children }}</Well>'
  })
};
