import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorPicker, VueColorSlider, VueColorSwatch} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/ColorPicker',
  component: VueColorPicker
} satisfies Meta<typeof VueColorPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function ColorPickerExampleRender() {
  return {
    components: {
      VueColorPicker
    },
    setup() {
      let color = ref('#ff0000');
      return {
        color
      };
    },
    template: `
      <VueColorPicker v-model="color" />
    `
  };
}

export const ColorPickerExample: Story = {
  render: () => ColorPickerExampleRender()
};

function ColorPickerSlidersRender() {
  return {
    components: {
      VueColorSlider,
      VueColorSwatch
    },
    setup() {
      let hue = ref(0);
      let saturation = ref(50);
      let lightness = ref(50);
      return {
        hue,
        saturation,
        lightness
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; width: 220px;">
        <VueColorSlider v-model="hue" label="Hue" channel="hue" :min="0" :max="360" />
        <VueColorSlider v-model="saturation" label="Saturation" channel="saturation" :min="0" :max="100" />
        <VueColorSlider v-model="lightness" label="Lightness" channel="lightness" :min="0" :max="100" />
        <VueColorSwatch :color="'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)'" label="Preview" />
      </div>
    `
  };
}

export const ColorPickerSliders: Story = {
  render: () => ColorPickerSlidersRender()
};
