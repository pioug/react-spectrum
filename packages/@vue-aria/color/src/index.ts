import {
  type AriaColorAreaOptions,
  type ColorAreaAria,
  useColorArea as useColorAreaInternal
} from './useColorArea';
import {
  type AriaColorChannelFieldOptions,
  type ColorChannelFieldAria,
  useColorChannelField as useColorChannelFieldInternal
} from './useColorChannelField';
import {
  type AriaColorFieldOptions,
  type ColorFieldAria,
  useColorField as useColorFieldInternal
} from './useColorField';
import {
  type AriaColorSliderOptions,
  type ColorSliderAria,
  useColorSlider as useColorSliderInternal
} from './useColorSlider';
import {
  type AriaColorSwatchOptions,
  type ColorSwatchAria,
  useColorSwatch as useColorSwatchInternal
} from './useColorSwatch';
import {
  type AriaColorWheelOptions,
  type ColorWheelAria,
  useColorWheel as useColorWheelInternal
} from './useColorWheel';
import type {
  AriaColorAreaProps as ReactAriaColorAreaProps,
  AriaColorChannelFieldProps as ReactAriaColorChannelFieldProps,
  AriaColorFieldProps as ReactAriaColorFieldProps,
  AriaColorSliderProps as ReactAriaColorSliderProps,
  AriaColorSwatchProps as ReactAriaColorSwatchProps
} from '@vue-types/color';

type AnyRecord = Record<string, unknown>;
type RefObject<T> = {current: T};
type ColorAreaState = AnyRecord;
type ColorSliderState = AnyRecord;
type ColorWheelState = AnyRecord;
type ColorFieldState = AnyRecord;
type ColorChannelFieldState = AnyRecord;

export type {AriaColorAreaOptions, ColorAreaAria};
export type {AriaColorChannelFieldOptions, ColorChannelFieldAria};
export type {AriaColorFieldOptions, ColorFieldAria};
export type {AriaColorSliderOptions, ColorSliderAria};
export type {AriaColorSwatchOptions, ColorSwatchAria};
export type {AriaColorWheelOptions, ColorWheelAria};

export type AriaColorAreaProps = ReactAriaColorAreaProps;
export type AriaColorChannelFieldProps = ReactAriaColorChannelFieldProps;
export type AriaColorFieldProps = ReactAriaColorFieldProps;
export type AriaColorSliderProps = ReactAriaColorSliderProps;
export type AriaColorSwatchProps = ReactAriaColorSwatchProps;

export function useColorArea(options: AriaColorAreaOptions, state: ColorAreaState): ColorAreaAria;
export function useColorArea(options: AriaColorAreaOptions): ColorAreaAria;
export function useColorArea(options: AriaColorAreaOptions): ColorAreaAria {
  return useColorAreaInternal(options);
}

export function useColorSlider(options: AriaColorSliderOptions, state: ColorSliderState): ColorSliderAria;
export function useColorSlider(options: AriaColorSliderOptions): ColorSliderAria;
export function useColorSlider(options: AriaColorSliderOptions): ColorSliderAria {
  return useColorSliderInternal(options);
}

export function useColorWheel(
  options: AriaColorWheelOptions,
  state: ColorWheelState,
  ref: RefObject<HTMLInputElement | null>
): ColorWheelAria;
export function useColorWheel(options: AriaColorWheelOptions): ColorWheelAria;
export function useColorWheel(options: AriaColorWheelOptions): ColorWheelAria {
  return useColorWheelInternal(options);
}

export function useColorField(
  props: AriaColorFieldProps,
  state: ColorFieldState,
  ref: RefObject<HTMLInputElement | null>
): ColorFieldAria;
export function useColorField(options: AriaColorFieldOptions): ColorFieldAria;
export function useColorField(options: AriaColorFieldOptions): ColorFieldAria {
  return useColorFieldInternal(options);
}

export function useColorSwatch(props: AriaColorSwatchProps): ColorSwatchAria;
export function useColorSwatch(options: AriaColorSwatchOptions): ColorSwatchAria;
export function useColorSwatch(options: AriaColorSwatchOptions): ColorSwatchAria {
  return useColorSwatchInternal(options);
}

export function useColorChannelField(
  props: AriaColorChannelFieldProps,
  state: ColorChannelFieldState,
  ref: RefObject<HTMLInputElement | null>
): ColorChannelFieldAria;
export function useColorChannelField(options: AriaColorChannelFieldOptions): ColorChannelFieldAria;
export function useColorChannelField(options: AriaColorChannelFieldOptions): ColorChannelFieldAria {
  return useColorChannelFieldInternal(options);
}
