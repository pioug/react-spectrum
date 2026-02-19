# @vue-stately/virtualizer

Vue state baseline for virtualizer geometry primitives, layout info, and virtualized view state management.

## Exports

* `Layout`
* `LayoutInfo`
* `Point`
* `Rect`
* `ReusableView`
* `Size`
* `Virtualizer`
* `useVirtualizerState`

## Usage

```ts
import {
  Layout,
  LayoutInfo,
  Rect,
  Size,
  useVirtualizerState
} from '@vue-stately/virtualizer';

class FixedLayout extends Layout<{id: string}> {
  getVisibleLayoutInfos(rect: Rect): LayoutInfo[] {
    return [new LayoutInfo('item', 'a', new Rect(0, 0, 100, 32))]
      .filter((info) => info.rect.intersects(rect));
  }
  getLayoutInfo(): LayoutInfo | null {
    return new LayoutInfo('item', 'a', new Rect(0, 0, 100, 32));
  }
  getContentSize(): Size {
    return new Size(100, 32);
  }
}

let state = useVirtualizerState({
  collection: {getItem: () => ({id: 'a'})},
  layout: new FixedLayout(),
  renderView: (_type, content) => content?.id ?? ''
});
```

## Known limitations

* API parity with `@react-stately/virtualizer` is not complete yet.
* Layout/view reuse and overscan behavior are intentionally simplified in this baseline implementation.
