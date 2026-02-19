import type {AriaStepListItemOptions, StepListItemAria, StepListState} from './types';
import {computed, unref} from 'vue';
import {useSelectableItem} from '@vue-aria/selection';

export function useStepListItem(options: AriaStepListItemOptions, state: StepListState): StepListItemAria {
  let isDisabled = computed(() => !state.isSelectable(options.key));
  let selectableItem = useSelectableItem({
    key: options.key
  }, state.selectionManager, {
    isDisabled
  });

  let isSelected = computed(() => unref(state.selectedKey) === options.key);

  return {
    stepProps: computed(() => {
      let itemProps = selectableItem.itemProps.value;

      return {
        ...itemProps,
        role: 'link' as const,
        'aria-current': isSelected.value ? 'step' as const : undefined,
        'aria-disabled': isDisabled.value ? true : undefined,
        tabIndex: isDisabled.value ? undefined : 0,
        onKeyDown: (event: KeyboardEvent) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            event.stopPropagation();
          }

        }
      };
    })
  };
}
