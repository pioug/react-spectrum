export type Color = string;
export type ColorFormat = 'hex' | 'hsb' | 'hsl' | 'rgb';
export type ColorSpace = 'hsb' | 'hsl' | 'rgb';
export type ColorChannel = 'alpha' | 'blue' | 'brightness' | 'green' | 'hue' | 'lightness' | 'red' | 'saturation';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizeHex(value: string): string {
  let candidate = value.trim();
  if (/^#[0-9a-fA-F]{3}$/.test(candidate)) {
    let expanded = candidate.slice(1).split('').map((channel) => `${channel}${channel}`).join('');
    return `#${expanded.toLowerCase()}`;
  }

  if (/^#[0-9a-fA-F]{6}$/.test(candidate)) {
    return candidate.toLowerCase();
  }

  return '#000000';
}

function toHexChannel(value: number): string {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0');
}

function getRgb(color: Color): {blue: number, green: number, red: number} {
  let hex = normalizeHex(color);
  return {
    red: parseInt(hex.slice(1, 3), 16),
    green: parseInt(hex.slice(3, 5), 16),
    blue: parseInt(hex.slice(5, 7), 16)
  };
}

function toHex(red: number, green: number, blue: number): Color {
  return `#${toHexChannel(red)}${toHexChannel(green)}${toHexChannel(blue)}`;
}

export function parseColor(value: string): Color {
  let candidate = value.trim();
  if (/^(rgb|rgba|hsl|hsla|hsb|hsba)\(/i.test(candidate)) {
    return candidate;
  }

  return normalizeHex(candidate);
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

export function getColorChannelValue(color: Color, channel: ColorChannel): number {
  let {red, green, blue} = getRgb(color);

  switch (channel) {
    case 'red':
      return red;
    case 'green':
      return green;
    case 'blue':
      return blue;
    case 'hue':
      return red / 255 * 360;
    case 'saturation':
      return green / 255 * 100;
    case 'lightness':
    case 'brightness':
      return blue / 255 * 100;
    case 'alpha':
    default:
      return 1;
  }
}

export function setColorChannelValue(color: Color, channel: ColorChannel, value: number): Color {
  let {red, green, blue} = getRgb(color);

  switch (channel) {
    case 'red':
      red = value;
      break;
    case 'green':
      green = value;
      break;
    case 'blue':
      blue = value;
      break;
    case 'hue':
      red = value / 360 * 255;
      break;
    case 'saturation':
      green = value / 100 * 255;
      break;
    case 'lightness':
    case 'brightness':
      blue = value / 100 * 255;
      break;
    case 'alpha':
    default:
      break;
  }

  return toHex(red, green, blue);
}

export function getChannelRange(channel: ColorChannel): {maxValue: number, minValue: number, pageSize: number, step: number} {
  if (channel === 'alpha') {
    return {
      minValue: 0,
      maxValue: 1,
      step: 0.01,
      pageSize: 0.1
    };
  }

  if (channel === 'hue') {
    return {
      minValue: 0,
      maxValue: 360,
      step: 1,
      pageSize: 10
    };
  }

  if (channel === 'saturation' || channel === 'lightness' || channel === 'brightness') {
    return {
      minValue: 0,
      maxValue: 100,
      step: 1,
      pageSize: 10
    };
  }

  return {
    minValue: 0,
    maxValue: 255,
    step: 1,
    pageSize: 16
  };
}
