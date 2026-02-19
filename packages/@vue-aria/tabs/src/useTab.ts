import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import type {TabKey, TabListState} from './useTabList';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaTabOptions {
  isDisabled?: MaybeRef<boolean>,
  key: MaybeRef<TabKey>,
  shouldSelectOnPressUp?: MaybeRef<boolean>
}

export interface TabAria {
  isDisabled: ComputedRef<boolean>,
  isPressed: ComputedRef<boolean>,
  isSelected: ComputedRef<boolean>,
  press: () => void,
  tabProps: ComputedRef<{
    'aria-controls'?: string,
    'aria-disabled'?: true,
    'aria-selected': boolean,
    id: string,
    onBlur: () => void,
    onFocus: () => void,
    onKeyDown: (event: KeyboardEvent) => void,
    onMouseDown: () => void,
    onMouseUp: () => void,
    role: 'tab',
    tabIndex?: -1 | 0
  }>
}

export function useTab(options: AriaTabOptions, state: TabListState): TabAria {
  let key = computed(() => String(unref(options.key)));
  let isPressed = ref(false);
  let shouldSelectOnPressUp = computed(() => Boolean(unref(options.shouldSelectOnPressUp)));
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)) || state.isDisabledKey(key.value));
  let isSelected = computed(() => state.isSelected(key.value));

  let press = () => {
    if (isDisabled.value) {
      return;
    }

    state.setSelectedKey(key.value);
  };

  let tabIndex = computed<0 | -1 | undefined>(() => {
    if (isDisabled.value) {
      return undefined;
    }

    if (state.focusedKey.value != null) {
      return state.focusedKey.value === key.value ? 0 : -1;
    }

    if (isSelected.value) {
      return 0;
    }

    return state.getFirstEnabledKey() === key.value ? 0 : -1;
  });

  let onFocus = () => {
    if (isDisabled.value) {
      return;
    }

    state.setFocusedKey(key.value);
    if (state.keyboardActivation.value === 'automatic') {
      state.setSelectedKey(key.value);
    }
  };

  let onKeyDown = (event: KeyboardEvent) => {
    if (isDisabled.value) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      press();
    }
  };

  let onMouseDown = () => {
    if (isDisabled.value) {
      return;
    }

    isPressed.value = true;

    if (!shouldSelectOnPressUp.value) {
      press();
    }
  };

  let onMouseUp = () => {
    if (isDisabled.value) {
      isPressed.value = false;
      return;
    }

    if (shouldSelectOnPressUp.value && isPressed.value) {
      press();
    }

    isPressed.value = false;
  };

  let onBlur = () => {
    isPressed.value = false;
  };

  return {
    isDisabled,
    isPressed: computed(() => isPressed.value),
    isSelected,
    press,
    tabProps: computed(() => ({
      id: state.getTabId(key.value),
      role: 'tab' as const,
      tabIndex: tabIndex.value,
      'aria-selected': isSelected.value,
      'aria-disabled': isDisabled.value ? true : undefined,
      'aria-controls': isSelected.value ? state.getTabPanelId(key.value) : undefined,
      onFocus,
      onKeyDown,
      onMouseDown,
      onMouseUp,
      onBlur
    }))
  };
}
