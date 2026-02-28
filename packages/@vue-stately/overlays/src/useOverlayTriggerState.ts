import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface OverlayTriggerProps {
  defaultOpen?: MaybeRef<boolean>,
  isOpen?: Ref<boolean | undefined>,
  onOpenChange?: (isOpen: boolean) => void
}

export interface OverlayTriggerState {
  isOpen: ComputedRef<boolean>,
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
  let isControlled = computed(() => props.isOpen !== undefined && props.isOpen.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let isOpen = computed(() => {
    if (isControlled.value && props.isOpen) {
      return props.isOpen.value;
    }

    return uncontrolledOpen.value;
  });

  let setOpen = (nextOpen: boolean): void => {
    if (isOpen.value === nextOpen) {
      return;
    }

    if (isControlled.value && props.isOpen) {
      props.isOpen.value = nextOpen;
    } else {
      uncontrolledOpen.value = nextOpen;
    }

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
