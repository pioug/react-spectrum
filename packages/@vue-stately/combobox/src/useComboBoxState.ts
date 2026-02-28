import {type AriaComboBoxOptions, type ComboBoxAria, type ComboBoxItem, useComboBox as useAriaComboBox} from '@vue-aria/combobox';
import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';
import {useControlledState} from '@vue-stately/utils';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;
type ComboBoxMenuTriggerAction = 'focus' | 'input' | 'manual';

export interface ComboBoxState {
  defaultInputValue: string,
  defaultSelectedKey: string | null,
  filteredCollection: ComputedRef<ComboBoxItem[]>,
  inputValue: Ref<string>,
  isFocused: Ref<boolean>,
  selectedItem: ComputedRef<ComboBoxItem | null>,
  selectedItems: ComputedRef<ComboBoxItem[]>,
  selectedKey: ComputedRef<string | null>,
  setFocused: (value: boolean) => void,
  setInputValue: (value: string) => void,
  setSelectedKey: (key: string | null) => void,
  setValue: (value: string | readonly string[] | null) => void,
  value: ComputedRef<string | null>
}

export interface ComboBoxStateOptions {
  allowsCustomValue?: MaybeRef<boolean>,
  defaultInputValue?: string,
  defaultSelectedKey?: string | null,
  inputValue?: Ref<string | undefined>,
  items: MaybeRef<Array<string | {id: string, textValue: string}>>,
  onInputChange?: (value: string) => void,
  onOpenChange?: (isOpen: boolean, trigger?: ComboBoxMenuTriggerAction) => void,
  onSelectionChange?: (key: string | null) => void,
  selectedKey?: Ref<string | null | undefined>
}

export type StatelyComboBoxState = ComboBoxState & ComboBoxAria;

export function useComboBoxState(options: ComboBoxStateOptions): StatelyComboBoxState {
  let [inputValueState, setInputValueInternal] = useControlledState(
    options.inputValue,
    options.defaultInputValue ?? '',
    options.onInputChange
  );
  let [selectedKeyState, setSelectedKeyInternal] = useControlledState(
    options.selectedKey,
    options.defaultSelectedKey ?? null,
    options.onSelectionChange
  );
  let inputValue = computed<string>({
    get: () => inputValueState.value,
    set: (nextValue) => {
      setInputValueInternal(nextValue);
    }
  }) as Ref<string>;
  let selectedKeyRef = computed<string | null>({
    get: () => selectedKeyState.value,
    set: (nextKey) => {
      setSelectedKeyInternal(nextKey);
    }
  }) as Ref<string | null>;
  let initialInputValue = inputValue.value;
  let initialSelectedKey = selectedKeyRef.value;
  let isFocused = ref(false);

  let comboBox = useAriaComboBox({
    allowsCustomValue: options.allowsCustomValue,
    inputValue,
    items: options.items,
    onOpenChange: options.onOpenChange,
    onSelectionChange: (key) => {
      setSelectedKeyInternal(key);
    },
    selectedKey: selectedKeyRef
  } satisfies AriaComboBoxOptions);

  let normalizedItems = computed(() => unref(options.items).map((item) => {
    if (typeof item === 'string') {
      return {
        id: item,
        textValue: item
      };
    }

    return {
      id: item.id,
      textValue: item.textValue
    };
  }));

  let selectedItem = computed(() => {
    if (comboBox.selectedKey.value == null) {
      return null;
    }

    return normalizedItems.value.find((item) => item.id === comboBox.selectedKey.value) ?? null;
  });

  let selectedItems = computed(() => (selectedItem.value ? [selectedItem.value] : []));

  let setInputValue = (nextValue: string): void => {
    setInputValueInternal(nextValue);
  };

  let setSelectedKey = (nextKey: string | null): void => {
    if (comboBox.selectedKey.value === nextKey) {
      return;
    }

    comboBox.selectKey(nextKey);
  };

  let setValue = (nextValue: string | readonly string[] | null): void => {
    if (Array.isArray(nextValue)) {
      setSelectedKey(nextValue[0] ?? null);
      return;
    }

    setSelectedKey(nextValue as string | null);
  };

  return {
    ...comboBox,
    inputValue,
    defaultInputValue: options.defaultInputValue ?? initialInputValue,
    selectedKey: comboBox.selectedKey,
    defaultSelectedKey: options.defaultSelectedKey ?? initialSelectedKey,
    value: computed(() => comboBox.selectedKey.value),
    setValue,
    selectedItem,
    selectedItems,
    filteredCollection: comboBox.filteredItems,
    setSelectedKey,
    setInputValue,
    isFocused,
    setFocused: (nextFocused: boolean) => {
      isFocused.value = nextFocused;
    }
  };
}
