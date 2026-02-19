import type {ActionGroupAria} from './useActionGroup';
import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaActionGroupItemProps {
  actionGroup: ActionGroupAria,
  disabled?: MaybeRef<boolean>,
  key: MaybeRef<string>,
  onPress?: (key: string, selectedKeys: Set<string>) => void
}

export interface ActionGroupItemAria {
  isDisabled: ComputedRef<boolean>,
  isSelected: ComputedRef<boolean>,
  itemProps: ComputedRef<{
    'aria-checked'?: boolean,
    'aria-disabled': boolean,
    role?: 'menuitemradio' | 'menuitemcheckbox',
    tabindex: number
  }>,
  press: () => void
}

export function useActionGroupItem(props: AriaActionGroupItemProps): ActionGroupItemAria {
  let itemKey = computed(() => String(unref(props.key)));
  let isDisabled = computed(() => Boolean(unref(props.disabled)) || props.actionGroup.isDisabled(itemKey.value));
  let isSelected = computed(() => props.actionGroup.isSelected(itemKey.value));

  let itemProps = computed(() => {
    if (props.actionGroup.selectionMode.value === 'none') {
      return {
        'aria-disabled': isDisabled.value,
        tabindex: isDisabled.value ? -1 : 0
      };
    }

    let role: 'menuitemcheckbox' | 'menuitemradio' = props.actionGroup.selectionMode.value === 'multiple'
      ? 'menuitemcheckbox'
      : 'menuitemradio';

    return {
      role,
      'aria-checked': isSelected.value,
      'aria-disabled': isDisabled.value,
      tabindex: isDisabled.value ? -1 : 0
    };
  });

  let press = () => {
    if (isDisabled.value) {
      return;
    }

    let nextSelectedKeys = props.actionGroup.toggleKey(itemKey.value);
    props.onPress?.(itemKey.value, nextSelectedKeys);
  };

  return {
    isDisabled,
    isSelected,
    itemProps,
    press
  };
}
