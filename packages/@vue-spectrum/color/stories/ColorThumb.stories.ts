import {ColorSwatch, parseColor} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {computed} from 'vue';

type ColorChannels = {
  alpha: number,
  blue: number,
  green: number,
  red: number
};

function toColorString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (
    value &&
    typeof value === 'object' &&
    'red' in value &&
    'green' in value &&
    'blue' in value &&
    'alpha' in value
  ) {
    let channels = value as ColorChannels;
    return `rgba(${channels.red}, ${channels.green}, ${channels.blue}, ${channels.alpha})`;
  }

  return 'rgba(255, 0, 0, 1)';
}

const meta: Meta<typeof ColorSwatch> = {
  title: 'ColorThumb',
  component: ColorSwatch,
  argTypes: {
    value: {
      control: 'object',
      table: {
        disable: true
      }
    },
    isDisabled: {
      control: 'boolean'
    },
    isDragging: {
      control: 'boolean'
    },
    isFocused: {
      control: 'boolean'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: {
      red: 255,
      green: 0,
      blue: 0,
      alpha: 1
    }
  },
  render: (args) => ({
    components: {ColorSwatch},
    setup() {
      let resolvedArgs = computed(() => {
        let {value, ...rest} = args;
        return {
          ...rest,
          color: parseColor(toColorString(value))
        };
      });

      return {resolvedArgs};
    },
    template: '<ColorSwatch v-bind="resolvedArgs" label="Color thumb" />'
  })
};

export const Alpha: Story = {
  ...Default,
  args: {
    value: {
      red: 255,
      green: 255,
      blue: 255,
      alpha: 0
    }
  }
};
