import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import type {MaybeRef} from './types';

export type OverlayTriggerType = 'dialog' | 'grid' | 'listbox' | 'menu' | 'tree';

export interface OverlayTriggerOptions {
  defaultOpen?: MaybeRef<boolean>,
  isOpen?: Ref<boolean>,
  onOpenChange?: (isOpen: boolean) => void,
  type: OverlayTriggerType
}

export interface OverlayTriggerAria {
  close: () => void,
  isOpen: Ref<boolean>,
  open: () => void,
  overlayProps: ComputedRef<{
    id: string
  }>,
  toggle: () => void,
  triggerProps: ComputedRef<{
    'aria-controls': string | undefined,
    'aria-expanded': boolean,
    'aria-haspopup'?: boolean | 'listbox',
    onClick: () => void
  }>
}

let overlayTriggerCounter = 0;

function resolveAriaHasPopup(type: OverlayTriggerType): boolean | 'listbox' | undefined {
  if (type === 'menu') {
    return true;
  }

  if (type === 'listbox') {
    return 'listbox';
  }

  return undefined;
}

export function useOverlayTrigger(options: OverlayTriggerOptions): OverlayTriggerAria {
  overlayTriggerCounter += 1;

  let overlayId = `vue-overlay-trigger-${overlayTriggerCounter}`;
  let internalOpen = ref(Boolean(unref(options.defaultOpen)));
  let isOpen = options.isOpen ?? internalOpen;

  let setOpen = (nextOpen: boolean) => {
    if (isOpen.value === nextOpen) {
      return;
    }

    isOpen.value = nextOpen;
    options.onOpenChange?.(nextOpen);
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

  return {
    close,
    isOpen,
    open,
    overlayProps: computed(() => ({
      id: overlayId
    })),
    toggle,
    triggerProps: computed(() => ({
      'aria-haspopup': resolveAriaHasPopup(options.type),
      'aria-expanded': isOpen.value,
      'aria-controls': isOpen.value ? overlayId : undefined,
      onClick: toggle
    }))
  };
}
