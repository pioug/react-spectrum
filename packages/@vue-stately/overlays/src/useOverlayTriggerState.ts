import {type ComputedRef, type Ref, ref, unref} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface OverlayTriggerProps {
  defaultOpen?: MaybeRef<boolean>,
  isOpen?: Ref<boolean>,
  onOpenChange?: (isOpen: boolean) => void
}

export interface OverlayTriggerState {
  isOpen: Ref<boolean>,
  close: () => void,
  open: () => void,
  setOpen: (isOpen: boolean) => void,
  toggle: () => void
}

/**
 * Manages state for an overlay trigger.
 */
export function useOverlayTriggerState(props: OverlayTriggerProps = {}): OverlayTriggerState {
  let uncontrolledOpen = ref(Boolean(unref(props.defaultOpen)));
  let isOpen = props.isOpen ?? uncontrolledOpen;

  let setOpen = (nextOpen: boolean): void => {
    if (isOpen.value === nextOpen) {
      return;
    }

    isOpen.value = nextOpen;
    props.onOpenChange?.(nextOpen);
  };

  let open = (): void => {
    setOpen(true);
  };

  let close = (): void => {
    setOpen(false);
  };

  let toggle = (): void => {
    setOpen(!isOpen.value);
  };

  return {
    isOpen,
    setOpen,
    open,
    close,
    toggle
  };
}
