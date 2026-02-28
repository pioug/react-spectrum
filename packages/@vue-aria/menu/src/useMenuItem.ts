import {computed, type ComputedRef, ref, unref} from 'vue';
import type {MaybeRef, MenuKey} from './types';
import {type MenuAria} from './useMenu';

export interface AriaMenuItemProps {
  'aria-controls'?: MaybeRef<string | undefined>,
  'aria-expanded'?: MaybeRef<boolean | 'true' | 'false' | undefined>,
  'aria-haspopup'?: MaybeRef<'dialog' | 'menu' | undefined>,
  'aria-label'?: MaybeRef<string | undefined>,
  closeOnSelect?: MaybeRef<boolean>,
  isDisabled?: MaybeRef<boolean>,
  key: MaybeRef<MenuKey>,
  onAction?: (key: MenuKey) => void
}

export interface MenuItemAria {
  isDisabled: ComputedRef<boolean>,
  isFocused: ComputedRef<boolean>,
  isPressed: ComputedRef<boolean>,
  isSelected: ComputedRef<boolean>,
  menuItemProps: ComputedRef<{
    'aria-checked'?: boolean,
    'aria-controls'?: string,
    'aria-disabled'?: true,
    'aria-expanded'?: boolean | 'true' | 'false',
    'aria-haspopup'?: 'dialog' | 'menu',
    'aria-label'?: string,
    id: string,
    onBlur: () => void,
    onClick: () => void,
    onFocus: () => void,
    onMouseDown: () => void,
    onMouseUp: () => void,
    role: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio'
  }>,
  press: () => void
}

let menuItemCounter = 0;

export function useMenuItem(props: AriaMenuItemProps, menu: MenuAria): MenuItemAria {
  menuItemCounter += 1;

  let key = computed(() => unref(props.key));
  let itemId = `vue-menu-item-${menuItemCounter}-${String(key.value).replace(/\s*/g, '')}`;
  let isPressed = ref(false);

  let isDisabled = computed(() => Boolean(unref(props.isDisabled)));
  let isSelected = computed(() => menu.selectedKeys.value.has(key.value));
  let isFocused = computed(() => menu.focusedKey.value === key.value);
  let hasPopup = computed(() => unref(props['aria-haspopup']));

  let role = computed(() => {
    if (hasPopup.value) {
      return 'menuitem' as const;
    }

    if (menu.selectionMode.value === 'single') {
      return 'menuitemradio' as const;
    }

    if (menu.selectionMode.value === 'multiple') {
      return 'menuitemcheckbox' as const;
    }

    return 'menuitem' as const;
  });

  let press = () => {
    if (isDisabled.value) {
      return;
    }

    menu.toggleSelection(key.value);
    props.onAction?.(key.value);
    menu.onAction?.(key.value);
  };

  let onClick = () => {
    if (unref(props.closeOnSelect) === false) {
      press();
      return;
    }

    press();
  };

  return {
    isDisabled,
    isFocused,
    isPressed: computed(() => isPressed.value),
    isSelected,
    menuItemProps: computed(() => ({
      id: itemId,
      role: role.value,
      'aria-disabled': isDisabled.value || undefined,
      'aria-checked': menu.selectionMode.value === 'none' || hasPopup.value ? undefined : isSelected.value,
      'aria-label': unref(props['aria-label']),
      'aria-controls': unref(props['aria-controls']),
      'aria-haspopup': hasPopup.value,
      'aria-expanded': unref(props['aria-expanded']),
      onBlur: () => {
        menu.focusKey(null);
      },
      onFocus: () => {
        menu.focusKey(key.value);
      },
      onMouseDown: () => {
        if (!isDisabled.value) {
          isPressed.value = true;
        }
      },
      onMouseUp: () => {
        isPressed.value = false;
      },
      onClick
    })),
    press
  };
}
