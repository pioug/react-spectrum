import {type InvalidationContext, type Key, type VirtualizerCollection} from './types';
import {Layout} from './Layout';
import {Rect} from './Rect';
import {ref, type Ref, shallowRef, type ShallowRef} from 'vue';
import {ReusableView} from './ReusableView';
import {Size} from './Size';
import {Virtualizer} from './Virtualizer';

interface VirtualizerProps<T extends object, V, O> {
  collection: VirtualizerCollection<T>,
  layout: Layout<T, O>,
  layoutOptions?: O,
  onVisibleRectChange?: (rect: Rect) => void,
  persistedKeys?: Set<Key> | null,
  renderView: (type: string, content: T | null) => V
}

export interface VirtualizerState<T extends object, V> {
  contentSize: Readonly<ShallowRef<Size>>,
  endScrolling: () => void,
  isScrolling: Ref<boolean>,
  setVisibleRect: (rect: Rect) => void,
  startScrolling: () => void,
  virtualizer: Virtualizer<T, V>,
  visibleViews: Readonly<ShallowRef<ReusableView<T, V>[]>>
}

/**
 * Provides reactive virtualizer state around a Virtualizer instance.
 */
export function useVirtualizerState<T extends object, V, O = unknown>(
  options: VirtualizerProps<T, V, O>
): VirtualizerState<T, V> {
  let visibleRect = shallowRef(new Rect(0, 0, 0, 0));
  let isScrolling = ref(false);
  let invalidationContext = shallowRef<InvalidationContext<O>>({});
  let visibleViews = shallowRef<ReusableView<T, V>[]>([]);
  let contentSize = shallowRef(new Size());

  let virtualizer = new Virtualizer<T, V>({
    collection: options.collection,
    layout: options.layout,
    delegate: {
      setVisibleRect: (rect) => {
        visibleRect.value = rect;
      },
      renderView: options.renderView,
      invalidate: (context) => {
        invalidationContext.value = context as InvalidationContext<O>;
        render();
      }
    }
  });

  let render = (): void => {
    visibleViews.value = virtualizer.render<O>({
      collection: options.collection,
      invalidationContext: invalidationContext.value,
      isScrolling: isScrolling.value,
      layout: options.layout,
      layoutOptions: options.layoutOptions,
      persistedKeys: options.persistedKeys,
      visibleRect: visibleRect.value
    });
    contentSize.value = virtualizer.contentSize.copy();
  };

  let setVisibleRect = (rect: Rect): void => {
    visibleRect.value = rect;
    render();
    options.onVisibleRectChange?.(rect);
  };

  let startScrolling = (): void => {
    if (isScrolling.value) {
      return;
    }

    isScrolling.value = true;
    render();
  };

  let endScrolling = (): void => {
    if (!isScrolling.value) {
      return;
    }

    isScrolling.value = false;
    render();
  };

  render();

  return {
    virtualizer,
    visibleViews,
    setVisibleRect,
    contentSize,
    isScrolling,
    startScrolling,
    endScrolling
  };
}
