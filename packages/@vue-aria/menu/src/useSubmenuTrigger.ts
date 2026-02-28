import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import {useLocale} from '@vue-aria/i18n';
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
    'aria-labelledby': string,
    id: string,
    role: 'menu'
  }>,
  submenuTriggerProps: ComputedRef<{
    'aria-controls': string | undefined,
    'aria-expanded': boolean,
    'aria-haspopup'?: 'menu',
    'aria-label': string,
    id: string,
    onClick: (event?: MouseEvent) => void,
    onKeyDown: (event: KeyboardEvent) => void,
    onMouseEnter: () => void,
    role: 'menuitem'
  }>,
  toggle: () => void
}

let submenuTriggerCounter = 0;

export function useSubmenuTrigger(props: AriaSubmenuTriggerProps = {}): SubmenuTriggerAria {
  submenuTriggerCounter += 1;

  let {direction} = useLocale();
  let triggerId = `vue-submenu-trigger-${submenuTriggerCounter}`;
  let submenuId = `vue-submenu-${submenuTriggerCounter}`;
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

    let openKey = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    let closeKey = direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';

    if (event.key === openKey || event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      open();
    }

    if ((event.key === closeKey && isOpen.value) || event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  return {
    close,
    isOpen,
    open,
    submenuProps: computed(() => ({
      id: submenuId,
      role: 'menu' as const,
      'aria-hidden': !isOpen.value,
      'aria-labelledby': triggerId
    })),
    submenuTriggerProps: computed(() => ({
      id: triggerId,
      role: 'menuitem' as const,
      'aria-controls': isOpen.value ? submenuId : undefined,
      'aria-haspopup': unref(props.isDisabled) ? undefined : 'menu' as const,
      'aria-expanded': isOpen.value,
      'aria-label': 'Open submenu',
      onClick: (event?: MouseEvent) => {
        if (unref(props.isDisabled)) {
          return;
        }

        if (event?.currentTarget instanceof HTMLElement) {
          event.currentTarget.focus();
        }
        open();
      },
      onMouseEnter: () => {
        open();
      },
      onKeyDown
    })),
    toggle
  };
}
