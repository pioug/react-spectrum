import {useCheckboxGroupState as useCheckboxGroupStateInternal, type CheckboxGroupState, type CheckboxGroupStateOptions, type ValidationResult} from './useCheckboxGroupState';
import type {CheckboxGroupProps} from '@react-types/checkbox';

export type {CheckboxGroupState, CheckboxGroupStateOptions, ValidationResult};
export type {CheckboxGroupProps} from '@react-types/checkbox';

export function useCheckboxGroupState(props?: CheckboxGroupProps): CheckboxGroupState;
export function useCheckboxGroupState(options: CheckboxGroupStateOptions = {}): CheckboxGroupState {
  return useCheckboxGroupStateInternal(options);
}
