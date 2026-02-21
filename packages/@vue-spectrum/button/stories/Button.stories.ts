import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Button} from '@vue-spectrum/button';
import {Provider} from '@vue-spectrum/provider';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';

type ButtonStoryArgs = {
  variant: 'cta' | 'primary' | 'secondary';
  disabled: boolean;
};

const meta = {
  title: 'Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    variant: 'cta',
    disabled: false
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['cta', 'primary', 'secondary']
    },
    disabled: {
      control: 'boolean'
    }
  },
  render: (args: ButtonStoryArgs) => ({
    components: {
      Button,
      Provider
    },
    setup() {
      return {
        args,
        theme: defaultTheme
      };
    },
    template: `
      <Provider :theme="theme" color-scheme="light" scale="medium" style="padding: 24px;">
        <Button :variant="args.variant" :disabled="args.disabled">
          Submit
        </Button>
      </Provider>
    `
  })
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary'
  }
};
