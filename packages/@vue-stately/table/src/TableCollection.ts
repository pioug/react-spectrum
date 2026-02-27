import {GridCollection, type GridNode, type GridRow, type Key} from '@vue-stately/grid';

export interface TableColumn {
  key: Key,
  title?: string
}

export interface TableCell<T> {
  colSpan?: number,
  key?: Key,
  textValue?: string,
  value?: T
}

export interface TableRow<T> {
  cells: TableCell<T>[],
  key?: Key,
  textValue?: string,
  value?: T
}

export interface TableCollectionOptions<T> {
  columns: TableColumn[],
  rows: TableRow<T>[]
}

interface NormalizedTableRow<T> extends TableRow<T> {
  cells: Array<TableCell<T> & {key: Key}>,
  key: Key
}

function normalizeRows<T>(rows: TableRow<T>[]): NormalizedTableRow<T>[] {
  return rows.map((row, rowIndex) => {
    let rowKey = row.key ?? `row-${rowIndex}`;
    let cells = row.cells.map((cell, columnIndex) => ({
      ...cell,
      key: cell.key ?? `${rowKey}-cell-${columnIndex}`
    }));

    return {
      ...row,
      key: rowKey,
      cells
    };
  });
}

function toGridRows<T>(rows: NormalizedTableRow<T>[]): GridRow<T>[] {
  return rows.map((row) => ({
    key: row.key,
    textValue: row.textValue,
    value: row.value,
    childNodes: row.cells.map((cell) => ({
      key: cell.key,
      textValue: cell.textValue,
      value: cell.value,
      colSpan: cell.colSpan
    }))
  }));
}

export function buildHeaderRows<T>(columns: TableColumn[]): TableRow<T>[] {
  if (columns.length === 0) {
    return [];
  }

  return [{
    key: 'header-row-0',
    cells: columns.map((column, index) => ({
      key: column.key ?? `column-${index}`,
      textValue: column.title ?? String(column.key)
    }))
  }];
}

/**
 * Table collection baseline with row/cell nodes and optional text filtering.
 */
export class TableCollection<T> extends GridCollection<T> {
  columns: TableColumn[];
  private normalizedRows: NormalizedTableRow<T>[];

  constructor(options: TableCollectionOptions<T>) {
    let normalizedRows = normalizeRows(options.rows);
    super({
      columnCount: options.columns.length,
      items: toGridRows(normalizedRows)
    });

    this.columns = options.columns;
    this.normalizedRows = normalizedRows;
  }

  filter(filterFn: (nodeValue: string, node: GridNode<T>) => boolean): TableCollection<T> {
    let filteredRows = this.normalizedRows.filter((row) => {
      let node = this.getItem(row.key);
      return node != null && filterFn(row.textValue ?? '', node);
    });

    return new TableCollection({
      columns: this.columns,
      rows: filteredRows
    });
  }
}
