import {type AriaComboBoxOptions, type ComboBoxAria, type ComboBoxItem, useComboBox as useAriaComboBox} from '@vue-aria/combobox';
import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

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
  onOpenChange?: (isOpen: boolean) => void,
  onSelectionChange?: (key: string | null) => void,
  selectedKey?: Ref<string | null | undefined>
}

export type StatelyComboBoxState = ComboBoxState & ComboBoxAria;

export function useComboBoxState(options: ComboBoxStateOptions): StatelyComboBoxState {
  let uncontrolledInputValue = ref(options.defaultInputValue ?? '');
  let uncontrolledSelectedKey = ref<string | null>(options.defaultSelectedKey ?? null);
  let isInputValueControlled = computed(() => options.inputValue !== undefined && options.inputValue.value !== undefined);
  let wasInputValueControlled = ref(isInputValueControlled.value);
  let isSelectedKeyControlled = computed(() => options.selectedKey !== undefined && options.selectedKey.value !== undefined);
  let wasSelectedKeyControlled = ref(isSelectedKeyControlled.value);

  watch(isInputValueControlled, (nextIsControlled) => {
    if (wasInputValueControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasInputValueControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasInputValueControlled.value = nextIsControlled;
  });

  watch(isSelectedKeyControlled, (nextIsControlled) => {
    if (wasSelectedKeyControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasSelectedKeyControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasSelectedKeyControlled.value = nextIsControlled;
  });

  let inputValue = computed<string>({
    get: () => {
      if (isInputValueControlled.value && options.inputValue) {
        return options.inputValue.value;
      }

      return uncontrolledInputValue.value;
    },
    set: (nextValue) => {
      if (isInputValueControlled.value && options.inputValue) {
        options.inputValue.value = nextValue;
      } else {
        uncontrolledInputValue.value = nextValue;
      }
    }
  }) as Ref<string>;
  let selectedKeyRef = computed<string | null>({
    get: () => {
      if (isSelectedKeyControlled.value && options.selectedKey) {
        return options.selectedKey.value;
      }

      return uncontrolledSelectedKey.value;
    },
    set: (nextSelectedKey) => {
      if (isSelectedKeyControlled.value && options.selectedKey) {
        options.selectedKey.value = nextSelectedKey;
      } else {
        uncontrolledSelectedKey.value = nextSelectedKey;
      }
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
      selectedKeyRef.value = key;
      options.onSelectionChange?.(key);
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
    if (inputValue.value === nextValue) {
      return;
    }

    inputValue.value = nextValue;
    options.onInputChange?.(nextValue);
  };

  let setSelectedKey = (nextKey: string | null): void => {
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
