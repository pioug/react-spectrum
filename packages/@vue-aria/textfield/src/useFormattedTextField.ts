import {type AriaTextFieldOptions, type TextFieldAria, useTextField} from './useTextField';
import {computed, ref, type Ref} from 'vue';

export interface FormattedTextFieldState {
  setInputValue: (value: string) => void,
  validate: (value: string) => boolean
}

function getNextValue(input: HTMLInputElement, data: string | null): string {
  let selectionStart = input.selectionStart ?? input.value.length;
  let selectionEnd = input.selectionEnd ?? input.value.length;
  let insertedText = data ?? '';

  return `${input.value.slice(0, selectionStart)}${insertedText}${input.value.slice(selectionEnd)}`;
}

export function useFormattedTextField(
  options: AriaTextFieldOptions,
  state: FormattedTextFieldState,
  inputRef: Ref<HTMLInputElement | null>
): TextFieldAria {
  let textField = useTextField({
    ...options,
    inputRef
  });

  let compositionStartValue = ref<string | null>(null);

  return {
    ...textField,
    inputProps: computed(() => ({
      ...textField.inputProps.value,
      onBeforeInput: (event: InputEvent) => {
        let input = inputRef.value;
        if (!input || event.data == null) {
          return;
        }

        let nextValue = getNextValue(input, event.data);
        if (!state.validate(nextValue)) {
          event.preventDefault();
        }
      },
      onInput: (valueOrEvent: Event | string) => {
        let nextValue: string | null = null;
        if (typeof valueOrEvent === 'string') {
          nextValue = valueOrEvent;
        } else if (valueOrEvent.target instanceof HTMLInputElement) {
          nextValue = valueOrEvent.target.value;
        }

        if (nextValue == null || !state.validate(nextValue)) {
          return;
        }

        textField.inputProps.value.onInput(valueOrEvent);
        state.setInputValue(nextValue);
      },
      onCompositionStart: () => {
        compositionStartValue.value = inputRef.value?.value ?? null;
      },
      onCompositionEnd: () => {
        let input = inputRef.value;
        if (!input || state.validate(input.value)) {
          return;
        }

        let fallbackValue = compositionStartValue.value ?? '';
        input.value = fallbackValue;
        textField.inputProps.value.onInput(fallbackValue);
        state.setInputValue(fallbackValue);
      }
    })) as TextFieldAria['inputProps']
  };
}
