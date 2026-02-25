import {action} from '@storybook/addon-actions';
import {ColorWheel} from '../src';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ColorWheel> = {
  title: 'ColorWheel',
  component: ColorWheel,
  args: {
    onChange: action('onChange'),
    onChangeEnd: action('onChangeEnd')
  },
  argTypes: {
    onChange: {
      table: {
        disable: true
      }
    },
    onChangeEnd: {
      table: {
        disable: true
      }
    },
    disabled: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'number'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;
type ControlledArgs = Record<string, unknown>;

export const Default: Story = {
  args: {
    modelValue: 0
  },
  render: (args) => ({
    components: {ColorWheel},
    setup() {
      return {args};
    },
    template: '<ColorWheel v-bind="args" />'
  })
};

function renderControlledHSL(args: ControlledArgs = {}) {
  return {
    components: {ColorWheel},
    setup() {
      let value = ref(0);
      let handleUpdate = (nextValue: number) => {
        value.value = nextValue;
        action('onChange')(nextValue);
        action('onChangeEnd')(nextValue);
      };

      return {
        args,
        value,
        handleUpdate
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <ColorWheel
          v-bind="args"
          :model-value="value"
          @update:model-value="handleUpdate" />
        <div>Value: {{value}}</div>
      </div>
    `
  };
}

export const Controlled: Story = {
  render: (args) => renderControlledHSL(args)
};

export const ControlledHSLRender: Story = {
  render: (args) => renderControlledHSL(args)
};

export const ControlledHSL: Story = {
  render: (args) => renderControlledHSL(args)
};
