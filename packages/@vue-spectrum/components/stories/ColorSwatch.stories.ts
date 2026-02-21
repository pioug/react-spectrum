import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorSwatch} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/ColorSwatch',
  component: VueColorSwatch
} satisfies Meta<typeof VueColorSwatch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ColorSwatchExampleRender = (args: {color?: string}) => ({
  components: {
    VueColorSwatch
  },
  setup() {
    return {
      args
    };
  },
  template: `
    <VueColorSwatch
      :color="args.color ?? 'rgb(255, 0, 0)'"
      label="Color swatch"
      style="width: 32px; height: 32px; border-radius: 4px;" />
  `
});

export const ColorSwatchExample: Story = {
  render: (args: {color?: string}) => ColorSwatchExampleRender(args),
  args: {
    color: 'rgb(255, 0, 0)'
  },
  argTypes: {
    color: {
      control: 'color'
    }
  }
};
