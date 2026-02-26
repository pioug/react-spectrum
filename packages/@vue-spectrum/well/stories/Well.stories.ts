import {Well} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

function resolveChildren(children: unknown): string {
  if (typeof children === 'string') {
    return children;
  }

  if (
    children &&
    typeof children === 'object' &&
    'props' in children &&
    children.props &&
    typeof children.props === 'object' &&
    'children' in children.props &&
    typeof children.props.children === 'string'
  ) {
    return children.props.children;
  }

  return 'This is a React Spectrum Well';
}

const meta = {
  title: 'Well',
  component: Well,
  argTypes: {
    children: {
      control: 'object'
    }
  }
} satisfies Meta<typeof Well>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: {
      key: null,
      ref: null,
      props: {
        children: 'This is a React Spectrum Well'
      }
    }
  },
  render: (args) => ({
    components: {Well},
    setup() {
      return {args, resolveChildren};
    },
    template: '<Well v-bind="args">{{ resolveChildren(args.children) }}</Well>'
  })
};
