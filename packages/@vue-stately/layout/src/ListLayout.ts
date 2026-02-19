import type {Key, LayoutInfo, LayoutNode, Rect, Size} from './types';

export interface ListLayoutOptions {
  estimatedRowHeight?: number,
  gap?: number,
  headingHeight?: number,
  loaderHeight?: number,
  padding?: number,
  rowHeight?: number
}

const DEFAULT_ROW_HEIGHT = 48;

export class ListLayout<T extends LayoutNode = LayoutNode> {
  protected options: Required<ListLayoutOptions>;
  protected contentSize: Size;
  protected infos: Map<Key, LayoutInfo>;

  constructor(options: ListLayoutOptions = {}) {
    this.options = {
      rowHeight: options.rowHeight ?? DEFAULT_ROW_HEIGHT,
      estimatedRowHeight: options.estimatedRowHeight ?? DEFAULT_ROW_HEIGHT,
      headingHeight: options.headingHeight ?? DEFAULT_ROW_HEIGHT,
      loaderHeight: options.loaderHeight ?? DEFAULT_ROW_HEIGHT,
      gap: options.gap ?? 0,
      padding: options.padding ?? 0
    };
    this.infos = new Map();
    this.contentSize = {
      width: 0,
      height: 0
    };
  }

  update(items: T[], width = 0): void {
    this.infos.clear();

    let y = this.options.padding;
    for (let [index, item] of items.entries()) {
      let height = this.getNodeHeight(item);
      let rect = {
        x: this.options.padding,
        y,
        width: Math.max(0, width - this.options.padding * 2),
        height
      };

      this.infos.set(item.key, {
        key: item.key,
        type: item.type ?? 'item',
        rect,
        estimatedSize: false
      });

      y += height + this.options.gap;
      if (item.index !== index) {
        item.index = index;
      }
    }

    this.contentSize = {
      width,
      height: Math.max(y + this.options.padding - this.options.gap, 0)
    };
  }

  protected getNodeHeight(node: T): number {
    if (node.type === 'header') {
      return this.options.headingHeight;
    }

    if (node.type === 'loader') {
      return this.options.loaderHeight;
    }

    return this.options.rowHeight || this.options.estimatedRowHeight;
  }

  getLayoutInfo(key: Key): LayoutInfo | null {
    return this.infos.get(key) ?? null;
  }

  getVisibleLayoutInfos(rect: Rect): LayoutInfo[] {
    let infos: LayoutInfo[] = [];
    for (let info of this.infos.values()) {
      let intersectsY = info.rect.y < rect.y + rect.height && info.rect.y + info.rect.height > rect.y;
      let intersectsX = info.rect.x < rect.x + rect.width && info.rect.x + info.rect.width > rect.x;
      if (intersectsX && intersectsY) {
        infos.push(info);
      }
    }

    return infos;
  }

  getContentSize(): Size {
    return this.contentSize;
  }
}
