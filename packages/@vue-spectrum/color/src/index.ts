import {VueColorArea, VueColorEditor, VueColorField, VueColorPicker, VueColorSlider, VueColorSwatch, VueColorSwatchPicker, VueColorWheel} from '@vue-spectrum/components';

export type Color = string;
export type ColorSpace = 'rgb' | 'hsl' | 'hsb';
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsb';
export type ColorChannel = 'red' | 'green' | 'blue' | 'hue' | 'saturation' | 'lightness' | 'brightness';
type IColor = Color;

export const ColorArea = VueColorArea;
export const ColorEditor = VueColorEditor;
export const ColorField = VueColorField;
export const ColorPicker = VueColorPicker;
export const ColorSlider = VueColorSlider;
export const ColorSwatch = VueColorSwatch;
export const ColorSwatchPicker = VueColorSwatchPicker;
export const ColorWheel = VueColorWheel;

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

export {VueColorArea, VueColorEditor, VueColorField, VueColorPicker, VueColorSlider, VueColorSwatch, VueColorSwatchPicker, VueColorWheel};
export type {
  SpectrumColorAreaProps,
  SpectrumColorFieldProps,
  SpectrumColorSliderProps,
  SpectrumColorWheelProps
} from '@react-types/color';
export type SpectrumColorEditorProps = InstanceType<typeof VueColorEditor>['$props'];
export type SpectrumColorPickerProps = InstanceType<typeof VueColorPicker>['$props'];
export type SpectrumColorSwatchPickerProps = InstanceType<typeof VueColorSwatchPicker>['$props'];
export type SpectrumColorSwatchProps = InstanceType<typeof VueColorSwatch>['$props'];
