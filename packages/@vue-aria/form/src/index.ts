import {
  useFormValidation as useFormValidationInternal,
  type AriaFormValidationOptions,
  type FormValidationAria,
  type NativeValidationResult,
  type ValidatableElement
} from './useFormValidation';
import type {FormValidationState as StatelyFormValidationState} from '@vue-stately/form';

type RefObject<T> = {
  current: T
};

export type FormValidationProps<T = unknown> = AriaFormValidationOptions & {
  _valueType?: T
};
export type FormValidationState = StatelyFormValidationState;
export type {AriaFormValidationOptions, FormValidationAria, NativeValidationResult, ValidatableElement};

export function useFormValidation<T>(
  props: FormValidationProps<T>,
  state: FormValidationState,
  ref: RefObject<ValidatableElement | null> | undefined
): void;
export function useFormValidation(
  options: AriaFormValidationOptions = {},
  state?: FormValidationState,
  refObject?: RefObject<ValidatableElement | null>
): FormValidationAria | void {
  let validation = useFormValidationInternal(options);
  if (state || refObject !== undefined) {
    validation.attach(refObject?.current ?? null);
    return;
  }

  return validation;
}
