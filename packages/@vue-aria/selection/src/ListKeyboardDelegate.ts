import type {KeyboardDelegate, SelectionItem, SelectionKey} from './types';

interface ListKeyboardDelegateOptions {
  items: SelectionItem[]
}

function normalizeKey(key: SelectionKey): string {
  return String(key);
}

export class ListKeyboardDelegate implements KeyboardDelegate {
  private readonly items: SelectionItem[];

  constructor(items: SelectionItem[]);
  constructor(options: ListKeyboardDelegateOptions);
  constructor(itemsOrOptions: ListKeyboardDelegateOptions | SelectionItem[]) {
    this.items = Array.isArray(itemsOrOptions) ? itemsOrOptions : itemsOrOptions.items;
  }

  private isItemDisabled(item: SelectionItem | undefined): boolean {
    return item == null || Boolean(item.disabled);
  }

  private findIndex(key: SelectionKey): number {
    return this.items.findIndex((item) => normalizeKey(item.key) === normalizeKey(key));
  }

  private findFromIndex(index: number, direction: 1 | -1): SelectionKey | null {
    if (this.items.length === 0) {
      return null;
    }

    let currentIndex = index;
    for (let count = 0; count < this.items.length; count += 1) {
      currentIndex = (currentIndex + direction + this.items.length) % this.items.length;
      let item = this.items[currentIndex];
      if (!this.isItemDisabled(item)) {
        return item.key;
      }
    }

    return null;
  }

  getFirstKey(): SelectionKey | null {
    return this.findFromIndex(-1, 1);
  }

  getLastKey(): SelectionKey | null {
    return this.findFromIndex(0, -1);
  }

  getKeyAbove(key: SelectionKey): SelectionKey | null {
    let index = this.findIndex(key);
    if (index === -1) {
      return this.getLastKey();
    }

    return this.findFromIndex(index, -1);
  }

  getKeyBelow(key: SelectionKey): SelectionKey | null {
    let index = this.findIndex(key);
    if (index === -1) {
      return this.getFirstKey();
    }

    return this.findFromIndex(index, 1);
  }

  getKeyForSearch(search: string, fromKey?: SelectionKey | null): SelectionKey | null {
    if (this.items.length === 0 || search.length === 0) {
      return null;
    }

    let normalizedSearch = search.toLocaleLowerCase();
    let startIndex = fromKey == null ? -1 : this.findIndex(fromKey);
    for (let count = 0; count < this.items.length; count += 1) {
      let index = (startIndex + count + 1 + this.items.length) % this.items.length;
      let item = this.items[index];
      if (!item || this.isItemDisabled(item)) {
        continue;
      }

      if (item.textValue.toLocaleLowerCase().startsWith(normalizedSearch)) {
        return item.key;
      }
    }

    return null;
  }
}
