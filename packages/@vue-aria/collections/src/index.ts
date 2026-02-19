import {
  BaseCollection,
  CollectionNode,
  FilterableNode,
  HeaderNode,
  ItemNode,
  LoaderNode,
  SectionNode
} from './BaseCollection';
import {
  CollectionBuilder,
  Collection,
  createBranchComponent as createBranchComponentInternal,
  createLeafComponent as createLeafComponentInternal,
  type CollectionBuilderProps,
  type CollectionProps
} from './CollectionBuilder';
import {createHideableComponent as createHideableComponentInternal, useIsHidden as useIsHiddenInternal} from './Hidden';
import {useCachedChildren as useCachedChildrenInternal, type CachedChild, type CachedChildrenOptions} from './useCachedChildren';

type Computedboolean = {
  value: boolean
};

type CollectionNodeClass<T> = {
  new (...args: unknown[]): T
};

type ForwardedRef<T> = {
  current: T | null
};

type ReactElement = unknown;
type ReactNode = unknown;
type RefAttributes<T> = {
  ref?: ForwardedRef<T>
};

type Node<T> = {
  value?: T
};

export type {CollectionBuilderProps, CollectionProps, CachedChild, CachedChildrenOptions};
export {
  BaseCollection,
  CollectionNode,
  FilterableNode,
  HeaderNode,
  ItemNode,
  LoaderNode,
  SectionNode,
  CollectionBuilder,
  Collection
};

export function createLeafComponent<T extends object, P extends object, E extends Element>(
  collectionNodeClass: CollectionNodeClass<any> | null,
  render: (props: P, ref: ForwardedRef<E>) => ReactElement
): (props: P & RefAttributes<E>) => ReactElement;
export function createLeafComponent<T extends object, P extends object, E extends Element>(
  collectionNodeClass: CollectionNodeClass<any> | null,
  render: (props: P, ref: ForwardedRef<E>, node: Node<T>) => ReactElement
): (props: P & RefAttributes<E>) => ReactElement;
export function createLeafComponent<T, TComponent>(
  component: (item: T, index: number) => TComponent
): (item: T, index: number) => TComponent;
export function createLeafComponent(...args: unknown[]): unknown {
  if (args.length === 1 && typeof args[0] === 'function') {
    return createLeafComponentInternal(args[0] as (item: unknown, index: number) => unknown);
  }

  return (props: unknown) => (args[1] as (props: unknown, ref: ForwardedRef<Element>) => unknown)?.(props, {current: null});
}

export function createBranchComponent<T extends object, P extends {children?: any}, E extends Element>(
  collectionNodeClass: CollectionNodeClass<any> | null,
  useChildren: (props: P) => ReactNode,
  render: (props: P, ref: ForwardedRef<E>, node: Node<T>) => ReactElement
): (props: P & RefAttributes<E>) => ReactElement;
export function createBranchComponent<T, TComponent>(
  component: (item: T, index: number, children: TComponent[]) => TComponent
): (item: T, index: number, children: TComponent[]) => TComponent;
export function createBranchComponent(...args: unknown[]): unknown {
  if (args.length === 1 && typeof args[0] === 'function') {
    return createBranchComponentInternal(args[0] as (item: unknown, index: number, children: unknown[]) => unknown);
  }

  return (props: unknown) => (args[2] as (props: unknown, ref: ForwardedRef<Element>, node: Node<unknown>) => unknown)?.(props, {current: null}, {});
}

export function createHideableComponent<T, P = {}>(
  component: (props: P, ref: ForwardedRef<T>) => ReactElement
): (props: P & RefAttributes<T>) => ReactElement;
export function createHideableComponent<TProps, TResult>(
  component: (props: TProps, isHidden: Computedboolean) => TResult
): (props: TProps) => TResult;
export function createHideableComponent(component: (props: unknown, isHidden: Computedboolean) => unknown): (props: unknown) => unknown {
  return createHideableComponentInternal(component);
}

export function useIsHidden(): boolean;
export function useIsHidden(): Computedboolean;
export function useIsHidden(): Computedboolean {
  return useIsHiddenInternal() as unknown as Computedboolean;
}

export function useCachedChildren<T extends object>(options: CachedChildrenOptions<T>): ReactNode;
export function useCachedChildren<T extends object>(options: CachedChildrenOptions<T>): ReturnType<typeof useCachedChildrenInternal<T>>;
export function useCachedChildren<T extends object>(options: CachedChildrenOptions<T>): ReturnType<typeof useCachedChildrenInternal<T>> {
  return useCachedChildrenInternal(options);
}
