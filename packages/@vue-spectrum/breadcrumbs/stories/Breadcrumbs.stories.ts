import {Breadcrumbs} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Breadcrumbs',
  component: Breadcrumbs,
  argTypes: {
    current: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    items: {
      table: {
        disable: true
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Breadcrumbs},
    setup() {
      return {args};
    },
    template: '<Breadcrumbs v-bind="args">Example</Breadcrumbs>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    disabled: true
  }
};
