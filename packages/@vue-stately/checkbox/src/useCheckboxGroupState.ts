import {computed, type ComputedRef, ref, type Ref, unref, watch} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface ValidationResult {
  isInvalid: boolean
}

export interface CheckboxGroupState {
  defaultValue: readonly string[],
  isDisabled: ComputedRef<boolean>,
  isInvalid: ComputedRef<boolean>,
  isReadOnly: ComputedRef<boolean>,
  isRequired: ComputedRef<boolean>,
  validationState: ComputedRef<'invalid' | null>,
  value: Ref<string[]>,
  addValue: (value: string) => void,
  isSelected: (value: string) => boolean,
  removeValue: (value: string) => void,
  setInvalid: (value: string, validation: ValidationResult) => void,
  setValue: (value: string[]) => void,
  toggleValue: (value: string) => void
}

export interface CheckboxGroupStateOptions {
  defaultValue?: MaybeRef<readonly string[] | undefined>,
  isDisabled?: MaybeRef<boolean>,
  isInvalid?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  onChange?: (value: string[]) => void,
  validationState?: MaybeRef<'invalid' | null | 'valid' | undefined>,
  value?: Ref<string[] | undefined>
}

export function useCheckboxGroupState(options: CheckboxGroupStateOptions = {}): CheckboxGroupState {
  let initialDefaultValue = [...(unref(options.defaultValue) ?? [])];
  let internalValue = ref(initialDefaultValue);
  let isControlled = computed(() => options.value !== undefined && options.value.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let value = computed<string[]>({
    get: () => {
      if (isControlled.value && options.value) {
        return options.value.value;
      }

      return internalValue.value;
    },
    set: (nextValue) => {
      if (isControlled.value && options.value) {
        options.value.value = nextValue;
      } else {
        internalValue.value = nextValue;
      }
    }
  }) as Ref<string[]>;

  let initialValue = [...value.value];
  let invalidValues = ref(new Map<string, ValidationResult>());

  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let isInvalid = computed(() => {
    if (unref(options.isInvalid)) {
      return true;
    }

    if (unref(options.validationState) === 'invalid') {
      return true;
    }

    return Array.from(invalidValues.value.values()).some((result) => result.isInvalid);
  });
  let validationState = computed(() => isInvalid.value ? 'invalid' as const : null);
  let isRequired = computed(() => Boolean(unref(options.isRequired)) && value.value.length === 0);

  let setValue = (nextValue: string[]): void => {
    if (isDisabled.value || isReadOnly.value) {
      return;
    }

    if (Object.is(nextValue, value.value)) {
      return;
    }

    value.value = nextValue;
    options.onChange?.(nextValue);
  };

  let isSelected = (nextValue: string): boolean => {
    return value.value.includes(nextValue);
  };

  let addValue = (nextValue: string): void => {
    if (isSelected(nextValue)) {
      return;
    }

    setValue(value.value.concat(nextValue));
  };

  let removeValue = (nextValue: string): void => {
    if (!isSelected(nextValue)) {
      return;
    }

    setValue(value.value.filter((existingValue) => existingValue !== nextValue));
  };

  let toggleValue = (nextValue: string): void => {
    if (isSelected(nextValue)) {
      removeValue(nextValue);
      return;
    }

    addValue(nextValue);
  };

  let setInvalid = (nextValue: string, validation: ValidationResult): void => {
    let nextMap = new Map(invalidValues.value);
    if (validation.isInvalid) {
      nextMap.set(nextValue, validation);
    } else {
      nextMap.delete(nextValue);
    }

    invalidValues.value = nextMap;
  };

  return {
    value,
    defaultValue: unref(options.defaultValue) ?? initialValue,
    setValue,
    isSelected,
    addValue,
    removeValue,
    toggleValue,
    setInvalid,
    isDisabled,
    isReadOnly,
    isInvalid,
    validationState,
    isRequired
  };
}
