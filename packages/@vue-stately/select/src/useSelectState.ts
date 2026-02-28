import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';
import {
  type FormValidationProps,
  type FormValidationState,
  useFormValidationState
} from '@vue-stately/form';
import {
  type Key,
  type ListNode,
  type ListProps,
  type SelectionMode as ListSelectionMode,
  type ListState,
  useListState
} from '@vue-stately/list';
import {type OverlayTriggerProps, type OverlayTriggerState, useOverlayTriggerState} from '@vue-stately/overlays';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;
export type SelectSelectionMode = Extract<ListSelectionMode, 'multiple' | 'single'>;
export type FocusStrategy = 'first' | 'last';
export type SelectValue<M extends SelectSelectionMode> = M extends 'single' ? Key | null : readonly Key[];

function isKey(value: Key | readonly Key[] | null): value is Key {
  return typeof value === 'number' || typeof value === 'string';
}

function normalizeSet(value: Key | readonly Key[] | null): Set<Key> {
  if (value == null) {
    return new Set();
  }

  if (isKey(value)) {
    return new Set([value]);
  }

  return new Set(value);
}

function equalSets(a: Set<Key>, b: Set<Key>): boolean {
  if (a.size !== b.size) {
    return false;
  }

  for (let key of a) {
    if (!b.has(key)) {
      return false;
    }
  }

  return true;
}

function normalizeValueForSelectionMode(
  value: Key | readonly Key[] | null,
  selectionMode: SelectSelectionMode
): Key | readonly Key[] | null {
  if (selectionMode === 'single') {
    if (value == null) {
      return null;
    }

    if (isKey(value)) {
      return value;
    }

    return value[0] ?? null;
  }

  if (value == null) {
    return [];
  }

  if (isKey(value)) {
    return [value];
  }

  return value;
}

export interface SelectStateOptions<T, M extends SelectSelectionMode = 'single'> extends
  Omit<ListProps<T>, 'allowDuplicateSelectionEvents' | 'disallowEmptySelection' | 'onSelectionChange' | 'selectedKeys' | 'selectionMode'>,
  Omit<FormValidationProps<Key | readonly Key[] | null>, 'value'>,
  OverlayTriggerProps {
  allowsEmptyCollection?: boolean,
  defaultSelectedKey?: Key | null,
  defaultValue?: SelectValue<M>,
  onChange?: (value: SelectValue<M>) => void,
  onSelectionChange?: (key: Key | null) => void,
  selectedKey?: Ref<Key | null | undefined>,
  selectionMode?: MaybeRef<M>,
  value?: Ref<SelectValue<M> | undefined>
}

export interface SelectState<T, M extends SelectSelectionMode = 'single'> extends
  FormValidationState,
  ListState<T>,
  OverlayTriggerState {
  defaultSelectedKey: Key | null,
  defaultValue: SelectValue<M>,
  focusStrategy: Ref<FocusStrategy | null>,
  isFocused: Ref<boolean>,
  selectedItem: ComputedRef<ListNode<T> | null>,
  selectedItems: ComputedRef<ListNode<T>[]>,
  selectedKey: ComputedRef<Key | null>,
  value: ComputedRef<SelectValue<M>>,
  open: (focusStrategy?: FocusStrategy | null) => void,
  setFocused: (isFocused: boolean) => void,
  setSelectedKey: (key: Key | null) => void,
  setValue: (value: Key | readonly Key[] | null) => void,
  toggle: (focusStrategy?: FocusStrategy | null) => void
}

/**
 * Provides state management for select controls with list selection,
 * overlay visibility, and form validation behavior.
 */
export function useSelectState<T extends object, M extends SelectSelectionMode = 'single'>(
  options: SelectStateOptions<T, M>
): SelectState<T, M> {
  let selectionMode = computed<SelectSelectionMode>(() => unref(options.selectionMode) ?? 'single');
  let triggerState = useOverlayTriggerState(options);
  let focusStrategy = ref<FocusStrategy | null>(null);
  let isValueControlled = computed(() => options.value !== undefined && options.value.value !== undefined);
  let isSelectedKeyControlled = computed(() => {
    if (selectionMode.value !== 'single' || options.value !== undefined) {
      return false;
    }

    return options.selectedKey !== undefined && options.selectedKey.value !== undefined;
  });
  let isControlled = computed(() => isValueControlled.value || isSelectedKeyControlled.value);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let derivedDefaultValue = computed<Key | readonly Key[] | null>(() => {
    if (options.defaultValue !== undefined) {
      return options.defaultValue as Key | readonly Key[] | null;
    }

    if (selectionMode.value === 'single') {
      return options.defaultSelectedKey ?? null;
    }

    return [];
  });

  let controlledValue = computed<Key | readonly Key[] | null | undefined>(() => {
    if (isValueControlled.value && options.value !== undefined) {
      return options.value.value as Key | readonly Key[] | null | undefined;
    }

    if (isSelectedKeyControlled.value && options.selectedKey !== undefined) {
      return options.selectedKey.value;
    }

    return undefined;
  });

  let uncontrolledValue = ref<Key | readonly Key[] | null>(derivedDefaultValue.value);
  let rawValue = computed<Key | readonly Key[] | null>(() => {
    if (controlledValue.value !== undefined) {
      return controlledValue.value;
    }

    return uncontrolledValue.value;
  });

  let value = computed<SelectValue<M>>(() => {
    let normalizedValue = normalizeValueForSelectionMode(rawValue.value, selectionMode.value);
    return normalizedValue as SelectValue<M>;
  });

  let commitValue = (nextValue: Key | readonly Key[] | null): void => {
    let normalizedValue = normalizeValueForSelectionMode(nextValue, selectionMode.value);

    if (isValueControlled.value && options.value) {
      options.value.value = normalizedValue as SelectValue<M>;
    } else if (isSelectedKeyControlled.value && selectionMode.value === 'single' && options.selectedKey) {
      options.selectedKey.value = Array.isArray(normalizedValue) ? normalizedValue[0] ?? null : normalizedValue;
    } else {
      uncontrolledValue.value = normalizedValue;
    }

    options.onChange?.(normalizedValue as SelectValue<M>);
  };

  let setValue = (nextValue: Key | readonly Key[] | null): void => {
    if (selectionMode.value === 'single') {
      let normalizedKey = Array.isArray(nextValue) ? nextValue[0] ?? null : nextValue;
      let previousKey = value.value as Key | null;
      commitValue(normalizedKey);

      if (normalizedKey !== previousKey) {
        options.onSelectionChange?.(normalizedKey);
      }

      return;
    }

    commitValue(normalizeValueForSelectionMode(nextValue, 'multiple'));
  };

  let selectedKeys = ref(normalizeSet(value.value as Key | readonly Key[] | null));
  watch(value, (nextValue) => {
    let nextKeys = normalizeSet(nextValue as Key | readonly Key[] | null);
    if (!equalSets(selectedKeys.value, nextKeys)) {
      selectedKeys.value = nextKeys;
    }
  }, {flush: 'sync'});

  let validationState = useFormValidationState<Key | readonly Key[] | null>({
    builtinValidation: options.builtinValidation,
    isInvalid: options.isInvalid,
    name: options.name,
    validate: options.validate,
    validationBehavior: options.validationBehavior,
    validationErrors: options.validationErrors,
    value: computed(() => {
      let currentValue = value.value as Key | readonly Key[] | null;
      if (Array.isArray(currentValue) && currentValue.length === 0) {
        return null;
      }

      return currentValue;
    })
  });

  let listState = useListState({
    ...options,
    allowDuplicateSelectionEvents: true,
    disallowEmptySelection: selectionMode.value === 'single',
    selectedKeys,
    selectionMode: selectionMode.value,
    onSelectionChange: (keys) => {
      if (selectionMode.value === 'single') {
        let key = keys.values().next().value ?? null;
        setValue(key);
        triggerState.close();
      } else {
        setValue([...keys]);
      }

      validationState.commitValidation();
    }
  });

  let selectedKey = computed(() => listState.selectionManager.firstSelectedKey);
  let selectedItems = computed(() => {
    return [...listState.selectionManager.selectedKeys.value]
      .map((key) => listState.collection.getItem(key))
      .filter((item): item is ListNode<T> => item != null);
  });
  let selectedItem = computed(() => selectedItems.value[0] ?? null);

  let initialValue = value.value as Key | readonly Key[] | null;
  let initialSingleValue = Array.isArray(initialValue) ? initialValue[0] ?? null : initialValue;
  let defaultValue = (derivedDefaultValue.value ?? initialValue) as SelectValue<M>;
  let defaultSelectedKey = options.defaultSelectedKey ?? (selectionMode.value === 'single' ? initialSingleValue : null);

  let open = (nextFocusStrategy: FocusStrategy | null = null): void => {
    if (listState.collection.size !== 0 || options.allowsEmptyCollection) {
      focusStrategy.value = nextFocusStrategy;
      triggerState.open();
    }
  };

  let toggle = (nextFocusStrategy: FocusStrategy | null = null): void => {
    if (listState.collection.size !== 0 || options.allowsEmptyCollection) {
      focusStrategy.value = nextFocusStrategy;
      triggerState.toggle();
    }
  };

  let isFocused = ref(false);
  let setFocused = (nextFocused: boolean): void => {
    isFocused.value = nextFocused;
  };

  let setSelectedKey = (key: Key | null): void => {
    setValue(key);
  };

  return {
    ...validationState,
    ...listState,
    ...triggerState,
    value,
    defaultValue,
    setValue,
    selectedKey,
    setSelectedKey,
    selectedItem,
    selectedItems,
    defaultSelectedKey,
    focusStrategy,
    open,
    toggle,
    isFocused,
    setFocused
  };
}
