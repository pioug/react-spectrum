import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorSwatch} from 'vue-aria-components';

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
    let color = args.color ?? 'rgba(255, 255, 255, 0)';
    let label = args.color ? 'vibrant red' : 'transparent';

    return {
      color,
      label
    };
  },
  template: `
    <VueColorSwatch
      class="react-aria-ColorSwatch"
      data-rac=""
      :label="label"
      :color="color"
      :style="{
        background: \`linear-gradient(\${color}, \${color}), repeating-conic-gradient(rgb(204, 204, 204) 0% 25%, white 0% 50%) 50% / 16px 16px\`,
        forcedColorAdjust: 'none',
        width: '32px',
        height: '32px',
        borderRadius: '4px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset'
      }" />
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
