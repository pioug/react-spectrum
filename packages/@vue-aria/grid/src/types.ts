import type {ComputedRef, Ref} from 'vue';

export type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type GridKey = string;
export type GridSelectionBehavior = 'replace' | 'toggle';
export type GridSelectionMode = 'multiple' | 'none' | 'single';

export interface GridCellNode {
  colIndex?: number,
  colSpan?: number,
  key: GridKey,
  textValue?: string
}

export interface GridRowNode {
  cells: GridCellNode[],
  index: number,
  key: GridKey,
  textValue?: string
}

export interface GridCollection {
  columnCount?: number,
  rows: GridRowNode[]
}
