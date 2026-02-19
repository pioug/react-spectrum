import {BaseTester} from './base';
import {pressElement} from './events';
import type {TabsTesterOpts, UserOpts} from './types';

export class TabsTester extends BaseTester {
  constructor(opts: TabsTesterOpts) {
    super(opts);
  }

  get tablist(): HTMLElement {
    return this.firstByRole('tablist') ?? this.root;
  }

  get tabs(): HTMLElement[] {
    return Array.from(this.tablist.querySelectorAll<HTMLElement>('[role="tab"]'));
  }

  get tabpanels(): HTMLElement[] {
    let panels: HTMLElement[] = [];
    for (let tab of this.tabs) {
      let panelId = tab.getAttribute('aria-controls');
      if (!panelId) {
        continue;
      }

      let panel = document.getElementById(panelId);
      if (panel) {
        panels.push(panel);
      }
    }

    return panels;
  }

  get selectedTab(): HTMLElement | null {
    return this.tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') ?? null;
  }

  async triggerTab(opts: {interactionType?: UserOpts['interactionType'], tab: number | string | HTMLElement}): Promise<void> {
    let interactionType = opts.interactionType ?? this.interactionType;
    let tab: HTMLElement | null;

    if (typeof opts.tab === 'number') {
      tab = this.tabs[opts.tab] ?? null;
    } else if (typeof opts.tab === 'string') {
      tab = this.tabs.find((item) => item.textContent?.trim() === opts.tab) ?? null;
    } else {
      tab = opts.tab;
    }

    if (!tab || tab.getAttribute('aria-disabled') === 'true' || tab.hasAttribute('disabled')) {
      return;
    }

    await pressElement(this.user, tab, interactionType);
  }
}
