import {ColorArea} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
type ColorAreaValue = {x: number, y: number};

const meta: Meta<typeof ColorArea> = {
  title: 'ColorArea',
  component: ColorArea,
  args: {
    label: 'Color area',
    modelValue: {
      x: 50,
      y: 50
    }
  },
  argTypes: {
    disabled: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      table: {
        disable: true
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderColorArea(args: StoryArgs) {
  return {
    components: {ColorArea},
    setup() {
      return {args};
    },
    template: '<ColorArea v-bind="args" />'
  };
}

function renderColorAreaSized(args: StoryArgs, width: string) {
  return {
    components: {ColorArea},
    setup() {
      return {args, width};
    },
    template: `
      <div :style="{width}">
        <ColorArea v-bind="args" />
      </div>
    `
  };
}

function renderColorAreaWithAriaLabel(args: StoryArgs) {
  return {
    components: {ColorArea},
    setup() {
      return {args};
    },
    template: '<ColorArea v-bind="args" aria-label="foo" />'
  };
}

function areaValue(x: number, y: number): ColorAreaValue {
  return {x, y};
}

const RGB_BLUE_GREEN_ARGS = {
  label: 'RGB blue/green',
  modelValue: areaValue(82, 42)
};

const RGB_BLUE_RED_ARGS = {
  label: 'RGB blue/red',
  modelValue: areaValue(76, 58)
};

const RGB_RED_GREEN_ARGS = {
  label: 'RGB red/green',
  modelValue: areaValue(66, 36)
};

const HSL_SAT_LIGHT_ARGS = {
  label: 'HSL saturation/lightness',
  modelValue: areaValue(74, 48)
};

const HSL_HUE_SAT_ARGS = {
  label: 'HSL hue/saturation',
  modelValue: areaValue(57, 44)
};

const HSL_HUE_LIGHT_ARGS = {
  label: 'HSL hue/lightness',
  modelValue: areaValue(44, 38)
};

const HSB_SAT_BRIGHT_ARGS = {
  label: 'HSB saturation/brightness',
  modelValue: areaValue(79, 31)
};

const HSB_HUE_SAT_ARGS = {
  label: 'HSB hue/saturation',
  modelValue: areaValue(61, 54)
};

const HSB_HUE_BRIGHT_ARGS = {
  label: 'HSB hue/brightness',
  modelValue: areaValue(36, 26)
};

export const XBlueYGreen: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="blue", yChannel="green"',
  args: {...RGB_BLUE_GREEN_ARGS}
};

export const XGreenYBlue: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="green", yChannel="blue"',
  args: {
    ...RGB_BLUE_GREEN_ARGS,
    modelValue: areaValue(42, 82)
  }
};

export const XBlueYRed: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="blue", yChannel="red"',
  args: {...RGB_BLUE_RED_ARGS}
};

export const XRedYBlue: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="red", yChannel="blue"',
  args: {
    ...RGB_BLUE_RED_ARGS,
    modelValue: areaValue(58, 76)
  }
};

export const XRedYGreen: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="red", yChannel="green"',
  args: {...RGB_RED_GREEN_ARGS}
};

export const XGreenYRed: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="green", yChannel="red"',
  args: {
    ...RGB_RED_GREEN_ARGS,
    modelValue: areaValue(36, 66)
  }
};

export const XBlueYGreenisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="blue", yChannel="green", isDisabled',
  args: {
    ...RGB_BLUE_GREEN_ARGS,
    isDisabled: true
  }
};

export const XBlueYGreenAriaLabelled: Story = {
  render: (args) => renderColorAreaWithAriaLabel(args),
  name: 'RGB xChannel="blue", yChannel="green", aria-label="foo"',
  args: {...RGB_BLUE_GREEN_ARGS}
};

export const XBlueYGreenSize3000: Story = {
  render: (args) => renderColorAreaSized(args, '300px'),
  name: 'RGB xChannel="blue", yChannel="green", size="size-3000"',
  args: {...RGB_BLUE_GREEN_ARGS}
};

export const XBlueYGreenSize600: Story = {
  render: (args) => renderColorAreaSized(args, '60px'),
  name: 'RGB xChannel="blue", yChannel="green", size="size-600"',
  args: {...RGB_BLUE_GREEN_ARGS}
};

export const XSaturationYLightness: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="saturation", yChannel="lightness"',
  args: {...HSL_SAT_LIGHT_ARGS}
};

export const XLightnessYSaturation: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="lightness", yChannel="saturation"',
  args: {
    ...HSL_SAT_LIGHT_ARGS,
    modelValue: areaValue(48, 74)
  }
};

export const XSaturationYLightnessisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="saturation", yChannel="lightness", isDisabled',
  args: {
    ...HSL_SAT_LIGHT_ARGS,
    isDisabled: true
  }
};

export const XHueYSaturationHSL: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="hue", yChannel="saturation"',
  args: {...HSL_HUE_SAT_ARGS}
};

export const XSaturationYHueHSL: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="saturation", yChannel="hue"',
  args: {
    ...HSL_HUE_SAT_ARGS,
    modelValue: areaValue(54, 61)
  }
};

export const XHueYSaturationHSLisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="hue", yChannel="saturation", isDisabled',
  args: {
    ...HSL_HUE_SAT_ARGS,
    isDisabled: true
  }
};

export const XHueYLightnessHSL: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="hue", yChannel="lightness"',
  args: {...HSL_HUE_LIGHT_ARGS}
};

export const XLightnessYHueHSL: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="lightness", yChannel="hue"',
  args: {
    ...HSL_HUE_LIGHT_ARGS,
    modelValue: areaValue(38, 44)
  }
};

export const XHueYLightnessHSLisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="hue", yChannel="lightness", isDisabled',
  args: {
    ...HSL_HUE_LIGHT_ARGS,
    isDisabled: true
  }
};

export const XSaturationYBrightness: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="saturation", yChannel="brightness"',
  args: {...HSB_SAT_BRIGHT_ARGS}
};

export const XBrightnessYSaturation: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="brightness", yChannel="saturation"',
  args: {
    ...HSB_SAT_BRIGHT_ARGS,
    modelValue: areaValue(31, 79)
  }
};

export const XSaturationYBrightnessisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="saturation", yChannel="brightness", isDisabled',
  args: {
    ...HSB_SAT_BRIGHT_ARGS,
    isDisabled: true
  }
};

export const XHueYSaturationHSB: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="hue", yChannel="saturation"',
  args: {...HSB_HUE_SAT_ARGS}
};

export const XSaturationYHueHS: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="saturation", yChannel="hue"',
  args: {
    ...HSB_HUE_SAT_ARGS,
    modelValue: areaValue(54, 61)
  }
};

export const XHueYSaturationHSBisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="hue", yChannel="saturation", isDisabled',
  args: {
    ...HSB_HUE_SAT_ARGS,
    isDisabled: true
  }
};

export const XHueYBrightnessHSB: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="hue", yChannel="brightness"',
  args: {...HSB_HUE_BRIGHT_ARGS}
};

export const XBrightnessYHueHSB: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="brightness", yChannel="hue"',
  args: {
    ...HSB_HUE_BRIGHT_ARGS,
    modelValue: areaValue(26, 36)
  }
};

export const XBrightnessYHueHSBisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="brightness", yChannel="hue", isDisabled',
  args: {
    ...HSB_HUE_BRIGHT_ARGS,
    isDisabled: true
  }
};
