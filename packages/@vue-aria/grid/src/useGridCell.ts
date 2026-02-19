import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import {type GridAria} from './useGrid';
import {type GridCellNode, type GridRowNode, type MaybeRef} from './types';

export interface GridCellProps {
  cell: MaybeRef<GridCellNode>,
  colSpan?: MaybeRef<number | undefined>,
  focusMode?: MaybeRef<'cell' | 'child'>,
  grid: GridAria,
  isVirtualized?: MaybeRef<boolean>,
  onAction?: () => void,
  row: MaybeRef<GridRowNode>,
  shouldSelectOnPressUp?: MaybeRef<boolean>
}

export interface GridCellAria {
  focus: () => void,
  gridCellProps: ComputedRef<{
    'aria-colindex': number,
    'aria-colspan'?: number,
    colSpan?: number,
    role: 'gridcell',
    tabindex: -1 | 0
  }>,
  isPressed: Ref<boolean>,
  press: () => void
}

export function useGridCell(props: GridCellProps): GridCellAria {
  let isPressed = ref(false);
  let row = computed(() => unref(props.row));
  let cell = computed(() => unref(props.cell));

  let resolvedColSpan = computed(() => {
    return unref(props.colSpan) ?? cell.value.colSpan;
  });

  let resolvedColIndex = computed(() => {
    let fromCell = cell.value.colIndex;
    if (typeof fromCell === 'number') {
      return fromCell;
    }

    return row.value.cells.findIndex((entry) => entry.key === cell.value.key);
  });

  let focus = () => {
    props.grid.setFocused(true);
    props.grid.setFocusedKey(cell.value.key);
  };

  let press = () => {
    isPressed.value = true;

    if (!unref(props.shouldSelectOnPressUp)) {
      props.grid.toggleSelection(row.value.key);
    }

    props.grid.triggerCellAction(cell.value.key);
    props.onAction?.();
    focus();

    if (unref(props.shouldSelectOnPressUp)) {
      props.grid.toggleSelection(row.value.key);
    }

    isPressed.value = false;
  };

  let gridCellProps = computed(() => ({
    role: 'gridcell' as const,
    tabindex: props.grid.focusedKey.value === cell.value.key ? 0 as const : -1 as const,
    'aria-colspan': resolvedColSpan.value,
    'aria-colindex': resolvedColIndex.value + 1,
    colSpan: unref(props.isVirtualized) ? undefined : resolvedColSpan.value
  }));

  return {
    focus,
    gridCellProps,
    isPressed,
    press
  };
}
