import {type InvalidationContext, type Key} from './types';
import {LayoutInfo} from './LayoutInfo';
import {Rect} from './Rect';
import {Size} from './Size';
import {Virtualizer} from './Virtualizer';

/**
 * Base layout class used by the virtualizer to map keys to visible layout info.
 */
export abstract class Layout<T extends object = Record<string, unknown>, O = unknown> {
  virtualizer: Virtualizer<T, unknown> | null = null;

  abstract getVisibleLayoutInfos(rect: Rect): LayoutInfo[];
  abstract getLayoutInfo(key: Key): LayoutInfo | null;
  abstract getContentSize(): Size;

  shouldInvalidate(newRect: Rect, oldRect: Rect): boolean {
    return newRect.width !== oldRect.width || newRect.height !== oldRect.height;
  }

  shouldInvalidateLayoutOptions(newOptions: O, oldOptions: O): boolean {
    return newOptions !== oldOptions;
  }

  update(invalidationContext: InvalidationContext<O>): void {
    void invalidationContext;
  }

  updateItemSize?(key: Key, size: Size): boolean;

  getItemRect(key: Key): Rect | null {
    return this.getLayoutInfo(key)?.rect ?? null;
  }

  getVisibleRect(): Rect {
    return this.virtualizer?.visibleRect ?? new Rect(0, 0, 0, 0);
  }
}
