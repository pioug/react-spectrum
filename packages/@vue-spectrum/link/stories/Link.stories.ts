import {Link} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Link> = {
  title: 'Link',
  component: Link,
  argTypes: {
    onPress: {
      action: 'press'
    },
    onPressStart: {
      action: 'pressstart'
    },
    onPressEnd: {
      action: 'pressend'
    },
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
    template: '<Link v-bind="args">{{args.children}}</Link>'
  }),
  args: {
    children: 'This is a React Spectrum Link'
  }
};

export const Secondary: Story = {
  ...Default,
  args: {
    ...Default.args,
    variant: 'secondary'
  },
  name: 'variant: secondary'
};

export const OverBackground: Story = {
  ...Default,
  render: (args) => ({
    components: {Link},
    setup() {
      return {args};
    },
    template: '<div style="background-color: rgb(15, 121, 125); color: rgb(15, 121, 125); padding: 15px 20px; display: inline-block;"><Link v-bind="args">This is a React Spectrum Link</Link></div>'
  }),
  args: {
    ...Default.args,
    variant: 'overBackground'
  },
  name: 'variant: overBackground'
};

export const IsQuiet: Story = {
  ...Default,
  args: {
    ...Default.args,
    isQuiet: true
  },
  name: 'isQuiet: true'
};

export const IsQuietSecondary: Story = {
  ...Default,
  args: {
    ...Default.args,
    isQuiet: true,
    variant: 'secondary'
  },
  name: 'isQuiet: true, variant: secondary'
};

export const WithHref: Story = {
  ...Default,
  args: {
    ...Default.args,
    href: '//example.com'
  },
  name: 'href'
};

export const WithChildren: Story = {
  render: (args) => ({
    components: {Link},
    setup() {
      return {args};
    },
    template: '<Link v-bind="args"><a href="//example.com" target="_self">This is a React Spectrum Link</a></Link>'
  }),
  name: 'children: a'
};

export const BlockNavigation: Story = {
  render: (args) => ({
    components: {Link},
    setup() {
      return {args};
    },
    template: '<Link v-bind="args"><a href="//example.com" target="_self" @click.prevent>This is a React Spectrum Link</a></Link>'
  })
};

export const OnClick: Story = {
  ...Default,
  argTypes: {
    onClick: {
      action: 'deprecatedOnClick'
    }
  },
  name: 'onClick'
};
