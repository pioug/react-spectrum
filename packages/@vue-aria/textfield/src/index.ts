import {type Ref, ref} from 'vue';
import {useTextField as useTextFieldInternal, type AriaTextFieldOptions as VueAriaTextFieldOptions, type TextFieldAria as VueTextFieldAria, type TextFieldInputElementType} from './useTextField';
import {useFormattedTextField as useFormattedTextFieldInternal, type FormattedTextFieldState} from './useFormattedTextField';
import type {AriaTextFieldProps} from '@react-types/textfield';

type DefaultElementType = 'input';
type TextFieldIntrinsicElements = 'input' | 'textarea';
type TextFieldElement<T extends TextFieldIntrinsicElements> = T extends 'textarea' ? HTMLTextAreaElement : HTMLInputElement;
type RefObject<T> = {
  current: T
};
type TextFieldRefObject<T extends TextFieldIntrinsicElements> = RefObject<TextFieldElement<T> | null>;

function toVueRef<T>(refObject: RefObject<T | null> | Ref<T | null>): Ref<T | null> {
  if ('value' in refObject) {
    return refObject;
  }

  let proxyRef = ref(refObject.current) as Ref<T | null>;
  Object.defineProperty(proxyRef, 'value', {
    get() {
      return refObject.current;
    },
    set(value: T | null) {
      refObject.current = value;
    }
  });
  return proxyRef;
}

export type AriaTextFieldOptions<T extends TextFieldIntrinsicElements = DefaultElementType> = VueAriaTextFieldOptions;
export type TextFieldAria<T extends TextFieldIntrinsicElements = DefaultElementType> = VueTextFieldAria;

export type {TextFieldInputElementType, FormattedTextFieldState, AriaTextFieldProps};

export function useTextField<T extends TextFieldIntrinsicElements = DefaultElementType>(
  props: AriaTextFieldOptions<T>,
  ref: TextFieldRefObject<T>
): TextFieldAria<T>;
export function useTextField(options?: VueAriaTextFieldOptions): VueTextFieldAria;
export function useTextField(
  options: VueAriaTextFieldOptions = {},
  inputRef?: RefObject<HTMLInputElement | HTMLTextAreaElement | null>
): VueTextFieldAria {
  if (inputRef) {
    return useTextFieldInternal({
      ...options,
      inputRef: toVueRef(inputRef)
    });
  }

  return useTextFieldInternal(options);
}

export function useFormattedTextField(
  props: AriaTextFieldProps,
  state: FormattedTextFieldState,
  inputRef: RefObject<HTMLInputElement | null>
): TextFieldAria;
export function useFormattedTextField(
  options: VueAriaTextFieldOptions,
  state: FormattedTextFieldState,
  inputRef: Ref<HTMLInputElement | null>
): VueTextFieldAria;
export function useFormattedTextField(
  options: VueAriaTextFieldOptions,
  state: FormattedTextFieldState,
  inputRef: Ref<HTMLInputElement | null> | RefObject<HTMLInputElement | null>
): VueTextFieldAria {
  return useFormattedTextFieldInternal(options, state, toVueRef(inputRef));
}
