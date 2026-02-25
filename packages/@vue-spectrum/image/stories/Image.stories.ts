import {Image} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Image> = {
  title: 'Image',
  component: Image,
  argTypes: {
    alt: {
      control: 'text'
    },
    borderRadius: {
      control: 'text'
    },
    fit: {
      control: 'select',
      options: ['contain', 'cover', 'fill', 'none']
    },
    hidden: {
      control: 'boolean'
    },
    src: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Image},
    setup() {
      return {args};
    },
    template: '<Image v-bind="args">Example</Image>'
  })
};

export const Hidden: Story = {
  ...Default,
  args: {
    hidden: true
  }
};

export const CoverFit: Story = {
  ...Default,
  args: {
    fit: 'cover',
    borderRadius: '8px'
  }
};
