import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import type {MaybeRef} from './types';

export interface AriaMenuTriggerProps {
  isDisabled?: MaybeRef<boolean>,
  isOpen?: Ref<boolean>,
  onOpenChange?: (isOpen: boolean) => void
}

export interface MenuTriggerAria {
  close: () => void,
  isOpen: Ref<boolean>,
  menuProps: ComputedRef<{
    'aria-labelledby': string,
    hidden: boolean,
    id: string,
    role: 'menu'
  }>,
  menuTriggerProps: ComputedRef<{
    'aria-controls': string | undefined,
    'aria-expanded': boolean,
    'aria-haspopup': 'menu',
    disabled?: true,
    id: string,
    onClick: (event?: MouseEvent) => void,
    onKeyDown: (event: KeyboardEvent) => void,
    onMouseDown: (event: MouseEvent) => void,
    onPointerDown: (event: PointerEvent) => void
  }>,
  open: () => void,
  toggle: () => void
}

let menuTriggerCounter = 0;

export function useMenuTrigger(props: AriaMenuTriggerProps = {}): MenuTriggerAria {
  menuTriggerCounter += 1;

  let triggerId = `vue-menu-trigger-${menuTriggerCounter}`;
  let menuId = `vue-menu-${menuTriggerCounter}`;
  let internalOpen = ref(false);
  let isOpen = props.isOpen ?? internalOpen;

  let setOpen = (nextOpen: boolean) => {
    if (unref(props.isDisabled) && nextOpen) {
      return;
    }

    if (isOpen.value === nextOpen) {
      return;
    }

    isOpen.value = nextOpen;
    props.onOpenChange?.(nextOpen);
  };

  let open = () => {
    setOpen(true);
  };

  let close = () => {
    setOpen(false);
  };

  let toggle = () => {
    setOpen(!isOpen.value);
  };

  let onKeyDown = (event: KeyboardEvent) => {
    if (unref(props.isDisabled)) {
      return;
    }

    if (
      event.key === 'ArrowDown'
      || event.key === 'ArrowUp'
      || event.key === 'Enter'
      || event.key === ' '
      || event.key === 'Spacebar'
    ) {
      event.preventDefault();
      open();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  return {
    close,
    isOpen,
    menuProps: computed(() => ({
      id: menuId,
      role: 'menu' as const,
      'aria-labelledby': triggerId,
      hidden: !isOpen.value
    })),
    menuTriggerProps: computed(() => ({
      id: triggerId,
      'aria-controls': isOpen.value ? menuId : undefined,
      'aria-haspopup': 'menu' as const,
      'aria-expanded': isOpen.value,
      disabled: unref(props.isDisabled) ? true : undefined,
      onClick: (event?: MouseEvent) => {
        if (unref(props.isDisabled)) {
          return;
        }

        if (event?.currentTarget instanceof HTMLElement) {
          event.currentTarget.focus();
        }
        toggle();
      },
      onMouseDown: (event: MouseEvent) => {
        event.preventDefault();
      },
      onPointerDown: (event: PointerEvent) => {
        event.preventDefault();
      },
      onKeyDown
    })),
    open,
    toggle
  };
}
