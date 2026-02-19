import {BaseTester} from './base';
import type {CheckboxGroupTesterOpts, UserOpts} from './types';
import {pressElement} from './events';

export class CheckboxGroupTester extends BaseTester {
  constructor(opts: CheckboxGroupTesterOpts) {
    super(opts);
  }

  get checkboxgroup(): HTMLElement {
    return this.firstByRole('group') ?? this.root;
  }

  get checkboxes(): HTMLElement[] {
    return Array.from(this.checkboxgroup.querySelectorAll<HTMLElement>('[role="checkbox"], input[type="checkbox"]'));
  }

  async toggleCheckbox(opts: {checkbox: number | string | HTMLElement, interactionType?: UserOpts['interactionType']}): Promise<void> {
    let interactionType = opts.interactionType ?? this.interactionType;
    let checkbox: HTMLElement | null;

    if (typeof opts.checkbox === 'number') {
      checkbox = this.checkboxes[opts.checkbox] ?? null;
    } else if (typeof opts.checkbox === 'string') {
      checkbox = this.checkboxes.find((item) => item.textContent?.trim() === opts.checkbox) ?? null;
    } else {
      checkbox = opts.checkbox;
    }

    if (!checkbox || checkbox.getAttribute('aria-disabled') === 'true' || checkbox.hasAttribute('disabled')) {
      return;
    }

    await pressElement(this.user, checkbox, interactionType);
  }
}
