import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorSwatch} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/ColorSwatch',
  component: VueColorSwatch
} satisfies Meta<typeof VueColorSwatch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ColorSwatchExampleRender = (args: {color?: string}) => ({
  setup() {
    let color = args.color ?? 'rgb(255, 0, 0)';
    let swatchStyle = {
      background: `linear-gradient(${color}, ${color}), repeating-conic-gradient(rgb(204, 204, 204) 0% 25%, white 0% 50%) 50% / 16px 16px`,
      forcedColorAdjust: 'none',
      width: '32px',
      height: '32px',
      borderRadius: '4px',
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset'
    };

    return {
      swatchStyle
    };
  },
  template: `
    <div role="img" aria-roledescription="color swatch" aria-label="vibrant red" class="react-aria-ColorSwatch" data-rac="" :style="swatchStyle" />
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
