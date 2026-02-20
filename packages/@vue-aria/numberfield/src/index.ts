import {useNumberField as useNumberFieldInternal, type AriaNumberFieldOptions, type NumberFieldAria} from './useNumberField';
import type {AriaNumberFieldProps} from '@react-types/numberfield';
import type {NumberFieldState} from '@vue-stately/numberfield';

type RefObject<T> = {
  current: T
};

export type {AriaNumberFieldOptions, NumberFieldAria};
export type {MaybeRef} from './types';
export type {AriaNumberFieldProps} from '@react-types/numberfield';

export function useNumberField(
  props: AriaNumberFieldProps,
  state: NumberFieldState,
  inputRef: RefObject<HTMLInputElement | null>
): NumberFieldAria;
export function useNumberField(
  options: AriaNumberFieldOptions = {},
  state?: NumberFieldState,
  inputRef?: RefObject<HTMLInputElement | null>
): NumberFieldAria {
  void state;
  void inputRef;
  return useNumberFieldInternal(options);
}
