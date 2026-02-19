import {BaseTester} from './base';
import type {TreeTesterOpts} from './types';

export class TreeTester extends BaseTester {
  constructor(opts: TreeTesterOpts) {
    super(opts);
  }

  get tree(): HTMLElement {
    return this.firstByRole('treegrid') ?? this.root;
  }

  get rows(): HTMLElement[] {
    return this.allByRole('row');
  }

  findRow(opts: {rowIndexOrText: number | string}): HTMLElement | null {
    if (typeof opts.rowIndexOrText === 'number') {
      return this.rows[opts.rowIndexOrText] ?? null;
    }

    return this.rows.find((row) => row.textContent?.includes(String(opts.rowIndexOrText))) ?? null;
  }
}
