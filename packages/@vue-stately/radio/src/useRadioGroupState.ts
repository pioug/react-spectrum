import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';
import {type FormValidationState, useFormValidationState, type ValidationErrors} from '@vue-stately/form';
import {useControlledState} from '@vue-stately/utils';
import {useId} from '@vue-aria/utils';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export type ValidationState = 'invalid' | null;

export interface RadioGroupStateOptions {
  defaultValue?: string | null,
  isDisabled?: MaybeRef<boolean>,
  isInvalid?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  name?: MaybeRef<string | undefined>,
  onChange?: (value: string | null) => void,
  validate?: (value: string | null) => boolean | null | string | string[] | undefined,
  validationBehavior?: MaybeRef<'aria' | 'native'>,
  validationErrors?: MaybeRef<ValidationErrors>,
  validationState?: MaybeRef<'invalid' | 'valid' | null | undefined>,
  value?: Ref<string | null | undefined>
}

export interface RadioGroupState extends FormValidationState {
  defaultSelectedValue: string | null,
  isDisabled: ComputedRef<boolean>,
  isInvalid: ComputedRef<boolean>,
  isReadOnly: ComputedRef<boolean>,
  isRequired: ComputedRef<boolean>,
  lastFocusedValue: Ref<string | null>,
  name: ComputedRef<string>,
  selectedValue: Ref<string | null>,
  validationState: ComputedRef<ValidationState>,
  setLastFocusedValue: (value: string | null) => void,
  setSelectedValue: (value: string | null) => void
}

/**
 * Provides state management for radio groups.
 */
export function useRadioGroupState(options: RadioGroupStateOptions = {}): RadioGroupState {
  let generatedName = useId();
  let name = computed(() => unref(options.name) ?? generatedName);
  let [selectedValue, setSelected] = useControlledState<string | null>(
    options.value,
    options.defaultValue ?? null,
    options.onChange
  );

  let initialSelectedValue = selectedValue.value;
  let lastFocusedValue = ref<string | null>(null);

  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let isRequired = computed(() => Boolean(unref(options.isRequired)));

  let validation = useFormValidationState<string | null>({
    isInvalid: options.isInvalid,
    name: (() => {
      let nextName = unref(options.name);
      return nextName == null ? undefined : nextName;
    })(),
    validate: (value) => {
      let validationResult = options.validate?.(value);
      if (validationResult !== undefined) {
        return validationResult;
      }

      if (isRequired.value && (value == null || value.length === 0)) {
        return 'A selection is required';
      }

      return undefined;
    },
    validationBehavior: options.validationBehavior,
    validationErrors: options.validationErrors,
    value: selectedValue
  });

  let isInvalid = computed(() => {
    if (unref(options.validationState) === 'invalid') {
      return true;
    }

    if (isRequired.value && (selectedValue.value == null || selectedValue.value.length === 0)) {
      return true;
    }

    return validation.displayValidation.value.isInvalid;
  });

  let validationState = computed(() => isInvalid.value ? 'invalid' as const : null);

  let setSelectedValue = (value: string | null): void => {
    if (isDisabled.value || isReadOnly.value) {
      return;
    }

    setSelected(value);
    validation.commitValidation();
  };

  let setLastFocusedValue = (value: string | null): void => {
    lastFocusedValue.value = value;
  };

  return {
    ...validation,
    name,
    selectedValue,
    defaultSelectedValue: options.value?.value !== undefined ? initialSelectedValue : options.defaultValue ?? null,
    setSelectedValue,
    lastFocusedValue,
    setLastFocusedValue,
    isDisabled,
    isReadOnly,
    isRequired,
    validationState,
    isInvalid
  };
}
