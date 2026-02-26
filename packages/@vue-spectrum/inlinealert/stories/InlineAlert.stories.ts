import {Button} from '@vue-spectrum/button';
import {InlineAlert} from '../src';
import {h, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = InstanceType<typeof InlineAlert>['$props'] & {content: string, title: string};

function renderAlertChildren(args: StoryArgs) {
  return [
    h('h3', {class: 'spectrum-InLineAlert-heading'}, args.title),
    h('section', {class: 'spectrum-InLineAlert-content'}, args.content)
  ];
}

function pickInlineAlertProps(args: StoryArgs) {
  return {
    autoFocus: args.autoFocus,
    variant: args.variant
  };
}

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
    setup() {
      return () => h(InlineAlert, pickInlineAlertProps(args), {
        default: () => renderAlertChildren(args)
      });
    }
  })
};

export const Dynamic: Story = {
  render: (args) => ({
    components: {Button, InlineAlert},
    setup() {
      let shown = ref(false);
      let onToggle = () => {
        shown.value = !shown.value;
      };

      return {
        args,
        onToggle,
        pickInlineAlertProps,
        shown
      };
    },
    template: `
      <div>
        <Button variant="primary" @click="onToggle">
          {{ shown ? 'Hide Alert' : 'Show Alert' }}
        </Button>
        <InlineAlert v-if="shown" v-bind="pickInlineAlertProps(args)" auto-focus>
          <h3 class="spectrum-InLineAlert-heading">{{ args.title }}</h3>
          <section class="spectrum-InLineAlert-content">{{ args.content }}</section>
        </InlineAlert>
      </div>
    `
  })
};
