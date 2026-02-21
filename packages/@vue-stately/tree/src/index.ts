import {type Key, TreeCollection, type TreeNode} from './TreeCollection';
import {type TreeProps, type TreeState, useTreeState as useTreeStateInternal} from './useTreeState';

export {TreeCollection};
export type {Key, TreeNode, TreeProps, TreeState};

export function useTreeState<T extends object>(props: TreeProps<T>): TreeState<T>;
export function useTreeState<T>(props: TreeProps<T>): TreeState<T> {
  return useTreeStateInternal(props);
}
