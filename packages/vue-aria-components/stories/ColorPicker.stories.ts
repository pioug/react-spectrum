import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorPicker, VueColorSlider} from 'vue-aria-components';
import {ref, watch} from 'vue';

const meta = {
  title: 'React Aria Components/ColorPicker',
  component: VueColorPicker
} satisfies Meta<typeof VueColorPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function hueToHex(hueValue: number): string {
  let hue = ((Math.round(hueValue) % 360) + 360) % 360;
  let segment = hue / 60;
  let secondary = 1 - Math.abs((segment % 2) - 1);

  let red = 0;
  let green = 0;
  let blue = 0;

  if (segment >= 0 && segment < 1) {
    red = 1;
    green = secondary;
  } else if (segment >= 1 && segment < 2) {
    red = secondary;
    green = 1;
  } else if (segment >= 2 && segment < 3) {
    green = 1;
    blue = secondary;
  } else if (segment >= 3 && segment < 4) {
    green = secondary;
    blue = 1;
  } else if (segment >= 4 && segment < 5) {
    red = secondary;
    blue = 1;
  } else {
    red = 1;
    blue = secondary;
  }

  let channelToHex = (value: number) => Math.round(value * 255).toString(16).padStart(2, '0');
  return `#${channelToHex(red)}${channelToHex(green)}${channelToHex(blue)}`;
}

export const ColorPickerExample: Story = {
  render: () => ({
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
      <VueColorPicker
        v-model="color"
        class="react-aria-ColorPicker"
        data-rac=""
        label="Color picker" />
    `
  })
};

export const ColorPickerSliders: Story = {
  render: () => ({
    components: {
      VueColorPicker,
      VueColorSlider
    },
    setup() {
      let color = ref('#ff0000');
      let hue = ref(0);

      watch(hue, (nextHue) => {
        color.value = hueToHex(nextHue);
      });

      return {
        color,
        hue
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <VueColorPicker
          v-model="color"
          class="react-aria-ColorPicker"
          data-rac=""
          label="Color picker" />
        <VueColorSlider
          v-model="hue"
          class="react-aria-ColorSlider"
          data-rac=""
          channel="hue"
          label="Hue" />
      </div>
    `
  })
};
