import {Flex} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Flex> = {
  title: 'Flex',
  component: Flex,
  args: {
    direction: 'row',
    gap: 'size-100',
    alignItems: 'center',
    justifyContent: 'start',
    wrap: false,
    reverse: false
  },
  argTypes: {
    alignItems: {
      control: 'select',
      options: [
        'start',
        'center',
        'end',
        'stretch',
        'baseline'
      ]
    },
    direction: {
      control: 'select',
      options: [
        'row',
        'column'
      ]
    },
    elementType: {
      control: 'text'
    },
    gap: {
      control: 'text'
    },
    justifyContent: {
      control: 'select',
      options: [
        'start',
        'center',
        'end',
        'space-between',
        'space-around',
        'space-evenly'
      ]
    },
    reverse: {
      control: 'boolean'
    },
    wrap: {
      control: 'boolean'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Flex},
    setup() {
      return {args};
    },
    template: `<Flex v-bind="args">
  <div style="padding: 8px 12px; border: 1px solid var(--spectrum-global-color-gray-300);">One</div>
  <div style="padding: 8px 12px; border: 1px solid var(--spectrum-global-color-gray-300);">Two</div>
  <div style="padding: 8px 12px; border: 1px solid var(--spectrum-global-color-gray-300);">Three</div>
</Flex>`
  })
};

export const Column: Story = {
  ...Default,
  args: {
    direction: 'column'
  }
};

export const Wrapped: Story = {
  ...Default,
  args: {
    wrap: true,
    gap: 'size-50'
  }
};

export const Reversed: Story = {
  ...Default,
  args: {
    reverse: true
  }
};
