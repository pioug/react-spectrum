import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type ValidatableElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type ValidationBehavior = 'aria' | 'native';

export interface NativeValidationResult {
  isInvalid: boolean,
  validationErrors: string[]
}

export interface AriaFormValidationOptions {
  focus?: () => void,
  isInvalid?: MaybeRef<boolean>,
  onCommitValidation?: () => void,
  onResetValidation?: () => void,
  onUpdateValidation?: (result: NativeValidationResult) => void,
  validationBehavior?: MaybeRef<ValidationBehavior>,
  validationErrors?: MaybeRef<Iterable<string>>
}

export interface FormValidationAria {
  attach: (input: ValidatableElement | null) => () => void,
  commitValidation: () => void,
  isInvalid: ComputedRef<boolean>,
  resetValidation: () => void,
  validationErrors: ComputedRef<string[]>,
  validationMessage: ComputedRef<string>
}

function getNativeValidationResult(input: ValidatableElement): NativeValidationResult {
  return {
    isInvalid: !input.validity.valid,
    validationErrors: input.validationMessage ? [input.validationMessage] : []
  };
}

function getFirstInvalidInput(form: HTMLFormElement): ValidatableElement | null {
  for (let i = 0; i < form.elements.length; i++) {
    let element = form.elements[i];
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement
    ) {
      if (!element.validity.valid) {
        return element;
      }
    }
  }

  return null;
}

export function useFormValidation(options: AriaFormValidationOptions = {}): FormValidationAria {
  let validationBehavior = computed(() => unref(options.validationBehavior) ?? 'aria');
  let inputRef = ref<ValidatableElement | null>(null);

  let validationErrors = computed(() => {
    let resolved = unref(options.validationErrors);
    if (!resolved) {
      return [];
    }

    return Array.from(resolved, (error) => String(error));
  });

  let isInvalid = computed(() => {
    return Boolean(unref(options.isInvalid)) || validationErrors.value.length > 0;
  });

  let validationMessage = computed(() => {
    if (validationErrors.value.length === 0) {
      return '';
    }

    return validationErrors.value.join(' ');
  });

  let applyNativeValidation = () => {
    let input = inputRef.value;
    if (!input || validationBehavior.value !== 'native' || input.disabled) {
      return;
    }

    let nextMessage = isInvalid.value ? validationMessage.value || 'Invalid value.' : '';
    input.setCustomValidity(nextMessage);
    if (!input.hasAttribute('title')) {
      input.title = '';
    }

    if (!isInvalid.value) {
      options.onUpdateValidation?.(getNativeValidationResult(input));
    }
  };

  let commitValidation = () => {
    options.onCommitValidation?.();
    applyNativeValidation();
  };

  let resetValidation = () => {
    options.onResetValidation?.();

    if (inputRef.value && validationBehavior.value === 'native' && !inputRef.value.disabled) {
      inputRef.value.setCustomValidity('');
    }
  };

  let attach = (input: ValidatableElement | null) => {
    inputRef.value = input;
    if (!input) {
      return () => {};
    }

    applyNativeValidation();

    let onInvalid = (event: Event) => {
      commitValidation();

      let form = input.form;
      if (!event.defaultPrevented && form && getFirstInvalidInput(form) === input) {
        if (options.focus) {
          options.focus();
        } else {
          input.focus();
        }
      }

      event.preventDefault();
    };

    let onChange = () => {
      commitValidation();
    };

    let onReset = () => {
      resetValidation();
    };

    input.addEventListener('invalid', onInvalid);
    input.addEventListener('change', onChange);
    input.form?.addEventListener('reset', onReset);

    return () => {
      input.removeEventListener('invalid', onInvalid);
      input.removeEventListener('change', onChange);
      input.form?.removeEventListener('reset', onReset);
      if (inputRef.value === input) {
        inputRef.value = null;
      }
    };
  };

  return {
    attach,
    commitValidation,
    isInvalid,
    resetValidation,
    validationErrors,
    validationMessage
  };
}
