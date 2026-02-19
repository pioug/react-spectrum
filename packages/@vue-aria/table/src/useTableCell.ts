import {type GridCellAria, type GridCellProps, useGridCell} from '@vue-aria/grid';

export interface AriaTableCellProps extends GridCellProps {}
export interface TableCellAria extends GridCellAria {}

export function useTableCell(props: AriaTableCellProps): TableCellAria {
  return useGridCell(props);
}
