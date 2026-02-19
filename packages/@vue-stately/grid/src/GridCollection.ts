export type Key = string | number;

export interface GridNode<T> {
  childNodes: GridNode<T>[],
  colIndex?: number,
  colSpan?: number,
  hasChildNodes: boolean,
  index: number,
  key: Key,
  level: number,
  nextKey?: Key | null,
  parentKey?: Key | null,
  prevKey?: Key | null,
  textValue: string,
  type: 'cell' | 'row',
  value: T | null
}

export interface GridCell<T> {
  colSpan?: number,
  index?: number,
  key?: Key,
  textValue?: string,
  value?: T
}

export interface GridRow<T> {
  childNodes: GridCell<T>[],
  index?: number,
  key?: Key,
  textValue?: string,
  value?: T
}

interface GridCollectionOptions<T> {
  columnCount: number,
  items: GridRow<T>[],
  visitNode?: (node: GridNode<T>) => GridNode<T>
}

export class GridCollection<T> {
  keyMap: Map<Key, GridNode<T>> = new Map();
  columnCount: number;
  rows: GridNode<T>[];

  constructor(options: GridCollectionOptions<T>) {
    this.keyMap = new Map();
    this.columnCount = options.columnCount;
    this.rows = [];

    let visit = (node: GridNode<T>): void => {
      let nextNode = options.visitNode ? options.visitNode(node) : node;
      this.keyMap.set(nextNode.key, nextNode);

      let lastChild: GridNode<T> | null = null;
      for (let child of nextNode.childNodes) {
        if (lastChild) {
          lastChild.nextKey = child.key;
          child.prevKey = lastChild.key;
        } else {
          child.prevKey = null;
        }

        child.parentKey = nextNode.key;
        visit(child);
        lastChild = child;
      }

      if (lastChild) {
        lastChild.nextKey = null;
      }
    };

    let lastRow: GridNode<T> | null = null;
    for (let [rowIndex, item] of options.items.entries()) {
      let rowKey = item.key ?? `row-${rowIndex}`;
      let cells = item.childNodes.map((cell, cellIndex) => {
        return {
          key: cell.key ?? `${rowKey}-cell-${cellIndex}`,
          type: 'cell' as const,
          level: 1,
          index: cell.index ?? cellIndex,
          value: cell.value ?? null,
          textValue: cell.textValue ?? '',
          hasChildNodes: false,
          childNodes: [],
          colSpan: cell.colSpan,
          colIndex: cellIndex
        };
      });

      let rowNode: GridNode<T> = {
        key: rowKey,
        type: 'row',
        level: 0,
        index: item.index ?? rowIndex,
        value: item.value ?? null,
        textValue: item.textValue ?? '',
        hasChildNodes: true,
        childNodes: cells
      };

      if (lastRow) {
        lastRow.nextKey = rowNode.key;
        rowNode.prevKey = lastRow.key;
      } else {
        rowNode.prevKey = null;
      }

      this.rows.push(rowNode);
      visit(rowNode);
      lastRow = rowNode;
    }

    if (lastRow) {
      lastRow.nextKey = null;
    }
  }

  *[Symbol.iterator](): IterableIterator<GridNode<T>> {
    yield* this.rows;
  }

  get size(): number {
    return this.rows.length;
  }

  getKeys(): IterableIterator<Key> {
    return this.keyMap.keys();
  }

  getKeyBefore(key: Key): Key | null {
    let node = this.keyMap.get(key);
    return node?.prevKey ?? null;
  }

  getKeyAfter(key: Key): Key | null {
    let node = this.keyMap.get(key);
    return node?.nextKey ?? null;
  }

  getFirstKey(): Key | null {
    return this.rows[0]?.key ?? null;
  }

  getLastKey(): Key | null {
    return this.rows[this.rows.length - 1]?.key ?? null;
  }

  getItem(key: Key): GridNode<T> | null {
    return this.keyMap.get(key) ?? null;
  }

  at(index: number): GridNode<T> | null {
    let keys = Array.from(this.getKeys());
    return this.getItem(keys[index]);
  }

  getChildren(key: Key): Iterable<GridNode<T>> {
    let node = this.getItem(key);
    return node?.childNodes ?? [];
  }
}
