import {computed, type ComputedRef} from 'vue';
import {type GridListAria} from './useGridList';
import {useGridSelectionCheckbox} from '@vue-aria/grid';

export interface AriaGridListSelectionCheckboxProps {
  gridList: GridListAria,
  key: string
}

export interface GridListSelectionCheckboxAria {
  checkboxProps: ComputedRef<{
    'aria-label': string,
    'aria-labelledby': string,
    checked: boolean,
    disabled: boolean,
    id: string
  }>,
  toggleSelection: () => void
}

export function useGridListSelectionCheckbox(
  props: AriaGridListSelectionCheckboxProps
): GridListSelectionCheckboxAria {
  let checkbox = useGridSelectionCheckbox({
    grid: props.gridList.grid,
    key: props.key
  });

  let checkboxId = computed(() => {
    let normalizedKey = String(props.key).replace(/\s*/g, '');
    return `vue-gridlist-checkbox-${normalizedKey}`;
  });
  let checkboxProps = computed(() => ({
    ...checkbox.checkboxProps.value,
    id: checkboxId.value,
    'aria-labelledby': `${checkboxId.value} ${props.gridList.rowId(props.key)}`
  }));

  return {
    checkboxProps,
    toggleSelection: checkbox.toggleSelection
  };
}
