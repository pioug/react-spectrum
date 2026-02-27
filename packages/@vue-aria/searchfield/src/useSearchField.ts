import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import type {MaybeRef} from './types';

export interface AriaSearchFieldOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  description?: MaybeRef<string | undefined>,
  errorMessage?: MaybeRef<string | undefined>,
  id?: MaybeRef<string | undefined>,
  inputRef?: Ref<HTMLInputElement | null>,
  inputValue?: Ref<string>,
  isDisabled?: MaybeRef<boolean>,
  isInvalid?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  label?: MaybeRef<string | undefined>,
  onClear?: () => void,
  onInputChange?: (value: string) => void,
  onSubmit?: (value: string) => void,
  placeholder?: MaybeRef<string | undefined>,
  type?: MaybeRef<'search' | 'text'>
}

export interface SearchFieldAria {
  clear: () => void,
  clearButtonProps: ComputedRef<{
    'aria-label': string,
    disabled: boolean,
    onClick: () => void,
    onMouseDown: (event: MouseEvent) => void,
    type: 'button'
  }>,
  descriptionProps: ComputedRef<{
    id?: string
  }>,
  errorMessageProps: ComputedRef<{
    id?: string
  }>,
  inputProps: ComputedRef<{
    'aria-describedby'?: string,
    'aria-invalid'?: true,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    disabled: boolean,
    id: string,
    onInput: (valueOrEvent: Event | string) => void,
    onKeyDown: (event: KeyboardEvent) => void,
    placeholder?: string,
    readonly: boolean,
    required: boolean,
    type: 'search' | 'text',
    value: string
  }>,
  inputRef: Ref<HTMLInputElement | null>,
  inputValue: Ref<string>,
  isInvalid: ComputedRef<boolean>,
  labelProps: ComputedRef<{
    id?: string
  }>,
  submit: () => void
}

let searchFieldCounter = 0;

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useSearchField(options: AriaSearchFieldOptions = {}): SearchFieldAria {
  searchFieldCounter += 1;

  let inputValue = options.inputValue ?? ref('');
  let inputRef = options.inputRef ?? ref<HTMLInputElement | null>(null);

  let inputId = computed(() => resolveOptionalString(options.id) ?? `vue-search-field-${searchFieldCounter}`);
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let isRequired = computed(() => Boolean(unref(options.isRequired)));

  let explicitInvalid = computed(() => Boolean(unref(options.isInvalid)));
  let isInvalid = computed(() => explicitInvalid.value || (isRequired.value && inputValue.value.trim().length === 0));

  let clear = () => {
    if (isDisabled.value || isReadOnly.value) {
      return;
    }

    if (inputValue.value.length === 0) {
      return;
    }

    inputValue.value = '';
    options.onInputChange?.('');
    options.onClear?.();
  };

  let submit = () => {
    if (isDisabled.value || isReadOnly.value) {
      return;
    }

    options.onSubmit?.(inputValue.value);
  };

  let label = computed(() => resolveOptionalString(options.label));
  let labelId = computed(() => label.value ? `${inputId.value}-label` : undefined);
  let description = computed(() => resolveOptionalString(options.description));
  let descriptionId = computed(() => description.value ? `${inputId.value}-description` : undefined);
  let errorMessage = computed(() => resolveOptionalString(options.errorMessage));
  let errorMessageId = computed(() => errorMessage.value ? `${inputId.value}-error` : undefined);

  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));
  let combinedAriaLabelledBy = computed(() => {
    let ids = new Set<string>();
    if (labelId.value) {
      ids.add(labelId.value);
    }

    if (ariaLabelledby.value) {
      for (let id of ariaLabelledby.value.trim().split(/\s+/)) {
        if (id) {
          ids.add(id);
        }
      }
    }

    if (ariaLabel.value && ids.size > 0) {
      ids.add(inputId.value);
    }

    return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
  });
  let ariaDescribedby = computed(() => {
    let ids: string[] = [];
    if (descriptionId.value) {
      ids.push(descriptionId.value);
    }
    if (isInvalid.value && errorMessageId.value) {
      ids.push(errorMessageId.value);
    }

    return ids.length === 0 ? undefined : ids.join(' ');
  });

  let onInput = (valueOrEvent: Event | string) => {
    if (typeof valueOrEvent === 'string') {
      inputValue.value = valueOrEvent;
      options.onInputChange?.(valueOrEvent);
      return;
    }

    let eventTarget = valueOrEvent.target;
    if (!(eventTarget instanceof HTMLInputElement)) {
      return;
    }

    inputValue.value = eventTarget.value;
    options.onInputChange?.(eventTarget.value);
  };

  let onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (isDisabled.value || isReadOnly.value) {
        event.preventDefault();
        return;
      }

      submit();
      return;
    }

    if (event.key === 'Escape') {
      if (inputValue.value.length === 0) {
        return;
      }

      event.preventDefault();
      clear();
    }
  };

  return {
    clear,
    clearButtonProps: computed(() => ({
      type: 'button' as const,
      'aria-label': 'Clear search',
      disabled: isDisabled.value || isReadOnly.value || inputValue.value.length === 0,
      onClick: clear,
      onMouseDown: (event: MouseEvent) => {
        event.preventDefault();
        inputRef.value?.focus();
      }
    })),
    descriptionProps: computed(() => ({
      id: descriptionId.value
    })),
    errorMessageProps: computed(() => ({
      id: errorMessageId.value
    })),
    inputProps: computed(() => ({
      id: inputId.value,
      type: unref(options.type) ?? 'search',
      value: inputValue.value,
      disabled: isDisabled.value,
      readonly: isReadOnly.value,
      required: isRequired.value,
      placeholder: resolveOptionalString(options.placeholder),
      'aria-label': ariaLabel.value,
      'aria-labelledby': combinedAriaLabelledBy.value,
      'aria-describedby': ariaDescribedby.value,
      'aria-invalid': isInvalid.value ? true : undefined,
      onInput,
      onKeyDown
    })),
    inputRef,
    inputValue,
    isInvalid,
    labelProps: computed(() => ({
      id: labelId.value
    })),
    submit
  };
}
