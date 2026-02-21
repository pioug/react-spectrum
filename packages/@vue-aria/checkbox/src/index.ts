import {type AriaCheckboxGroupItemOptions, useCheckboxGroupItem as useCheckboxGroupItemInternal} from './useCheckboxGroupItem';
import type {AriaCheckboxGroupItemProps, AriaCheckboxGroupProps, AriaCheckboxProps} from '@vue-types/checkbox';
import {type AriaCheckboxGroupOptions, type CheckboxGroupAria, useCheckboxGroup as useCheckboxGroupInternal} from './useCheckboxGroup';
import {type AriaCheckboxOptions, type CheckboxAria, useCheckbox as useCheckboxInternal} from './useCheckbox';
import type {CheckboxGroupState} from '@vue-stately/checkbox';
import type {ToggleState} from '@vue-stately/toggle';

type RefObject<T> = {
  current: T
};

export type {AriaCheckboxGroupItemProps, AriaCheckboxGroupProps, AriaCheckboxProps} from '@vue-types/checkbox';
export type {AriaCheckboxOptions, CheckboxAria, AriaCheckboxGroupOptions, CheckboxGroupAria, AriaCheckboxGroupItemOptions};

export function useCheckbox(
  props: AriaCheckboxProps,
  state: ToggleState,
  ref: RefObject<HTMLInputElement | null>
): CheckboxAria;
export function useCheckbox(options?: AriaCheckboxOptions): CheckboxAria;
export function useCheckbox(options?: AriaCheckboxOptions): CheckboxAria {
  return useCheckboxInternal(options);
}

export function useCheckboxGroup(props: AriaCheckboxGroupProps, state: CheckboxGroupState): CheckboxGroupAria;
export function useCheckboxGroup(options?: AriaCheckboxGroupOptions): CheckboxGroupAria;
export function useCheckboxGroup(options?: AriaCheckboxGroupOptions): CheckboxGroupAria {
  return useCheckboxGroupInternal(options);
}

export function useCheckboxGroupItem(
  props: AriaCheckboxGroupItemProps,
  state: CheckboxGroupState,
  ref: RefObject<HTMLInputElement | null>
): CheckboxAria;
export function useCheckboxGroupItem(options: AriaCheckboxGroupItemOptions): CheckboxAria;
export function useCheckboxGroupItem(options: AriaCheckboxGroupItemOptions): CheckboxAria {
  return useCheckboxGroupItemInternal(options);
}
