import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorArea} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/ColorArea',
  component: VueColorArea,
  excludeStories: ['ColorAreaExampleRender']
} satisfies Meta<typeof VueColorArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ColorAreaExampleRender = (args: {xChannel?: string, yChannel?: string}) => ({
  components: {
    VueColorArea
  },
  setup() {
    let value = ref({x: 40, y: 50});
    return {
      args,
      value
    };
  },
  template: `
    <VueColorArea
      v-model="value"
      label="Color area" />
  `
});

export const ColorAreaExample: Story = {
  render: (args: {xChannel?: string, yChannel?: string}) => ColorAreaExampleRender(args),
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
  render: ColorAreaExample.render,
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
  render: ColorAreaExample.render,
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
