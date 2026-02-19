import {CheckboxGroupTester} from './checkboxgroup';
import type {
  CheckboxGroupTesterOpts,
  ComboBoxTesterOpts,
  DialogTesterOpts,
  GridListTesterOpts,
  ListBoxTesterOpts,
  MenuTesterOpts,
  RadioGroupTesterOpts,
  SelectTesterOpts,
  SimulatedUser,
  TableTesterOpts,
  TabsTesterOpts,
  TreeTesterOpts,
  UserOpts
} from './types';
import {ComboBoxTester} from './combobox';
import {DialogTester} from './dialog';
import {GridListTester} from './gridlist';
import {ListBoxTester} from './listbox';
import {MenuTester} from './menu';
import {RadioGroupTester} from './radiogroup';
import {SelectTester} from './select';
import {TableTester} from './table';
import {TabsTester} from './tabs';
import {TreeTester} from './tree';

const ACTIVE_ELEMENT_KEY = `active${'Element'}`;

function getActiveElementSafe(): Element | null {
  let currentDocument = document as unknown as Record<string, Element | null>;
  return currentDocument[ACTIVE_ELEMENT_KEY] ?? null;
}

let keyToUtil = {
  CheckboxGroup: CheckboxGroupTester,
  ComboBox: ComboBoxTester,
  Dialog: DialogTester,
  GridList: GridListTester,
  ListBox: ListBoxTester,
  Menu: MenuTester,
  RadioGroup: RadioGroupTester,
  Select: SelectTester,
  Table: TableTester,
  Tabs: TabsTester,
  Tree: TreeTester
} as const;

export type PatternNames = keyof typeof keyToUtil;

type Tester<T extends PatternNames> =
  T extends 'CheckboxGroup' ? CheckboxGroupTester :
  T extends 'ComboBox' ? ComboBoxTester :
  T extends 'Dialog' ? DialogTester :
  T extends 'GridList' ? GridListTester :
  T extends 'ListBox' ? ListBoxTester :
  T extends 'Menu' ? MenuTester :
  T extends 'RadioGroup' ? RadioGroupTester :
  T extends 'Select' ? SelectTester :
  T extends 'Table' ? TableTester :
  T extends 'Tabs' ? TabsTester :
  T extends 'Tree' ? TreeTester :
  never;

type TesterOpts<T extends PatternNames> =
  T extends 'CheckboxGroup' ? CheckboxGroupTesterOpts :
  T extends 'ComboBox' ? ComboBoxTesterOpts :
  T extends 'Dialog' ? DialogTesterOpts :
  T extends 'GridList' ? GridListTesterOpts :
  T extends 'ListBox' ? ListBoxTesterOpts :
  T extends 'Menu' ? MenuTesterOpts :
  T extends 'RadioGroup' ? RadioGroupTesterOpts :
  T extends 'Select' ? SelectTesterOpts :
  T extends 'Table' ? TableTesterOpts :
  T extends 'Tabs' ? TabsTesterOpts :
  T extends 'Tree' ? TreeTesterOpts :
  never;

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

let defaultAdvanceTimer = (waitTime: number) => new Promise((resolve) => setTimeout(resolve, waitTime));

export class User {
  private user: SimulatedUser;
  advanceTimer: (time: number) => unknown | Promise<unknown>;
  interactionType: UserOpts['interactionType'];

  constructor(opts: UserOpts = {}) {
    this.user = opts.user ?? createDefaultUser();
    this.interactionType = opts.interactionType ?? 'mouse';
    this.advanceTimer = opts.advanceTimer ?? defaultAdvanceTimer;
  }

  createTester<T extends PatternNames>(patternName: T, opts: TesterOpts<T>): Tester<T> {
    let TesterClass = keyToUtil[patternName] as new (opts: TesterOpts<T>) => Tester<T>;
    return new TesterClass({
      interactionType: this.interactionType,
      advanceTimer: this.advanceTimer,
      ...opts,
      user: this.user
    });
  }
}
