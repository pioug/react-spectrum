import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorSlider} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/ColorSlider',
  component: VueColorSlider,
  excludeStories: ['ColorSliderExampleRender']
} satisfies Meta<typeof VueColorSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export function ColorSliderExampleRender(args: {channel?: string}) {
  return {
    components: {
      VueColorSlider
    },
    setup() {
      let value = ref(220);
      return {
        args,
        value
      };
    },
    template: `
      <VueColorSlider
        v-model="value"
        label="Hue"
        :channel="args.channel ?? 'hue'" />
    `
  };
}

export const ColorSliderExample: Story = {
  render: (args: {channel?: string}) => ColorSliderExampleRender(args),
  args: {
    channel: 'hue',
    defaultValue: 'hsl(0, 100%, 50%)'
  },
  argTypes: {
    channel: {
      control: 'select',
      options: ['hue', 'saturation', 'lightness', 'alpha']
    }
  }
};
