import {type AriaTextFieldOptions, type TextFieldAria, useTextField} from './useTextField';
import {computed, ref, type Ref} from 'vue';

export interface FormattedTextFieldState {
  setInputValue: (value: string) => void,
  validate: (value: string) => boolean
}

interface CompositionSnapshot {
  selectionEnd: number | null,
  selectionStart: number | null,
  value: string
}

function getNextValue(input: HTMLInputElement, data: string): string {
  let selectionStart = input.selectionStart ?? input.value.length;
  let selectionEnd = input.selectionEnd ?? input.value.length;

  return `${input.value.slice(0, selectionStart)}${data}${input.value.slice(selectionEnd)}`;
}

function getNextValueFromBeforeInput(input: HTMLInputElement, event: InputEvent): string | null | undefined {
  let selectionStart = input.selectionStart ?? 0;
  let selectionEnd = input.selectionEnd ?? selectionStart;

  switch (event.inputType) {
    case 'historyUndo':
    case 'historyRedo':
    case 'insertLineBreak':
      return undefined;
    case 'deleteContent':
    case 'deleteByCut':
    case 'deleteByDrag':
      return input.value.slice(0, selectionStart) + input.value.slice(selectionEnd);
    case 'deleteContentForward':
      return selectionEnd === selectionStart
        ? input.value.slice(0, selectionStart) + input.value.slice(selectionEnd + 1)
        : input.value.slice(0, selectionStart) + input.value.slice(selectionEnd);
    case 'deleteContentBackward':
      return selectionEnd === selectionStart
        ? input.value.slice(0, Math.max(0, selectionStart - 1)) + input.value.slice(selectionStart)
        : input.value.slice(0, selectionStart) + input.value.slice(selectionEnd);
    case 'deleteSoftLineBackward':
    case 'deleteHardLineBackward':
      return input.value.slice(selectionStart);
    default:
      if (event.data != null) {
        return getNextValue(input, event.data);
      }

      return null;
  }
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

  let compositionStartState = ref<CompositionSnapshot | null>(null);

  return {
    ...textField,
    inputProps: computed(() => ({
      ...textField.inputProps.value,
      onBeforeInput: (event: InputEvent) => {
        let input = inputRef.value;
        if (!input) {
          return;
        }

        let nextValue = getNextValueFromBeforeInput(input, event);
        if (nextValue === undefined) {
          return;
        }

        if (nextValue == null || !state.validate(nextValue)) {
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
        if (!inputRef.value) {
          compositionStartState.value = null;
          return;
        }

        compositionStartState.value = {
          value: inputRef.value.value,
          selectionStart: inputRef.value.selectionStart,
          selectionEnd: inputRef.value.selectionEnd
        };
      },
      onCompositionEnd: () => {
        let input = inputRef.value;
        if (!input || state.validate(input.value)) {
          return;
        }

        let fallbackValue = compositionStartState.value?.value ?? '';
        let fallbackSelectionStart = compositionStartState.value?.selectionStart ?? fallbackValue.length;
        let fallbackSelectionEnd = compositionStartState.value?.selectionEnd ?? fallbackSelectionStart;
        input.value = fallbackValue;
        input.setSelectionRange(fallbackSelectionStart, fallbackSelectionEnd);
        textField.inputProps.value.onInput(fallbackValue);
        state.setInputValue(fallbackValue);
      }
    })) as TextFieldAria['inputProps']
  };
}
