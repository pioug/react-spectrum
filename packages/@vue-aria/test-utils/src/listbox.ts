import {BaseTester} from './base';
import type {ListBoxTesterOpts, UserOpts} from './types';
import {pressElement} from './events';

export class ListBoxTester extends BaseTester {
  constructor(opts: ListBoxTesterOpts) {
    super(opts);
  }

  get listbox(): HTMLElement {
    return this.firstByRole('listbox') ?? this.root;
  }

  get options(): HTMLElement[] {
    return Array.from(this.listbox.querySelectorAll<HTMLElement>('[role="option"]'));
  }

  async selectOption(opts: {interactionType?: UserOpts['interactionType'], option: number | string | HTMLElement}): Promise<void> {
    let interactionType = opts.interactionType ?? this.interactionType;
    let option: HTMLElement | null;

    if (typeof opts.option === 'number') {
      option = this.options[opts.option] ?? null;
    } else if (typeof opts.option === 'string') {
      option = this.options.find((item) => item.textContent?.trim() === opts.option) ?? null;
    } else {
      option = opts.option;
    }

    if (!option || option.getAttribute('aria-disabled') === 'true') {
      return;
    }

    await pressElement(this.user, option, interactionType);
  }
}
