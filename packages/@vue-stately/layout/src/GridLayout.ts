import type {LayoutNode} from './types';
import {ListLayout, type ListLayoutOptions} from './ListLayout';

export interface GridLayoutOptions extends ListLayoutOptions {
  maxColumns?: number,
  minColumnWidth?: number
}

export class GridLayout<T extends LayoutNode = LayoutNode> extends ListLayout<T> {
  protected gridOptions: Required<GridLayoutOptions>;

  constructor(options: GridLayoutOptions = {}) {
    super(options);
    this.gridOptions = {
      ...this.options,
      maxColumns: options.maxColumns ?? Number.POSITIVE_INFINITY,
      minColumnWidth: options.minColumnWidth ?? 200
    };
  }

  override update(items: T[], width = 0): void {
    this.infos.clear();

    let gap = this.gridOptions.gap;
    let usableWidth = Math.max(width - this.gridOptions.padding * 2, 0);
    let columns = Math.max(1, Math.min(
      this.gridOptions.maxColumns,
      Math.floor((usableWidth + gap) / (this.gridOptions.minColumnWidth + gap)) || 1
    ));

    let columnWidth = columns === 0
      ? usableWidth
      : Math.max((usableWidth - gap * (columns - 1)) / columns, 0);

    let y = this.gridOptions.padding;
    let rowHeight = this.gridOptions.rowHeight || this.gridOptions.estimatedRowHeight;

    items.forEach((item, index) => {
      let row = Math.floor(index / columns);
      let column = index % columns;
      let x = this.gridOptions.padding + column * (columnWidth + gap);
      let rect = {
        x,
        y: y + row * (rowHeight + gap),
        width: columnWidth,
        height: rowHeight
      };

      this.infos.set(item.key, {
        key: item.key,
        type: item.type ?? 'item',
        rect,
        estimatedSize: false
      });

      item.index = index;
    });

    let rows = Math.ceil(items.length / columns);
    this.contentSize = {
      width,
      height: this.gridOptions.padding * 2 + Math.max(0, rows * rowHeight + Math.max(rows - 1, 0) * gap)
    };
  }
}
