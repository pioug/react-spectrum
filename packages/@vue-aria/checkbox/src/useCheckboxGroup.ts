import {computed, type ComputedRef, isRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaCheckboxGroupOptions {
  isDisabled?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  name?: MaybeRef<string | undefined>,
  onChange?: (selectedValues: Set<string>) => void,
  selectedValues?: Iterable<string> | Ref<Iterable<string>>
}

export interface CheckboxGroupAria {
  groupProps: ComputedRef<{
    'aria-disabled'?: boolean,
    'aria-required'?: boolean,
    role: 'group'
  }>,
  isDisabled: ComputedRef<boolean>,
  isReadOnly: ComputedRef<boolean>,
  isRequired: ComputedRef<boolean>,
  isSelected: (value: string) => boolean,
  name: ComputedRef<string | undefined>,
  selectedValues: ComputedRef<Set<string>>,
  setSelected: (value: string, isSelected: boolean) => Set<string>,
  toggleValue: (value: string) => Set<string>
}

function toValueSet(values: Iterable<string> | undefined): Set<string> {
  if (!values) {
    return new Set();
  }

  return new Set(Array.from(values, (value) => String(value)));
}

function resolveValues(values: Iterable<string> | Ref<Iterable<string>> | undefined): Iterable<string> | undefined {
  if (!values) {
    return undefined;
  }

  if (isRef(values)) {
    return values.value;
  }

  return values;
}

function setValues(target: Iterable<string> | Ref<Iterable<string>> | undefined, values: Set<string>): void {
  if (!target || !isRef(target)) {
    return;
  }

  target.value = Array.from(values);
}

export function useCheckboxGroup(options: AriaCheckboxGroupOptions = {}): CheckboxGroupAria {
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let isRequired = computed(() => Boolean(unref(options.isRequired)));
  let name = computed(() => unref(options.name));
  let selectedValues = computed(() => toValueSet(resolveValues(options.selectedValues)));

  let setSelected = (value: string, isSelectedValue: boolean): Set<string> => {
    let nextValues = new Set(selectedValues.value);
    if (isDisabled.value || isReadOnly.value) {
      return nextValues;
    }

    if (isSelectedValue) {
      nextValues.add(value);
    } else {
      nextValues.delete(value);
    }

    setValues(options.selectedValues, nextValues);
    options.onChange?.(nextValues);
    return nextValues;
  };

  let toggleValue = (value: string): Set<string> => {
    let nextSelected = !selectedValues.value.has(value);
    return setSelected(value, nextSelected);
  };

  let isSelected = (value: string): boolean => selectedValues.value.has(value);

  let groupProps = computed(() => ({
    role: 'group' as const,
    'aria-disabled': isDisabled.value || undefined,
    'aria-required': isRequired.value || undefined
  }));

  return {
    groupProps,
    isDisabled,
    isReadOnly,
    isRequired,
    isSelected,
    name,
    selectedValues,
    setSelected,
    toggleValue
  };
}
