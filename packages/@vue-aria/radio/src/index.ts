import {type AriaRadioGroupOptions, type RadioGroupAria, useRadioGroup as useRadioGroupInternal} from './useRadioGroup';
import type {AriaRadioGroupProps, AriaRadioProps} from '@vue-types/radio';
import {type AriaRadioOptions, type RadioAria, useRadio as useRadioInternal} from './useRadio';
import type {RadioGroupState} from '@vue-stately/radio';

type RefObject<T> = {
  current: T
};

export type {AriaRadioOptions, RadioAria, AriaRadioGroupOptions, RadioGroupAria};
export type {MaybeRef} from './types';
export type {AriaRadioGroupProps, AriaRadioProps};
export type {Orientation} from '@vue-types/shared';

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
