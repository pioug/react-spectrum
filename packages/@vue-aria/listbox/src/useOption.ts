import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';
import {getItemId, type ListKey} from './utils';
import {type ListBoxAria, type ListBoxItemNode} from './useListBox';
import type {ListState} from '@vue-stately/list';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaOptionProps {
  'aria-label'?: MaybeRef<string | undefined>,
  key: MaybeRef<ListKey>,
  option?: MaybeRef<ListBoxItemNode | undefined>
}

export interface OptionAria {
  descriptionProps: ComputedRef<{id: string}>,
  isDisabled: ComputedRef<boolean>,
  isFocusVisible: ComputedRef<boolean>,
  isFocused: ComputedRef<boolean>,
  isPressed: ComputedRef<boolean>,
  isSelected: ComputedRef<boolean>,
  labelProps: ComputedRef<{id: string}>,
  optionProps: ComputedRef<{
    'aria-disabled'?: true,
    'aria-describedby'?: string,
    'aria-label'?: string,
    'aria-labelledby': string,
    'aria-posinset'?: number,
    'aria-selected'?: boolean,
    'aria-setsize'?: number,
    id: string,
    onClick: () => void,
    onMouseDown: () => void,
    onMouseEnter: () => void,
    onMouseUp: () => void,
    role: 'option'
  }>,
  press: () => void
}

export function useOption(props: AriaOptionProps, listBox: ListBoxAria): OptionAria {
  let key = computed(() => unref(props.key));
  let item = computed(() => {
    let explicitItem = props.option ? unref(props.option) : undefined;
    if (explicitItem) {
      return explicitItem;
    }

    return listBox.collection.value.items.find((candidate) => candidate.key === key.value);
  });

  let labelId = computed(() => `${String(key.value)}-label`);
  let descriptionId = computed(() => `${String(key.value)}-description`);
  let isPressed = ref(false);

  let isDisabled = computed(() => Boolean(item.value?.isDisabled));
  let isSelected = computed(() => listBox.selectedKeys.value.has(key.value));
  let isFocused = computed(() => listBox.focusedKey.value === key.value);

  let select = () => {
    if (isDisabled.value) {
      return;
    }

    if (listBox.selectionMode.value === 'none') {
      listBox.onAction?.(key.value);
      return;
    }

    if (listBox.selectionMode.value === 'single') {
      listBox.selectKey(key.value);
    } else {
      listBox.toggleSelection(key.value);
    }

    listBox.onAction?.(key.value);
  };

  let onMouseEnter = () => {
    if (listBox.shouldFocusOnHover.value && !isDisabled.value) {
      listBox.focusedKey.value = key.value;
    }
  };

  let onMouseDown = () => {
    if (isDisabled.value) {
      return;
    }

    isPressed.value = true;
    if (!listBox.shouldSelectOnPressUp.value) {
      select();
    }
  };

  let onMouseUp = () => {
    if (!isPressed.value) {
      return;
    }

    isPressed.value = false;
    if (listBox.shouldSelectOnPressUp.value) {
      select();
    }
  };

  let onClick = () => {
    if (!listBox.shouldSelectOnPressUp.value) {
      listBox.focusedKey.value = key.value;
      return;
    }

    if (!isPressed.value) {
      select();
    }

    listBox.focusedKey.value = key.value;
  };

  return {
    descriptionProps: computed(() => ({
      id: descriptionId.value
    })),
    isDisabled,
    isFocusVisible: computed(() => isFocused.value),
    isFocused,
    isPressed: computed(() => isPressed.value),
    isSelected,
    labelProps: computed(() => ({
      id: labelId.value
    })),
    optionProps: computed(() => ({
      id: getItemId(listBox as unknown as ListState<unknown>, key.value),
      role: 'option' as const,
      'aria-disabled': isDisabled.value || undefined,
      'aria-selected': listBox.selectionMode.value !== 'none' ? isSelected.value : undefined,
      'aria-label': unref(props['aria-label']),
      'aria-labelledby': labelId.value,
      'aria-describedby': item.value?.description ? descriptionId.value : undefined,
      'aria-posinset': listBox.isVirtualized.value ? (item.value?.index ?? 0) + 1 : undefined,
      'aria-setsize': listBox.isVirtualized.value ? listBox.collection.value.items.length : undefined,
      onClick,
      onMouseDown,
      onMouseEnter,
      onMouseUp
    })),
    press: select
  };
}
