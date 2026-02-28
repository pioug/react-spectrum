import {ColorArea, ColorField, ColorSlider, ColorSwatch, ColorWheel} from '../src';
import {action} from 'storybook/actions';
import {computed, ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
type AreaValue = {x: number, y: number};

type Channel = 'red' | 'green' | 'blue' | 'hue' | 'saturation' | 'lightness' | 'brightness';

const CHANNELS_RGB: Channel[] = ['red', 'green', 'blue'];
const CHANNELS_HSL: Channel[] = ['hue', 'saturation', 'lightness'];
const CHANNELS_HSB: Channel[] = ['hue', 'saturation', 'brightness'];

const meta: Meta<typeof ColorArea> = {
  title: 'ColorArea',
  component: ColorArea,
  argTypes: {
    xChannel: {
      table: {
        disable: true
      }
    },
    yChannel: {
      table: {
        disable: true
      }
    },
    onChange: {
      table: {
        disable: true
      }
    },
    onChangeEnd: {
      table: {
        disable: true
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(value: string): string {
  let candidate = value.trim();
  if (/^#[0-9a-fA-F]{3}$/.test(candidate)) {
    let expanded = candidate.slice(1).split('').map((channel) => `${channel}${channel}`).join('');
    return `#${expanded.toUpperCase()}`;
  }

  if (/^#[0-9a-fA-F]{6}$/.test(candidate)) {
    return candidate.toUpperCase();
  }

  return '#FF00FF';
}

function colorNameFromHex(value: string): string {
  let normalized = normalizeHex(value);
  if (normalized === '#00FFFF') {
    return 'very light vibrant cyan';
  }

  return normalized;
}

function hexToRgb(value: string): {b: number, g: number, r: number} {
  let normalized = normalizeHex(value);
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16)
  };
}

function rgbToHex(value: {b: number, g: number, r: number}): string {
  let channel = (channelValue: number) => clamp(Math.round(channelValue), 0, 255).toString(16).padStart(2, '0').toUpperCase();
  return `#${channel(value.r)}${channel(value.g)}${channel(value.b)}`;
}

function hexToHue(value: string): number {
  let {r, g, b} = hexToRgb(value);
  let red = r / 255;
  let green = g / 255;
  let blue = b / 255;

  let max = Math.max(red, green, blue);
  let min = Math.min(red, green, blue);
  let delta = max - min;

  if (delta === 0) {
    return 0;
  }

  let hue = 0;
  if (max === red) {
    hue = ((green - blue) / delta) % 6;
  } else if (max === green) {
    hue = (blue - red) / delta + 2;
  } else {
    hue = (red - green) / delta + 4;
  }

  return Math.round((hue * 60 + 360) % 360);
}

function channelPercentFromHex(color: string, channel: Channel): number {
  let rgb = hexToRgb(color);

  if (channel === 'red') {
    return Math.round((rgb.r / 255) * 100);
  }

  if (channel === 'green') {
    return Math.round((rgb.g / 255) * 100);
  }

  if (channel === 'blue') {
    return Math.round((rgb.b / 255) * 100);
  }

  if (channel === 'hue') {
    return Math.round((hexToHue(color) / 360) * 100);
  }

  let max = Math.max(rgb.r, rgb.g, rgb.b);
  let min = Math.min(rgb.r, rgb.g, rgb.b);

  if (channel === 'saturation') {
    if (max === 0) {
      return 0;
    }

    return Math.round(((max - min) / max) * 100);
  }

  if (channel === 'lightness') {
    return Math.round(((max + min) / 510) * 100);
  }

  return Math.round((max / 255) * 100);
}

function familyForAxes(xChannel: Channel, yChannel: Channel): 'hsb' | 'hsl' | 'rgb' {
  if (CHANNELS_RGB.includes(xChannel) || CHANNELS_RGB.includes(yChannel)) {
    return 'rgb';
  }

  if (xChannel === 'brightness' || yChannel === 'brightness') {
    return 'hsb';
  }

  return 'hsl';
}

function zChannelForAxes(xChannel: Channel, yChannel: Channel): Channel {
  let family = familyForAxes(xChannel, yChannel);
  let axes = family === 'rgb' ? CHANNELS_RGB : family === 'hsb' ? CHANNELS_HSB : CHANNELS_HSL;
  return axes.find((channel) => channel !== xChannel && channel !== yChannel) ?? axes[0];
}

function toAreaValue(color: string, xChannel: Channel, yChannel: Channel): AreaValue {
  return {
    x: clamp(channelPercentFromHex(color, xChannel), 0, 100),
    y: clamp(100 - channelPercentFromHex(color, yChannel), 0, 100)
  };
}

function toZValue(color: string, zChannel: Channel): number {
  if (zChannel === 'hue') {
    return hexToHue(color);
  }

  if (zChannel === 'red' || zChannel === 'green' || zChannel === 'blue') {
    let rgb = hexToRgb(color);
    if (zChannel === 'red') {
      return rgb.r;
    }

    if (zChannel === 'green') {
      return rgb.g;
    }

    return rgb.b;
  }

  return channelPercentFromHex(color, zChannel);
}

function hsbToRgb(hue: number, saturation: number, brightness: number): {b: number, g: number, r: number} {
  let normalizedHue = ((hue % 360) + 360) % 360;
  let s = clamp(saturation, 0, 100) / 100;
  let b = clamp(brightness, 0, 100) / 100;
  let chroma = b * s;
  let x = chroma * (1 - Math.abs(((normalizedHue / 60) % 2) - 1));
  let m = b - chroma;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (normalizedHue < 60) {
    red = chroma;
    green = x;
  } else if (normalizedHue < 120) {
    red = x;
    green = chroma;
  } else if (normalizedHue < 180) {
    green = chroma;
    blue = x;
  } else if (normalizedHue < 240) {
    green = x;
    blue = chroma;
  } else if (normalizedHue < 300) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  return {
    r: (red + m) * 255,
    g: (green + m) * 255,
    b: (blue + m) * 255
  };
}

function hslToRgb(hue: number, saturation: number, lightness: number): {b: number, g: number, r: number} {
  let normalizedHue = ((hue % 360) + 360) % 360;
  let s = clamp(saturation, 0, 100) / 100;
  let l = clamp(lightness, 0, 100) / 100;
  let chroma = (1 - Math.abs(2 * l - 1)) * s;
  let x = chroma * (1 - Math.abs(((normalizedHue / 60) % 2) - 1));
  let m = l - chroma / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (normalizedHue < 60) {
    red = chroma;
    green = x;
  } else if (normalizedHue < 120) {
    red = x;
    green = chroma;
  } else if (normalizedHue < 180) {
    green = chroma;
    blue = x;
  } else if (normalizedHue < 240) {
    green = x;
    blue = chroma;
  } else if (normalizedHue < 300) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  return {
    r: (red + m) * 255,
    g: (green + m) * 255,
    b: (blue + m) * 255
  };
}

function buildColorFromChannels(areaValue: AreaValue, zValue: number, xChannel: Channel, yChannel: Channel, zChannel: Channel): string {
  let x = clamp(areaValue.x, 0, 100);
  let y = clamp(100 - areaValue.y, 0, 100);
  let family = familyForAxes(xChannel, yChannel);

  if (family === 'rgb') {
    let channels: Record<Channel, number> = {
      red: 0,
      green: 0,
      blue: 0,
      hue: 0,
      saturation: 0,
      lightness: 0,
      brightness: 0
    };

    channels[xChannel] = x * 2.55;
    channels[yChannel] = y * 2.55;
    channels[zChannel] = clamp(zValue, 0, 255);

    return rgbToHex({
      r: channels.red,
      g: channels.green,
      b: channels.blue
    });
  }

  let channels: Record<Channel, number> = {
    red: 0,
    green: 0,
    blue: 0,
    hue: 0,
    saturation: 100,
    lightness: 50,
    brightness: 100
  };

  channels[xChannel] = xChannel === 'hue' ? x * 3.6 : x;
  channels[yChannel] = yChannel === 'hue' ? y * 3.6 : y;
  channels[zChannel] = zChannel === 'hue' ? clamp(zValue, 0, 360) : clamp(zValue, 0, 100);

  let rgb = family === 'hsb'
    ? hsbToRgb(channels.hue, channels.saturation, channels.brightness)
    : hslToRgb(channels.hue, channels.saturation, channels.lightness);

  return rgbToHex(rgb);
}

function renderColorArea(args: StoryArgs) {
  return {
    components: {ColorArea, ColorField, ColorSlider, ColorSwatch, ColorWheel},
    setup() {
      let initialColor = computed(() => normalizeHex(typeof args.defaultValue === 'string' ? args.defaultValue : '#FF00FF'));
      let xChannel = computed(() => (typeof args.xChannel === 'string' ? args.xChannel : 'saturation') as Channel);
      let yChannel = computed(() => (typeof args.yChannel === 'string' ? args.yChannel : 'brightness') as Channel);
      let zChannel = computed(() => zChannelForAxes(xChannel.value, yChannel.value));
      let isHue = computed(() => zChannel.value === 'hue');
      let colorSpace = computed(() => familyForAxes(xChannel.value, yChannel.value));

      let color = ref(initialColor.value);
      let areaValue = ref<AreaValue>(toAreaValue(initialColor.value, xChannel.value, yChannel.value));
      let zValue = ref<number>(toZValue(initialColor.value, zChannel.value));

      watch([xChannel, yChannel, initialColor], ([nextXChannel, nextYChannel, nextInitialColor]) => {
        color.value = nextInitialColor;
        areaValue.value = toAreaValue(nextInitialColor, nextXChannel, nextYChannel);
        zValue.value = toZValue(nextInitialColor, zChannelForAxes(nextXChannel, nextYChannel));
      }, {immediate: true});

      watch([areaValue, zValue, xChannel, yChannel, zChannel], ([nextAreaValue, nextZValue, nextXChannel, nextYChannel, nextZChannel]) => {
        color.value = buildColorFromChannels(nextAreaValue, nextZValue, nextXChannel, nextYChannel, nextZChannel);
      });

      let onAreaUpdate = (nextValue: AreaValue) => {
        areaValue.value = nextValue;
        if (typeof args.onChange === 'function') {
          args.onChange(nextValue);
        }
      };

      let onAreaChange = (nextValue: AreaValue) => {
        if (typeof args.onChangeEnd === 'function') {
          args.onChangeEnd(nextValue);
        }
      };

      let onZUpdate = (nextValue: number) => {
        zValue.value = nextValue;
        if (typeof args.onChange === 'function') {
          args.onChange(nextValue);
        }
      };

      let onZChange = (nextValue: number) => {
        if (typeof args.onChangeEnd === 'function') {
          args.onChangeEnd(nextValue);
        }
      };

      let onFieldUpdate = (nextValue: string) => {
        color.value = normalizeHex(nextValue);
        areaValue.value = toAreaValue(color.value, xChannel.value, yChannel.value);
        zValue.value = toZValue(color.value, zChannel.value);
      };

      let groupLabel = computed(() => `${typeof args['aria-label'] === 'string' && args['aria-label'].length > 0 ? `${args['aria-label']} ` : ''}${colorSpace.value.toUpperCase()} Color Picker`);
      let colorName = computed(() => {
        return colorNameFromHex(color.value);
      });

      return {
        args,
        areaValue,
        color,
        colorName,
        groupLabel,
        isHue,
        onAreaChange,
        onAreaUpdate,
        onFieldUpdate,
        onZChange,
        onZUpdate,
        xChannel,
        yChannel,
        zChannel,
        zValue
      };
    },
    template: `
      <div role="group" :aria-label="groupLabel">
        <div style="display: flex; gap: var(--spectrum-global-dimension-size-500); align-items: flex-start;">
          <div v-if="isHue" style="display: flex; flex-direction: column; align-items: center;">
            <div style="position: relative; width: var(--spectrum-global-dimension-size-2400);">
              <div style="position: absolute; width: 100%; height: 100%; display: grid; place-items: center;">
                <ColorArea
                  :value="color"
                  :x-channel="xChannel"
                  :y-channel="yChannel"
                  :is-disabled="Boolean(args.isDisabled)"
                  size="size-1200"
                  :model-value="areaValue"
                  @update:model-value="onAreaUpdate"
                  @change="onAreaChange" />
              </div>
              <ColorWheel
                :model-value="zValue"
                size="size-2400"
                :is-disabled="Boolean(args.isDisabled)"
                @update:model-value="onZUpdate"
                @change="onZChange" />
            </div>
          </div>
          <div v-else style="display: flex; flex-direction: column; gap: var(--spectrum-global-dimension-size-50); align-items: center;">
            <ColorArea
              :value="color"
              :x-channel="xChannel"
              :y-channel="yChannel"
              :is-disabled="Boolean(args.isDisabled)"
              :size="typeof args.size === 'string' ? args.size : undefined"
              :model-value="areaValue"
              @update:model-value="onAreaUpdate"
              @change="onAreaChange" />
            <ColorSlider
              :channel="zChannel"
              :value="color"
              :model-value="zValue"
              :is-disabled="Boolean(args.isDisabled)"
              @update:model-value="onZUpdate"
              @change="onZChange" />
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-start; gap: var(--spectrum-global-dimension-size-100); min-width: var(--spectrum-global-dimension-size-1200);">
            <ColorSwatch :color="color" size="L" />
            <ColorField
              label="HEX Color"
              width="size-1200"
              :is-disabled="Boolean(args.isDisabled)"
              :model-value="color"
              @update:model-value="onFieldUpdate" />
            <div style="width: 100px; min-height: 2lh;">{{ colorName }}</div>
          </div>
        </div>
      </div>
    `
  };
}

const X_BLUE_Y_GREEN_ARGS = {
  defaultValue: '#0FF',
  xChannel: 'blue',
  yChannel: 'green',
  onChange: action('onChange'),
  onChangeEnd: action('onChangeEnd')
};

export const XBlueYGreen: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="blue", yChannel="green"',
  args: {...X_BLUE_Y_GREEN_ARGS}
};

export const XGreenYBlue: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="green", yChannel="blue"',
  args: {...X_BLUE_Y_GREEN_ARGS, xChannel: 'green', yChannel: 'blue'}
};

export const XBlueYRed: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="blue", yChannel="red"',
  args: {...X_BLUE_Y_GREEN_ARGS, defaultValue: '#F0F', xChannel: 'blue', yChannel: 'red'}
};

export const XRedYBlue: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="red", yChannel="blue"',
  args: {...X_BLUE_Y_GREEN_ARGS, defaultValue: '#F0F', xChannel: 'red', yChannel: 'blue'}
};

export const XRedYGreen: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="red", yChannel="green"',
  args: {...X_BLUE_Y_GREEN_ARGS, defaultValue: '#FF0', xChannel: 'red', yChannel: 'green'}
};

export const XGreenYRed: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="green", yChannel="red"',
  args: {...X_BLUE_Y_GREEN_ARGS, defaultValue: '#FF0', xChannel: 'green', yChannel: 'red'}
};

export const XBlueYGreenisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="blue", yChannel="green", isDisabled',
  args: {...XBlueYGreen.args, isDisabled: true}
};

export const XBlueYGreenAriaLabelled: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="blue", yChannel="green", aria-label="foo"',
  args: {...XBlueYGreen.args, 'aria-label': 'foo'}
};

export const XBlueYGreenSize3000: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="blue", yChannel="green", size="size-3000"',
  args: {...XBlueYGreen.args, size: 'size-3000'}
};

export const XBlueYGreenSize600: Story = {
  render: (args) => renderColorArea(args),
  name: 'RGB xChannel="blue", yChannel="green", size="size-600"',
  args: {...XBlueYGreen.args, size: 'size-600'}
};

export const XSaturationYLightness: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="saturation", yChannel="lightness"',
  args: {...XBlueYGreen.args, xChannel: 'saturation', yChannel: 'lightness', defaultValue: 'hsl(0, 100%, 50%)'}
};

export const XLightnessYSaturation: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="lightness", yChannel="saturation"',
  args: {...XSaturationYLightness.args, xChannel: 'lightness', yChannel: 'saturation'}
};

export const XSaturationYLightnessisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="saturation", yChannel="lightness", isDisabled',
  args: {...XSaturationYLightness.args, isDisabled: true}
};

export const XHueYSaturationHSL: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="hue", yChannel="saturation"',
  args: {...XSaturationYLightness.args, xChannel: 'hue', yChannel: 'saturation'}
};

export const XSaturationYHueHSL: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="saturation", yChannel="hue"',
  args: {...XSaturationYLightness.args, xChannel: 'saturation', yChannel: 'hue'}
};

export const XHueYSaturationHSLisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="hue", yChannel="saturation", isDisabled',
  args: {...XHueYSaturationHSL.args, isDisabled: true}
};

export const XHueYLightnessHSL: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="hue", yChannel="lightness"',
  args: {...XHueYSaturationHSL.args, xChannel: 'hue', yChannel: 'lightness'}
};

export const XLightnessYHueHSL: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="lightness", yChannel="hue"',
  args: {...XHueYSaturationHSL.args, xChannel: 'lightness', yChannel: 'hue'}
};

export const XHueYLightnessHSLisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSL xChannel="hue", yChannel="lightness", isDisabled',
  args: {...XHueYLightnessHSL.args, isDisabled: true}
};

export const XSaturationYBrightness: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="saturation", yChannel="brightness"',
  args: {...XHueYSaturationHSL.args, xChannel: 'saturation', yChannel: 'brightness', defaultValue: 'hsb(0, 100%, 100%)'}
};

export const XBrightnessYSaturation: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="brightness", yChannel="saturation"',
  args: {...XSaturationYBrightness.args, xChannel: 'brightness', yChannel: 'saturation'}
};

export const XSaturationYBrightnessisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="saturation", yChannel="brightness", isDisabled',
  args: {...XSaturationYBrightness.args, isDisabled: true}
};

export const XHueYSaturationHSB: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="hue", yChannel="saturation"',
  args: {...XSaturationYBrightness.args, xChannel: 'hue', yChannel: 'saturation'}
};

export const XSaturationYHueHS: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="saturation", yChannel="hue"',
  args: {...XSaturationYBrightness.args, xChannel: 'saturation', yChannel: 'hue'}
};

export const XHueYSaturationHSBisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="hue", yChannel="saturation", isDisabled',
  args: {...XHueYSaturationHSB.args, isDisabled: true}
};

export const XHueYBrightnessHSB: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="hue", yChannel="brightness"',
  args: {...XHueYSaturationHSB.args, xChannel: 'hue', yChannel: 'brightness'}
};

export const XBrightnessYHueHSB: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="brightness", yChannel="hue"',
  args: {...XHueYSaturationHSB.args, xChannel: 'brightness', yChannel: 'hue'}
};

export const XBrightnessYHueHSBisDisabled: Story = {
  render: (args) => renderColorArea(args),
  name: 'HSB xChannel="brightness", yChannel="hue", isDisabled',
  args: {...XHueYBrightnessHSB.args, isDisabled: true}
};
