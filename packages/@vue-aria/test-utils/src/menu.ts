import {BaseTester} from './base';
import type {MenuTesterOpts, UserOpts} from './types';

export class MenuTester extends BaseTester {
  constructor(opts: MenuTesterOpts) {
    super(opts);
  }

  get trigger(): HTMLElement {
    return this.firstByRole('button') ?? this.root;
  }

  get menu(): HTMLElement | null {
    return this.firstByRole('menu');
  }

  get items(): HTMLElement[] {
    return this.menu ? Array.from(this.menu.querySelectorAll<HTMLElement>('[role^="menuitem"]')) : [];
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
