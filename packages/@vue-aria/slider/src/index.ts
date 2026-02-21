import {type AriaSliderThumbOptions, type SliderThumbAria, useSliderThumb} from './useSliderThumb';
import type {AriaSliderThumbProps, AriaSliderProps as ReactAriaSliderProps} from '@vue-types/slider';
import type {MaybeRef, SliderDirection, SliderOrientation, SliderState} from './types';
import type {Orientation} from '@vue-types/shared';
import {type SliderAria, useSlider as useSliderInternal, type AriaSliderOptions as VueAriaSliderOptions} from './useSlider';
import type {SliderTrackRef} from './utils';

type RefObject<T> = {
  current: T
};

export type AriaSliderProps<T extends number | number[] = number | number[]> = ReactAriaSliderProps<T>;
export type {AriaSliderThumbProps, Orientation};
export type {MaybeRef, SliderDirection, SliderOrientation, SliderState};
export type {VueAriaSliderOptions as AriaSliderOptions, SliderAria, AriaSliderThumbOptions, SliderThumbAria};
export {useSliderThumb};

export function useSlider<T extends number | number[]>(
  props: AriaSliderProps<T>,
  state: SliderState,
  trackRef: RefObject<Element | null>
): SliderAria;
export function useSlider(
  options: VueAriaSliderOptions = {},
  state: SliderState,
  trackRef: SliderTrackRef | RefObject<Element | null>
): SliderAria {
  let resolvedTrackRef: SliderTrackRef;
  if (trackRef && typeof trackRef === 'object' && 'current' in trackRef) {
    resolvedTrackRef = {
      value: trackRef.current
    };
  } else {
    resolvedTrackRef = trackRef as SliderTrackRef;
  }

  return useSliderInternal(options, state, resolvedTrackRef);
}
