import {
  BaseCollection,
  CollectionNode,
  FilterableNode,
  HeaderNode,
  ItemNode,
  LoaderNode,
  SectionNode
} from './BaseCollection';
import {type CachedChild, type CachedChildrenOptions, useCachedChildren as useCachedChildrenInternal} from './useCachedChildren';
import {
  Collection,
  CollectionBuilder,
  type CollectionBuilderProps,
  type CollectionProps,
  createBranchComponent as createBranchComponentInternal,
  createLeafComponent as createLeafComponentInternal
} from './CollectionBuilder';
import {createHideableComponent as createHideableComponentInternal, useIsHidden as useIsHiddenInternal} from './Hidden';

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
namespace React {
  export type Ref<T> = ForwardedRef<T>;
  export type RefAttributes<T> = {
    ref?: Ref<T>
  };
}

type Node<T> = {
  children?: unknown,
  props?: unknown,
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
  collectionNodeClass: CollectionNodeClass<any> | string,
  render: (props: P, ref: ForwardedRef<E>) => ReactElement | null
): (props: P & React.RefAttributes<E>) => ReactElement | null;
export function createLeafComponent<T extends object, P extends object, E extends Element>(
  collectionNodeClass: CollectionNodeClass<any> | string,
  render: (props: P, ref: ForwardedRef<E>, node: Node<T>) => ReactElement | null
): (props: P & React.RefAttributes<E>) => ReactElement | null;
export function createLeafComponent(
  collectionNodeClassOrRender: unknown,
  render?: unknown
): unknown {
  if (typeof collectionNodeClassOrRender === 'function' && render == null) {
    return createLeafComponentInternal(collectionNodeClassOrRender as (item: unknown, index: number) => unknown);
  }

  return (props: unknown) => (render as (props: unknown, ref: ForwardedRef<Element>, node: Node<unknown>) => unknown)?.(
    props,
    {current: null},
    {props}
  );
}

export function createBranchComponent<T extends object, P extends {children?: any}, E extends Element>(
  collectionNodeClass: CollectionNodeClass<any> | string,
  render: (props: P, ref: ForwardedRef<E>, node: Node<T>) => ReactElement | null,
  useChildren: (props: P) => ReactNode
): (props: P & React.RefAttributes<E>) => ReactElement | null;
export function createBranchComponent(
  collectionNodeClassOrRender: unknown,
  render?: unknown,
  useChildren?: unknown
): unknown {
  if (typeof collectionNodeClassOrRender === 'function' && render == null) {
    return createBranchComponentInternal(collectionNodeClassOrRender as (item: unknown, index: number, children: unknown[]) => unknown);
  }

  return (props: unknown) => {
    let children = typeof useChildren === 'function' ? (useChildren as (props: unknown) => unknown)(props) : undefined;
    return (render as (props: unknown, ref: ForwardedRef<Element>, node: Node<unknown>) => unknown)?.(
      props,
      {current: null},
      {
        children,
        props
      }
    );
  };
}

export function createHideableComponent<T, P = {}>(
  component: (props: P, ref: React.Ref<T>) => ReactElement | null
): (props: P & React.RefAttributes<T>) => ReactElement | null;
export function createHideableComponent(component: (props: unknown, ref: React.Ref<unknown>) => ReactElement | null): (props: unknown) => ReactElement | null {
  return createHideableComponentInternal(component as (props: unknown, isHidden: Computedboolean) => ReactElement | null) as (
    props: unknown
  ) => ReactElement | null;
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
