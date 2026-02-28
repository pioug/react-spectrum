import {type Color, parseColor} from './Color';

function isParsableColorString(value: string): boolean {
  let trimmedValue = value.trim();
  return /^#[0-9a-fA-F]{3}$/.test(trimmedValue)
    || /^#[0-9a-fA-F]{6}$/.test(trimmedValue)
    || /^(rgb|rgba|hsl|hsla|hsb|hsba)\(/i.test(trimmedValue);
}

export function useColor(value: string | Color | undefined | null): Color | null | undefined {
  if (typeof value === 'string') {
    if (!isParsableColorString(value)) {
      return undefined;
    }

    return parseColor(value);
  }

  return value;
}
