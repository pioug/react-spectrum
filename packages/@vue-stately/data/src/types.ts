export type Key = string | number;

export type Selection = 'all' | Set<Key>;

export type SelectionInput = 'all' | Iterable<Key>;

export type LoadingState = 'error' | 'filtering' | 'idle' | 'loading' | 'loadingMore' | 'sorting';

export interface SortDescriptor {
  column: Key,
  direction: 'ascending' | 'descending'
}
