import {ColorArea, ColorEditor, ColorPicker, ColorSwatchPicker, ColorWheel} from '../src';
import {ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
type SwatchItem = {
  color: string,
  id: string,
  label: string
};

const DEFAULT_SWATCH_ITEMS: SwatchItem[] = [
  {id: '#A00', color: '#A00', label: '#A00'},
  {id: '#f80', color: '#f80', label: '#F80'},
  {id: '#080', color: '#080', label: '#080'},
  {id: '#08f', color: '#08f', label: '#08F'},
  {id: '#088', color: '#088', label: '#088'},
  {id: '#008', color: '#008', label: '#008'}
];

const meta: Meta<typeof ColorPicker> = {
  title: 'ColorPicker',
  component: ColorPicker,
  parameters: {
    actions: {
      argTypesRegex: '^$'
    }
  },
  argTypes: {
    value: {
      control: 'color'
    },
    label: {
      control: 'text'
    },
    rounding: {
      control: 'radio',
      options: ['default', 'none', 'full']
    },
    size: {
      control: 'radio',
      options: ['XS', 'S', 'M', 'L']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderDefault(args: StoryArgs) {
  return {
    components: {ColorEditor, ColorPicker},
    setup() {
      let color = ref(typeof args.value === 'string' ? args.value : '#f00');

      watch(() => args.value, (nextValue) => {
        if (typeof nextValue === 'string') {
          color.value = nextValue;
        }
      });

      return {
        args,
        color
      };
    },
    template: `
      <div style="display: grid; gap: 12px; max-width: 320px;">
        <ColorPicker
          v-bind="args"
          :model-value="color"
          @update:model-value="color = $event" />
        <ColorEditor
          :model-value="color"
          @update:model-value="color = $event" />
      </div>
    `
  };
}

function renderCustom(args: StoryArgs) {
  return {
    components: {ColorArea, ColorPicker, ColorWheel},
    setup() {
      let color = ref(typeof args.value === 'string' ? args.value : '#f00');

      watch(() => args.value, (nextValue) => {
        if (typeof nextValue === 'string') {
          color.value = nextValue;
        }
      });

      return {
        args,
        color
      };
    },
    template: `
      <div style="display: grid; gap: 12px; max-width: 360px;">
        <ColorPicker
          v-bind="args"
          :model-value="color"
          @update:model-value="color = $event" />
        <ColorWheel
          :model-value="color"
          @update:model-value="color = $event" />
        <ColorArea
          label="Saturation/Brightness"
          :model-value="{x: 65, y: 42}" />
      </div>
    `
  };
}

function renderSwatches(args: StoryArgs) {
  return {
    components: {ColorPicker, ColorSwatchPicker},
    setup() {
      let color = ref(typeof args.value === 'string' ? args.value : '#A00');

      watch(() => args.value, (nextValue) => {
        if (typeof nextValue === 'string') {
          color.value = nextValue;
        }
      });

      return {
        args,
        color,
        items: DEFAULT_SWATCH_ITEMS
      };
    },
    template: `
      <div style="display: grid; gap: 12px; max-width: 420px;">
        <ColorPicker
          v-bind="args"
          :model-value="color"
          @update:model-value="color = $event" />
        <ColorSwatchPicker
          :items="items"
          :model-value="color"
          @update:model-value="color = $event" />
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => renderDefault(args)
};

export const Custom: Story = {
  render: (args) => renderCustom(args)
};

export const Swatches: Story = {
  render: (args) => renderSwatches(args)
};
