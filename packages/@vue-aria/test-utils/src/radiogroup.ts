import {BaseTester} from './base';
import {pressElement} from './events';
import type {RadioGroupTesterOpts, UserOpts} from './types';

export class RadioGroupTester extends BaseTester {
  constructor(opts: RadioGroupTesterOpts) {
    super(opts);
  }

  get radiogroup(): HTMLElement {
    return this.firstByRole('radiogroup') ?? this.root;
  }

  get radios(): HTMLElement[] {
    return Array.from(this.radiogroup.querySelectorAll<HTMLElement>('[role="radio"], input[type="radio"]'));
  }

  async selectRadio(opts: {interactionType?: UserOpts['interactionType'], radio: number | string | HTMLElement}): Promise<void> {
    let interactionType = opts.interactionType ?? this.interactionType;
    let radio: HTMLElement | null;

    if (typeof opts.radio === 'number') {
      radio = this.radios[opts.radio] ?? null;
    } else if (typeof opts.radio === 'string') {
      radio = this.radios.find((item) => item.textContent?.trim() === opts.radio) ?? null;
    } else {
      radio = opts.radio;
    }

    if (!radio || radio.getAttribute('aria-disabled') === 'true' || radio.hasAttribute('disabled')) {
      return;
    }

    await pressElement(this.user, radio, interactionType);
  }
}
