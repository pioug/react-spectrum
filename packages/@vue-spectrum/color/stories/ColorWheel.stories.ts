import {action} from 'storybook/actions';
import {ColorWheel} from '../src';
import {ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'ColorWheel',
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
    isDisabled: {
      control: 'boolean'
    },
    size: {
      control: 'text'
    },
    defaultValue: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;
type ControlledArgs = Record<string, unknown>;

function resolveHue(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    let hslMatch = value.match(/hsl\(\s*([+-]?\d+(\.\d+)?)/i);
    if (hslMatch) {
      return Number.parseFloat(hslMatch[1]);
    }
  }

  return 0;
}

export const Default: Story = {
  args: {
    defaultValue: 'hsl(0, 100%, 50%)'
  },
  render: (args) => ({
    components: {ColorWheel},
    setup() {
      let hue = ref(resolveHue(args.value ?? args.defaultValue));
      let handleUpdate = (nextValue: number) => {
        hue.value = nextValue;

        if (typeof args.onChange === 'function') {
          args.onChange(nextValue);
        }

        if (typeof args.onChangeEnd === 'function') {
          args.onChangeEnd(nextValue);
        }
      };

      watch(() => args.value, (nextValue) => {
        if (nextValue != null) {
          hue.value = resolveHue(nextValue);
        }
      });

      watch(() => args.defaultValue, (nextValue) => {
        if (args.value == null && nextValue != null) {
          hue.value = resolveHue(nextValue);
        }
      });

      return {
        args,
        handleUpdate,
        hue
      };
    },
    template: '<ColorWheel :is-disabled="Boolean(args.isDisabled)" :model-value="hue" @update:model-value="handleUpdate" />'
  })
};

function renderControlledHSL(args: ControlledArgs = {}) {
  return {
    components: {ColorWheel},
    setup() {
      let value = ref(resolveHue(args.value ?? args.defaultValue));
      let handleUpdate = (nextValue: number) => {
        value.value = nextValue;

        if (typeof args.onChange === 'function') {
          args.onChange(nextValue);
        } else {
          action('onChange')(nextValue);
        }

        if (typeof args.onChangeEnd === 'function') {
          args.onChangeEnd(nextValue);
        } else {
          action('onChangeEnd')(nextValue);
        }
      };

      watch(() => args.value, (nextValue) => {
        if (nextValue != null) {
          value.value = resolveHue(nextValue);
        }
      });

      return {
        args,
        value,
        handleUpdate
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <ColorWheel
          :is-disabled="Boolean(args.isDisabled)"
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
