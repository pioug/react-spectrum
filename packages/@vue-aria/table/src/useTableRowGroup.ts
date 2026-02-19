import {type GridRowGroupAria, useGridRowGroup} from '@vue-aria/grid';

export interface TableRowGroupAria extends GridRowGroupAria {}

export function useTableRowGroup(): TableRowGroupAria {
  return useGridRowGroup();
}
