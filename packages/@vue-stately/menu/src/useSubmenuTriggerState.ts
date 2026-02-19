import {computed, type ComputedRef, ref, type Ref} from 'vue';
import {type FocusStrategy, type Key, type RootMenuTriggerState} from './useMenuTriggerState';

export interface SubmenuTriggerProps {
  triggerKey: Key
}

export interface SubmenuTriggerState {
  close: () => void,
  closeAll: () => void,
  focusStrategy: Ref<FocusStrategy | null>,
  isOpen: ComputedRef<boolean>,
  open: (focusStrategy?: FocusStrategy | null) => void,
  setOpen: (isOpen: boolean, focusStrategy?: FocusStrategy | null) => void,
  submenuLevel: number,
  toggle: (focusStrategy?: FocusStrategy | null) => void
}

/**
 * Manages submenu state for a trigger item using the root menu trigger state stack.
 */
export function useSubmenuTriggerState(props: SubmenuTriggerProps, state: RootMenuTriggerState): SubmenuTriggerState {
  let submenuLevel = state.expandedKeysStack.value.length;
  let focusStrategy = ref<FocusStrategy | null>(null);
  let isOpen = computed(() => state.expandedKeysStack.value[submenuLevel] === props.triggerKey);

  let open = (nextFocusStrategy: FocusStrategy | null = null): void => {
    focusStrategy.value = nextFocusStrategy;
    state.openSubmenu(props.triggerKey, submenuLevel);
  };

  let close = (): void => {
    focusStrategy.value = null;
    state.closeSubmenu(props.triggerKey, submenuLevel);
  };

  let toggle = (nextFocusStrategy: FocusStrategy | null = null): void => {
    if (isOpen.value) {
      close();
      return;
    }

    open(nextFocusStrategy);
  };

  let setOpen = (nextOpen: boolean, nextFocusStrategy: FocusStrategy | null = null): void => {
    if (nextOpen) {
      open(nextFocusStrategy);
      return;
    }

    close();
  };

  return {
    isOpen,
    focusStrategy,
    open,
    close,
    closeAll: state.close,
    submenuLevel,
    setOpen,
    toggle
  };
}
