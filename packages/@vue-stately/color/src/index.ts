import {type Color, getColorChannels, parseColor as parseColorInternal} from './Color';
import type {ColorFieldProps, ColorWheelProps} from '@vue-types/color';
import {type ColorFieldState, type ColorFieldStateOptions, useColorFieldState as useColorFieldStateInternal} from './useColorFieldState';
import {type ColorWheelState, type ColorWheelStateOptions, useColorWheelState as useColorWheelStateInternal} from './useColorWheelState';
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
export type {ColorFieldProps, ColorWheelProps} from '@vue-types/color';

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
