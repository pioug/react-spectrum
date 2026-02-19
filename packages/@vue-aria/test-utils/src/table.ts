import {BaseTester} from './base';
import type {TableTesterOpts} from './types';

export class TableTester extends BaseTester {
  constructor(opts: TableTesterOpts) {
    super(opts);
  }

  get table(): HTMLElement {
    return this.firstByRole('grid') ?? this.firstByRole('table') ?? this.root;
  }

  get rows(): HTMLElement[] {
    return this.allByRole('row');
  }

  get columns(): HTMLElement[] {
    return this.allByRole('columnheader');
  }
}
