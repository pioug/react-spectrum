import {type Color, parseColor} from './Color';

export function useColor(value?: Color | null): Color | null {
  if (value == null) {
    return null;
  }

  return parseColor(value);
}
