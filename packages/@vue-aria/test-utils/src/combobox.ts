import {BaseTester} from './base';
import type {ComboBoxTesterOpts, UserOpts} from './types';

export class ComboBoxTester extends BaseTester {
  private triggerNode: HTMLElement;

  constructor(opts: ComboBoxTesterOpts) {
    super(opts);
    this.triggerNode = opts.trigger
      ?? this.firstByRole('button')
      ?? this.firstByRole('combobox')
      ?? this.root;
  }

  get combobox(): HTMLElement {
    return this.firstByRole('combobox') ?? this.root;
  }

  get trigger(): HTMLElement {
    return this.triggerNode;
  }

  get listbox(): HTMLElement | null {
    let listboxId = this.combobox.getAttribute('aria-controls');
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

  options(): HTMLElement[] {
    return this.listbox ? Array.from(this.listbox.querySelectorAll<HTMLElement>('[role="option"]')) : [];
  }
}
