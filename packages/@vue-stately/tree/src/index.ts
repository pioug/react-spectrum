import {TreeCollection, type Key, type TreeNode} from './TreeCollection';
import {useTreeState as useTreeStateInternal, type TreeProps, type TreeState} from './useTreeState';

export {TreeCollection};
export type {Key, TreeNode, TreeProps, TreeState};

export function useTreeState<T extends object>(props: TreeProps<T>): TreeState<T>;
export function useTreeState<T>(props: TreeProps<T>): TreeState<T> {
  return useTreeStateInternal(props);
}
