import {type Key} from './types';
import {Rect} from './Rect';

export class LayoutInfo {
  type: string;
  key: Key;
  parentKey: Key | null;
  content: unknown | null;
  rect: Rect;
  estimatedSize: boolean;
  isSticky: boolean;
  opacity: number;
  transform: string | null;
  zIndex: number;
  allowOverflow: boolean;

  constructor(type: string, key: Key, rect: Rect) {
    this.type = type;
    this.key = key;
    this.parentKey = null;
    this.content = null;
    this.rect = rect;
    this.estimatedSize = false;
    this.isSticky = false;
    this.opacity = 1;
    this.transform = null;
    this.zIndex = 0;
    this.allowOverflow = false;
  }

  copy(): LayoutInfo {
    let copied = new LayoutInfo(this.type, this.key, this.rect.copy());
    copied.parentKey = this.parentKey;
    copied.content = this.content;
    copied.estimatedSize = this.estimatedSize;
    copied.isSticky = this.isSticky;
    copied.opacity = this.opacity;
    copied.transform = this.transform;
    copied.zIndex = this.zIndex;
    copied.allowOverflow = this.allowOverflow;
    return copied;
  }
}
