import {calculateVisibleItemsForCollapse} from '@vue-spectrum/actiongroup';
import {describe, expect, it} from 'vitest';

describe('ActionGroup collapse visibility', () => {
  it('shows all items when there is enough room', () => {
    expect(calculateVisibleItemsForCollapse({
      containerSize: 200,
      itemSizes: [34, 34, 34],
      overflowTriggerSize: 34,
      selectionMode: 'none'
    })).toBe(3);
  });

  it('keeps one visible item for non-selection overflow mode', () => {
    expect(calculateVisibleItemsForCollapse({
      containerSize: 40,
      itemSizes: [34, 34, 34],
      overflowTriggerSize: 34,
      selectionMode: 'none'
    })).toBe(1);
  });

  it('keeps selection mode behavior unchanged when collapsing', () => {
    expect(calculateVisibleItemsForCollapse({
      containerSize: 40,
      itemSizes: [34, 34, 34],
      overflowTriggerSize: 34,
      selectionMode: 'single'
    })).toBe(0);
  });
});
