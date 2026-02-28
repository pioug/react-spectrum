import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import type {MaybeRef} from './types';

export interface AriaSubmenuTriggerProps {
  isDisabled?: MaybeRef<boolean>,
  isOpen?: Ref<boolean>,
  onOpenChange?: (isOpen: boolean) => void
}

export interface SubmenuTriggerAria {
  close: () => void,
  isOpen: Ref<boolean>,
  open: () => void,
  submenuProps: ComputedRef<{
    'aria-hidden': boolean,
    role: 'menu'
  }>,
  submenuTriggerProps: ComputedRef<{
    'aria-expanded': boolean,
    'aria-haspopup'?: 'menu',
    'aria-label': string,
    onKeyDown: (event: KeyboardEvent) => void,
    onMouseEnter: () => void,
    role: 'menuitem'
  }>,
  toggle: () => void
}

export function useSubmenuTrigger(props: AriaSubmenuTriggerProps = {}): SubmenuTriggerAria {
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
    if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      open();
    }

    if (event.key === 'ArrowLeft' || event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  return {
    close,
    isOpen,
    open,
    submenuProps: computed(() => ({
      role: 'menu' as const,
      'aria-hidden': !isOpen.value
    })),
    submenuTriggerProps: computed(() => ({
      role: 'menuitem' as const,
      'aria-haspopup': unref(props.isDisabled) ? undefined : 'menu' as const,
      'aria-expanded': isOpen.value,
      'aria-label': 'Open submenu',
      onMouseEnter: () => {
        open();
      },
      onKeyDown
    })),
    toggle
  };
}
