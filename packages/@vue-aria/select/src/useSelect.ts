import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import type {MaybeRef} from './types';

export type SelectKey = string | number;

export interface SelectOption {
  disabled?: boolean,
  key: SelectKey,
  textValue: string
}

export interface AriaSelectOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  description?: MaybeRef<string | undefined>,
  errorMessage?: MaybeRef<string | undefined>,
  form?: MaybeRef<string | undefined>,
  id?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  isInvalid?: MaybeRef<boolean>,
  isOpen?: Ref<boolean>,
  isRequired?: MaybeRef<boolean>,
  label?: MaybeRef<string | undefined>,
  name?: MaybeRef<string | undefined>,
  onOpenChange?: (isOpen: boolean) => void,
  onSelectionChange?: (key: SelectKey | null) => void,
  options?: MaybeRef<SelectOption[]>,
  selectedKey?: Ref<SelectKey | null>
}

export interface SelectAria {
  close: () => void,
  descriptionProps: ComputedRef<{
    id?: string
  }>,
  errorMessageProps: ComputedRef<{
    id?: string
  }>,
  hiddenSelectProps: ComputedRef<{
    form?: string,
    isDisabled: boolean,
    name?: string,
    options: SelectOption[],
    selectedKey: SelectKey | null
  }>,
  isInvalid: ComputedRef<boolean>,
  isOpen: Ref<boolean>,
  labelProps: ComputedRef<{
    id?: string,
    onClick: () => void
  }>,
  menuProps: ComputedRef<{
    'aria-labelledby'?: string,
    hidden: boolean,
    id: string,
    onSelect: (key: SelectKey) => void,
    role: 'listbox'
  }>,
  open: () => void,
  selectKey: (key: SelectKey) => void,
  selectedItem: ComputedRef<SelectOption | undefined>,
  selectedKey: Ref<SelectKey | null>,
  toggle: () => void,
  triggerProps: ComputedRef<{
    'aria-controls'?: string,
    'aria-expanded': boolean,
    'aria-haspopup': 'listbox',
    'aria-invalid'?: true,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    disabled?: true,
    id: string,
    onClick: () => void,
    onKeyDown: (event: KeyboardEvent) => void,
    role: 'button'
  }>,
  valueProps: ComputedRef<{
    id: string
  }>
}

let selectCounter = 0;

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

function isOptionDisabled(option: SelectOption | undefined): boolean {
  if (!option) {
    return true;
  }

  return Boolean(option.disabled);
}

function findFirstEnabledKey(options: SelectOption[]): SelectKey | null {
  for (let option of options) {
    if (!isOptionDisabled(option)) {
      return option.key;
    }
  }

  return null;
}

export function useSelect(options: AriaSelectOptions = {}): SelectAria {
  selectCounter += 1;

  let triggerId = computed(() => resolveOptionalString(options.id) ?? `vue-select-trigger-${selectCounter}`);
  let menuId = `${triggerId.value}-menu`;
  let valueId = `${triggerId.value}-value`;

  let isOpen = options.isOpen ?? ref(false);
  let selectedKey = options.selectedKey ?? ref<SelectKey | null>(null);
  let normalizedOptions = computed(() => unref(options.options) ?? []);
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isInvalid = computed(() => Boolean(unref(options.isInvalid)));

  let selectedItem = computed(() => normalizedOptions.value.find((option) => option.key === selectedKey.value));

  let setOpen = (nextOpen: boolean) => {
    if (isOpen.value === nextOpen) {
      return;
    }

    isOpen.value = nextOpen;
    options.onOpenChange?.(nextOpen);
  };

  let open = () => {
    if (isDisabled.value) {
      return;
    }

    setOpen(true);
  };

  let close = () => {
    setOpen(false);
  };

  let toggle = () => {
    if (isDisabled.value) {
      return;
    }

    setOpen(!isOpen.value);
  };

  let selectKey = (key: SelectKey) => {
    if (isDisabled.value) {
      return;
    }

    let nextItem = normalizedOptions.value.find((option) => option.key === key);
    if (!nextItem || isOptionDisabled(nextItem)) {
      return;
    }

    if (selectedKey.value !== key) {
      selectedKey.value = key;
      options.onSelectionChange?.(key);
    }

    close();
  };

  let getNextEnabledKey = (direction: 'next' | 'previous') => {
    if (normalizedOptions.value.length === 0) {
      return null;
    }

    let startIndex: number;
    if (selectedKey.value == null) {
      startIndex = direction === 'next' ? -1 : 0;
    } else {
      startIndex = normalizedOptions.value.findIndex((option) => option.key === selectedKey.value);
    }

    let step = direction === 'next' ? 1 : -1;
    let index = startIndex;
    for (let count = 0; count < normalizedOptions.value.length; count += 1) {
      index = (index + step + normalizedOptions.value.length) % normalizedOptions.value.length;
      let option = normalizedOptions.value[index];
      if (option && !isOptionDisabled(option)) {
        return option.key;
      }
    }

    return null;
  };

  let onKeyDown = (event: KeyboardEvent) => {
    if (isDisabled.value) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      open();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      open();
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();

      let nextKey: SelectKey | null;
      if (selectedKey.value == null) {
        nextKey = findFirstEnabledKey(normalizedOptions.value);
      } else {
        nextKey = getNextEnabledKey(event.key === 'ArrowLeft' ? 'previous' : 'next');
      }

      if (nextKey != null && nextKey !== selectedKey.value) {
        selectedKey.value = nextKey;
        options.onSelectionChange?.(nextKey);
      }

      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  let label = computed(() => resolveOptionalString(options.label));
  let labelId = computed(() => label.value ? `${triggerId.value}-label` : undefined);
  let description = computed(() => resolveOptionalString(options.description));
  let descriptionId = computed(() => description.value ? `${triggerId.value}-description` : undefined);
  let errorMessage = computed(() => resolveOptionalString(options.errorMessage));
  let errorMessageId = computed(() => errorMessage.value ? `${triggerId.value}-error` : undefined);

  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));
  let combinedLabelledBy = computed(() => {
    let ids = new Set<string>();
    if (labelId.value) {
      ids.add(labelId.value);
    }

    if (ariaLabelledby.value) {
      for (let id of ariaLabelledby.value.trim().split(/\s+/)) {
        if (id) {
          ids.add(id);
        }
      }
    }

    if (ariaLabel.value && ids.size > 0) {
      ids.add(triggerId.value);
    }

    return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
  });
  let triggerAriaLabelledBy = computed(() => {
    let ids = new Set<string>([valueId]);
    if (combinedLabelledBy.value) {
      for (let id of combinedLabelledBy.value.split(/\s+/)) {
        if (id) {
          ids.add(id);
        }
      }
    } else if (ariaLabel.value) {
      ids.add(triggerId.value);
    }

    return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
  });
  let menuAriaLabelledBy = computed(() => {
    if (combinedLabelledBy.value) {
      return combinedLabelledBy.value;
    }

    if (ariaLabel.value) {
      return triggerId.value;
    }

    return undefined;
  });

  return {
    close,
    descriptionProps: computed(() => ({
      id: descriptionId.value
    })),
    errorMessageProps: computed(() => ({
      id: errorMessageId.value
    })),
    hiddenSelectProps: computed(() => ({
      options: normalizedOptions.value,
      selectedKey: selectedKey.value,
      name: resolveOptionalString(options.name),
      form: resolveOptionalString(options.form),
      isDisabled: isDisabled.value
    })),
    isInvalid,
    isOpen,
    labelProps: computed(() => ({
      id: labelId.value,
      onClick: open
    })),
    menuProps: computed(() => ({
      id: menuId,
      role: 'listbox' as const,
      hidden: !isOpen.value,
      'aria-labelledby': menuAriaLabelledBy.value,
      onSelect: selectKey
    })),
    open,
    selectKey,
    selectedItem,
    selectedKey,
    toggle,
    triggerProps: computed(() => ({
      id: triggerId.value,
      role: 'button' as const,
      'aria-haspopup': 'listbox' as const,
      'aria-expanded': isOpen.value,
      'aria-controls': isOpen.value ? menuId : undefined,
      'aria-label': ariaLabel.value,
      'aria-labelledby': triggerAriaLabelledBy.value,
      'aria-invalid': isInvalid.value ? true : undefined,
      disabled: isDisabled.value ? true : undefined,
      onClick: toggle,
      onKeyDown
    })),
    valueProps: computed(() => ({
      id: valueId
    }))
  };
}
