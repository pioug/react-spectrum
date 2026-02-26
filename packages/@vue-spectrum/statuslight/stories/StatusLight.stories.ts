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
  args: {
    children: 'Status light of love',
    variant: 'positive'
  },
  name: 'Default',
  render: (args) => ({
    components: {StatusLight},
    setup() {
      return {args};
    },
    template: '<StatusLight v-bind="args">{{args.children}}</StatusLight>'
  })
};
