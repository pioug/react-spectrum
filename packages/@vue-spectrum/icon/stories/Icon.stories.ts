import {Icon} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Icon> = {
  title: 'Icons/Custom',
  component: Icon,
  args: {
    label: 'Example icon',
    size: 'M'
  },
  argTypes: {
    color: {
      control: 'text'
    },
    elementType: {
      control: 'text'
    },
    hidden: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    size: {
      control: 'select',
      options: [
        'XXS',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL'
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Icon},
    setup() {
      return {args};
    },
    template: '<Icon v-bind="args"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7" fill="currentColor" /></svg></Icon>'
  })
};

export const Large: Story = {
  ...Default,
  args: {
    size: 'XL'
  }
};

export const CustomColor: Story = {
  ...Default,
  args: {
    color: '#1473e6'
  }
};

export const Decorative: Story = {
  ...Default,
  args: {
    hidden: true,
    label: ''
  }
};
