import {type AriaCheckboxOptions, type CheckboxAria, useCheckbox} from './useCheckbox';
import type {CheckboxGroupAria} from './useCheckboxGroup';
import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaCheckboxGroupItemOptions extends Omit<AriaCheckboxOptions, 'isSelected' | 'name' | 'setSelected' | 'value'> {
  group: CheckboxGroupAria,
  value: MaybeRef<string>
}

export function useCheckboxGroupItem(options: AriaCheckboxGroupItemOptions): CheckboxAria {
  let value = computed(() => String(unref(options.value)));

  return useCheckbox({
    isDisabled: computed(() => Boolean(unref(options.isDisabled)) || options.group.isDisabled.value),
    isIndeterminate: options.isIndeterminate,
    isInvalid: options.isInvalid,
    isReadOnly: computed(() => Boolean(unref(options.isReadOnly)) || options.group.isReadOnly.value),
    isRequired: computed(() => Boolean(unref(options.isRequired)) || options.group.isRequired.value),
    isSelected: computed(() => options.group.isSelected(value.value)),
    name: options.group.name,
    onChange: options.onChange,
    setSelected: (isSelected) => {
      options.group.setSelected(value.value, isSelected);
    },
    value
  });
}
