import {InlineAlert} from '../src';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = InstanceType<typeof InlineAlert>['$props'] & {content: string, title: string};

const meta: Meta<StoryArgs> = {
  title: 'InlineAlert',
  component: InlineAlert,
  args: {
    title: 'Title',
    content: 'Content'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'positive', 'notice', 'negative']
    },
    title: {
      control: 'text'
    },
    content: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {InlineAlert},
    setup() {
      return {args};
    },
    template: '<InlineAlert v-bind="args" :title="args.title">{{ args.content }}</InlineAlert>'
  })
};

export const Dynamic: Story = {
  render: (args) => ({
    components: {InlineAlert},
    setup() {
      let shown = ref(false);
      let onToggle = () => {
        shown.value = !shown.value;
      };

      return {
        args,
        onToggle,
        shown
      };
    },
    template: `
      <div>
        <button type="button" @click="onToggle">
          {{ shown ? 'Hide Alert' : 'Show Alert' }}
        </button>
        <InlineAlert v-if="shown" v-bind="args" :title="args.title" auto-focus style="margin-top: 12px;">
          {{ args.content }}
        </InlineAlert>
      </div>
    `
  })
};
