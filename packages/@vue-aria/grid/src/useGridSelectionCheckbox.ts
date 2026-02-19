import {computed, type ComputedRef, unref} from 'vue';
import {type GridAria} from './useGrid';
import {type GridKey, type MaybeRef} from './types';

export interface AriaGridSelectionCheckboxProps {
  ariaLabel?: MaybeRef<string | undefined>,
  grid: GridAria,
  key: GridKey
}

export interface GridSelectionCheckboxAria {
  checkboxProps: ComputedRef<{
    'aria-label': string,
    checked: boolean,
    disabled: boolean
  }>,
  toggleSelection: () => void
}

export function useGridSelectionCheckbox(props: AriaGridSelectionCheckboxProps): GridSelectionCheckboxAria {
  let toggleSelection = () => {
    props.grid.toggleSelection(props.key);
  };

  let checkboxProps = computed(() => ({
    'aria-label': unref(props.ariaLabel) ?? 'Select row',
    checked: props.grid.isSelected(props.key),
    disabled: !props.grid.canSelectItem(props.key)
  }));

  return {
    checkboxProps,
    toggleSelection
  };
}
