import {Link} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Link> = {
  title: 'Link',
  component: Link,
  argTypes: {
    href: {
      control: 'text'
    },
    isQuiet: {
      control: 'boolean'
    },
    rel: {
      control: 'text'
    },
    target: {
      control: 'text'
    },
    variant: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Link},
    setup() {
      return {args};
    },
    template: '<Link v-bind="args">Example</Link>'
  })
};

export const Quiet: Story = {
  ...Default,
  args: {
    isQuiet: true
  }
};
