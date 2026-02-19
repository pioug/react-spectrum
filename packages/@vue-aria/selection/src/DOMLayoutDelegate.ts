import type {Ref} from 'vue';

export class DOMLayoutDelegate {
  private readonly ref: Ref<HTMLElement | null>;

  constructor(ref: Ref<HTMLElement | null>) {
    this.ref = ref;
  }

  getVisibleRect(): DOMRect {
    return this.ref.value?.getBoundingClientRect() ?? new DOMRect();
  }

  getContentSize(): {height: number, width: number} {
    return {
      width: this.ref.value?.scrollWidth ?? 0,
      height: this.ref.value?.scrollHeight ?? 0
    };
  }

  getItemRect(key: string | number): DOMRect | null {
    let container = this.ref.value;
    if (!container) {
      return null;
    }

    let element = container.querySelector(`[data-key="${String(key)}"]`);
    return element instanceof HTMLElement ? element.getBoundingClientRect() : null;
  }
}
