import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorArea, VueColorSlider} from 'vue-aria-components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/ColorArea',
  component: VueColorArea,
  excludeStories: ['ColorAreaExampleRender']
} satisfies Meta<typeof VueColorArea>;

export default meta;

type Story = StoryObj<typeof meta>;

type ColorAreaArgs = {
  defaultValue?: string,
  xChannel?: string,
  yChannel?: string
};

function normalizeChannelLabel(channel?: string): string {
  if (channel == null || channel.length === 0) {
    return 'Hue';
  }

  return `${channel.slice(0, 1).toUpperCase()}${channel.slice(1)}`;
}

export const ColorAreaExampleRender = (args: ColorAreaArgs, initial: {x: number, y: number, z: number}) => ({
  components: {
    VueColorArea,
    VueColorSlider
  },
  setup() {
    let xy = ref({x: initial.x, y: initial.y});
    let z = ref(initial.z);

    return {
      args,
      xy,
      z,
      zLabel: normalizeChannelLabel(args.xChannel === 'hue' ? 'lightness' : 'blue')
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <VueColorArea
        v-model="xy"
        class="react-aria-ColorArea"
        data-rac="" />
      <VueColorSlider
        v-model="z"
        class="react-aria-ColorSlider"
        data-rac=""
        :label="zLabel"
        :channel="args.xChannel === 'hue' ? 'lightness' : 'blue'"
        :max="args.xChannel === 'hue' ? 100 : 255" />
    </div>
  `
});

export const ColorAreaExample: Story = {
  render: (args: ColorAreaArgs) => ColorAreaExampleRender(args, {x: 39, y: 42, z: 237}),
  args: {
    defaultValue: 'rgb(100, 149, 237)',
    xChannel: 'red',
    yChannel: 'green'
  },
  argTypes: {
    xChannel: {
      control: 'select',
      options: ['red', 'green', 'blue']
    },
    yChannel: {
      control: 'select',
      options: ['red', 'green', 'blue']
    }
  }
};

export const ColorAreaHSL: Story = {
  render: (args: ColorAreaArgs) => ColorAreaExampleRender(args, {x: 61, y: 21, z: 66}),
  args: {
    defaultValue: 'hsl(219, 79%, 66%)',
    xChannel: 'hue',
    yChannel: 'saturation'
  },
  argTypes: {
    xChannel: {
      control: 'select',
      options: ['hue', 'saturation', 'lightness']
    },
    yChannel: {
      control: 'select',
      options: ['hue', 'saturation', 'lightness']
    }
  }
};

export const ColorAreaHSB: Story = {
  render: (args: ColorAreaArgs) => ColorAreaExampleRender(args, {x: 61, y: 21, z: 66}),
  args: {
    defaultValue: 'hsb(219, 79%, 66%)',
    xChannel: 'hue',
    yChannel: 'saturation'
  },
  argTypes: {
    xChannel: {
      control: 'select',
      options: ['hue', 'saturation', 'brightness']
    },
    yChannel: {
      control: 'select',
      options: ['hue', 'saturation', 'brightness']
    }
  }
};
