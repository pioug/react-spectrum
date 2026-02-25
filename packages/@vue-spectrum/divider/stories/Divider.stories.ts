import {Divider} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Divider> = {
  title: 'Divider',
  component: Divider,
  args: {
    orientation: 'horizontal',
    decorative: true
  },
  argTypes: {
    decorative: {
      control: 'boolean'
    },
    orientation: {
      control: 'select',
      options: [
        'horizontal',
        'vertical'
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Divider},
    setup() {
      return {args};
    },
    template: `<div style="display: flex; flex-direction: column; gap: 10px; width: 260px;">
  <span>Section A</span>
  <Divider v-bind="args"></Divider>
  <span>Section B</span>
</div>`
  })
};

export const Vertical: Story = {
  ...Default,
  args: {
    orientation: 'vertical',
    decorative: false
  }
};

export const SemanticSeparator: Story = {
  ...Default,
  args: {
    decorative: false
  }
};

export const HorizontalSemantic: Story = {
  ...Default,
  args: {
    orientation: 'horizontal',
    decorative: false
  }
};
