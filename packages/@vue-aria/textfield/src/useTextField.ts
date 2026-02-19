import {computed, type ComputedRef, ref, type Ref, unref, watch} from 'vue';
import {useField} from '@vue-aria/label';
import {useFormValidation} from '@vue-aria/form';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;
type ValidationBehavior = 'aria' | 'native';

export type TextFieldInputElementType = 'input' | 'textarea';

export interface AriaTextFieldOptions {
  'aria-activedescendant'?: MaybeRef<string | undefined>,
  'aria-autocomplete'?: MaybeRef<'both' | 'inline' | 'list' | 'none' | undefined>,
  'aria-controls'?: MaybeRef<string | undefined>,
  'aria-errormessage'?: MaybeRef<string | undefined>,
  'aria-haspopup'?: MaybeRef<boolean | 'dialog' | 'grid' | 'listbox' | 'menu' | 'tree' | undefined>,
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  autoCapitalize?: MaybeRef<'characters' | 'none' | 'off' | 'on' | 'sentences' | 'words' | undefined>,
  autoComplete?: MaybeRef<string | undefined>,
  autoCorrect?: MaybeRef<string | undefined>,
  defaultValue?: MaybeRef<string | undefined>,
  description?: MaybeRef<string | undefined>,
  enterKeyHint?: MaybeRef<'done' | 'enter' | 'go' | 'next' | 'previous' | 'search' | 'send' | undefined>,
  errorMessage?: MaybeRef<string | undefined>,
  form?: MaybeRef<string | undefined>,
  id?: MaybeRef<string | undefined>,
  inputElementType?: MaybeRef<TextFieldInputElementType>,
  inputMode?: MaybeRef<string | undefined>,
  inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement | null>,
  inputValue?: Ref<string>,
  isDisabled?: MaybeRef<boolean>,
  isInvalid?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  label?: MaybeRef<string | undefined>,
  maxLength?: MaybeRef<number | undefined>,
  minLength?: MaybeRef<number | undefined>,
  name?: MaybeRef<string | undefined>,
  onInputChange?: (value: string) => void,
  onKeyDown?: (event: KeyboardEvent) => void,
  pattern?: MaybeRef<string | undefined>,
  placeholder?: MaybeRef<string | undefined>,
  spellCheck?: MaybeRef<boolean | undefined>,
  type?: MaybeRef<string | undefined>,
  validationBehavior?: MaybeRef<ValidationBehavior | undefined>,
  validationErrors?: MaybeRef<Iterable<string> | undefined>
}

export interface TextFieldAria {
  descriptionProps: ComputedRef<{
    id: string
  }>,
  errorMessageProps: ComputedRef<{
    id: string
  }>,
  inputProps: ComputedRef<{
    'aria-activedescendant'?: string,
    'aria-autocomplete'?: 'both' | 'inline' | 'list' | 'none',
    'aria-controls'?: string,
    'aria-describedby'?: string,
    'aria-errormessage'?: string,
    'aria-haspopup'?: boolean | 'dialog' | 'grid' | 'listbox' | 'menu' | 'tree',
    'aria-invalid'?: true,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-required'?: true,
    autoCapitalize?: 'characters' | 'none' | 'off' | 'on' | 'sentences' | 'words',
    autoComplete?: string,
    autocorrect?: string,
    disabled: boolean,
    enterKeyHint?: 'done' | 'enter' | 'go' | 'next' | 'previous' | 'search' | 'send',
    form?: string,
    id: string,
    inputMode?: string,
    maxLength?: number,
    minLength?: number,
    name?: string,
    onChange: () => void,
    onInput: (valueOrEvent: Event | string) => void,
    onKeyDown?: (event: KeyboardEvent) => void,
    pattern?: string,
    placeholder?: string,
    readonly: boolean,
    required: boolean,
    spellcheck?: boolean,
    type?: string,
    value: string
  }>,
  inputRef: Ref<HTMLInputElement | HTMLTextAreaElement | null>,
  inputValue: Ref<string>,
  isInvalid: ComputedRef<boolean>,
  labelProps: ComputedRef<{
    htmlFor?: string,
    id?: string
  }>,
  validationDetails: ComputedRef<{
    validationBehavior: ValidationBehavior
  }>,
  validationErrors: ComputedRef<string[]>
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

function toErrorArray(value: MaybeRef<Iterable<string> | undefined> | undefined): string[] {
  if (!value) {
    return [];
  }

  let resolved = unref(value);
  if (!resolved) {
    return [];
  }

  return Array.from(resolved, (entry) => String(entry));
}

export function useTextField(options: AriaTextFieldOptions = {}): TextFieldAria {
  let inputValue = options.inputValue ?? ref(unref(options.defaultValue) ?? '');
  let inputRef = options.inputRef ?? ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
  let inputElementType = computed(() => unref(options.inputElementType) ?? 'input');
  let validationBehavior = computed(() => unref(options.validationBehavior) ?? 'aria');
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let isRequired = computed(() => Boolean(unref(options.isRequired)));
  let externalValidationErrors = computed(() => toErrorArray(options.validationErrors));
  let requiredErrors = computed(() => (isRequired.value && inputValue.value.trim().length === 0 ? ['Value is required.'] : []));
  let validationErrors = computed(() => {
    return externalValidationErrors.value.length > 0 ? externalValidationErrors.value : requiredErrors.value;
  });

  let isInvalid = computed(() => {
    return Boolean(unref(options.isInvalid)) || validationErrors.value.length > 0;
  });

  let field = useField({
    'aria-label': options['aria-label'],
    'aria-labelledby': options['aria-labelledby'],
    ariaLabel: options.ariaLabel,
    ariaLabelledby: options.ariaLabelledby,
    description: options.description,
    errorMessage: computed(() => resolveOptionalString(options.errorMessage) ?? (validationErrors.value.join(' ') || undefined)),
    id: options.id,
    isInvalid,
    label: options.label,
    validationState: computed(() => (isInvalid.value ? 'invalid' : 'valid'))
  });

  let formValidation = useFormValidation({
    focus: () => {
      inputRef.value?.focus();
    },
    isInvalid,
    validationBehavior,
    validationErrors
  });

  watch(
    inputRef,
    (element, _, onCleanup) => {
      if (!(element instanceof HTMLInputElement) && !(element instanceof HTMLTextAreaElement)) {
        return;
      }

      let detach = formValidation.attach(element);
      onCleanup(detach);
    },
    {immediate: true}
  );

  let onInput = (valueOrEvent: Event | string) => {
    let nextValue: string | null = null;
    if (typeof valueOrEvent === 'string') {
      nextValue = valueOrEvent;
    } else if (valueOrEvent.target instanceof HTMLInputElement || valueOrEvent.target instanceof HTMLTextAreaElement) {
      nextValue = valueOrEvent.target.value;
    }

    if (nextValue == null) {
      return;
    }

    inputValue.value = nextValue;
    options.onInputChange?.(nextValue);
  };

  let onChange = () => {
    formValidation.commitValidation();
  };

  return {
    descriptionProps: field.descriptionProps,
    errorMessageProps: field.errorMessageProps,
    inputProps: computed(() => ({
      id: field.fieldProps.value.id,
      type: inputElementType.value === 'input' ? unref(options.type) ?? 'text' : undefined,
      pattern: inputElementType.value === 'input' ? resolveOptionalString(options.pattern) : undefined,
      value: inputValue.value,
      disabled: isDisabled.value,
      readonly: isReadOnly.value,
      required: isRequired.value && validationBehavior.value === 'native',
      'aria-required': isRequired.value && validationBehavior.value === 'aria' ? true : undefined,
      'aria-label': field.fieldProps.value['aria-label'],
      'aria-labelledby': field.fieldProps.value['aria-labelledby'],
      'aria-describedby': field.fieldProps.value['aria-describedby'],
      'aria-invalid': isInvalid.value ? true : undefined,
      'aria-errormessage': resolveOptionalString(options['aria-errormessage']),
      'aria-activedescendant': resolveOptionalString(options['aria-activedescendant']),
      'aria-autocomplete': unref(options['aria-autocomplete']),
      'aria-haspopup': unref(options['aria-haspopup']),
      'aria-controls': resolveOptionalString(options['aria-controls']),
      onInput,
      onChange,
      onKeyDown: options.onKeyDown,
      autoComplete: resolveOptionalString(options.autoComplete),
      autoCapitalize: unref(options.autoCapitalize),
      maxLength: unref(options.maxLength),
      minLength: unref(options.minLength),
      name: resolveOptionalString(options.name),
      form: resolveOptionalString(options.form),
      placeholder: resolveOptionalString(options.placeholder),
      inputMode: resolveOptionalString(options.inputMode),
      autocorrect: resolveOptionalString(options.autoCorrect),
      spellcheck: unref(options.spellCheck),
      enterKeyHint: unref(options.enterKeyHint)
    })),
    inputRef,
    inputValue,
    isInvalid,
    labelProps: field.labelProps,
    validationDetails: computed(() => ({
      validationBehavior: validationBehavior.value
    })),
    validationErrors
  };
}
