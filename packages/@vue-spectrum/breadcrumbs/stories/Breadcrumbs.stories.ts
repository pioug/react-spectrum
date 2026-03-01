import {action} from 'storybook/actions';
import {Breadcrumbs} from '../src';
import {Item} from '@vue-stately/collections';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

let defaultItems = [
  {key: 'Folder 1', label: 'The quick brown fox jumps over'},
  {key: 'Folder 2', label: 'My Documents'},
  {key: 'Folder 3', label: 'Kangaroos jump high'}
];
let manyItems = [
  {key: 'Folder 1', label: 'The quick brown fox jumps over'},
  {key: 'Folder 2', label: 'My Documents'},
  {key: 'Folder 3', label: 'Kangaroos jump high'},
  {key: 'Folder 4', label: 'Koalas are very cute'},
  {key: 'Folder 5', label: 'Wombat\'s noses'},
  {key: 'Folder 6', label: 'Wattle trees'},
  {key: 'Folder 7', label: 'April 7'}
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
    components: {Breadcrumbs, Item},
    setup() {
      return {args, items: defaultItems};
    },
    template: `
      <div style="width: 100vw;">
        <Breadcrumbs v-bind="args">
          <Item v-for="item in items" :key="item.key">{{ item.label }}</Item>
        </Breadcrumbs>
      </div>
    `
  }),
  name: '3 items'
};

export const DefaultTruncated: Story = {
  render: (args) => ({
    components: {Breadcrumbs, Item},
    setup() {
      return {args, items: defaultItems};
    },
    template: `
      <div style="width: 100vw;">
        <div style="width: 120px;">
          <Breadcrumbs v-bind="args">
            <Item v-for="item in items" :key="item.key">{{ item.label }}</Item>
          </Breadcrumbs>
        </div>
      </div>
    `
  }),
  name: 'truncated'
};

export const RenderMany: Story = {
  render: (args) => ({
    components: {Breadcrumbs, Item},
    setup() {
      return {args, items: manyItems};
    },
    template: `
      <div style="width: 100vw;">
        <div style="min-width: 100px; width: 300px; padding: 10px; resize: horizontal; overflow: auto; background-color: var(--spectrum-global-color-gray-50);">
          <Breadcrumbs v-bind="args">
            <Item v-for="item in items" :key="item.key">{{ item.label }}</Item>
          </Breadcrumbs>
        </div>
      </div>
    `
  }),
  name: '7 items, resizable container'
};

export const OneItem: Story = {
  render: (args) => ({
    components: {Breadcrumbs, Item},
    setup() {
      return {args};
    },
    template: `
      <div style="width: 100vw;">
        <Breadcrumbs v-bind="args">
          <Item>Root</Item>
        </Breadcrumbs>
      </div>
    `
  }),
  name: '1 item'
};

export const Links: Story = {
  render: (args) => ({
    components: {Breadcrumbs, Item},
    setup() {
      return {args};
    },
    template: `
      <div style="width: 100vw;">
        <Breadcrumbs v-bind="args">
          <Item href="https://example.com">Example.com</Item>
          <Item href="https://example.com/foo">Foo</Item>
          <Item href="https://example.com/foo/bar">Bar</Item>
          <Item href="https://example.com/foo/bar/baz">Baz</Item>
          <Item href="https://example.com/foo/bar/baz/qux">Qux</Item>
        </Breadcrumbs>
      </div>
    `
  })
};
