import {BaseTester} from './base';
import type {DialogTesterOpts, UserOpts} from './types';

export class DialogTester extends BaseTester {
  private triggerNode: HTMLElement;

  constructor(opts: DialogTesterOpts) {
    super(opts);
    this.triggerNode = this.firstByRole('button') ?? this.root;
  }

  get trigger(): HTMLElement {
    return this.triggerNode;
  }

  get dialog(): HTMLElement | null {
    return document.querySelector<HTMLElement>('[role="dialog"], [role="alertdialog"]');
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

  async close(): Promise<void> {
    await this.user.keyboard('[Escape]');
  }
}
