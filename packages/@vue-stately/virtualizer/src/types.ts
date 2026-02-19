import {Layout} from './Layout';
import {Rect} from './Rect';

export type Key = string | number;

export interface InvalidationContext<O = unknown> {
  contentChanged?: boolean,
  itemSizeChanged?: boolean,
  layoutOptions?: O,
  layoutOptionsChanged?: boolean,
  offsetChanged?: boolean,
  sizeChanged?: boolean
}

export interface VirtualizerCollection<T extends object> {
  getItem: (key: Key) => T | null | undefined,
  getKeys?: () => Iterable<Key>
}

export interface VirtualizerDelegate<T extends object, V> {
  invalidate: (context: InvalidationContext) => void,
  renderView: (type: string, content: T | null) => V,
  setVisibleRect: (rect: Rect) => void
}

export interface VirtualizerRenderOptions<T extends object, O = unknown> {
  collection: VirtualizerCollection<T>,
  invalidationContext: InvalidationContext<O>,
  isScrolling: boolean,
  layout: Layout<T, O>,
  layoutOptions?: O,
  persistedKeys?: Set<Key> | null,
  visibleRect: Rect
}
