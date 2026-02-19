import {type AriaCheckboxOptions, useCheckbox} from '@vue-aria/checkbox';
import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface AriaSwitchOptions extends AriaCheckboxOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>
}

export interface SwitchAria {
  inputProps: ComputedRef<{
    'aria-checked': 'mixed' | boolean,
    'aria-invalid'?: boolean,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-required'?: boolean,
    checked: boolean,
    disabled: boolean,
    indeterminate: boolean,
    name?: string,
    required: boolean,
    role: 'switch',
    value?: string
  }>,
  isDisabled: ComputedRef<boolean>,
  isPressed: ComputedRef<boolean>,
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

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useSwitch(options: AriaSwitchOptions = {}): SwitchAria {
  let checkbox = useCheckbox(options);
  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));

  return {
    inputProps: computed(() => ({
      ...checkbox.inputProps.value,
      role: 'switch' as const,
      checked: checkbox.isSelected.value,
      'aria-label': ariaLabel.value,
      'aria-labelledby': ariaLabelledby.value
    })),
    isDisabled: checkbox.isDisabled,
    isPressed: computed(() => checkbox.isPressed.value),
    isReadOnly: checkbox.isReadOnly,
    isSelected: checkbox.isSelected,
    labelProps: checkbox.labelProps,
    press: checkbox.press,
    pressEnd: checkbox.pressEnd,
    pressStart: checkbox.pressStart,
    toggle: checkbox.toggle
  };
}
