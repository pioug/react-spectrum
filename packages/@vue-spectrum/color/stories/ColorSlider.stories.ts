import {ColorSlider, ColorSwatch} from '../src';
import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const meta: Meta<typeof ColorSlider> = {
  title: 'ColorSlider',
  component: ColorSlider,
  args: {
    channel: 'red',
    label: 'Red',
    max: 255,
    min: 0,
    modelValue: 128
  },
  argTypes: {
    channel: {
      control: 'text'
    },
    description: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    id: {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    max: {
      control: 'number'
    },
    min: {
      control: 'number'
    },
    modelValue: {
      control: 'number'
    },
    step: {
      control: 'number'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderColorSlider(args: StoryArgs) {
  return {
    components: {ColorSlider},
    setup() {
      return {args};
    },
    template: '<ColorSlider v-bind="args" />'
  };
}

function renderControlled(args: StoryArgs) {
  return {
    components: {ColorSlider},
    setup() {
      let value = ref(typeof args.modelValue === 'number' ? args.modelValue : 128);
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
  render: (args) => renderColorSlider(args)
};

export const Controlled: Story = {
  render: (args) => renderControlled(args)
};

export const ContextualHelpStory: Story = {
  render: (args) => renderContextualHelp(args),
  args: {
    channel: 'hue',
    label: 'Hue',
    max: 360,
    min: 0,
    modelValue: 180
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
