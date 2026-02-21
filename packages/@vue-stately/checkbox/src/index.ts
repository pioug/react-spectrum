import type {CheckboxGroupProps} from '@vue-types/checkbox';
import {type CheckboxGroupState, type CheckboxGroupStateOptions, useCheckboxGroupState as useCheckboxGroupStateInternal, type ValidationResult} from './useCheckboxGroupState';

export type {CheckboxGroupState, CheckboxGroupStateOptions, ValidationResult};
export type {CheckboxGroupProps} from '@vue-types/checkbox';

export function useCheckboxGroupState(props?: CheckboxGroupProps): CheckboxGroupState;
export function useCheckboxGroupState(options: CheckboxGroupStateOptions = {}): CheckboxGroupState {
  return useCheckboxGroupStateInternal(options);
}
