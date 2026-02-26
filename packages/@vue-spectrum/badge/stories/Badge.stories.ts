import {Badge} from '../src';
import CheckmarkCircle from '@spectrum-icons-vue/workflow/CheckmarkCircle';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const variantOptions = ['positive', 'negative', 'neutral', 'info', 'indigo', 'yellow', 'magenta', 'fuchsia', 'purple', 'seafoam'];

const meta: Meta<typeof Badge> = {
  title: 'Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: variantOptions
      }
    }
  }
};

export default meta;

type BadgeStory = StoryObj<typeof meta>;

export const Default: BadgeStory = {
  args: {
    children: 'Licensed',
    variant: 'positive'
  },
  name: 'Default',
  render: (args) => ({
    components: {Badge},
    setup() {
      return {args};
    },
    template: '<Badge v-bind="args">{{args.children}}</Badge>'
  })
};

export const WithIcon: BadgeStory = {
  args: {
    variant: 'positive'
  },
  name: 'With icon',
  render: (args) => ({
    components: {
      Badge,
      CheckmarkCircle
    },
    setup() {
      return {args};
    },
    template: `
      <Badge v-bind="args">
        <CheckmarkCircle aria-label="Done" />
        Licensed
      </Badge>
    `
  })
};

export const WithIconReverseOrder: BadgeStory = {
  args: {
    variant: 'positive'
  },
  name: 'With icon, order reversed',
  render: (args) => ({
    components: {
      Badge,
      CheckmarkCircle
    },
    setup() {
      return {args};
    },
    template: `
      <Badge v-bind="args">
        Licensed
        <CheckmarkCircle aria-label="Done" />
      </Badge>
    `
  })
};

export const IconOnly: BadgeStory = {
  args: {
    variant: 'positive'
  },
  name: 'Icon only',
  render: (args) => ({
    components: {
      Badge,
      CheckmarkCircle
    },
    setup() {
      return {args};
    },
    template: `
      <Badge v-bind="args">
        <CheckmarkCircle aria-label="Licensed" />
      </Badge>
    `
  })
};

export const Overflow: BadgeStory = {
  args: {
    children: '24 days left in trial',
    variant: 'positive',
    UNSAFE_style: {
      width: '74px'
    }
  },
  render: (args) => ({
    components: {Badge},
    setup() {
      return {args};
    },
    template: '<Badge v-bind="args">{{args.children}}</Badge>'
  })
};
