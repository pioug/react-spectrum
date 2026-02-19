import {type RuntimeStyleOutput, style} from './style-macro';

export interface ColorStates {
  default: string,
  isFocusVisible: string,
  isHovered: string,
  isPressed: string
}

function shiftColorScale(color: string): string {
  let match = color.match(/^(.*?)-(\d+)$/);
  if (!match) {
    return color;
  }

  let [, prefix, scale] = match;
  return `${prefix}-${Number(scale) + 100}`;
}

export function baseColor(base: string): ColorStates {
  let next = shiftColorScale(base);

  return {
    default: base,
    isFocusVisible: next,
    isHovered: next,
    isPressed: next
  };
}

export function lightDark(light: string, dark: string): `[${string}]` {
  return `[light-dark(${light}, ${dark})]`;
}

export const focusRing: RuntimeStyleOutput = style({
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
});

export {style};
