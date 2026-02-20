import {getColorChannels, parseColor as parseColorInternal, type Color} from './Color';
import {useColorWheelState as useColorWheelStateInternal, type ColorWheelState, type ColorWheelStateOptions} from './useColorWheelState';
import {useColorFieldState as useColorFieldStateInternal, type ColorFieldState, type ColorFieldStateOptions} from './useColorFieldState';
import type {ColorFieldProps, ColorWheelProps} from '@react-types/color';
export type {Color, ColorChannel, ColorFormat, ColorSpace} from './Color';
export {getColorChannels};
export {useColorAreaState} from './useColorAreaState';
export type {ColorAreaProps, ColorAreaState} from './useColorAreaState';
export {useColorSliderState} from './useColorSliderState';
export type {ColorSliderState, ColorSliderStateOptions} from './useColorSliderState';
export {useColorChannelFieldState} from './useColorChannelFieldState';
export type {ColorChannelFieldProps, ColorChannelFieldState, ColorChannelFieldStateOptions} from './useColorChannelFieldState';
export {useColorPickerState} from './useColorPickerState';
export type {ColorPickerProps, ColorPickerState} from './useColorPickerState';
export type {ColorFieldProps, ColorWheelProps} from '@react-types/color';

type IColor = Color;

export function parseColor(value: string): IColor {
  return parseColorInternal(value) as IColor;
}

export type {ColorWheelState, ColorWheelStateOptions};
export function useColorWheelState(props: ColorWheelProps): ColorWheelState;
export function useColorWheelState(props: ColorWheelStateOptions): ColorWheelState;
export function useColorWheelState(props: ColorWheelStateOptions): ColorWheelState {
  return useColorWheelStateInternal(props);
}

export type {ColorFieldState, ColorFieldStateOptions};
export function useColorFieldState(props: ColorFieldProps): ColorFieldState;
export function useColorFieldState(props?: ColorFieldStateOptions): ColorFieldState;
export function useColorFieldState(props?: ColorFieldStateOptions): ColorFieldState {
  return useColorFieldStateInternal(props);
}
