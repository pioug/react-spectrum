import type {LayoutNode} from './types';
import {ListLayout, type ListLayoutOptions} from './ListLayout';

export interface TableLayoutProps extends ListLayoutOptions {
  columnWidths?: Map<string | number, number>
}

export class TableLayout<T extends LayoutNode = LayoutNode> extends ListLayout<T> {
  private tableOptions: TableLayoutProps;

  constructor(options: TableLayoutProps = {}) {
    super(options);
    this.tableOptions = options;
  }

  getColumnWidth(key: string | number, fallbackWidth: number): number {
    return this.tableOptions.columnWidths?.get(key) ?? fallbackWidth;
  }
}
