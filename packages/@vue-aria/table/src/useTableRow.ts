import {type GridRowAria, type GridRowProps, useGridRow} from '@vue-aria/grid';

export interface AriaTableRowProps extends GridRowProps {}
export interface TableRowAria extends GridRowAria {}

export function useTableRow(props: AriaTableRowProps): TableRowAria {
  return useGridRow(props);
}
