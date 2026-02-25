import {ButtonGroup} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ButtonGroup> = {
  title: 'ButtonGroup',
  component: ButtonGroup,
  args: {
    orientation: 'horizontal',
    align: 'start'
  },
  argTypes: {
    align: {
      control: 'select',
      options: [
        'start',
        'center',
        'end'
      ]
    },
    elementType: {
      control: 'text'
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
    components: {ButtonGroup},
    setup() {
      return {args};
    },
    template: `<ButtonGroup v-bind="args">
  <button type="button">Cut</button>
  <button type="button">Copy</button>
  <button type="button">Paste</button>
</ButtonGroup>`
  })
};

export const Vertical: Story = {
  ...Default,
  args: {
    orientation: 'vertical'
  }
};

export const Centered: Story = {
  ...Default,
  args: {
    align: 'center'
  }
};

export const EndAligned: Story = {
  ...Default,
  args: {
    align: 'end'
  }
};
