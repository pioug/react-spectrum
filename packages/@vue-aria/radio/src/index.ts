import {useRadio as useRadioInternal, type AriaRadioOptions, type RadioAria} from './useRadio';
import {useRadioGroup as useRadioGroupInternal, type AriaRadioGroupOptions, type RadioGroupAria} from './useRadioGroup';
import type {RadioGroupState} from '@vue-stately/radio';
import type {AriaRadioGroupProps, AriaRadioProps} from '@react-types/radio';

type RefObject<T> = {
  current: T
};

export type {AriaRadioOptions, RadioAria, AriaRadioGroupOptions, RadioGroupAria};
export type {MaybeRef} from './types';
export type {AriaRadioGroupProps, AriaRadioProps};
export type {Orientation} from '@react-types/shared';

export function useRadio(
  props: AriaRadioProps,
  state: RadioGroupState,
  ref: RefObject<HTMLInputElement | null>
): RadioAria;
export function useRadio(options: AriaRadioOptions, group: RadioGroupAria): RadioAria;
export function useRadio(options: AriaRadioOptions, group: RadioGroupAria): RadioAria {
  return useRadioInternal(options, group);
}

export function useRadioGroup(props: AriaRadioGroupProps, state: RadioGroupState): RadioGroupAria;
export function useRadioGroup(options?: AriaRadioGroupOptions): RadioGroupAria;
export function useRadioGroup(options?: AriaRadioGroupOptions): RadioGroupAria {
  return useRadioGroupInternal(options);
}
