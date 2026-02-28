import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {useControlledState} from '@vue-stately/utils';

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
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let [isSelected, setSelectedInternal] = useControlledState(
    options.isSelected,
    options.defaultSelected ?? false,
    options.onChange
  );
  let initialValue = isSelected.value;

  let setSelected = (nextSelected: boolean): void => {
    if (!isReadOnly.value) {
      setSelectedInternal(nextSelected);
    }
  };

  let toggle = (): void => {
    if (!isReadOnly.value) {
      setSelectedInternal(!isSelected.value);
    }
  };

  return {
    isSelected,
    defaultSelected: options.defaultSelected ?? initialValue,
    setSelected,
    toggle
  };
}
