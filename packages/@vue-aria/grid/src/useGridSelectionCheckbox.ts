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
    disabled: boolean,
    id: string,
    onChange: () => void
  }>,
  toggleSelection: () => void
}

let gridSelectionCheckboxCounter = 0;

export function useGridSelectionCheckbox(props: AriaGridSelectionCheckboxProps): GridSelectionCheckboxAria {
  gridSelectionCheckboxCounter += 1;
  let checkboxId = `vue-grid-selection-checkbox-${gridSelectionCheckboxCounter}`;

  let toggleSelection = () => {
    props.grid.toggleSelection(props.key);
  };

  let checkboxProps = computed(() => ({
    id: checkboxId,
    'aria-label': unref(props.ariaLabel) ?? 'Select row',
    checked: props.grid.isSelected(props.key),
    disabled: !props.grid.canSelectItem(props.key),
    onChange: toggleSelection
  }));

  return {
    checkboxProps,
    toggleSelection
  };
}
