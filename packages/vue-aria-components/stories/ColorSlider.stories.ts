import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorSlider} from 'vue-aria-components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/ColorSlider',
  component: VueColorSlider,
  excludeStories: ['ColorSliderExampleRender']
} satisfies Meta<typeof VueColorSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

function hueFromDefault(value?: string): number {
  if (value == null) {
    return 0;
  }

  let match = value.match(/(-?\d+(\.\d+)?)\s*,/);
  if (match == null) {
    return 0;
  }

  return Number.parseFloat(match[1]) || 0;
}

function normalizeChannelLabel(channel?: string): string {
  if (channel == null || channel.length === 0) {
    return 'Hue';
  }

  return `${channel.slice(0, 1).toUpperCase()}${channel.slice(1)}`;
}

export function ColorSliderExampleRender(args: {channel?: string, defaultValue?: string}) {
  return {
    components: {
      VueColorSlider
    },
    setup() {
      let value = ref(hueFromDefault(args.defaultValue));

      return {
        args,
        channelLabel: normalizeChannelLabel(args.channel),
        value
      };
    },
    template: `
      <VueColorSlider
        v-model="value"
        class="react-aria-ColorSlider"
        data-rac=""
        :label="channelLabel"
        :channel="args.channel ?? 'hue'" />
    `
  };
}

export const ColorSliderExample: Story = {
  render: (args: {channel?: string, defaultValue?: string}) => ColorSliderExampleRender(args),
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
