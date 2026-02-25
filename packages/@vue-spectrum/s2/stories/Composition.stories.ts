import {Button, Provider, Switch, TextField} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Provider> = {
  title: 'S2/Composition',
  component: Provider,
  args: {
    colorScheme: 'light',
    dir: 'ltr',
    scale: 'medium'
  },
  argTypes: {
    colorScheme: {
      control: 'select',
      options: ['light', 'dark']
    },
    dir: {
      control: 'radio',
      options: ['ltr', 'rtl']
    },
    locale: {
      control: 'text'
    },
    scale: {
      control: 'select',
      options: ['medium', 'large']
    },
    theme: {
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
    components: {Button, Provider, Switch, TextField},
    setup() {
      return {args};
    },
    template: `
      <Provider v-bind="args">
        <div style="display: grid; gap: 12px; max-width: 320px; padding: 16px;">
          <TextField label="Project name" />
          <Switch label="Enable sync" />
          <Button variant="primary">Save changes</Button>
        </div>
      </Provider>
    `
  })
};

export const DarkScheme: Story = {
  ...Default,
  args: {
    colorScheme: 'dark'
  }
};

export const LargeScale: Story = {
  ...Default,
  args: {
    scale: 'large'
  }
};

export const RightToLeft: Story = {
  ...Default,
  args: {
    dir: 'rtl',
    locale: 'ar-AE'
  }
};
