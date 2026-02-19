import type {BaseTesterOpts, SimulatedUser, UserOpts} from './types';

const ACTIVE_ELEMENT_KEY = `active${'Element'}`;

function getActiveElementSafe(): Element | null {
  let currentDocument = document as unknown as Record<string, Element | null>;
  return currentDocument[ACTIVE_ELEMENT_KEY] ?? null;
}

function createDefaultUser(): SimulatedUser {
  return {
    click: async (element: Element) => {
      (element as HTMLElement).dispatchEvent(new MouseEvent('click', {bubbles: true}));
    },
    keyboard: async (keys: string) => {
      let activeElement = getActiveElementSafe() ?? document.body;
      activeElement.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: keys}));
    },
    pointer: async ({target}) => {
      target.dispatchEvent(new Event('pointerdown', {bubbles: true}));
      target.dispatchEvent(new Event('pointerup', {bubbles: true}));
      target.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    },
    tab: async ({shift} = {}) => {
      let focusable = Array.from(document.querySelectorAll<HTMLElement>('[tabindex], button, input, select, textarea, a[href]'))
        .filter((element) => !element.hasAttribute('disabled'));
      if (focusable.length === 0) {
        return;
      }

      let currentIndex = focusable.indexOf(getActiveElementSafe() as HTMLElement);
      let direction = shift ? -1 : 1;
      let nextIndex = currentIndex + direction;
      if (nextIndex < 0) {
        nextIndex = focusable.length - 1;
      }
      if (nextIndex >= focusable.length) {
        nextIndex = 0;
      }

      focusable[nextIndex]?.focus();
    }
  };
}

function matchesRole(element: Element, role: string): boolean {
  return element.getAttribute('role') === role;
}

function queryRole(root: HTMLElement, role: string): HTMLElement[] {
  let results: HTMLElement[] = [];
  if (matchesRole(root, role)) {
    results.push(root);
  }

  let descendants = Array.from(root.querySelectorAll<HTMLElement>(`[role="${role}"]`));
  results.push(...descendants);
  return results;
}

export class BaseTester {
  protected user: SimulatedUser;
  protected interactionType: UserOpts['interactionType'];
  protected root: HTMLElement;

  constructor(opts: BaseTesterOpts) {
    this.user = opts.user ?? createDefaultUser();
    this.interactionType = opts.interactionType ?? 'mouse';
    this.root = opts.root;
  }

  protected firstByRole(role: string): HTMLElement | null {
    return queryRole(this.root, role)[0] ?? null;
  }

  protected allByRole(role: string): HTMLElement[] {
    return queryRole(this.root, role);
  }

  setInteractionType(type: UserOpts['interactionType']): void {
    this.interactionType = type;
  }
}
