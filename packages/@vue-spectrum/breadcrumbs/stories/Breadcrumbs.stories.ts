import {action} from 'storybook/actions';
import {Breadcrumbs} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

let defaultItems = ['The quick brown fox jumps over', 'My Documents', 'Kangaroos jump high'];
let manyItems = [
  'The quick brown fox jumps over',
  'My Documents',
  'Kangaroos jump high',
  'Koalas are very cute',
  'Wombat noses',
  'Wattle trees',
  'April 7'
];
let linkItems = [
  {href: 'https://example.com', key: 'example.com', label: 'Example.com'},
  {href: 'https://example.com/foo', key: 'foo', label: 'Foo'},
  {href: 'https://example.com/foo/bar', key: 'bar', label: 'Bar'},
  {href: 'https://example.com/foo/bar/baz', key: 'baz', label: 'Baz'},
  {href: 'https://example.com/foo/bar/baz/qux', key: 'qux', label: 'Qux'}
];

const meta = {
  title: 'Breadcrumbs',
  component: Breadcrumbs,
  args: {
    onAction: action('onAction')
  },
  argTypes: {
    onAction: {
      table: {
        disable: true
      }
    },
    isMultiline: {
      control: 'boolean'
    },
    showRoot: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    autoFocusCurrent: {
      control: 'boolean'
    },
    size: {
      control: 'select',
      options: ['S', 'M', 'L']
    }
  }
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Breadcrumbs},
    setup() {
      return {args, items: defaultItems};
    },
    template: '<div style="width: 100vw;"><Breadcrumbs v-bind="args" :items="items" /></div>'
  }),
  name: '3 items'
};

export const DefaultTruncated: Story = {
  render: (args) => ({
    components: {Breadcrumbs},
    setup() {
      return {args, items: defaultItems};
    },
    template: '<div style="width: 100vw;"><div style="width: 120px;"><Breadcrumbs v-bind="args" :items="items" /></div></div>'
  }),
  name: 'truncated'
};

export const RenderMany: Story = {
  render: (args) => ({
    components: {Breadcrumbs},
    setup() {
      return {args, items: manyItems};
    },
    template: '<div style="width: 100vw;"><div style="min-width: 100px; width: 300px; padding: 10px; resize: horizontal; overflow: auto; background-color: var(--spectrum-global-color-gray-50);"><Breadcrumbs v-bind="args" :items="items" /></div></div>'
  }),
  name: '7 items, resizable container'
};

export const OneItem: Story = {
  render: (args) => ({
    components: {Breadcrumbs},
    setup() {
      return {args, items: ['Root']};
    },
    template: '<div style="width: 100vw;"><Breadcrumbs v-bind="args" :items="items" /></div>'
  }),
  name: '1 item'
};

export const Links: Story = {
  render: (args) => ({
    components: {Breadcrumbs},
    setup() {
      return {args, items: linkItems};
    },
    template: '<div style="width: 100vw;"><Breadcrumbs v-bind="args" :items="items" /></div>'
  })
};
