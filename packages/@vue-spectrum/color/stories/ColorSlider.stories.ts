import {ColorSlider, ColorSwatch} from '../src';
import {action} from '@storybook/addon-actions';
import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
type SliderChannel = 'red' | 'green' | 'blue' | 'hue' | 'saturation' | 'lightness' | 'brightness' | 'alpha';

const meta: Meta<typeof ColorSlider> = {
  title: 'ColorSlider',
  component: ColorSlider,
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
    contextualHelp: {
      table: {
        disable: true
      }
    },
    channel: {
      table: {
        disable: true
      }
    },
    label: {
      control: 'text'
    },
    'aria-label': {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    showValueLabel: {
      control: 'boolean'
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical']
    },
    width: {
      control: 'text'
    },
    height: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function resolveChannelRange(channel: SliderChannel): {max: number, min: number} {
  if (channel === 'red' || channel === 'green' || channel === 'blue') {
    return {min: 0, max: 255};
  }

  if (channel === 'alpha' || channel === 'saturation' || channel === 'lightness' || channel === 'brightness') {
    return {min: 0, max: 100};
  }

  return {min: 0, max: 360};
}

function parseHexColor(value: string): {blue: number, green: number, red: number} | null {
  let normalized = value.trim();
  if (/^#[0-9a-f]{3}$/i.test(normalized)) {
    normalized = `#${normalized.slice(1).split('').map((char) => `${char}${char}`).join('')}`;
  }

  if (!/^#[0-9a-f]{6}$/i.test(normalized)) {
    return null;
  }

  return {
    red: Number.parseInt(normalized.slice(1, 3), 16),
    green: Number.parseInt(normalized.slice(3, 5), 16),
    blue: Number.parseInt(normalized.slice(5, 7), 16)
  };
}

function resolveChannelValue(value: unknown, channel: SliderChannel): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    let parsedHex = parseHexColor(value);
    if (parsedHex) {
      if (channel === 'red') {
        return parsedHex.red;
      }
      if (channel === 'green') {
        return parsedHex.green;
      }
      if (channel === 'blue') {
        return parsedHex.blue;
      }
    }
  }

  return undefined;
}

function toSliderProps(args: StoryArgs): StoryArgs {
  let channel = (typeof args.channel === 'string' ? args.channel : 'hue') as SliderChannel;
  let range = resolveChannelRange(channel);
  let min = typeof args.min === 'number' && Number.isFinite(args.min) ? args.min : range.min;
  let max = typeof args.max === 'number' && Number.isFinite(args.max) ? args.max : range.max;
  let derivedValue = resolveChannelValue(args.modelValue ?? args.value ?? args.defaultValue, channel);
  let modelValue = typeof derivedValue === 'number' ? derivedValue : Math.round((min + max) / 2);

  return {
    'aria-label': typeof args['aria-label'] === 'string' ? args['aria-label'] : undefined,
    'aria-labelledby': typeof args['aria-labelledby'] === 'string' ? args['aria-labelledby'] : undefined,
    channel,
    description: typeof args.description === 'string' ? args.description : '',
    disabled: Boolean(args.disabled),
    id: typeof args.id === 'string' ? args.id : undefined,
    isDisabled: typeof args.isDisabled === 'boolean' ? args.isDisabled : undefined,
    label: typeof args.label === 'string' ? args.label : '',
    max,
    min,
    modelValue,
    step: typeof args.step === 'number' && Number.isFinite(args.step) ? args.step : 1
  };
}

function renderColorSlider(args: StoryArgs) {
  return {
    components: {ColorSlider},
    setup() {
      let sliderArgs = computed(() => toSliderProps(args));
      let onChange = (value: number) => {
        if (typeof args.onChange === 'function') {
          args.onChange(value);
        }
      };
      let onChangeEnd = (value: number) => {
        if (typeof args.onChangeEnd === 'function') {
          args.onChangeEnd(value);
        }
      };

      return {onChange, onChangeEnd, sliderArgs};
    },
    template: '<ColorSlider v-bind="sliderArgs" @update:model-value="onChange($event)" @change="onChangeEnd($event)" />'
  };
}

function renderControlled(args: StoryArgs) {
  return {
    components: {ColorSlider},
    setup() {
      let channel = (typeof args.channel === 'string' ? args.channel : 'hue') as SliderChannel;
      let resolvedValue = resolveChannelValue(args.modelValue ?? args.value ?? args.defaultValue, channel);
      let value = ref(typeof resolvedValue === 'number' ? resolvedValue : 128);
      return {
        args,
        value
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 360px;">
        <ColorSlider
          v-bind="args"
          :model-value="value"
          @update:model-value="value = $event" />
        <output>Value: {{value}}</output>
      </div>
    `
  };
}

function renderContextualHelp(args: StoryArgs) {
  return {
    components: {ColorSlider},
    setup() {
      return {args};
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 420px;">
        <ColorSlider v-bind="args" />
        <aside style="font-size: 12px; opacity: 0.8;">
          Hue is a degree on the color wheel from 0 to 360. 0 (or 360) is red, 120 is green, and 240 is blue.
        </aside>
      </div>
    `
  };
}

function renderRGBA(args: StoryArgs) {
  return {
    components: {ColorSlider, ColorSwatch},
    setup() {
      let red = ref(255);
      let green = ref(0);
      let blue = ref(255);
      let alpha = ref(100);

      let color = computed(() => `rgba(${red.value}, ${green.value}, ${blue.value}, ${alpha.value / 100})`);

      return {
        alpha,
        args,
        blue,
        color,
        green,
        red
      };
    },
    template: `
      <div role="group" aria-label="RGBA Color Picker" style="display: flex; gap: 24px; align-items: center;">
        <div style="display: grid; gap: 8px; min-width: 280px;">
          <ColorSlider v-bind="args" label="Red" channel="red" :min="0" :max="255" :model-value="red" @update:model-value="red = $event" />
          <ColorSlider v-bind="args" label="Green" channel="green" :min="0" :max="255" :model-value="green" @update:model-value="green = $event" />
          <ColorSlider v-bind="args" label="Blue" channel="blue" :min="0" :max="255" :model-value="blue" @update:model-value="blue = $event" />
          <ColorSlider v-bind="args" label="Alpha" channel="alpha" :min="0" :max="100" :model-value="alpha" @update:model-value="alpha = $event" />
        </div>
        <div style="display: grid; gap: 8px;">
          <ColorSwatch :color="color" label="RGBA color" />
          <code>{{color}}</code>
        </div>
      </div>
    `
  };
}

function renderHSLA(args: StoryArgs) {
  return {
    components: {ColorSlider, ColorSwatch},
    setup() {
      let hue = ref(0);
      let saturation = ref(100);
      let lightness = ref(50);
      let alpha = ref(100);

      let color = computed(() => `hsla(${hue.value}, ${saturation.value}%, ${lightness.value}%, ${alpha.value / 100})`);

      return {
        alpha,
        args,
        color,
        hue,
        lightness,
        saturation
      };
    },
    template: `
      <div role="group" aria-label="HSLA Color Picker" style="display: flex; gap: 24px; align-items: center;">
        <div style="display: grid; gap: 8px; min-width: 280px;">
          <ColorSlider v-bind="args" label="Hue" channel="hue" :min="0" :max="360" :model-value="hue" @update:model-value="hue = $event" />
          <ColorSlider v-bind="args" label="Saturation" channel="saturation" :min="0" :max="100" :model-value="saturation" @update:model-value="saturation = $event" />
          <ColorSlider v-bind="args" label="Lightness" channel="lightness" :min="0" :max="100" :model-value="lightness" @update:model-value="lightness = $event" />
          <ColorSlider v-bind="args" label="Alpha" channel="alpha" :min="0" :max="100" :model-value="alpha" @update:model-value="alpha = $event" />
        </div>
        <div style="display: grid; gap: 8px;">
          <ColorSwatch :color="color" label="HSLA color" />
          <code>{{color}}</code>
        </div>
      </div>
    `
  };
}

function renderHSBA(args: StoryArgs) {
  return {
    components: {ColorSlider, ColorSwatch},
    setup() {
      let hue = ref(0);
      let saturation = ref(100);
      let brightness = ref(50);
      let alpha = ref(100);

      let color = computed(() => {
        let adjustedLightness = Math.max(0, Math.min(100, Math.round(brightness.value * 0.5)));
        return `hsla(${hue.value}, ${saturation.value}%, ${adjustedLightness}%, ${alpha.value / 100})`;
      });

      return {
        alpha,
        args,
        brightness,
        color,
        hue,
        saturation
      };
    },
    template: `
      <div role="group" aria-label="HSBA Color Picker" style="display: flex; gap: 24px; align-items: center;">
        <div style="display: grid; gap: 8px; min-width: 280px;">
          <ColorSlider v-bind="args" label="Hue" channel="hue" :min="0" :max="360" :model-value="hue" @update:model-value="hue = $event" />
          <ColorSlider v-bind="args" label="Saturation" channel="saturation" :min="0" :max="100" :model-value="saturation" @update:model-value="saturation = $event" />
          <ColorSlider v-bind="args" label="Brightness" channel="brightness" :min="0" :max="100" :model-value="brightness" @update:model-value="brightness = $event" />
          <ColorSlider v-bind="args" label="Alpha" channel="alpha" :min="0" :max="100" :model-value="alpha" @update:model-value="alpha = $event" />
        </div>
        <div style="display: grid; gap: 8px;">
          <ColorSwatch :color="color" label="HSBA color" />
          <code>{{color}}</code>
        </div>
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => renderColorSlider(args),
  args: {
    defaultValue: '#800000',
    channel: 'red'
  }
};

export const Controlled: Story = {
  render: (args) => renderControlled(args),
  args: {
    value: '#800000',
    channel: 'red'
  }
};

export const ContextualHelpStory: Story = {
  render: (args) => renderContextualHelp(args),
  args: {
    channel: 'hue',
    defaultValue: 'hsb(0, 100%, 50%)'
  },
  name: 'contextual help'
};

export const RGBA: Story = {
  render: (args) => renderRGBA(args)
};

export const HSLA: Story = {
  render: (args) => renderHSLA(args)
};

export const HSBA: Story = {
  render: (args) => renderHSBA(args)
};
