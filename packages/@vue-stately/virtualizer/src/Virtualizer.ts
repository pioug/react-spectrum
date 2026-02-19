import {type InvalidationContext, type Key, type VirtualizerCollection, type VirtualizerDelegate, type VirtualizerRenderOptions} from './types';
import {Layout} from './Layout';
import {LayoutInfo} from './LayoutInfo';
import {Point} from './Point';
import {Rect} from './Rect';
import {ReusableView} from './ReusableView';
import {Size} from './Size';

interface VirtualizerOptions<T extends object, V> {
  collection: VirtualizerCollection<T>,
  delegate: VirtualizerDelegate<T, V>,
  layout: Layout<T>
}

/**
 * Lightweight virtualizer that maps layout infos to reusable rendered views.
 */
export class Virtualizer<T extends object, V> {
  delegate: VirtualizerDelegate<T, V>;
  collection: VirtualizerCollection<T>;
  layout: Layout<T>;
  contentSize: Size;
  visibleRect: Rect;
  persistedKeys: Set<Key>;

  private visibleViews: Map<Key, ReusableView<T, V>>;

  constructor(options: VirtualizerOptions<T, V>) {
    this.delegate = options.delegate;
    this.collection = options.collection;
    this.layout = options.layout;
    this.layout.virtualizer = this;
    this.contentSize = new Size();
    this.visibleRect = new Rect();
    this.persistedKeys = new Set();
    this.visibleViews = new Map();
  }

  private applyLayoutInfo(view: ReusableView<T, V>, layoutInfo: LayoutInfo): void {
    view.layoutInfo = layoutInfo;
    let content = (layoutInfo.content as T | null) ?? this.collection.getItem(layoutInfo.key) ?? null;
    view.content = content;
    view.rendered = this.delegate.renderView(layoutInfo.type, content);
  }

  private getVisibleLayoutInfos(): LayoutInfo[] {
    return this.layout.getVisibleLayoutInfos(this.visibleRect);
  }

  keyAtPoint(point: Point): Key | null {
    let pointRect = new Rect(point.x, point.y, 1, 1);
    for (let layoutInfo of this.getVisibleLayoutInfos()) {
      if (layoutInfo.rect.intersects(pointRect)) {
        return layoutInfo.key;
      }
    }

    return null;
  }

  render<O = unknown>(options: VirtualizerRenderOptions<T, O>): ReusableView<T, V>[] {
    if (this.layout !== options.layout || this.layout.virtualizer !== this) {
      this.layout.virtualizer = null;
      this.layout = options.layout as unknown as Layout<T>;
      this.layout.virtualizer = this;
    }

    this.collection = options.collection;
    this.visibleRect = options.visibleRect;
    this.persistedKeys = options.persistedKeys ? new Set(options.persistedKeys) : new Set();

    this.layout.update(options.invalidationContext as InvalidationContext);
    this.contentSize = this.layout.getContentSize();

    let nextViews = new Map<Key, ReusableView<T, V>>();
    for (let layoutInfo of this.getVisibleLayoutInfos()) {
      let view = this.visibleViews.get(layoutInfo.key) ?? new ReusableView<T, V>(this, layoutInfo.type);
      this.applyLayoutInfo(view, layoutInfo);
      nextViews.set(layoutInfo.key, view);
    }

    for (let key of this.persistedKeys) {
      if (nextViews.has(key)) {
        continue;
      }

      let persistedInfo = this.layout.getLayoutInfo(key);
      if (!persistedInfo) {
        continue;
      }

      let view = this.visibleViews.get(key) ?? new ReusableView<T, V>(this, persistedInfo.type);
      this.applyLayoutInfo(view, persistedInfo);
      nextViews.set(key, view);
    }

    for (let [key, view] of this.visibleViews) {
      if (!nextViews.has(key)) {
        view.prepareForReuse();
      }
    }

    this.visibleViews = nextViews;
    return Array.from(nextViews.values());
  }

  getVisibleView(key: Key): ReusableView<T, V> | undefined {
    return this.visibleViews.get(key);
  }

  invalidate(context: InvalidationContext): void {
    this.delegate.invalidate(context);
  }

  updateItemSize(key: Key, size: Size): void {
    if (!this.layout.updateItemSize) {
      return;
    }

    if (this.layout.updateItemSize(key, size)) {
      this.invalidate({itemSizeChanged: true});
    }
  }
}
