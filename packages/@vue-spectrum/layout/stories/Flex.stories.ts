import {Flex} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Flex> = {
  title: 'Flex',
  component: Flex
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Flex},
    setup() {
      return {args};
    },
    template: '<Flex v-bind="args">Example</Flex>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {Flex},
    setup() {
      return {args};
    },
    template: '<Flex v-bind="args">Story variant</Flex>'
  })
};
