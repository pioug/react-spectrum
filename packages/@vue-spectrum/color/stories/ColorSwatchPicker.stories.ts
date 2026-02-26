import {ColorSwatchPicker} from '../src';
import {ref, watch} from 'vue';
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

const MANY_ITEMS: SwatchItem[] = Array.from({length: 24}).map(() => {
  let color = `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
  return {
    id: color,
    color,
    label: color
  };
});

const meta: Meta<typeof ColorSwatchPicker> = {
  title: 'ColorSwatchPicker',
  component: ColorSwatchPicker,
  parameters: {
    actions: {
      argTypesRegex: '^$'
    }
  },
  argTypes: {
    value: {
      control: 'color'
    },
    rounding: {
      control: 'radio',
      options: ['none', 'default', 'full']
    },
    size: {
      control: 'radio',
      options: ['XS', 'S', 'M', 'L']
    },
    density: {
      control: 'radio',
      options: ['compact', 'regular', 'spacious']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderSwatchPicker(args: StoryArgs, items = DEFAULT_ITEMS, defaultColor = '#f00', maxWidth?: string) {
  return {
    components: {ColorSwatchPicker},
    setup() {
      let selected = ref(typeof args.value === 'string' ? args.value : defaultColor);

      watch(() => args.value, (nextValue) => {
        if (typeof nextValue === 'string') {
          selected.value = nextValue;
        }
      });

      return {
        args,
        items,
        maxWidth,
        selected
      };
    },
    template: `
      <div :style="maxWidth ? {maxWidth} : undefined">
        <ColorSwatchPicker
          v-bind="args"
          :items="items"
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
  render: (args) => renderSwatchPicker(args, MANY_ITEMS, '')
};
