import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface ToggleStateOptions {
  defaultSelected?: boolean,
  isReadOnly?: MaybeRef<boolean>,
  isSelected?: Ref<boolean | undefined>,
  onChange?: (isSelected: boolean) => void
}

export interface ToggleState {
  defaultSelected: boolean,
  isSelected: ComputedRef<boolean>,
  setSelected: (isSelected: boolean) => void,
  toggle: () => void
}

/**
 * Provides state management for single toggles.
 */
export function useToggleState(options: ToggleStateOptions = {}): ToggleState {
  let uncontrolledSelected = ref(options.defaultSelected ?? false);
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let isControlled = computed(() => options.isSelected !== undefined && options.isSelected.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let isSelected = computed(() => {
    if (isControlled.value && options.isSelected) {
      return Boolean(options.isSelected.value);
    }

    return uncontrolledSelected.value;
  });
  let initialValue = isSelected.value;

  let setSelected = (nextSelected: boolean): void => {
    if (isReadOnly.value || nextSelected === isSelected.value) {
      return;
    }

    if (!isControlled.value) {
      uncontrolledSelected.value = nextSelected;
    }

    options.onChange?.(nextSelected);
  };

  let toggle = (): void => {
    setSelected(!isSelected.value);
  };

  return {
    isSelected,
    defaultSelected: options.defaultSelected ?? initialValue,
    setSelected,
    toggle
  };
}
