import {type GridCollection, type GridKey, type GridRowNode} from './types';

export interface GridKeyboardDelegateOptions {
  collection: GridCollection,
  direction?: 'ltr' | 'rtl',
  focusMode?: 'cell' | 'row'
}

interface CellLocation {
  cellIndex: number,
  row: GridRowNode,
  rowIndex: number
}

export class GridKeyboardDelegate {
  collection: GridCollection;
  direction: 'ltr' | 'rtl';
  focusMode: 'cell' | 'row';

  constructor(options: GridKeyboardDelegateOptions) {
    this.collection = options.collection;
    this.direction = options.direction ?? 'ltr';
    this.focusMode = options.focusMode ?? 'row';
  }

  private getRowByKey(key: GridKey): GridRowNode | null {
    return this.collection.rows.find((row) => row.key === key) ?? null;
  }

  private getCellLocation(key: GridKey): CellLocation | null {
    for (let rowIndex = 0; rowIndex < this.collection.rows.length; rowIndex++) {
      let row = this.collection.rows[rowIndex];
      for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
        if (row.cells[cellIndex].key === key) {
          return {
            row,
            rowIndex,
            cellIndex
          };
        }
      }
    }

    return null;
  }

  private getCellKeyAt(row: GridRowNode, cellIndex: number): GridKey | null {
    if (cellIndex < 0 || cellIndex >= row.cells.length) {
      return null;
    }

    return row.cells[cellIndex].key;
  }

  getFirstKey(): GridKey | null {
    let firstRow = this.collection.rows[0];
    if (!firstRow) {
      return null;
    }

    if (this.focusMode === 'row') {
      return firstRow.key;
    }

    return firstRow.cells[0]?.key ?? null;
  }

  getKeyAbove(key: GridKey): GridKey | null {
    let row = this.getRowByKey(key);
    if (row) {
      let rowAbove = this.collection.rows[row.index - 1];
      return rowAbove?.key ?? null;
    }

    let location = this.getCellLocation(key);
    if (!location) {
      return null;
    }

    let rowAbove = this.collection.rows[location.rowIndex - 1];
    if (!rowAbove) {
      return null;
    }

    if (this.focusMode === 'row') {
      return rowAbove.key;
    }

    return this.getCellKeyAt(rowAbove, location.cellIndex);
  }

  getKeyBelow(key: GridKey): GridKey | null {
    let row = this.getRowByKey(key);
    if (row) {
      let rowBelow = this.collection.rows[row.index + 1];
      return rowBelow?.key ?? null;
    }

    let location = this.getCellLocation(key);
    if (!location) {
      return null;
    }

    let rowBelow = this.collection.rows[location.rowIndex + 1];
    if (!rowBelow) {
      return null;
    }

    if (this.focusMode === 'row') {
      return rowBelow.key;
    }

    return this.getCellKeyAt(rowBelow, location.cellIndex);
  }

  getKeyForSearch(search: string, fromKey?: GridKey): GridKey | null {
    let normalizedSearch = search.trim().toLowerCase();
    if (normalizedSearch.length === 0) {
      return null;
    }

    let orderedKeys: GridKey[] = [];
    for (let row of this.collection.rows) {
      if (this.focusMode === 'row') {
        orderedKeys.push(row.key);
      } else {
        orderedKeys.push(...row.cells.map((cell) => cell.key));
      }
    }

    if (orderedKeys.length === 0) {
      return null;
    }

    let startIndex = fromKey ? orderedKeys.indexOf(fromKey) + 1 : 0;
    if (startIndex < 0 || startIndex >= orderedKeys.length) {
      startIndex = 0;
    }

    for (let offset = 0; offset < orderedKeys.length; offset++) {
      let key = orderedKeys[(startIndex + offset) % orderedKeys.length];
      let row = this.getRowByKey(key);
      let text = row?.textValue;
      if (!text) {
        let location = this.getCellLocation(key);
        text = location ? location.row.cells[location.cellIndex].textValue : undefined;
      }

      if (text?.toLowerCase().startsWith(normalizedSearch)) {
        return key;
      }
    }

    return null;
  }

  getKeyLeftOf(key: GridKey): GridKey | null {
    let row = this.getRowByKey(key);
    if (row) {
      return this.direction === 'rtl'
        ? row.cells[0]?.key ?? null
        : row.cells[row.cells.length - 1]?.key ?? null;
    }

    let location = this.getCellLocation(key);
    if (!location) {
      return null;
    }

    let delta = this.direction === 'rtl' ? 1 : -1;
    let cellKey = this.getCellKeyAt(location.row, location.cellIndex + delta);
    if (cellKey) {
      return cellKey;
    }

    if (this.focusMode === 'row') {
      return location.row.key;
    }

    return this.direction === 'rtl'
      ? location.row.cells[0]?.key ?? null
      : location.row.cells[location.row.cells.length - 1]?.key ?? null;
  }

  getKeyRightOf(key: GridKey): GridKey | null {
    let row = this.getRowByKey(key);
    if (row) {
      return this.direction === 'rtl'
        ? row.cells[row.cells.length - 1]?.key ?? null
        : row.cells[0]?.key ?? null;
    }

    let location = this.getCellLocation(key);
    if (!location) {
      return null;
    }

    let delta = this.direction === 'rtl' ? -1 : 1;
    let cellKey = this.getCellKeyAt(location.row, location.cellIndex + delta);
    if (cellKey) {
      return cellKey;
    }

    if (this.focusMode === 'row') {
      return location.row.key;
    }

    return this.direction === 'rtl'
      ? location.row.cells[location.row.cells.length - 1]?.key ?? null
      : location.row.cells[0]?.key ?? null;
  }

  getLastKey(): GridKey | null {
    let lastRow = this.collection.rows[this.collection.rows.length - 1];
    if (!lastRow) {
      return null;
    }

    if (this.focusMode === 'row') {
      return lastRow.key;
    }

    return lastRow.cells[lastRow.cells.length - 1]?.key ?? null;
  }
}
