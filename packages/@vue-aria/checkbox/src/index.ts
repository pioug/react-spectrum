import {useCheckbox as useCheckboxInternal, type AriaCheckboxOptions, type CheckboxAria} from './useCheckbox';
import {useCheckboxGroup as useCheckboxGroupInternal, type AriaCheckboxGroupOptions, type CheckboxGroupAria} from './useCheckboxGroup';
import {useCheckboxGroupItem as useCheckboxGroupItemInternal, type AriaCheckboxGroupItemOptions} from './useCheckboxGroupItem';
import type {CheckboxGroupState} from '@vue-stately/checkbox';
import type {ToggleState} from '@vue-stately/toggle';
import type {AriaCheckboxGroupItemProps, AriaCheckboxGroupProps, AriaCheckboxProps} from '@react-types/checkbox';

type RefObject<T> = {
  current: T
};

export type {AriaCheckboxGroupItemProps, AriaCheckboxGroupProps, AriaCheckboxProps} from '@react-types/checkbox';
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
