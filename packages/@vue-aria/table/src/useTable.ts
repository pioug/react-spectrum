import {type AriaGridOptions, type GridAria, useGrid} from '@vue-aria/grid';

export interface AriaTableOptions extends AriaGridOptions {}

export function useTable(options: AriaTableOptions): GridAria {
  return useGrid(options);
}
