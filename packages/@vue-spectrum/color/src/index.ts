import '@adobe/spectrum-css-temp/components/colorarea/vars.css';
import '@adobe/spectrum-css-temp/components/colorhandle/vars.css';
import '@adobe/spectrum-css-temp/components/colorloupe/vars.css';
import '@adobe/spectrum-css-temp/components/colorslider/vars.css';
import '@adobe/spectrum-css-temp/components/colorwheel/vars.css';
import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import '@adobe/spectrum-css-temp/components/helptext/vars.css';
import '@adobe/spectrum-css-temp/components/textfield/vars.css';
import './colorfield.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, getCurrentInstance, h, onBeforeUnmount, onMounted, type PropType, ref, watch} from 'vue';
const colorAreaStyles: {[key: string]: string} = {};
const colorHandleStyles: {[key: string]: string} = {};
const colorLoupeStyles: {[key: string]: string} = {};
const colorSliderStyles: {[key: string]: string} = {};
const colorWheelStyles: {[key: string]: string} = {};
const fieldLabelStyles: {[key: string]: string} = {};
const helpTextStyles: {[key: string]: string} = {};
const textfieldStyles: {[key: string]: string} = {};


const colorFieldStyles: {[key: string]: string} = {};

export type Color = string;
export type ColorSpace = 'rgb' | 'hsl' | 'hsb';
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsb';
export type ColorChannel = 'red' | 'green' | 'blue' | 'hue' | 'saturation' | 'lightness' | 'brightness' | 'alpha';
type IColor = Color;

type ColorAreaValue = {
  x: number,
  y: number
};

type ColorSwatchItem = {
  color: string,
  id: string,
  label?: string
};

type RgbColor = {
  b: number,
  g: number,
  r: number
};

type ParsedColorModel = {
  rgb: RgbColor,
  space: ColorSpace
};

const DEFAULT_HEX_COLOR = '#3366ff';
const COLORFIELD_PLACEHOLDER_WARNING = 'Placeholders are deprecated due to accessibility issues. Please use help text instead. See the docs for details: https://react-spectrum.adobe.com/react-spectrum/ColorField.html#help-text';
const DEFAULT_COLOR_SWATCHES: ColorSwatchItem[] = [
  {id: 'azure', color: '#0ea5e9', label: 'Azure'},
  {id: 'violet', color: '#8b5cf6', label: 'Violet'},
  {id: 'emerald', color: '#10b981', label: 'Emerald'},
  {id: 'amber', color: '#f59e0b', label: 'Amber'}
];

let colorFieldId = 0;
let colorSliderId = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readNumberInputValue(event: Event): number | null {
  let target = event.currentTarget as HTMLInputElement | null;
  let parsedValue = Number(target?.value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function readTextInputValue(event: Event): string {
  let target = event.currentTarget as HTMLInputElement | null;
  return target?.value ?? '';
}

function resolveDisabled(disabled: boolean, isDisabled?: boolean): boolean {
  return isDisabled ?? disabled;
}

function normalizeHexColor(value: string): string {
  let candidate = value.trim();
  if (/^#[0-9a-fA-F]{3}$/.test(candidate)) {
    let expanded = candidate.slice(1).split('').map((channel) => `${channel}${channel}`).join('');
    return `#${expanded.toLowerCase()}`;
  }

  if (/^#[0-9a-fA-F]{6}$/.test(candidate)) {
    return candidate.toLowerCase();
  }

  return DEFAULT_HEX_COLOR;
}

function channelToHex(channelValue: number): string {
  return clamp(Math.round(channelValue), 0, 255).toString(16).padStart(2, '0');
}

function rgbToHex(value: RgbColor): string {
  return `#${channelToHex(value.r)}${channelToHex(value.g)}${channelToHex(value.b)}`;
}

function rgbToCssColor(value: RgbColor): string {
  return `rgb(${Math.round(clamp(value.r, 0, 255))}, ${Math.round(clamp(value.g, 0, 255))}, ${Math.round(clamp(value.b, 0, 255))})`;
}

function hexToRgb(value: string): RgbColor {
  let normalizedHex = normalizeHexColor(value);
  return {
    r: Number.parseInt(normalizedHex.slice(1, 3), 16),
    g: Number.parseInt(normalizedHex.slice(3, 5), 16),
    b: Number.parseInt(normalizedHex.slice(5, 7), 16)
  };
}

function hueToHex(hue: number): string {
  let normalizedHue = ((Math.round(hue) % 360) + 360) % 360;
  let segment = normalizedHue / 60;
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

  return rgbToHex({
    r: red * 255,
    g: green * 255,
    b: blue * 255
  });
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

function normalizeColorAreaValue(value: ColorAreaValue): ColorAreaValue {
  return {
    x: clamp(Math.round(value.x), 0, 100),
    y: clamp(Math.round(value.y), 0, 100)
  };
}

function circlePath(cx: number, cy: number, radius: number): string {
  return `M ${cx} ${cy} m ${-radius} 0 a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 ${-radius * 2} 0`;
}

function toDimensionValue(value: string | number | undefined): string | undefined {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string' && value.startsWith('size-')) {
    return `var(--spectrum-global-dimension-${value})`;
  }

  return value;
}

function normalizeChannel(channel: string): string {
  return channel.toLowerCase();
}

function channelRange(channel: string): {max: number, min: number} {
  let normalized = normalizeChannel(channel);
  if (normalized === 'hue') {
    return {min: 0, max: 360};
  }

  if (normalized === 'saturation' || normalized === 'lightness' || normalized === 'brightness' || normalized === 'alpha') {
    return {min: 0, max: 100};
  }

  return {min: 0, max: 255};
}

function normalizeHueDegrees(value: number): number {
  return ((Math.round(value) % 360) + 360) % 360;
}

function hsbToRgb(hue: number, saturation: number, brightness: number): RgbColor {
  let normalizedHue = normalizeHueDegrees(hue);
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

function hslToRgb(hue: number, saturation: number, lightness: number): RgbColor {
  let normalizedHue = normalizeHueDegrees(hue);
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

function rgbToHsb(value: RgbColor): {b: number, h: number, s: number} {
  let red = clamp(value.r, 0, 255) / 255;
  let green = clamp(value.g, 0, 255) / 255;
  let blue = clamp(value.b, 0, 255) / 255;
  let max = Math.max(red, green, blue);
  let min = Math.min(red, green, blue);
  let delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === red) {
      hue = ((green - blue) / delta) % 6;
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }
  }

  return {
    h: normalizeHueDegrees(hue * 60),
    s: max === 0 ? 0 : (delta / max) * 100,
    b: max * 100
  };
}

function rgbToHsl(value: RgbColor): {h: number, l: number, s: number} {
  let red = clamp(value.r, 0, 255) / 255;
  let green = clamp(value.g, 0, 255) / 255;
  let blue = clamp(value.b, 0, 255) / 255;
  let max = Math.max(red, green, blue);
  let min = Math.min(red, green, blue);
  let delta = max - min;
  let lightness = (max + min) / 2;

  let hue = 0;
  if (delta !== 0) {
    if (max === red) {
      hue = ((green - blue) / delta) % 6;
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }
  }

  let saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return {
    h: normalizeHueDegrees(hue * 60),
    s: saturation * 100,
    l: lightness * 100
  };
}

function parseHueToken(value: string): number | null {
  let normalized = value.trim().toLowerCase().replace(/deg$/, '');
  let parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return normalizeHueDegrees(parsed);
}

function parsePercentToken(value: string): number | null {
  let normalized = value.trim();
  if (normalized.endsWith('%')) {
    normalized = normalized.slice(0, -1);
  }

  let parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return clamp(parsed, 0, 100);
}

function parseRgbToken(value: string): number | null {
  let normalized = value.trim();
  if (normalized.endsWith('%')) {
    let parsedPercent = parsePercentToken(normalized);
    return parsedPercent === null ? null : (parsedPercent / 100) * 255;
  }

  let parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return clamp(parsed, 0, 255);
}

function parseColorModel(value: string): ParsedColorModel | null {
  let candidate = value.trim();

  if (/^#[0-9a-fA-F]{3}$/.test(candidate) || /^#[0-9a-fA-F]{6}$/.test(candidate)) {
    return {
      rgb: hexToRgb(candidate),
      space: 'rgb'
    };
  }

  let rgbMatch = candidate.match(/^rgba?\((.+)\)$/i);
  if (rgbMatch) {
    let tokens = rgbMatch[1].split(',').map((token) => token.trim());
    if (tokens.length >= 3) {
      let red = parseRgbToken(tokens[0]);
      let green = parseRgbToken(tokens[1]);
      let blue = parseRgbToken(tokens[2]);
      if (red !== null && green !== null && blue !== null) {
        return {
          rgb: {r: red, g: green, b: blue},
          space: 'rgb'
        };
      }
    }
  }

  let hslMatch = candidate.match(/^hsla?\((.+)\)$/i);
  if (hslMatch) {
    let tokens = hslMatch[1].split(',').map((token) => token.trim());
    if (tokens.length >= 3) {
      let hue = parseHueToken(tokens[0]);
      let saturation = parsePercentToken(tokens[1]);
      let lightness = parsePercentToken(tokens[2]);
      if (hue !== null && saturation !== null && lightness !== null) {
        return {
          rgb: hslToRgb(hue, saturation, lightness),
          space: 'hsl'
        };
      }
    }
  }

  let hsbMatch = candidate.match(/^hsba?\((.+)\)$/i);
  if (hsbMatch) {
    let tokens = hsbMatch[1].split(',').map((token) => token.trim());
    if (tokens.length >= 3) {
      let hue = parseHueToken(tokens[0]);
      let saturation = parsePercentToken(tokens[1]);
      let brightness = parsePercentToken(tokens[2]);
      if (hue !== null && saturation !== null && brightness !== null) {
        return {
          rgb: hsbToRgb(hue, saturation, brightness),
          space: 'hsb'
        };
      }
    }
  }

  return null;
}

function colorModelWithChannelValue(model: ParsedColorModel, channel: string, value: number): RgbColor {
  let normalized = normalizeChannel(channel);

  if (normalized === 'red' || normalized === 'green' || normalized === 'blue') {
    return {
      ...model.rgb,
      [normalized]: clamp(value, 0, 255)
    } as RgbColor;
  }

  if (normalized === 'lightness') {
    let hsl = rgbToHsl(model.rgb);
    return hslToRgb(hsl.h, hsl.s, clamp(value, 0, 100));
  }

  if (normalized === 'brightness') {
    let hsb = rgbToHsb(model.rgb);
    return hsbToRgb(hsb.h, hsb.s, clamp(value, 0, 100));
  }

  if (normalized === 'saturation') {
    if (model.space === 'hsb') {
      let hsb = rgbToHsb(model.rgb);
      return hsbToRgb(hsb.h, clamp(value, 0, 100), hsb.b);
    }

    let hsl = rgbToHsl(model.rgb);
    return hslToRgb(hsl.h, clamp(value, 0, 100), hsl.l);
  }

  if (normalized === 'hue') {
    if (model.space === 'hsb') {
      let hsb = rgbToHsb(model.rgb);
      return hsbToRgb(normalizeHueDegrees(value), hsb.s, hsb.b);
    }

    let hsl = rgbToHsl(model.rgb);
    return hslToRgb(normalizeHueDegrees(value), hsl.s, hsl.l);
  }

  return model.rgb;
}

function channelValueFromModel(model: ParsedColorModel, channel: string): number {
  let normalized = normalizeChannel(channel);
  let rgb = model.rgb;

  if (normalized === 'red') {
    return Math.round(rgb.r);
  }

  if (normalized === 'green') {
    return Math.round(rgb.g);
  }

  if (normalized === 'blue') {
    return Math.round(rgb.b);
  }

  if (normalized === 'hue') {
    return Math.round(model.space === 'hsb' ? rgbToHsb(rgb).h : rgbToHsl(rgb).h);
  }

  if (normalized === 'saturation') {
    return Math.round(model.space === 'hsb' ? rgbToHsb(rgb).s : rgbToHsl(rgb).s);
  }

  if (normalized === 'lightness') {
    return Math.round(rgbToHsl(rgb).l);
  }

  if (normalized === 'brightness') {
    return Math.round(rgbToHsb(rgb).b);
  }

  if (normalized === 'alpha') {
    return 100;
  }

  return 0;
}

function channelValueFromColor(color: string, channel: string): number {
  let parsedColor = parseColorModel(color);
  if (parsedColor) {
    return channelValueFromModel(parsedColor, channel);
  }

  return channelValueFromModel({rgb: hexToRgb(color), space: 'rgb'}, channel);
}

function channelDisplayName(channel: string): string {
  if (channel === 'hue') {
    return 'Hue';
  }

  if (channel === 'saturation') {
    return 'Saturation';
  }

  if (channel === 'lightness') {
    return 'Lightness';
  }

  if (channel === 'brightness') {
    return 'Brightness';
  }

  if (channel === 'alpha') {
    return 'Alpha';
  }

  if (channel === 'red') {
    return 'Red';
  }

  if (channel === 'green') {
    return 'Green';
  }

  if (channel === 'blue') {
    return 'Blue';
  }

  return channel;
}

export const ColorSwatch = defineComponent({
  name: 'VueColorSwatch',
  inheritAttrs: false,
  props: {
    bordered: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    rounding: {
      type: String as PropType<'default' | 'none' | 'full'>,
      default: 'default'
    },
    selected: {
      type: Boolean,
      default: false
    },
    size: {
      type: String as PropType<'XS' | 'S' | 'M' | 'L'>,
      default: 'M'
    },
    height: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined
    },
    width: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs}) {
    let size = computed(() => {
      if (props.size === 'XS') {
        return 'var(--spectrum-global-dimension-size-200)';
      }

      if (props.size === 'S') {
        return 'var(--spectrum-global-dimension-size-300)';
      }

      if (props.size === 'L') {
        return 'var(--spectrum-global-dimension-size-500)';
      }

      return 'var(--spectrum-global-dimension-size-400)';
    });

    let borderRadius = computed(() => {
      if (props.rounding === 'none') {
        return '0';
      }

      if (props.rounding === 'full') {
        return '9999px';
      }

      return 'var(--spectrum-alias-border-radius-small)';
    });

    let swatchBackground = computed(() => {
      if (!props.color) {
        return 'linear-gradient(to bottom right, transparent calc(50% - 2px), var(--spectrum-red-900) calc(50% - 2px) calc(50% + 2px), transparent calc(50% + 2px)) no-repeat';
      }

      let normalized = parseColor(props.color);
      return `linear-gradient(${normalized}, ${normalized}), repeating-conic-gradient(#e6e6e6 0% 25%, white 0% 50%) 0% 50% / 16px 16px`;
    });

    return () => h('div', {
      ...attrs,
      class: [
        'vs-spectrum-color-swatch',
        props.bordered ? 'is-bordered' : null,
        props.selected ? 'is-selected' : null,
        attrs.class
      ],
      role: 'img',
      'aria-label': props.label || (props.color ? `Color ${props.color}` : 'No color selected'),
      'aria-hidden': attrs['aria-hidden'],
      style: [
        {
          width: toDimensionValue(props.width) ?? size.value,
          height: toDimensionValue(props.height) ?? size.value,
          borderRadius: borderRadius.value,
          borderWidth: props.bordered ? '1px' : '0',
          borderStyle: 'solid',
          borderColor: 'color-mix(in srgb, var(--spectrum-gray-900), transparent 49%)',
          boxSizing: 'border-box',
          background: swatchBackground.value,
          opacity: props.isDisabled ? 0.4 : undefined,
          forcedColorAdjust: 'none'
        },
        attrs.style
      ],
      'data-vac': ''
    });
  }
});

export const ColorThumb = defineComponent({
  name: 'VueColorThumb',
  inheritAttrs: false,
  props: {
    className: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isDragging: {
      type: Boolean,
      default: false
    },
    isFocused: {
      type: Boolean,
      default: false
    },
    style: {
      type: Object as PropType<Record<string, unknown> | undefined>,
      default: undefined
    },
    value: {
      type: String,
      default: DEFAULT_HEX_COLOR
    }
  },
  setup(props, {attrs, slots}) {
    let valueCSS = computed(() => parseColor(props.value));

    return () => h('div', {
      ...attrs,
      class: [
        classNames(colorHandleStyles, 'spectrum-ColorHandle', {
          'is-focused': props.isFocused,
          'is-disabled': props.isDisabled
        }),
        props.className,
        attrs.class
      ],
      style: [
        props.style ?? {},
        attrs.style
      ]
    }, [
      h('div', {
        class: classNames(colorHandleStyles, 'spectrum-ColorHandle-color'),
        style: {
          backgroundColor: valueCSS.value
        }
      }),
      h('svg', {
        class: classNames(colorLoupeStyles, 'spectrum-ColorLoupe', {
          'is-open': props.isDragging
        }),
        style: {
          display: props.isDragging ? undefined : 'none'
        },
        'aria-hidden': 'true'
      }, [
        h('path', {
          class: classNames(colorLoupeStyles, 'spectrum-ColorLoupe-inner'),
          d: 'M25 1a24 24 0 0124 24c0 16.255-24 40-24 40S1 41.255 1 25A24 24 0 0125 1z',
          fill: valueCSS.value
        }),
        h('path', {
          class: classNames(colorLoupeStyles, 'spectrum-ColorLoupe-outer'),
          d: 'M25 3A21.98 21.98 0 003 25c0 6.2 4 14.794 11.568 24.853A144.233 144.233 0 0025 62.132a144.085 144.085 0 0010.4-12.239C42.99 39.816 47 31.209 47 25A21.98 21.98 0 0025 3m0-2a24 24 0 0124 24c0 16.255-24 40-24 40S1 41.255 1 25A24 24 0 0125 1z'
        })
      ]),
      slots.default ? slots.default() : null
    ]);
  }
});

export const ColorField = defineComponent({
  name: 'VueColorField',
  inheritAttrs: false,
  props: {
    contextualHelp: {
      type: null as unknown as PropType<unknown>,
      default: undefined
    },
    defaultValue: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    description: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    form: {
      type: String,
      default: undefined
    },
    id: {
      type: String,
      default: undefined
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean,
      default: false
    },
    isReadOnly: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isRequired: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    name: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    value: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    placeholder: {
      type: String,
      default: ''
    },
    width: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: string) => typeof value === 'string',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let instance = getCurrentInstance();
    let didProvidePlaceholderProp = Boolean(instance?.vnode.props && Object.prototype.hasOwnProperty.call(instance.vnode.props, 'placeholder'));
    let generatedId = `vs-spectrum-color-field-${++colorFieldId}`;
    let focused = ref(false);
    let hasWarnedDeprecatedPlaceholder = ref(false);
    let uncontrolledValue = ref<string>(props.defaultValue ?? props.modelValue);

    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));
    let isReadOnly = computed(() => props.isReadOnly ?? props.readOnly);
    let isRequired = computed(() => props.isRequired ?? props.required);
    let isInvalid = computed(() => props.isInvalid && !disabled.value);
    let inputId = computed(() => props.id ?? generatedId);
    let labelId = computed(() => props.label ? `${inputId.value}-label` : undefined);
    let currentValue = computed(() => props.value ?? props.modelValue ?? uncontrolledValue.value);
    let helpText = computed(() => (isInvalid.value ? props.errorMessage : props.description));
    let helpTextId = computed(() => {
      if (!helpText.value) {
        return undefined;
      }

      return isInvalid.value ? `${inputId.value}-error` : `${inputId.value}-description`;
    });

    let inputClasses = computed(() => ([
      classNames(textfieldStyles, 'spectrum-Textfield-input', 'i18nFontFamily'),
      classNames(colorFieldStyles, 'react-spectrum-ColorField-input'),
      'vs-spectrum-color-field__input'
    ]));

    let rootAttrs = computed(() => {
      let next: Record<string, unknown> = {};
      for (let [key, value] of Object.entries(attrs)) {
        if (
          key === 'aria-label' ||
          key === 'aria-labelledby' ||
          key === 'autofocus' ||
          key === 'class' ||
          key === 'style'
        ) {
          continue;
        }

        next[key] = value;
      }

      return next;
    });

    let externalAriaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });

    let ariaLabelledBy = computed(() => {
      let parts = [labelId.value, externalAriaLabelledBy.value].filter((part): part is string => Boolean(part));
      return parts.length > 0 ? parts.join(' ') : undefined;
    });

    let ariaLabel = computed(() => {
      if (ariaLabelledBy.value) {
        return undefined;
      }

      let value = attrs['aria-label'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });

    watch(() => [props.value, props.modelValue], ([value, modelValue]) => {
      if (typeof value === 'string') {
        uncontrolledValue.value = value;
        return;
      }

      if (typeof modelValue === 'string') {
        uncontrolledValue.value = modelValue;
      }
    }, {immediate: true});

    watch(() => props.placeholder, (placeholder) => {
      if (didProvidePlaceholderProp && placeholder && !hasWarnedDeprecatedPlaceholder.value && process.env.NODE_ENV !== 'production') {
        console.warn(COLORFIELD_PLACEHOLDER_WARNING);
        hasWarnedDeprecatedPlaceholder.value = true;
      }
    }, {immediate: true});

    return () => h('div', {
      ...rootAttrs.value,
      class: [
        classNames(fieldLabelStyles, 'spectrum-Field', 'spectrum-Field--positionTop'),
        classNames(textfieldStyles, 'spectrum-Textfield-wrapper', {
          'spectrum-Textfield-wrapper--quiet': props.isQuiet
        }),
        'vs-spectrum-color-field',
        attrs.class
      ],
      style: [
        {
          width: toDimensionValue(props.width)
        },
        attrs.style
      ],
      'data-vac': ''
    }, [
      props.label
        ? h('label', {
          id: labelId.value,
          for: inputId.value,
          class: [classNames(fieldLabelStyles, 'spectrum-FieldLabel'), 'vs-spectrum-color-field__label']
        }, [
          props.label,
          props.contextualHelp ? h('span', {class: 'vs-spectrum-color-field__contextual-help'}, [props.contextualHelp as never]) : null
        ])
        : null,
      h('div', {
        class: [
          'vs-spectrum-color-field__control',
          classNames(textfieldStyles, 'spectrum-Textfield', 'spectrum-FocusRing', 'spectrum-FocusRing-ring', 'spectrum-Field-field', {
            'spectrum-Textfield--invalid': isInvalid.value,
            'spectrum-Textfield--quiet': props.isQuiet,
            'is-disabled': disabled.value,
            'focus-ring': focused.value
          })
        ]
      }, [
        h('input', {
          id: inputId.value,
          class: inputClasses.value,
          type: 'text',
          value: currentValue.value,
          placeholder: props.placeholder,
          disabled: disabled.value || undefined,
          readonly: isReadOnly.value || undefined,
          required: isRequired.value || undefined,
          spellcheck: 'false',
          'aria-invalid': isInvalid.value ? 'true' : undefined,
          'aria-describedby': helpTextId.value,
          'aria-label': ariaLabel.value,
          'aria-labelledby': ariaLabelledBy.value,
          onInput: (event: Event) => {
            let value = readTextInputValue(event);
            if (props.value === undefined && props.modelValue === undefined) {
              uncontrolledValue.value = value;
            }

            emit('update:modelValue', value);
          },
          onChange: (event: Event) => {
            emit('change', readTextInputValue(event));
          },
          onFocus: (event: FocusEvent) => {
            focused.value = true;
            emit('focus', event);
          },
          onBlur: (event: FocusEvent) => {
            focused.value = false;
            emit('blur', event);
          }
        })
      ]),
      helpText.value
        ? h('div', {
          id: helpTextId.value,
          class: [
            classNames(helpTextStyles, 'spectrum-HelpText', {
              'is-negative': isInvalid.value
            }),
            'vs-spectrum-color-field__description'
          ]
        }, helpText.value)
        : null,
      props.name
        ? h('input', {
          type: 'hidden',
          hidden: true,
          'aria-hidden': 'true',
          name: props.name,
          form: props.form,
          value: currentValue.value
        })
        : null
    ]);
  }
});

export const ColorSlider = defineComponent({
  name: 'VueColorSlider',
  inheritAttrs: false,
  props: {
    channel: {
      type: String,
      default: 'hue'
    },
    description: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: undefined
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    label: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    max: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    min: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    modelValue: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal'
    },
    showValueLabel: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    step: {
      type: Number,
      default: 1
    },
    value: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: undefined
    }
  },
  emits: {
    change: (value: number) => Number.isFinite(value),
    'update:modelValue': (value: number) => Number.isFinite(value)
  },
  setup(props, {emit, attrs}) {
    let generatedId = `vs-spectrum-color-slider-${++colorSliderId}`;
    let uncontrolledValue = ref<number | string | undefined>(props.defaultValue ?? props.modelValue);
    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));
    let vertical = computed(() => props.orientation === 'vertical');
    let sliderId = computed(() => props.id ?? generatedId);

    let baseRange = computed(() => channelRange(props.channel));
    let minimum = computed(() => {
      if (typeof props.min === 'number') {
        return props.min;
      }

      return baseRange.value.min;
    });
    let maximum = computed(() => {
      if (typeof props.max === 'number') {
        return props.max;
      }

      return baseRange.value.max;
    });

    let valueFromProps = computed(() => props.value ?? props.modelValue ?? uncontrolledValue.value);
    let sliderValue = computed(() => {
      if (typeof valueFromProps.value === 'number') {
        return clamp(valueFromProps.value, minimum.value, maximum.value);
      }

      if (typeof valueFromProps.value === 'string') {
        return clamp(channelValueFromColor(valueFromProps.value, props.channel), minimum.value, maximum.value);
      }

      return clamp((minimum.value + maximum.value) / 2, minimum.value, maximum.value);
    });

    let computedLabel = computed(() => {
      if (props.label !== undefined) {
        return props.label;
      }

      if (!vertical.value && !attrs['aria-label'] && !attrs['aria-labelledby']) {
        return channelDisplayName(normalizeChannel(props.channel));
      }

      return '';
    });
    let visibleLabel = computed(() => (vertical.value ? '' : computedLabel.value));
    let sliderLabelId = computed(() => visibleLabel.value ? `${sliderId.value}-label` : undefined);
    let showValueLabel = computed(() => props.showValueLabel ?? Boolean(visibleLabel.value));

    let rootAttrs = computed(() => {
      let next: Record<string, unknown> = {};
      for (let [key, value] of Object.entries(attrs)) {
        if (key === 'aria-label' || key === 'aria-labelledby' || key === 'autofocus' || key === 'class') {
          continue;
        }

        next[key] = value;
      }

      return next;
    });

    let externalAriaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });

    let ariaLabelledBy = computed(() => {
      let parts = [sliderLabelId.value, externalAriaLabelledBy.value].filter((part): part is string => Boolean(part));
      return parts.length > 0 ? parts.join(' ') : undefined;
    });

    let ariaLabel = computed(() => {
      if (ariaLabelledBy.value) {
        return undefined;
      }

      let value = attrs['aria-label'];
      if (typeof value === 'string' && value.length > 0) {
        return value;
      }

      if (vertical.value && props.label) {
        return props.label;
      }

      return undefined;
    });

    let gradientDirection = computed(() => vertical.value ? 'top' : 'right');

    let colorModel = computed(() => {
      let source = typeof props.value === 'string'
        ? props.value
        : typeof valueFromProps.value === 'string'
          ? valueFromProps.value
          : undefined;

      if (!source) {
        return null;
      }

      return parseColorModel(source);
    });

    let displayColor = computed(() => {
      if (!colorModel.value) {
        return null;
      }

      return colorModelWithChannelValue(colorModel.value, props.channel, sliderValue.value);
    });

    let trackBackground = computed(() => {
      let normalizedChannel = normalizeChannel(props.channel);
      let direction = gradientDirection.value;
      let model = colorModel.value;

      if (model) {
        if (normalizedChannel === 'hue') {
          let stops = [0, 60, 120, 180, 240, 300, 360]
            .map((hue) => rgbToCssColor(colorModelWithChannelValue(model, 'hue', hue)))
            .join(', ');
          return `linear-gradient(to ${direction}, ${stops})`;
        }

        if (normalizedChannel === 'lightness') {
          let midpoint = minimum.value + (maximum.value - minimum.value) / 2;
          let start = rgbToCssColor(colorModelWithChannelValue(model, 'lightness', minimum.value));
          let middle = rgbToCssColor(colorModelWithChannelValue(model, 'lightness', midpoint));
          let end = rgbToCssColor(colorModelWithChannelValue(model, 'lightness', maximum.value));
          return `linear-gradient(to ${direction}, ${start}, ${middle}, ${end})`;
        }

        if (normalizedChannel === 'saturation' || normalizedChannel === 'brightness' || normalizedChannel === 'red' || normalizedChannel === 'green' || normalizedChannel === 'blue' || normalizedChannel === 'alpha') {
          let start = rgbToCssColor(colorModelWithChannelValue(model, normalizedChannel, minimum.value));
          let end = rgbToCssColor(colorModelWithChannelValue(model, normalizedChannel, maximum.value));
          return `linear-gradient(to ${direction}, ${start}, ${end})`;
        }
      }

      if (normalizedChannel === 'hue') {
        return `linear-gradient(to ${direction}, #ff0000 0%, #ffff00 16%, #00ff00 33%, #00ffff 50%, #0000ff 66%, #ff00ff 83%, #ff0000 100%)`;
      }

      if (normalizedChannel === 'red') {
        return `linear-gradient(to ${direction}, #000000 0%, #ff0000 100%)`;
      }

      if (normalizedChannel === 'green') {
        return `linear-gradient(to ${direction}, #000000 0%, #00ff00 100%)`;
      }

      if (normalizedChannel === 'blue') {
        return `linear-gradient(to ${direction}, #000000 0%, #0000ff 100%)`;
      }

      return `linear-gradient(to ${direction}, #000000 0%, #ffffff 100%)`;
    });

    let thumbColor = computed(() => {
      let color = displayColor.value;
      if (color) {
        return rgbToCssColor(color);
      }

      let normalizedChannel = normalizeChannel(props.channel);
      if (normalizedChannel === 'hue') {
        return hueToHex(sliderValue.value);
      }

      if (normalizedChannel === 'red') {
        return rgbToHex({r: sliderValue.value, g: 0, b: 0});
      }

      if (normalizedChannel === 'green') {
        return rgbToHex({r: 0, g: sliderValue.value, b: 0});
      }

      if (normalizedChannel === 'blue') {
        return rgbToHex({r: 0, g: 0, b: sliderValue.value});
      }

      return rgbToHex({r: sliderValue.value, g: sliderValue.value, b: sliderValue.value});
    });

    let thumbStyle = computed(() => {
      let range = maximum.value - minimum.value;
      let percentage = range === 0 ? 0 : ((sliderValue.value - minimum.value) / range) * 100;
      if (vertical.value) {
        return {top: `${100 - clamp(percentage, 0, 100)}%`};
      }

      return {left: `${clamp(percentage, 0, 100)}%`};
    });

    watch(() => [props.value, props.modelValue], ([value, modelValue]) => {
      if (value !== undefined) {
        uncontrolledValue.value = value;
        return;
      }

      uncontrolledValue.value = modelValue;
    }, {immediate: true});

    let emitInputValue = (value: number, emitChange: boolean) => {
      let normalized = clamp(value, minimum.value, maximum.value);
      if (props.value === undefined && props.modelValue === undefined) {
        uncontrolledValue.value = normalized;
      }

      emit('update:modelValue', normalized);
      if (emitChange) {
        emit('change', normalized);
      }
    };

    return () => h('div', {
      ...rootAttrs.value,
      class: [
        classNames(colorSliderStyles, {
          'spectrum-ColorSlider-container--horizontal': !vertical.value,
          'spectrum-ColorSlider-container--vertical': vertical.value
        }),
        'vs-spectrum-color-slider',
        attrs.class
      ],
      'data-vac': ''
    }, [
      visibleLabel.value
        ? h('div', {class: [classNames(colorSliderStyles, 'spectrum-ColorSlider-labelContainer'), 'vs-spectrum-color-slider__header']}, [
          h('label', {
            id: sliderLabelId.value,
            class: [classNames(fieldLabelStyles, 'spectrum-FieldLabel'), 'vs-spectrum-color-slider__label'],
            for: sliderId.value
          }, visibleLabel.value),
          showValueLabel.value
            ? h('span', {class: [classNames(colorSliderStyles, 'spectrum-ColorSlider-valueLabel'), 'vs-spectrum-color-slider__value']}, [
              h('output', {for: sliderId.value}, `${sliderValue.value}`)
            ])
            : null
        ])
        : null,
      h('div', {
        class: classNames(colorSliderStyles, 'spectrum-ColorSlider', {
          'is-disabled': disabled.value,
          'spectrum-ColorSlider--vertical': vertical.value
        }),
        style: {
          background: disabled.value ? undefined : trackBackground.value
        }
      }, [
        h(ColorThumb, {
          className: classNames(colorSliderStyles, 'spectrum-ColorSlider-handle'),
          value: thumbColor.value,
          isDisabled: disabled.value,
          style: thumbStyle.value
        }, {
          default: () => [
            h('input', {
              id: sliderId.value,
              class: ['vs-spectrum-color-slider__input', classNames(colorSliderStyles, 'spectrum-ColorSlider-slider', 'spectrum-ColorControl-hiddenField')],
              type: 'range',
              min: minimum.value,
              max: maximum.value,
              step: props.step,
              value: sliderValue.value,
              disabled: disabled.value,
              'aria-label': ariaLabel.value,
              'aria-labelledby': ariaLabelledBy.value,
              onInput: (event: Event) => {
                let parsedValue = readNumberInputValue(event);
                if (parsedValue === null) {
                  return;
                }

                emitInputValue(parsedValue, false);
              },
              onChange: (event: Event) => {
                let parsedValue = readNumberInputValue(event);
                if (parsedValue === null) {
                  return;
                }

                emitInputValue(parsedValue, true);
              }
            })
          ]
        })
      ]),
      props.description
        ? h('div', {class: ['vs-spectrum-color-slider__description', classNames(helpTextStyles, 'spectrum-HelpText')]}, props.description)
        : null,
    ]);
  }
});

export const ColorArea = defineComponent({
  name: 'VueColorArea',
  inheritAttrs: false,
  props: {
    colorSpace: {
      type: String as PropType<ColorSpace | undefined>,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    label: {
      type: String,
      default: 'Color area'
    },
    size: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined
    },
    modelValue: {
      type: Object as PropType<ColorAreaValue>,
      default: () => ({
        x: 50,
        y: 50
      })
    },
    value: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    xChannel: {
      type: String as PropType<ColorChannel | undefined>,
      default: undefined
    },
    yChannel: {
      type: String as PropType<ColorChannel | undefined>,
      default: undefined
    }
  },
  emits: {
    change: (value: ColorAreaValue) => typeof value === 'object' && value !== null,
    'update:modelValue': (value: ColorAreaValue) => typeof value === 'object' && value !== null
  },
  setup(props, {emit, attrs}) {
    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));
    let areaValue = computed(() => normalizeColorAreaValue(props.modelValue));

    let ariaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });
    let ariaLabel = computed(() => {
      if (ariaLabelledBy.value) {
        return undefined;
      }

      let value = attrs['aria-label'];
      if (typeof value === 'string' && value.length > 0) {
        return value;
      }

      return props.label;
    });

    let rootAttrs = computed(() => {
      let next: Record<string, unknown> = {};
      for (let [key, value] of Object.entries(attrs)) {
        if (key === 'class' || key === 'style' || key === 'aria-label' || key === 'aria-labelledby') {
          continue;
        }

        next[key] = value;
      }

      return next;
    });

    let emitNextValue = (nextValue: Partial<ColorAreaValue>, emitChange: boolean) => {
      let normalizedValue = normalizeColorAreaValue({
        x: nextValue.x ?? areaValue.value.x,
        y: nextValue.y ?? areaValue.value.y
      });

      emit('update:modelValue', normalizedValue);
      if (emitChange) {
        emit('change', normalizedValue);
      }
    };

    let areaBackground = computed(() => {
      let xChannel = normalizeChannel(props.xChannel ?? 'saturation');
      let yChannel = normalizeChannel(props.yChannel ?? 'brightness');
      if (xChannel === 'hue' || yChannel === 'hue') {
        return {
          background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)'
        };
      }

      if (
        (xChannel === 'red' || xChannel === 'green' || xChannel === 'blue')
        && (yChannel === 'red' || yChannel === 'green' || yChannel === 'blue')
      ) {
        let current = hexToRgb(props.value ? normalizeHexColor(props.value) : DEFAULT_HEX_COLOR);
        let channels: Array<'red' | 'green' | 'blue'> = ['red', 'green', 'blue'];
        let zChannel = channels.find((channel) => channel !== xChannel && channel !== yChannel) ?? 'red';

        let fixed = {
          r: zChannel === 'red' ? current.r : 0,
          g: zChannel === 'green' ? current.g : 0,
          b: zChannel === 'blue' ? current.b : 0
        };

        let xColor = {
          ...fixed,
          r: xChannel === 'red' ? 255 : fixed.r,
          g: xChannel === 'green' ? 255 : fixed.g,
          b: xChannel === 'blue' ? 255 : fixed.b
        };

        let yColor = {
          ...fixed,
          r: yChannel === 'red' ? 255 : fixed.r,
          g: yChannel === 'green' ? 255 : fixed.g,
          b: yChannel === 'blue' ? 255 : fixed.b
        };

        return {
          background: `linear-gradient(to top, ${rgbToHex(fixed)}, ${rgbToHex(yColor)}), linear-gradient(to right, #000000, ${rgbToHex(xColor)})`,
          backgroundBlendMode: 'screen'
        };
      }

      let hue = props.value ? hexToHue(props.value) : 0;
      return {
        background: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, transparent), hsl(${hue}, 100%, 50%)`
      };
    });

    let thumbColor = computed(() => {
      if (props.value && props.value.length > 0) {
        return parseColor(props.value);
      }

      let hue = Math.round(areaValue.value.x * 3.6);
      let lightness = clamp(Math.round(90 - areaValue.value.y * 0.6), 20, 90);
      return `hsl(${hue}, 85%, ${lightness}%)`;
    });

    let thumbStyle = computed(() => ({
      left: `${areaValue.value.x}%`,
      top: `${areaValue.value.y}%`
    }));

    let size = computed(() => toDimensionValue(props.size));

    return () => h('div', {
      ...rootAttrs.value,
      class: [
        classNames(colorAreaStyles, 'spectrum-ColorArea', {'is-disabled': disabled.value}),
        'vs-spectrum-color-area',
        attrs.class
      ],
      role: 'application',
      'aria-label': ariaLabel.value,
      'aria-labelledby': ariaLabelledBy.value,
      style: [
        {
          ...(disabled.value ? {} : areaBackground.value),
          width: size.value,
          height: size.value
        },
        attrs.style
      ],
      'data-vac': ''
    }, [
      h(ColorThumb, {
        value: thumbColor.value,
        isDisabled: disabled.value,
        className: classNames(colorAreaStyles, 'spectrum-ColorArea-handle'),
        style: thumbStyle.value
      }, {
        default: () => h('div', {role: 'presentation'}, [
          h('input', {
            class: ['vs-spectrum-color-area__input', classNames(colorAreaStyles, 'spectrum-ColorArea-slider', 'spectrum-ColorControl-hiddenField')],
            type: 'range',
            min: 0,
            max: 100,
            step: 1,
            value: areaValue.value.x,
            disabled: disabled.value,
            'aria-label': `${props.xChannel ?? 'x'} channel`,
            onInput: (event: Event) => {
              let parsedValue = readNumberInputValue(event);
              if (parsedValue === null) {
                return;
              }

              emitNextValue({x: parsedValue}, false);
            },
            onChange: (event: Event) => {
              let parsedValue = readNumberInputValue(event);
              if (parsedValue === null) {
                return;
              }

              emitNextValue({x: parsedValue}, true);
            }
          }),
          h('input', {
            class: ['vs-spectrum-color-area__input', classNames(colorAreaStyles, 'spectrum-ColorArea-slider', 'spectrum-ColorControl-hiddenField')],
            type: 'range',
            min: 0,
            max: 100,
            step: 1,
            value: areaValue.value.y,
            disabled: disabled.value,
            'aria-label': `${props.yChannel ?? 'y'} channel`,
            onInput: (event: Event) => {
              let parsedValue = readNumberInputValue(event);
              if (parsedValue === null) {
                return;
              }

              emitNextValue({y: parsedValue}, false);
            },
            onChange: (event: Event) => {
              let parsedValue = readNumberInputValue(event);
              if (parsedValue === null) {
                return;
              }

              emitNextValue({y: parsedValue}, true);
            }
          })
        ])
      })
    ]);
  }
});

export const ColorWheel = defineComponent({
  name: 'VueColorWheel',
  inheritAttrs: false,
  props: {
    defaultValue: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    label: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    modelValue: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    size: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined
    },
    value: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: undefined
    }
  },
  emits: {
    change: (value: number) => Number.isFinite(value),
    'update:modelValue': (value: number) => Number.isFinite(value)
  },
  setup(props, {emit, attrs}) {
    let uncontrolledValue = ref<number | string | undefined>(props.defaultValue ?? props.modelValue);
    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));
    let size = computed(() => toDimensionValue(props.size));
    let containerRef = ref<HTMLElement | null>(null);
    let wheelRadius = ref(0);
    let wheelThickness = ref(24);
    let resizeObserver: ResizeObserver | null = null;

    let updateWheelGeometry = () => {
      let element = containerRef.value;
      if (!element) {
        return;
      }

      let radius = element.offsetWidth / 2;
      if (Number.isFinite(radius) && radius > 0) {
        wheelRadius.value = radius;
      }

      if (typeof window === 'undefined') {
        return;
      }

      let rawThickness = window.getComputedStyle(element).getPropertyValue('--spectrum-colorwheel-track-thickness');
      let parsedThickness = Number.parseInt(rawThickness, 10);
      if (Number.isFinite(parsedThickness) && parsedThickness > 0) {
        wheelThickness.value = parsedThickness;
      }
    };

    onMounted(() => {
      updateWheelGeometry();

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(updateWheelGeometry);
        if (containerRef.value) {
          resizeObserver.observe(containerRef.value);
        }
      } else if (typeof window !== 'undefined') {
        window.addEventListener('resize', updateWheelGeometry);
      }
    });

    onBeforeUnmount(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }

      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateWheelGeometry);
      }
    });

    let normalizedHue = (value: number) => ((Math.round(value) % 360) + 360) % 360;
    let hueValue = computed(() => {
      let source = props.value ?? props.modelValue ?? uncontrolledValue.value;
      if (typeof source === 'number') {
        return normalizedHue(source);
      }

      if (typeof source === 'string') {
        let hslMatch = source.match(/(?:hsl|hsb)\(\s*([+-]?\d+(\.\d+)?)/i);
        if (hslMatch) {
          return normalizedHue(Number.parseFloat(hslMatch[1]));
        }

        return normalizedHue(hexToHue(source));
      }

      return normalizedHue(0);
    });

    let wheelAttrs = computed(() => {
      let next: Record<string, unknown> = {};
      for (let [key, value] of Object.entries(attrs)) {
        if (key === 'class' || key === 'style' || key === 'aria-label' || key === 'aria-labelledby') {
          continue;
        }

        next[key] = value;
      }

      return next;
    });

    let ariaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });
    let ariaLabel = computed(() => {
      if (ariaLabelledBy.value) {
        return undefined;
      }

      let value = attrs['aria-label'];
      if (typeof value === 'string' && value.length > 0) {
        return value;
      }

      return props.label;
    });

    let outerRadius = computed(() => wheelRadius.value > 0 ? wheelRadius.value : 80);
    let innerRadius = computed(() => Math.max(0, outerRadius.value - wheelThickness.value));
    let thumbRadius = computed(() => (innerRadius.value + outerRadius.value) / 2);

    let wheelTrackStyle = computed(() => ({
      position: 'relative',
      touchAction: 'none',
      width: `${outerRadius.value * 2}px`,
      height: `${outerRadius.value * 2}px`,
      background: [
        'conic-gradient(',
        'from 90deg,',
        'hsl(0, 100%, 50%),',
        'hsl(30, 100%, 50%),',
        'hsl(60, 100%, 50%),',
        'hsl(90, 100%, 50%),',
        'hsl(120, 100%, 50%),',
        'hsl(150, 100%, 50%),',
        'hsl(180, 100%, 50%),',
        'hsl(210, 100%, 50%),',
        'hsl(240, 100%, 50%),',
        'hsl(270, 100%, 50%),',
        'hsl(300, 100%, 50%),',
        'hsl(330, 100%, 50%),',
        'hsl(360, 100%, 50%)',
        ')'
      ].join(' '),
      clipPath: `path(evenodd, "${circlePath(outerRadius.value, outerRadius.value, outerRadius.value)} ${circlePath(outerRadius.value, outerRadius.value, innerRadius.value)}")`,
      forcedColorAdjust: 'none'
    }));

    let thumbStyle = computed(() => {
      let radians = hueValue.value * Math.PI / 180;
      let x = outerRadius.value + Math.cos(radians) * thumbRadius.value;
      let y = outerRadius.value + Math.sin(radians) * thumbRadius.value;
      return {
        position: 'absolute',
        left: `${x.toFixed(3)}px`,
        top: `${y.toFixed(3)}px`,
        transform: 'translate(-50%, -50%)',
        touchAction: 'none',
        forcedColorAdjust: 'none'
      };
    });

    watch(() => [props.value, props.modelValue], ([value, modelValue]) => {
      if (value !== undefined) {
        uncontrolledValue.value = value;
        return;
      }

      uncontrolledValue.value = modelValue;
    }, {immediate: true});

    let emitHue = (value: number, emitChange: boolean) => {
      let nextHue = normalizedHue(value);
      if (props.value === undefined && props.modelValue === undefined) {
        uncontrolledValue.value = nextHue;
      }

      emit('update:modelValue', nextHue);
      if (emitChange) {
        emit('change', nextHue);
      }
    };

    return () => h('div', {
      ...wheelAttrs.value,
      class: [
        classNames(colorWheelStyles, 'spectrum-ColorWheel', {'is-disabled': disabled.value}),
        'vs-spectrum-color-wheel',
        attrs.class
      ],
      ref: containerRef,
      style: [
        {
          width: size.value,
          height: size.value
        },
        attrs.style
      ],
      'data-vac': ''
    }, [
      h('div', {
        class: classNames(colorWheelStyles, 'spectrum-ColorWheel-gradient'),
        style: wheelTrackStyle.value
      }),
      h(ColorThumb, {
        value: `hsl(${hueValue.value}, 100%, 50%)`,
        isDisabled: disabled.value,
        className: classNames(colorWheelStyles, 'spectrum-ColorWheel-handle'),
        style: thumbStyle.value
      }, {
        default: () => [
          h('input', {
            class: ['vs-spectrum-color-wheel__input', classNames(colorWheelStyles, 'spectrum-ColorWheel-slider', 'spectrum-ColorControl-hiddenField')],
            type: 'range',
            min: 0,
            max: 360,
            step: 1,
            value: hueValue.value,
            disabled: disabled.value,
            'aria-label': ariaLabel.value ?? channelDisplayName('hue'),
            'aria-labelledby': ariaLabelledBy.value,
            onInput: (event: Event) => {
              let parsedValue = readNumberInputValue(event);
              if (parsedValue === null) {
                return;
              }

              emitHue(parsedValue, false);
            },
            onChange: (event: Event) => {
              let parsedValue = readNumberInputValue(event);
              if (parsedValue === null) {
                return;
              }

              emitHue(parsedValue, true);
            }
          })
        ]
      })
    ]);
  }
});

export const ColorSwatchPicker = defineComponent({
  name: 'VueColorSwatchPicker',
  inheritAttrs: false,
  props: {
    defaultValue: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    density: {
      type: String as PropType<'compact' | 'regular' | 'spacious'>,
      default: 'regular'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    items: {
      type: Array as PropType<ColorSwatchItem[]>,
      default: () => DEFAULT_COLOR_SWATCHES.map((item) => ({...item}))
    },
    modelValue: {
      type: String,
      default: ''
    },
    rounding: {
      type: String as PropType<'none' | 'default' | 'full'>,
      default: 'none'
    },
    size: {
      type: String as PropType<'XS' | 'S' | 'M' | 'L'>,
      default: 'M'
    },
    value: {
      type: String as PropType<string | undefined>,
      default: undefined
    }
  },
  emits: {
    change: (item: ColorSwatchItem) => typeof item === 'object' && item !== null,
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs, slots}) {
    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));

    let slotItems = computed(() => {
      let nodes = slots.default?.() ?? [];
      return nodes.map((node, index) => {
        let propsRecord = (node.props ?? {}) as Record<string, unknown>;
        let color = typeof propsRecord.color === 'string' ? propsRecord.color : '';
        if (!color) {
          return null;
        }

        return {
          id: typeof propsRecord.id === 'string' ? propsRecord.id : color,
          color,
          label: typeof propsRecord.label === 'string' ? propsRecord.label : undefined
        };
      }).filter((item): item is ColorSwatchItem => item !== null);
    });

    let swatches = computed(() => (
      slotItems.value.length > 0
        ? slotItems.value
        : props.items.length > 0
        ? props.items
        : DEFAULT_COLOR_SWATCHES
    ));

    let selectedId = computed(() => {
      if (props.value) {
        return props.value;
      }

      if (props.modelValue) {
        return props.modelValue;
      }

      if (props.defaultValue) {
        return props.defaultValue;
      }

      return swatches.value[0]?.id ?? '';
    });

    let gap = computed(() => {
      if (props.density === 'compact') {
        return 'var(--spectrum-global-dimension-size-50)';
      }

      if (props.density === 'spacious') {
        return 'var(--spectrum-global-dimension-size-200)';
      }

      return 'var(--spectrum-global-dimension-size-100)';
    });

    let onSelect = (item: ColorSwatchItem) => {
      emit('update:modelValue', item.id);
      emit('change', item);
    };

    return () => h('div', {
      ...attrs,
      class: [
        'vs-spectrum-color-swatch-picker',
        attrs.class
      ],
      style: [
        {
          display: 'flex',
          flexWrap: 'wrap',
          gap: gap.value
        },
        attrs.style
      ],
      'data-vac': ''
    }, [
      ...swatches.value.map((item) => {
        let isSelected = item.id === selectedId.value;
        return h('button', {
          key: item.id,
          class: ['vs-spectrum-color-swatch-picker__item', isSelected ? 'is-selected' : null],
          type: 'button',
          disabled: disabled.value,
          style: {
            border: 'none',
            background: 'transparent',
            padding: 0,
            position: 'relative',
            cursor: disabled.value ? 'default' : 'pointer',
            borderRadius: props.rounding === 'full'
              ? '9999px'
              : props.rounding === 'none'
                ? '0'
                : 'var(--spectrum-alias-border-radius-small)',
            outline: 'none'
          },
          onClick: () => onSelect(item)
        }, [
          h(ColorSwatch, {
            class: 'vs-spectrum-color-swatch-picker__swatch',
            color: item.color,
            label: item.label ?? item.id,
            selected: isSelected,
            isDisabled: disabled.value,
            rounding: props.rounding === 'none' ? 'none' : props.rounding === 'full' ? 'full' : 'default',
            size: props.size
          }),
          isSelected
            ? h('div', {
              'aria-hidden': 'true',
              style: {
                position: 'absolute',
                pointerEvents: 'none',
                inset: 0,
                borderRadius: 'inherit',
                boxShadow: 'inset 0 0 0 2px var(--spectrum-gray-900), inset 0 0 0 4px var(--spectrum-gray-50)'
              }
            })
            : null
        ]);
      }),
      h('input', {
        type: 'hidden',
        hidden: true,
        'aria-hidden': 'true',
        value: selectedId.value
      })
    ]);
  }
});

export const ColorPicker = defineComponent({
  name: 'VueColorPicker',
  inheritAttrs: false,
  props: {
    defaultValue: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    description: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    rounding: {
      type: String as PropType<'default' | 'none' | 'full'>,
      default: 'default'
    },
    size: {
      type: String as PropType<'XS' | 'S' | 'M' | 'L'>,
      default: 'M'
    },
    value: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String as PropType<string | undefined>,
      default: undefined
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: string) => typeof value === 'string',
    close: () => true,
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    open: () => true,
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs, slots}) {
    let instance = getCurrentInstance();
    let didProvideIsOpenProp = Boolean(instance?.vnode.props && Object.prototype.hasOwnProperty.call(instance.vnode.props, 'isOpen'));
    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));
    let focused = ref(false);
    let open = ref(props.isOpen);
    let rootRef = ref<HTMLElement | null>(null);
    let uncontrolledColor = ref<string | undefined>(props.defaultValue ?? props.modelValue);
    let labelId = `vs-spectrum-color-picker-${++colorFieldId}-label`;

    watch(() => props.isOpen, (next) => {
      if (didProvideIsOpenProp) {
        open.value = next;
      }
    });
    watch(() => [props.value, props.modelValue], ([value, modelValue]) => {
      if (typeof value === 'string') {
        uncontrolledColor.value = value;
        return;
      }

      if (typeof modelValue === 'string') {
        uncontrolledColor.value = modelValue;
      }
    }, {immediate: true});

    let currentColor = computed(() => {
      let value = props.value ?? props.modelValue ?? uncontrolledColor.value;
      if (typeof value === 'string' && value.length > 0) {
        return normalizeHexColor(value);
      }

      return '';
    });

    let setOpen = (nextOpen: boolean) => {
      if (!didProvideIsOpenProp) {
        open.value = nextOpen;
      }

      if (nextOpen) {
        emit('open');
      } else {
        emit('close');
      }
    };

    let onDocumentPointerDown = (event: MouseEvent | PointerEvent | TouchEvent) => {
      if (!open.value) {
        return;
      }

      let target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (rootRef.value?.contains(target)) {
        return;
      }

      setOpen(false);
    };

    onMounted(() => {
      document.addEventListener('mousedown', onDocumentPointerDown, true);
      document.addEventListener('pointerdown', onDocumentPointerDown, true);
      document.addEventListener('touchstart', onDocumentPointerDown, true);
    });
    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', onDocumentPointerDown, true);
      document.removeEventListener('pointerdown', onDocumentPointerDown, true);
      document.removeEventListener('touchstart', onDocumentPointerDown, true);
    });

    let triggerAriaLabelledBy = computed(() => {
      if (props.label) {
        return labelId;
      }

      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });
    let triggerAriaLabel = computed(() => {
      if (triggerAriaLabelledBy.value) {
        return undefined;
      }

      let value = attrs['aria-label'];
      return typeof value === 'string' && value.length > 0 ? value : 'Color picker';
    });

    return () => h('div', {
      ref: rootRef,
      class: [
        'vs-spectrum-color-picker',
        attrs.class
      ],
      style: [
        {
          position: 'relative',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        },
        attrs.style
      ],
      'data-vac': ''
    }, [
      h('button', {
        type: 'button',
        class: 'vs-spectrum-color-picker__trigger',
        disabled: disabled.value,
        'aria-label': triggerAriaLabel.value,
        'aria-labelledby': triggerAriaLabelledBy.value,
        style: {
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spectrum-global-dimension-size-100)',
          outline: 'none',
          cursor: disabled.value ? 'default' : 'pointer'
        },
        onClick: () => {
          if (disabled.value) {
            return;
          }

          setOpen(!open.value);
        },
        onFocus: (event: FocusEvent) => {
          focused.value = true;
          emit('focus', event);
        },
        onBlur: (event: FocusEvent) => {
          focused.value = false;
          emit('blur', event);
        }
      }, [
        h('div', {
          style: {
            outlineStyle: focused.value ? 'solid' : 'none',
            outlineColor: 'var(--spectrum-alias-focus-ring-color)',
            outlineWidth: '2px',
            outlineOffset: '2px',
            borderRadius: 'var(--spectrum-alias-border-radius-small)'
          }
        }, [
          h(ColorSwatch, {
            color: currentColor.value,
            size: props.size,
            rounding: props.rounding,
            label: props.label || 'Color swatch',
            isDisabled: disabled.value
          })
        ]),
        props.label
          ? h('span', {id: labelId}, props.label)
          : null
      ]),
      open.value
        ? h('div', {
          class: ['vs-spectrum-color-picker__popover', classNames({}, 'spectrum-Popover', 'spectrum-Popover--bottom', 'spectrum-Popover--withTip', 'is-open', 'is-open--bottom', 'react-spectrum-Popover')],
          role: 'presentation',
          style: {
            position: 'absolute',
            top: 'calc(100% + var(--spectrum-global-dimension-size-100))',
            left: 0,
            zIndex: 2
          }
        }, [
          h('div', {
            style: {
              background: 'var(--spectrum-global-color-gray-50)',
              border: '1px solid var(--spectrum-gray-300)',
              borderRadius: 'var(--spectrum-alias-border-radius-regular)',
              padding: 'var(--spectrum-global-dimension-size-200)',
              width: 'fit-content',
              minWidth: 0,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)'
            }
          }, slots.default
            ? slots.default()
            : [
              h(ColorEditor, {
                modelValue: currentColor.value,
                'onUpdate:modelValue': (value: string) => {
                  if (props.value === undefined && props.modelValue === undefined) {
                    uncontrolledColor.value = value;
                  }

                  emit('update:modelValue', value);
                },
                onChange: (value: string) => emit('change', value)
              })
            ])
        ])
        : null,
      h('div', {class: 'vs-spectrum-color-picker__preview', style: {display: 'none'}}, [
        h(ColorSwatch, {
          class: 'vs-spectrum-color-picker__preview-swatch',
          color: currentColor.value,
          label: 'Current color',
          isDisabled: disabled.value
        }),
        h('code', {class: 'vs-spectrum-color-picker__preview-value'}, currentColor.value)
      ])
    ]);
  }
});

export const ColorEditor = defineComponent({
  name: 'VueColorEditor',
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    label: {
      type: String,
      default: 'Color editor'
    },
    modelValue: {
      type: String,
      default: DEFAULT_HEX_COLOR
    }
  },
  emits: {
    change: (value: string) => typeof value === 'string',
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));
    let rgbColor = computed(() => hexToRgb(props.modelValue));

    let emitChannelValue = (channel: keyof RgbColor, value: number, emitChange: boolean) => {
      let nextColor: RgbColor = {
        ...rgbColor.value,
        [channel]: clamp(Math.round(value), 0, 255)
      };

      let nextHex = rgbToHex(nextColor);
      emit('update:modelValue', nextHex);
      if (emitChange) {
        emit('change', nextHex);
      }
    };

    return () => h('fieldset', {
      ...attrs,
      class: ['vs-spectrum-color-editor', attrs.class],
      disabled: disabled.value,
      'data-vac': ''
    }, [
      h('legend', {class: 'vs-spectrum-color-editor__label'}, props.label),
      h('div', {class: 'vs-spectrum-color-editor__preview'}, [
        h(ColorSwatch, {
          class: 'vs-spectrum-color-editor__preview-swatch',
          color: props.modelValue,
          label: 'Editable color',
          isDisabled: disabled.value
        }),
        h('code', {class: 'vs-spectrum-color-editor__preview-value'}, normalizeHexColor(props.modelValue))
      ]),
      h('label', {class: 'vs-spectrum-color-editor__channel'}, [
        h('span', `Red (${rgbColor.value.r})`),
        h('input', {
          class: 'vs-spectrum-color-editor__channel-input',
          type: 'range',
          min: 0,
          max: 255,
          step: 1,
          value: rgbColor.value.r,
          onInput: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitChannelValue('r', parsedValue, false);
          },
          onChange: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitChannelValue('r', parsedValue, true);
          }
        })
      ]),
      h('label', {class: 'vs-spectrum-color-editor__channel'}, [
        h('span', `Green (${rgbColor.value.g})`),
        h('input', {
          class: 'vs-spectrum-color-editor__channel-input',
          type: 'range',
          min: 0,
          max: 255,
          step: 1,
          value: rgbColor.value.g,
          onInput: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitChannelValue('g', parsedValue, false);
          },
          onChange: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitChannelValue('g', parsedValue, true);
          }
        })
      ]),
      h('label', {class: 'vs-spectrum-color-editor__channel'}, [
        h('span', `Blue (${rgbColor.value.b})`),
        h('input', {
          class: 'vs-spectrum-color-editor__channel-input',
          type: 'range',
          min: 0,
          max: 255,
          step: 1,
          value: rgbColor.value.b,
          onInput: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitChannelValue('b', parsedValue, false);
          },
          onChange: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitChannelValue('b', parsedValue, true);
          }
        })
      ])
    ]);
  }
});

export function parseColor(value: string): IColor {
  let candidate = value.trim();
  if (/^#[0-9a-fA-F]{3}$/.test(candidate)) {
    let expanded = candidate.slice(1).split('').map((channel) => `${channel}${channel}`).join('');
    return `#${expanded.toLowerCase()}`;
  }

  if (/^#[0-9a-fA-F]{6}$/.test(candidate)) {
    return candidate.toLowerCase();
  }

  if (/^(rgb|rgba|hsl|hsla|hsb|hsba)\(/i.test(candidate)) {
    return candidate;
  }

  return '#000000';
}

export function getColorChannels(colorSpace: ColorSpace): [ColorChannel, ColorChannel, ColorChannel] {
  if (colorSpace === 'rgb') {
    return ['red', 'green', 'blue'];
  }

  if (colorSpace === 'hsb') {
    return ['hue', 'saturation', 'brightness'];
  }

  return ['hue', 'saturation', 'lightness'];
}

export {
  ColorArea as VueColorArea,
  ColorThumb as VueColorThumb,
  ColorEditor as VueColorEditor,
  ColorField as VueColorField,
  ColorPicker as VueColorPicker,
  ColorSlider as VueColorSlider,
  ColorSwatch as VueColorSwatch,
  ColorSwatchPicker as VueColorSwatchPicker,
  ColorWheel as VueColorWheel
};

export type {
  SpectrumColorAreaProps,
  SpectrumColorFieldProps,
  SpectrumColorSliderProps,
  SpectrumColorWheelProps
} from '@vue-types/color';
export type SpectrumColorEditorProps = InstanceType<typeof ColorEditor>['$props'];
export type SpectrumColorPickerProps = InstanceType<typeof ColorPicker>['$props'];
export type SpectrumColorSwatchPickerProps = InstanceType<typeof ColorSwatchPicker>['$props'];
export type SpectrumColorSwatchProps = InstanceType<typeof ColorSwatch>['$props'];
export type SpectrumColorThumbProps = InstanceType<typeof ColorThumb>['$props'];
