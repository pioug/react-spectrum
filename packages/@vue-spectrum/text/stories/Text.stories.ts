import {Heading, Keyboard, Text} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Text> = {
  title: 'Text',
  component: Text,
  args: {
    elementType: 'p',
    emphasized: false,
    truncate: false,
    variant: 'body'
  },
  argTypes: {
    elementType: {
      control: 'text'
    },
    emphasized: {
      control: 'boolean'
    },
    truncate: {
      control: 'boolean'
    },
    variant: {
      control: 'select',
      options: [
        'body',
        'detail',
        'heading'
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Text},
    setup() {
      return {args};
    },
    template: '<Text v-bind="args">This is standard body copy for migration docs.</Text>'
  })
};

export const DetailEmphasized: Story = {
  ...Default,
  args: {
    elementType: 'span',
    emphasized: true,
    variant: 'detail'
  }
};

export const HeadingStyle: Story = {
  render: (args) => ({
    components: {Heading},
    setup() {
      return {args};
    },
    template: '<Heading v-bind="args">Migration Overview</Heading>'
  }),
  args: {
    elementType: 'h3',
    variant: 'heading'
  }
};

export const KeyboardShortcut: Story = {
  render: (args) => ({
    components: {Keyboard},
    setup() {
      return {args};
    },
    template: '<Keyboard v-bind="args">Cmd + K</Keyboard>'
  }),
  args: {
    elementType: 'kbd',
    variant: 'detail'
  }
};

export const TruncatedText: Story = {
  ...Default,
  args: {
    truncate: true
  },
  render: (args) => ({
    components: {Text},
    setup() {
      return {args};
    },
    template: '<Text v-bind="args" style="display: block; max-width: 220px;">This sentence is intentionally long so truncation behavior is visible in the story.</Text>'
  })
};
