import {computed, type ComputedRef, isReadonly, isRef, type Ref, ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaCheckboxOptions {
  isDisabled?: MaybeRef<boolean>,
  isIndeterminate?: MaybeRef<boolean>,
  isInvalid?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  isSelected?: MaybeRef<boolean>,
  name?: MaybeRef<string | undefined>,
  onChange?: (isSelected: boolean) => void,
  setSelected?: (isSelected: boolean) => void,
  value?: MaybeRef<string | undefined>
}

export interface CheckboxAria {
  inputProps: ComputedRef<{
    'aria-checked': 'mixed' | boolean,
    'aria-invalid'?: boolean,
    'aria-required'?: boolean,
    checked: boolean,
    disabled: boolean,
    indeterminate: boolean,
    name?: string,
    required: boolean,
    value?: string
  }>,
  isDisabled: ComputedRef<boolean>,
  isPressed: Ref<boolean>,
  isReadOnly: ComputedRef<boolean>,
  isSelected: ComputedRef<boolean>,
  labelProps: ComputedRef<{
    'aria-disabled'?: boolean
  }>,
  press: () => void,
  pressEnd: () => void,
  pressStart: () => void,
  toggle: () => void
}

function updateSelectedValue(value: MaybeRef<boolean> | undefined, isSelected: boolean): void {
  if (!isRef(value) || isReadonly(value)) {
    return;
  }

  (value as Ref<boolean>).value = isSelected;
}

export function useCheckbox(options: AriaCheckboxOptions = {}): CheckboxAria {
  let isSelected = computed(() => Boolean(unref(options.isSelected)));
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let isIndeterminate = computed(() => Boolean(unref(options.isIndeterminate)));
  let isRequired = computed(() => Boolean(unref(options.isRequired)));
  let isInvalid = computed(() => Boolean(unref(options.isInvalid)));
  let isPressed = ref(false);

  let toggle = () => {
    if (isDisabled.value || isReadOnly.value) {
      return;
    }

    let nextSelected = !isSelected.value;
    if (options.setSelected) {
      options.setSelected(nextSelected);
    } else {
      updateSelectedValue(options.isSelected, nextSelected);
    }

    options.onChange?.(nextSelected);
  };

  let pressStart = () => {
    if (isDisabled.value || isReadOnly.value || isPressed.value) {
      return;
    }

    isPressed.value = true;
  };

  let pressEnd = () => {
    if (!isPressed.value) {
      return;
    }

    isPressed.value = false;
  };

  let press = () => {
    if (isDisabled.value || isReadOnly.value) {
      return;
    }

    pressStart();
    toggle();
    pressEnd();
  };

  let inputProps = computed(() => ({
    checked: isSelected.value,
    disabled: isDisabled.value,
    indeterminate: isIndeterminate.value,
    name: unref(options.name),
    required: isRequired.value,
    value: unref(options.value),
    'aria-invalid': isInvalid.value || undefined,
    'aria-required': isRequired.value || undefined,
    'aria-checked': isIndeterminate.value ? 'mixed' as const : isSelected.value
  }));

  let labelProps = computed(() => ({
    'aria-disabled': isDisabled.value || undefined
  }));

  return {
    inputProps,
    isDisabled,
    isPressed,
    isReadOnly,
    isSelected,
    labelProps,
    press,
    pressEnd,
    pressStart,
    toggle
  };
}
