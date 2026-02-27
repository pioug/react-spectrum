import {describe, expect, it} from 'vitest';
import {
  ActionButton,
  Button,
  ClearButton,
  FieldButton,
  LogicButton,
  ToggleButton,
  VueButton
} from '@vue-spectrum/button';
import {
  AlertDialog,
  Dialog,
  DialogContainer,
  DialogTrigger,
  useDialogContainer,
  VueDialog
} from '@vue-spectrum/dialog';
import {
  Cell,
  Column,
  Row,
  Section,
  Table,
  TableBody,
  TableHeader,
  TableView,
  VueTable
} from '@vue-spectrum/table';
import {
  Collection,
  Tree,
  TreeView,
  TreeViewItem,
  TreeViewItemContent,
  VueTree
} from '@vue-spectrum/tree';
import {
  Content,
  Footer,
  Header,
  View
} from '@vue-spectrum/view';
import {
  ActionMenu,
  ContextualHelpTrigger,
  Item as MenuItem,
  Menu,
  MenuTrigger,
  Section as MenuSection,
  SubmenuTrigger,
  VueMenu
} from '@vue-spectrum/menu';
import {
  Item as ListBoxItem,
  ListBox,
  ListBoxBase,
  Section as ListBoxSection,
  useListBoxLayout,
  VueListBox
} from '@vue-spectrum/listbox';
import {
  Heading,
  Keyboard,
  Text,
  VueText
} from '@vue-spectrum/text';
import {
  Icon,
  Illustration,
  UIIcon,
  VueIcon,
  VueIllustration,
  VueUIIcon
} from '@vue-spectrum/icon';
import {
  Item as TabItem,
  TabList,
  TabPanels,
  Tabs,
  VueTabs
} from '@vue-spectrum/tabs';

describe('Vue Spectrum API compatibility aliases', () => {
  it('exports button primitives with VueButton as the base Button export', () => {
    expect(Button).toBe(VueButton);
    expect(ActionButton).not.toBeUndefined();
    expect(FieldButton).not.toBeUndefined();
    expect(LogicButton).not.toBeUndefined();
    expect(ClearButton).not.toBeUndefined();
    expect(ToggleButton).not.toBeUndefined();
  });

  it('aliases dialog exports and returns a dialog container controller', () => {
    expect(Dialog).toBe(VueDialog);
    expect(AlertDialog).not.toBeUndefined();
    expect(DialogTrigger).toBe(VueDialog);
    expect(DialogContainer).toBe(VueDialog);

    let controller = useDialogContainer();
    expect(typeof controller.close).toBe('function');
  });

  it('aliases table exports to VueTable', () => {
    expect(Table).toBe(VueTable);
    expect(TableView).toBe(VueTable);
    expect(TableHeader).toBe(VueTable);
    expect(TableBody).toBe(VueTable);
    expect(Column).toBe(VueTable);
    expect(Row).toBe(VueTable);
    expect(Cell).toBe(VueTable);
    expect(Section).toBe(VueTable);
  });

  it('aliases tree exports to VueTree', () => {
    expect(Tree).toBe(VueTree);
    expect(TreeView).toBe(VueTree);
    expect(TreeViewItem).toBe(VueTree);
    expect(TreeViewItemContent).toBe(VueTree);
    expect(Collection).toBe(VueTree);
  });

  it('exports view primitives with semantic wrappers', () => {
    expect(View).not.toBeUndefined();
    expect(Header).not.toBeUndefined();
    expect(Content).not.toBeUndefined();
    expect(Footer).not.toBeUndefined();
    expect(Header).not.toBe(View);
    expect(Content).not.toBe(View);
    expect(Footer).not.toBe(View);
  });

  it('aliases menu exports to VueMenu', () => {
    expect(Menu).toBe(VueMenu);
    expect(ActionMenu).toBe(VueMenu);
    expect(MenuTrigger).not.toBeUndefined();
    expect(MenuTrigger).not.toBe(VueMenu);
    expect(SubmenuTrigger).toBe(VueMenu);
    expect(ContextualHelpTrigger).toBe(VueMenu);
    expect(MenuItem).toBe(VueMenu);
    expect(MenuSection).toBe(VueMenu);
  });

  it('aliases listbox exports to VueListBox and exposes useListBoxLayout', () => {
    expect(ListBox).toBe(VueListBox);
    expect(ListBoxBase).toBe(VueListBox);
    expect(ListBoxItem).toBe(VueListBox);
    expect(ListBoxSection).toBe(VueListBox);
    expect(useListBoxLayout()).toEqual({layout: 'stack'});
  });

  it('aliases text exports to VueText', () => {
    expect(Text).toBe(VueText);
    expect(Heading).toBe(VueText);
    expect(Keyboard).toBe(VueText);
  });

  it('keeps icon exports wired to Vue icon primitives', () => {
    expect(Icon).toBe(VueIcon);
    expect(UIIcon).toBe(VueUIIcon);
    expect(Illustration).toBe(VueIllustration);
  });

  it('aliases tabs exports to VueTabs', () => {
    expect(Tabs).toBe(VueTabs);
    expect(TabList).toBe(VueTabs);
    expect(TabPanels).toBe(VueTabs);
    expect(TabItem).toBe(VueTabs);
  });
});
