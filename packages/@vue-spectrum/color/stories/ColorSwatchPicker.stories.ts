import {ColorSwatch, ColorSwatchPicker} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ColorSwatchPicker> = {
  title: 'ColorSwatchPicker',
  component: ColorSwatchPicker,
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

let randomColors = Array.from(Array(24)).map(() => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`);

export const Default: Story = {
  render: (args) => ({
    components: {ColorSwatch, ColorSwatchPicker},
    setup() {
      return {args};
    },
    template: `
      <ColorSwatchPicker v-bind="args" default-value="#f00">
        <ColorSwatch color="#f00" />
        <ColorSwatch color="#0f0" />
        <ColorSwatch color="#0ff" />
        <ColorSwatch color="#00f" />
      </ColorSwatchPicker>
    `
  })
};

export const ManySwatches: Story = {
  render: (args) => ({
    components: {ColorSwatch, ColorSwatchPicker},
    setup() {
      return {args, randomColors};
    },
    template: `
      <ColorSwatchPicker v-bind="args" style="max-width: var(--spectrum-global-dimension-size-3000);">
        <ColorSwatch
          v-for="color in randomColors"
          :key="color"
          :color="color" />
      </ColorSwatchPicker>
    `
  })
};
