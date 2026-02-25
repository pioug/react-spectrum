import {ColorSwatchPicker} from '../src';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
type SwatchItem = {
  color: string,
  id: string,
  label: string
};

const DEFAULT_ITEMS: SwatchItem[] = [
  {id: '#f00', color: '#f00', label: '#f00'},
  {id: '#0f0', color: '#0f0', label: '#0f0'},
  {id: '#0ff', color: '#0ff', label: '#0ff'},
  {id: '#00f', color: '#00f', label: '#00f'}
];

const MANY_ITEMS: SwatchItem[] = Array.from({length: 24}).map((_, index) => {
  let hue = Math.round((index / 24) * 360);
  let color = `hsl(${hue}, 80%, 50%)`;
  return {
    id: `swatch-${index}`,
    color,
    label: color
  };
});

const meta: Meta<typeof ColorSwatchPicker> = {
  title: 'ColorSwatchPicker',
  component: ColorSwatchPicker,
  args: {
    items: DEFAULT_ITEMS,
    modelValue: '#f00'
  },
  argTypes: {
    disabled: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    items: {
      table: {
        disable: true
      }
    },
    modelValue: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderSwatchPicker(args: StoryArgs, maxWidth?: string) {
  return {
    components: {ColorSwatchPicker},
    setup() {
      let selected = ref(typeof args.modelValue === 'string' ? args.modelValue : '');
      return {
        args,
        maxWidth,
        selected
      };
    },
    template: `
      <div :style="maxWidth ? {maxWidth} : undefined">
        <ColorSwatchPicker
          v-bind="args"
          :model-value="selected"
          @update:model-value="selected = $event" />
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => renderSwatchPicker(args)
};

export const ManySwatches: Story = {
  render: (args) => renderSwatchPicker(args, '360px'),
  args: {
    items: MANY_ITEMS,
    modelValue: 'swatch-0'
  }
};
