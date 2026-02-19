import {computed, type ComputedRef, isReadonly, isRef, type Ref, ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type ToggleValidationState = 'invalid' | 'valid';

export interface AriaToggleOptions {
  'aria-controls'?: MaybeRef<string | undefined>,
  'aria-errormessage'?: MaybeRef<string | undefined>,
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  form?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  isInvalid?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isSelected?: MaybeRef<boolean>,
  label?: MaybeRef<string | undefined>,
  name?: MaybeRef<string | undefined>,
  onChange?: (isSelected: boolean) => void,
  onPress?: () => void,
  onPressChange?: (isPressed: boolean) => void,
  setSelected?: (isSelected: boolean) => void,
  validationState?: MaybeRef<ToggleValidationState | undefined>,
  value?: MaybeRef<string | undefined>
}

export interface ToggleAria {
  inputProps: ComputedRef<{
    'aria-controls'?: string,
    'aria-errormessage'?: string,
    'aria-invalid'?: true,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-readonly'?: true,
    checked: boolean,
    disabled: boolean,
    form?: string,
    name?: string,
    onChange: (valueOrEvent: boolean | Event) => void,
    onKeyDown: (event: KeyboardEvent) => void,
    onMouseDown: () => void,
    onMouseUp: () => void,
    type: 'checkbox',
    value?: string
  }>,
  isDisabled: ComputedRef<boolean>,
  isInvalid: ComputedRef<boolean>,
  isPressed: Ref<boolean>,
  isReadOnly: ComputedRef<boolean>,
  isSelected: ComputedRef<boolean>,
  labelProps: ComputedRef<{
    onClick: (event: MouseEvent) => void
  }>,
  press: () => void,
  pressEnd: () => void,
  pressStart: () => void,
  toggle: () => void
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

function updateSelectedValue(value: MaybeRef<boolean> | undefined, isSelected: boolean): void {
  if (!isRef(value) || isReadonly(value)) {
    return;
  }

  (value as Ref<boolean>).value = isSelected;
}

export function useToggle(options: AriaToggleOptions = {}): ToggleAria {
  let isSelected = computed(() => Boolean(unref(options.isSelected)));
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let isInvalid = computed(() => Boolean(unref(options.isInvalid)) || unref(options.validationState) === 'invalid');
  let isPressed = ref(false);

  let hasVisibleLabel = computed(() => Boolean(resolveOptionalString(options.label)));
  let hasAriaLabel = computed(() => Boolean(resolveOptionalString(options['aria-label']) || resolveOptionalString(options['aria-labelledby'])));
  if (!hasVisibleLabel.value && !hasAriaLabel.value && process.env.NODE_ENV !== 'production') {
    console.warn('If you do not provide a visible label, you must specify an aria-label or aria-labelledby attribute for accessibility');
  }

  let setSelected = (nextSelected: boolean) => {
    if (isDisabled.value || isReadOnly.value) {
      return;
    }

    if (options.setSelected) {
      options.setSelected(nextSelected);
    } else {
      updateSelectedValue(options.isSelected, nextSelected);
    }

    options.onChange?.(nextSelected);
  };

  let toggle = () => {
    setSelected(!isSelected.value);
  };

  let pressStart = () => {
    if (isDisabled.value || isReadOnly.value || isPressed.value) {
      return;
    }

    isPressed.value = true;
    options.onPressChange?.(true);
  };

  let pressEnd = () => {
    if (!isPressed.value) {
      return;
    }

    isPressed.value = false;
    options.onPressChange?.(false);
  };

  let press = () => {
    if (isDisabled.value || isReadOnly.value) {
      return;
    }

    pressStart();
    toggle();
    options.onPress?.();
    pressEnd();
  };

  let onChange = (valueOrEvent: boolean | Event) => {
    let nextSelected: boolean | null = null;

    if (typeof valueOrEvent === 'boolean') {
      nextSelected = valueOrEvent;
    } else if (valueOrEvent.target instanceof HTMLInputElement) {
      nextSelected = valueOrEvent.target.checked;
      valueOrEvent.stopPropagation();
    }

    if (nextSelected == null) {
      return;
    }

    setSelected(nextSelected);
  };

  return {
    inputProps: computed(() => ({
      type: 'checkbox' as const,
      checked: isSelected.value,
      disabled: isDisabled.value,
      name: resolveOptionalString(options.name),
      value: resolveOptionalString(options.value),
      form: resolveOptionalString(options.form),
      'aria-label': resolveOptionalString(options['aria-label']),
      'aria-labelledby': resolveOptionalString(options['aria-labelledby']),
      'aria-invalid': isInvalid.value ? true : undefined,
      'aria-readonly': isReadOnly.value ? true : undefined,
      'aria-errormessage': resolveOptionalString(options['aria-errormessage']),
      'aria-controls': resolveOptionalString(options['aria-controls']),
      onChange,
      onMouseDown: pressStart,
      onMouseUp: pressEnd,
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          press();
        }
      }
    })),
    isDisabled,
    isInvalid,
    isPressed,
    isReadOnly,
    isSelected,
    labelProps: computed(() => ({
      onClick: (event: MouseEvent) => {
        event.preventDefault();
        press();
      }
    })),
    press,
    pressEnd,
    pressStart,
    toggle
  };
}
