import {GridCollection, type GridCell, type GridNode, type GridRow, type Key} from './GridCollection';
import {
  useGridState as useGridStateInternal,
  type GridState,
  type GridStateOptions as VueGridStateOptions,
  type SelectionManager
} from './useGridState';

export type GridStateOptions<T extends object, C extends GridCollection<T>> = VueGridStateOptions<T, C>;
export {GridCollection};
export type {GridCell, GridNode, GridRow, Key, GridState, SelectionManager};

export function useGridState<T extends object, C extends GridCollection<T>>(props: GridStateOptions<T, C>): GridState<T, C>;
export function useGridState<T extends object, C extends GridCollection<T>>(options: VueGridStateOptions<T, C>): GridState<T, C> {
  return useGridStateInternal(options);
}
