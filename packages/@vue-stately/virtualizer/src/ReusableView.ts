import {LayoutInfo} from './LayoutInfo';
import {Virtualizer} from './Virtualizer';

let KEY = 0;

/**
 * Represents a reusable rendered view entry controlled by Virtualizer.
 */
export class ReusableView<T extends object, V> {
  virtualizer: Virtualizer<T, V>;
  layoutInfo: LayoutInfo | null = null;
  content: T | null = null;
  rendered: V | null = null;
  viewType: string;
  key: number;

  constructor(virtualizer: Virtualizer<T, V>, viewType: string) {
    this.virtualizer = virtualizer;
    this.viewType = viewType;
    this.key = ++KEY;
  }

  prepareForReuse(): void {
    this.layoutInfo = null;
    this.content = null;
    this.rendered = null;
  }
}
