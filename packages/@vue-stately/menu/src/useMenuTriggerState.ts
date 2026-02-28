import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export type Key = string | number;
export type FocusStrategy = 'first' | 'last';

export interface MenuTriggerProps {
  defaultOpen?: MaybeRef<boolean>,
  isDisabled?: MaybeRef<boolean>,
  isOpen?: Ref<boolean | undefined>,
  onOpenChange?: (isOpen: boolean) => void
}

export interface OverlayTriggerState {
  close: () => void,
  isOpen: ComputedRef<boolean>,
  open: () => void,
  setOpen: (isOpen: boolean) => void,
  toggle: () => void
}

export interface MenuTriggerState extends OverlayTriggerState {
  focusStrategy: Ref<FocusStrategy | null>,
  open: (focusStrategy?: FocusStrategy | null) => void,
  toggle: (focusStrategy?: FocusStrategy | null) => void
}

export interface RootMenuTriggerState extends MenuTriggerState {
  close: () => void,
  closeSubmenu: (triggerKey: Key, level: number) => void,
  expandedKeysStack: Ref<Key[]>,
  openSubmenu: (triggerKey: Key, level: number) => void
}

/**
 * Manages root menu trigger open state and nested submenu key stacks.
 */
export function useMenuTriggerState(props: MenuTriggerProps = {}): RootMenuTriggerState {
  let internalOpen = ref(Boolean(unref(props.defaultOpen)));
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

    return internalOpen.value;
  });
  let focusStrategy = ref<FocusStrategy | null>(null);
  let expandedKeysStack = ref<Key[]>([]);

  let setOpen = (nextOpen: boolean): void => {
    if (unref(props.isDisabled)) {
      return;
    }

    if (isOpen.value === nextOpen) {
      return;
    }

    if (isControlled.value && props.isOpen) {
      props.isOpen.value = nextOpen;
    } else {
      internalOpen.value = nextOpen;
    }

    if (!nextOpen) {
      expandedKeysStack.value = [];
    }

    props.onOpenChange?.(nextOpen);
  };

  let open = (nextFocusStrategy: FocusStrategy | null = null): void => {
    focusStrategy.value = nextFocusStrategy;
    setOpen(true);
  };

  let close = (): void => {
    focusStrategy.value = null;
    setOpen(false);
  };

  let toggle = (nextFocusStrategy: FocusStrategy | null = null): void => {
    focusStrategy.value = nextFocusStrategy;
    setOpen(!isOpen.value);
  };

  let openSubmenu = (triggerKey: Key, level: number): void => {
    if (level > expandedKeysStack.value.length) {
      return;
    }

    expandedKeysStack.value = [...expandedKeysStack.value.slice(0, level), triggerKey];
  };

  let closeSubmenu = (triggerKey: Key, level: number): void => {
    if (expandedKeysStack.value[level] !== triggerKey) {
      return;
    }

    expandedKeysStack.value = expandedKeysStack.value.slice(0, level);
  };

  return {
    isOpen,
    setOpen,
    open,
    close,
    toggle,
    focusStrategy,
    expandedKeysStack,
    openSubmenu,
    closeSubmenu
  };
}
