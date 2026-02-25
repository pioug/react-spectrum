import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {StatusLight} from '../src';

const variantOptions = [
  'positive',
  'negative',
  'notice',
  'info',
  'neutral',
  'celery',
  'chartreuse',
  'yellow',
  'magenta',
  'fuchsia',
  'purple',
  'indigo',
  'seafoam'
];

const meta: Meta<typeof StatusLight> = {
  title: 'StatusLight',
  component: StatusLight,
  args: {
    label: 'Status light of love',
    variant: 'positive'
  },
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: variantOptions
      }
    },
    isDisabled: {
      control: 'boolean'
    }
  }
};

export default meta;

type StatusLightStory = StoryObj<typeof meta>;

export const Default: StatusLightStory = {
  name: 'Default',
  render: (args) => ({
    components: {StatusLight},
    setup() {
      return {args};
    },
    template: '<StatusLight v-bind="args" />'
  })
};

export const Disabled: StatusLightStory = {
  args: {
    label: 'Sync unavailable',
    variant: 'negative',
    isDisabled: true
  },
  render: (args) => ({
    components: {StatusLight},
    setup() {
      return {args};
    },
    template: '<StatusLight v-bind="args" />'
  })
};

export const RoleStatus: StatusLightStory = {
  args: {
    label: 'Sync complete',
    role: 'status',
    variant: 'info'
  },
  name: 'role: status',
  render: (args) => ({
    components: {StatusLight},
    setup() {
      return {args};
    },
    template: '<StatusLight v-bind="args" />'
  })
};

export const Variants: StatusLightStory = {
  render: () => ({
    components: {StatusLight},
    setup() {
      return {variants: variantOptions};
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;">
        <StatusLight
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          :label="variant" />
      </div>
    `
  })
};
