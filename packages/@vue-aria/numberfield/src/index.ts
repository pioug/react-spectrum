import {type AriaNumberFieldOptions, type NumberFieldAria, useNumberField as useNumberFieldInternal} from './useNumberField';
import type {AriaNumberFieldProps} from '@vue-types/numberfield';
import type {NumberFieldState} from '@vue-stately/numberfield';

type RefObject<T> = {
  current: T
};

export type {AriaNumberFieldOptions, NumberFieldAria};
export type {MaybeRef} from './types';
export type {AriaNumberFieldProps} from '@vue-types/numberfield';

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
