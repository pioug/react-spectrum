import {useRadioGroupState as useRadioGroupStateInternal, type RadioGroupState, type RadioGroupStateOptions, type ValidationState} from './useRadioGroupState';
import type {RadioGroupProps} from '@react-types/radio';

export type {RadioGroupState, RadioGroupStateOptions, ValidationState};
export type {RadioGroupProps} from '@react-types/radio';

export function useRadioGroupState(props: RadioGroupProps): RadioGroupState;
export function useRadioGroupState(options: RadioGroupStateOptions = {}): RadioGroupState {
  return useRadioGroupStateInternal(options);
}
