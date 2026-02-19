import {BaseTester} from './base';
import type {SelectTesterOpts, UserOpts} from './types';

export class SelectTester extends BaseTester {
  private triggerNode: HTMLElement;

  constructor(opts: SelectTesterOpts) {
    super(opts);
    this.triggerNode = opts.trigger ?? this.firstByRole('button') ?? this.root;
  }

  get trigger(): HTMLElement {
    return this.triggerNode;
  }

  get listbox(): HTMLElement | null {
    let listboxId = this.trigger.getAttribute('aria-controls');
    if (!listboxId) {
      return this.firstByRole('listbox');
    }

    return document.getElementById(listboxId);
  }

  async open(opts: {interactionType?: UserOpts['interactionType']} = {}): Promise<void> {
    let interactionType = opts.interactionType ?? this.interactionType;
    if (interactionType === 'keyboard') {
      this.trigger.focus();
      await this.user.keyboard('[Enter]');
      return;
    }

    await this.user.click(this.trigger);
  }
}
