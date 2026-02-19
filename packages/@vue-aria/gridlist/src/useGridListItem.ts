import {computed, type ComputedRef, unref} from 'vue';
import {type GridCellAria, type GridRowAria, useGridCell, useGridRow} from '@vue-aria/grid';
import {type GridListAria} from './useGridList';
import {type GridListItemNode, type MaybeRef} from './types';

export interface AriaGridListItemOptions {
  gridList: GridListAria,
  isVirtualized?: MaybeRef<boolean>,
  item: MaybeRef<GridListItemNode>,
  shouldSelectOnPressUp?: MaybeRef<boolean>
}

export interface GridListItemAria {
  descriptionProps: ComputedRef<{
    id: string
  }>,
  gridCellProps: GridCellAria['gridCellProps'],
  isDisabled: GridRowAria['isDisabled'],
  isPressed: GridRowAria['isPressed'],
  isSelected: GridRowAria['isSelected'],
  press: () => void,
  rowProps: ComputedRef<{
    'aria-disabled'?: true,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-rowindex'?: number,
    'aria-selected'?: boolean,
    id: string,
    role: 'row'
  }>
}

export function useGridListItem(options: AriaGridListItemOptions): GridListItemAria {
  let item = computed(() => unref(options.item));
  let row = computed(() => ({
    key: item.value.key,
    index: item.value.index,
    textValue: item.value.textValue,
    cells: [
      {
        key: `${item.value.key}-cell`,
        colIndex: 0,
        textValue: item.value.textValue
      }
    ]
  }));

  let rowAria = useGridRow({
    grid: options.gridList.grid,
    isDisabled: computed(() => Boolean(item.value.isDisabled)),
    isVirtualized: options.isVirtualized,
    row,
    shouldSelectOnPressUp: computed(() => {
      return Boolean(unref(options.shouldSelectOnPressUp) || options.gridList.shouldSelectOnPressUp.value);
    })
  });

  let cellAria = useGridCell({
    cell: computed(() => row.value.cells[0]),
    grid: options.gridList.grid,
    isVirtualized: options.isVirtualized,
    row
  });

  let descriptionId = computed(() => {
    let normalizedKey = String(item.value.key).replace(/\s*/g, '');
    return `vue-gridlist-description-${normalizedKey}`;
  });
  let rowProps = computed(() => ({
    ...rowAria.rowProps.value,
    id: options.gridList.rowId(item.value.key),
    'aria-label': item.value.textValue,
    'aria-labelledby': item.value.description ? `${options.gridList.rowId(item.value.key)} ${descriptionId.value}` : undefined
  }));

  let descriptionProps = computed(() => ({
    id: descriptionId.value
  }));

  return {
    descriptionProps,
    gridCellProps: cellAria.gridCellProps,
    isDisabled: rowAria.isDisabled,
    isPressed: rowAria.isPressed,
    isSelected: rowAria.isSelected,
    press: rowAria.press,
    rowProps
  };
}
