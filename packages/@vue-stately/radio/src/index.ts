import type {RadioGroupProps} from '@vue-types/radio';
import {type RadioGroupState, type RadioGroupStateOptions, useRadioGroupState as useRadioGroupStateInternal, type ValidationState} from './useRadioGroupState';

export type {RadioGroupState, RadioGroupStateOptions, ValidationState};
export type {RadioGroupProps} from '@vue-types/radio';

export function useRadioGroupState(props: RadioGroupProps): RadioGroupState;
export function useRadioGroupState(options: RadioGroupStateOptions = {}): RadioGroupState {
  return useRadioGroupStateInternal(options);
}
