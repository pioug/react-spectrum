import {useHiddenSelect as useHiddenSelectInternal, type AriaHiddenSelectOptions, type HiddenSelectAria} from './useHiddenSelect';
import {HiddenSelect} from './HiddenSelect';
import {useSelect as useSelectInternal, type AriaSelectOptions as VueAriaSelectOptions, type SelectAria as VueSelectAria, type SelectKey, type SelectOption} from './useSelect';
import type {SelectState} from '@vue-stately/select';

type SelectionMode = 'multiple' | 'single';
type FocusableElement = Element;
type RefObject<T> = {
  current: T
};

export {HiddenSelect};
export type {AriaHiddenSelectProps, HiddenSelectProps} from './HiddenSelect';
export type {AriaSelectProps} from '@react-types/select';
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
