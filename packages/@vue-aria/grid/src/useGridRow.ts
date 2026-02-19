import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import {type GridAria} from './useGrid';
import {type GridRowNode, type MaybeRef} from './types';

export interface GridRowProps {
  grid: GridAria,
  isDisabled?: MaybeRef<boolean>,
  isVirtualized?: MaybeRef<boolean>,
  onAction?: () => void,
  row: MaybeRef<GridRowNode>,
  shouldSelectOnPressUp?: MaybeRef<boolean>
}

export interface GridRowAria {
  isDisabled: ComputedRef<boolean>,
  isPressed: Ref<boolean>,
  isSelected: ComputedRef<boolean>,
  press: () => void,
  rowProps: ComputedRef<{
    'aria-disabled'?: true,
    'aria-rowindex'?: number,
    'aria-selected'?: boolean,
    role: 'row'
  }>
}

export function useGridRow(props: GridRowProps): GridRowAria {
  let isPressed = ref(false);
  let row = computed(() => unref(props.row));

  let isDisabled = computed(() => {
    return Boolean(unref(props.isDisabled)) || !props.grid.canSelectItem(row.value.key);
  });

  let isSelected = computed(() => props.grid.isSelected(row.value.key));

  let press = () => {
    if (isDisabled.value) {
      return;
    }

    isPressed.value = true;
    if (!unref(props.shouldSelectOnPressUp)) {
      props.grid.toggleSelection(row.value.key);
    }

    props.grid.triggerRowAction(row.value.key);
    props.onAction?.();

    if (unref(props.shouldSelectOnPressUp)) {
      props.grid.toggleSelection(row.value.key);
    }

    isPressed.value = false;
  };

  let rowProps = computed(() => ({
    role: 'row' as const,
    'aria-selected': props.grid.selectionMode.value === 'none' ? undefined : isSelected.value,
    'aria-disabled': isDisabled.value ? true as const : undefined,
    'aria-rowindex': unref(props.isVirtualized) ? row.value.index + 1 : undefined
  }));

  return {
    isDisabled,
    isPressed,
    isSelected,
    press,
    rowProps
  };
}
