import {type AriaHiddenSelectOptions, type HiddenSelectAria, useHiddenSelect as useHiddenSelectInternal} from './useHiddenSelect';
import {HiddenSelect} from './HiddenSelect';
import {type SelectKey, type SelectOption, useSelect as useSelectInternal, type AriaSelectOptions as VueAriaSelectOptions, type SelectAria as VueSelectAria} from './useSelect';
import type {SelectState} from '@vue-stately/select';

type SelectionMode = 'multiple' | 'single';
type FocusableElement = Element;
type RefObject<T> = {
  current: T
};

export {HiddenSelect};
export type {AriaHiddenSelectProps, HiddenSelectProps} from './HiddenSelect';
export type {AriaSelectProps} from '@vue-types/select';
export type {MaybeRef} from './types';

export type AriaSelectOptions<T = unknown, M extends SelectionMode = 'single'> = VueAriaSelectOptions;
export type SelectAria<T = unknown, M extends SelectionMode = 'single'> = VueSelectAria;
export type {AriaHiddenSelectOptions, HiddenSelectAria, SelectKey, SelectOption};

export function useSelect<T, M extends SelectionMode = 'single'>(
  props: AriaSelectOptions<T, M>,
  state: SelectState<T, M>,
  ref: RefObject<HTMLElement | null>
): SelectAria<T, M>;
export function useSelect(options?: VueAriaSelectOptions): VueSelectAria;
export function useSelect(options?: VueAriaSelectOptions): VueSelectAria {
  return useSelectInternal(options);
}

export function useHiddenSelect<T, M extends SelectionMode = 'single'>(
  props: AriaHiddenSelectOptions,
  state: SelectState<T, M>,
  triggerRef: RefObject<FocusableElement | null>
): HiddenSelectAria;
export function useHiddenSelect(options: AriaHiddenSelectOptions): HiddenSelectAria;
export function useHiddenSelect(options: AriaHiddenSelectOptions): HiddenSelectAria {
  return useHiddenSelectInternal(options);
}
