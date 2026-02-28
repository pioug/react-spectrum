import {ColorArea, ColorEditor, ColorPicker, ColorSwatch, ColorSwatchPicker, ColorWheel} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const meta: Meta<typeof ColorPicker> = {
  title: 'ColorPicker',
  component: ColorPicker,
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
      return {args};
    },
    template: `
      <ColorPicker v-bind="args" default-value="#f00">
        <ColorEditor />
      </ColorPicker>
    `
  };
}

function renderCustom(args: StoryArgs) {
  return {
    components: {ColorArea, ColorPicker, ColorWheel},
    setup() {
      return {args};
    },
    template: `
      <ColorPicker v-bind="args" default-value="#f00">
        <ColorWheel />
        <ColorArea
          color-space="hsb"
          x-channel="saturation"
          y-channel="brightness"
          size="size-400"
          style="position: absolute; top: calc(50% - var(--spectrum-global-dimension-size-400)); left: calc(50% - var(--spectrum-global-dimension-size-400));" />
      </ColorPicker>
    `
  };
}

function renderSwatches(args: StoryArgs) {
  return {
    components: {ColorEditor, ColorPicker, ColorSwatch, ColorSwatchPicker},
    setup() {
      return {args};
    },
    template: `
      <ColorPicker v-bind="args" default-value="#A00">
        <div style="display: flex; flex-direction: column; gap: var(--spectrum-global-dimension-size-300);">
          <ColorEditor />
          <ColorSwatchPicker>
            <ColorSwatch color="#A00" />
            <ColorSwatch color="#f80" />
            <ColorSwatch color="#080" />
            <ColorSwatch color="#08f" />
            <ColorSwatch color="#088" />
            <ColorSwatch color="#008" />
          </ColorSwatchPicker>
        </div>
      </ColorPicker>
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
