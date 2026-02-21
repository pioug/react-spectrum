import type * as CSS from 'csstype';
import type {
  focusRing as reactFocusRing,
  style as reactStyle
} from '../../../@react-spectrum/style-macro-s1/src/spectrum-theme';
import {style as styleInternal} from './style-macro';

export interface ColorStates {
  default: CSS.Property.Color,
  isFocusVisible: CSS.Property.Color,
  isHovered: CSS.Property.Color,
  isPressed: CSS.Property.Color
}

const color = {
  transparent: 'transparent',
  black: 'black',
  white: 'white'
} as const;

function shiftColorScale(color: string): string {
  let match = color.match(/^(.*?)-(\d+)$/);
  if (!match) {
    return color;
  }

  let [, prefix, scale] = match;
  return `${prefix}-${Number(scale) + 100}`;
}

export function baseColor(base: keyof typeof color): ColorStates {
  let next = shiftColorScale(base);

  return {
    default: base,
    isFocusVisible: next,
    isHovered: next,
    isPressed: next
  };
}

export function lightDark(light: keyof typeof color, dark: keyof typeof color): `[${string}]` {
  return `[light-dark(${light}, ${dark})]`;
}

export const style: typeof reactStyle = styleInternal as unknown as typeof reactStyle;

export const focusRing: typeof reactFocusRing = styleInternal({
  outlineColor: {
    default: 'transparent',
    isFocusVisible: '[Highlight]'
  },
  outlineStyle: {
    default: 'none',
    isFocusVisible: 'solid'
  },
  outlineWidth: {
    default: '0px',
    isFocusVisible: '2px'
  }
}) as unknown as typeof reactFocusRing;
