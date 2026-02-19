import {BaseTester} from './base';
import type {GridListTesterOpts} from './types';

export class GridListTester extends BaseTester {
  constructor(opts: GridListTesterOpts) {
    super(opts);
  }

  get gridlist(): HTMLElement {
    return this.firstByRole('grid') ?? this.root;
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
