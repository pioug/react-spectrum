import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;
type ComboBoxFocusStrategy = 'first' | 'last' | 'manual';
type ComboBoxMenuTriggerAction = 'focus' | 'input' | 'manual';

export type ComboBoxItem = {
  id: string,
  textValue: string
};

export type ComboBoxItemInput =
  | string
  | {
      id: string,
      textValue: string
    };

export interface AriaComboBoxOptions {
  allowsCustomValue?: MaybeRef<boolean>,
  inputValue: Ref<string>,
  isDisabled?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  items: MaybeRef<ComboBoxItemInput[]>,
  onOpenChange?: (isOpen: boolean, trigger?: ComboBoxMenuTriggerAction) => void,
  onSelectionChange?: (key: string | null) => void,
  selectedKey?: Ref<string | null>
}

export interface ComboBoxAria {
  buttonProps: ComputedRef<{
    'aria-controls': string | undefined,
    'aria-expanded': boolean,
    'aria-haspopup': 'listbox',
    'aria-label': string,
    disabled: boolean,
    onMouseDown: (event: MouseEvent) => void,
    onPointerDown: (event: PointerEvent) => void,
    tabIndex: -1
  }>,
  close: () => void,
  commit: () => void,
  descriptionProps: ComputedRef<{
    id: string
  }>,
  errorMessageProps: ComputedRef<{
    id: string
  }>,
  filteredItems: ComputedRef<ComboBoxItem[]>,
  focusedKey: Ref<string | null>,
  inputProps: ComputedRef<{
    'aria-activedescendant'?: string,
    'aria-autocomplete': 'list',
    'aria-controls': string | undefined,
    'aria-expanded': boolean,
    autoComplete: 'off',
    autoCorrect: 'off',
    disabled: boolean,
    readonly: boolean,
    role: 'combobox',
    spellCheck: 'false',
    value: string
  }>,
  isOpen: Ref<boolean>,
  labelProps: ComputedRef<{
    id: string
  }>,
  listBoxProps: ComputedRef<{
    id: string,
    role: 'listbox'
  }>,
  open: (focus?: ComboBoxFocusStrategy, trigger?: ComboBoxMenuTriggerAction) => void,
  revert: () => void,
  selectKey: (key: string | null) => void,
  selectedKey: ComputedRef<string | null>,
  toggle: (focus?: ComboBoxFocusStrategy, trigger?: ComboBoxMenuTriggerAction) => void,
  valueProps: ComputedRef<{
    id: string
  }>
}

let comboBoxCounter = 0;

function normalizeItem(item: ComboBoxItemInput): ComboBoxItem {
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
}

export function useComboBox(options: AriaComboBoxOptions): ComboBoxAria {
  comboBoxCounter += 1;
  let idBase = `vue-combobox-${comboBoxCounter}`;
  let listBoxId = `${idBase}-listbox`;

  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let allowsCustomValue = computed(() => Boolean(unref(options.allowsCustomValue)));

  let internalSelectedKey = ref<string | null>(options.selectedKey?.value ?? null);
  let selectedKey = computed(() => options.selectedKey?.value ?? internalSelectedKey.value);
  let setSelectedKey = (key: string | null) => {
    if (selectedKey.value === key) {
      return;
    }

    if (options.selectedKey) {
      options.selectedKey.value = key;
    } else {
      internalSelectedKey.value = key;
    }

    options.onSelectionChange?.(key);
  };

  let isOpen = ref(false);
  let focusedKey = ref<string | null>(null);
  let committedInputValue = ref(options.inputValue.value);

  let items = computed(() => {
    let sourceItems = unref(options.items);
    return sourceItems.map((item) => normalizeItem(item));
  });

  let filteredItems = computed(() => {
    let query = options.inputValue.value.trim().toLocaleLowerCase();
    if (!query) {
      return items.value;
    }

    return items.value.filter((item) => item.textValue.toLocaleLowerCase().includes(query));
  });

  let open = (focus: ComboBoxFocusStrategy = 'first', trigger?: ComboBoxMenuTriggerAction) => {
    if (isDisabled.value || isReadOnly.value) {
      return;
    }

    let wasOpen = isOpen.value;
    if (!wasOpen) {
      isOpen.value = true;
    }

    if (focus === 'first') {
      focusedKey.value = filteredItems.value[0]?.id ?? null;
    } else if (focus === 'last') {
      focusedKey.value = filteredItems.value.length > 0
        ? filteredItems.value[filteredItems.value.length - 1].id
        : null;
    }

    if (!wasOpen) {
      options.onOpenChange?.(true, trigger);
    }
  };

  let close = () => {
    if (!isOpen.value) {
      return;
    }

    isOpen.value = false;
    focusedKey.value = null;
    options.onOpenChange?.(false);
  };

  let toggle = (focus: ComboBoxFocusStrategy = 'first', trigger?: ComboBoxMenuTriggerAction) => {
    if (isOpen.value) {
      close();
    } else {
      open(focus, trigger);
    }
  };

  let selectKey = (key: string | null) => {
    if (key == null) {
      setSelectedKey(null);
      if (!allowsCustomValue.value) {
        options.inputValue.value = '';
      }
      close();
      return;
    }

    let selectedItem = items.value.find((item) => item.id === key);
    if (!selectedItem && !allowsCustomValue.value) {
      return;
    }

    setSelectedKey(key);
    if (selectedItem) {
      options.inputValue.value = selectedItem.textValue;
    } else if (allowsCustomValue.value) {
      options.inputValue.value = key;
    }

    committedInputValue.value = options.inputValue.value;
    close();
  };

  let commit = () => {
    let selectedItem = selectedKey.value != null
      ? items.value.find((item) => item.id === selectedKey.value)
      : null;
    if (selectedItem) {
      options.inputValue.value = selectedItem.textValue;
      committedInputValue.value = selectedItem.textValue;
      close();
      return;
    }

    if (!allowsCustomValue.value) {
      options.inputValue.value = committedInputValue.value;
      close();
      return;
    }

    committedInputValue.value = options.inputValue.value;
    close();
  };

  let revert = () => {
    options.inputValue.value = committedInputValue.value;
    close();
  };

  let buttonProps = computed(() => ({
    disabled: isDisabled.value || isReadOnly.value,
    tabIndex: -1 as const,
    'aria-haspopup': 'listbox' as const,
    'aria-controls': isOpen.value ? listBoxId : undefined,
    'aria-expanded': isOpen.value,
    'aria-label': 'Toggle suggestions',
    onMouseDown: (event: MouseEvent) => {
      event.preventDefault();
    },
    onPointerDown: (event: PointerEvent) => {
      event.preventDefault();
    }
  }));

  let inputProps = computed(() => ({
    role: 'combobox' as const,
    value: options.inputValue.value,
    disabled: isDisabled.value,
    readonly: isReadOnly.value,
    'aria-autocomplete': 'list' as const,
    'aria-controls': isOpen.value ? listBoxId : undefined,
    'aria-expanded': isOpen.value,
    autoComplete: 'off' as const,
    autoCorrect: 'off' as const,
    spellCheck: 'false' as const,
    'aria-activedescendant': focusedKey.value == null ? undefined : `${idBase}-option-${focusedKey.value}`
  }));

  let listBoxProps = computed(() => ({
    id: listBoxId,
    role: 'listbox' as const
  }));

  let labelProps = computed(() => ({
    id: `${idBase}-label`
  }));

  let valueProps = computed(() => ({
    id: `${idBase}-value`
  }));

  let descriptionProps = computed(() => ({
    id: `${idBase}-description`
  }));

  let errorMessageProps = computed(() => ({
    id: `${idBase}-error`
  }));

  return {
    buttonProps,
    close,
    commit,
    descriptionProps,
    errorMessageProps,
    filteredItems,
    focusedKey,
    inputProps,
    isOpen,
    labelProps,
    listBoxProps,
    open,
    revert,
    selectKey,
    selectedKey,
    toggle,
    valueProps
  };
}
