import {Grid} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Grid> = {
  title: 'Grid',
  component: Grid
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Grid},
    setup() {
      return {args};
    },
    template: '<Grid v-bind="args">Example</Grid>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {Grid},
    setup() {
      return {args};
    },
    template: '<Grid v-bind="args">Story variant</Grid>'
  })
};
