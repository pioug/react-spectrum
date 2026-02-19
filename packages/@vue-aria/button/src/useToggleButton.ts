import {type AriaButtonOptions, type ButtonAria, useButton} from './useButton';
import {computed, type ComputedRef, isReadonly, isRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaToggleButtonOptions extends AriaButtonOptions {
  isSelected?: MaybeRef<boolean>,
  onToggle?: (isSelected: boolean) => void,
  setSelected?: (isSelected: boolean) => void
}

export interface ToggleButtonAria extends ButtonAria {
  isSelected: ComputedRef<boolean>,
  toggle: () => void
}

function updateSelectedValue(value: MaybeRef<boolean> | undefined, isSelected: boolean): void {
  if (!isRef(value) || isReadonly(value)) {
    return;
  }

  (value as Ref<boolean>).value = isSelected;
}

export function useToggleButton(options: AriaToggleButtonOptions = {}): ToggleButtonAria {
  let isSelected = computed(() => Boolean(unref(options.isSelected)));

  let toggle = () => {
    if (button.isDisabled.value) {
      return;
    }

    let nextSelected = !isSelected.value;
    if (options.setSelected) {
      options.setSelected(nextSelected);
    } else {
      updateSelectedValue(options.isSelected, nextSelected);
    }

    options.onToggle?.(nextSelected);
  };

  let onPress = options.onPress;
  let button = useButton({
    ...options,
    ariaPressed: isSelected,
    onPress: () => {
      toggle();
      onPress?.();
    }
  });

  return {
    ...button,
    isSelected,
    toggle
  };
}
