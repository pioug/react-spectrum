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
  Item as PickerItem,
  Picker,
  Section as PickerSection,
  VuePicker
} from '@vue-spectrum/picker';
import {
  Heading,
  Keyboard,
  Text,
  VueText
} from '@vue-spectrum/text';
import {
  ProgressBar,
  ProgressBarBase,
  VueProgressBar
} from '@vue-spectrum/progress';
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

  it('exports dialog trigger/container as controllers and enforces dialog context', () => {
    expect(Dialog).toBe(VueDialog);
    expect(AlertDialog).not.toBeUndefined();
    expect(DialogTrigger).not.toBe(VueDialog);
    expect(DialogContainer).not.toBe(VueDialog);
    expect(() => useDialogContainer()).toThrow('Cannot call useDialogContext outside a <DialogTrigger> or <DialogContainer>.');
  });

  it('exports table view as VueTable and collection primitives separately', () => {
    expect(Table).toBe(VueTable);
    expect(TableView).not.toBe(VueTable);
    expect(TableHeader).not.toBe(VueTable);
    expect(TableBody).not.toBe(VueTable);
    expect(Column).not.toBe(VueTable);
    expect(Row).not.toBe(VueTable);
    expect(Cell).not.toBe(VueTable);
    expect(Section).not.toBe(VueTable);
  });

  it('keeps tree primitives exported and collection as a dedicated primitive', () => {
    expect(Tree).toBe(VueTree);
    expect(TreeView).toBe(VueTree);
    expect(TreeViewItem).not.toBe(VueTree);
    expect(TreeViewItemContent).not.toBe(VueTree);
    expect(Collection).not.toBe(VueTree);
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

  it('exports menu controllers/collection primitives separately from VueMenu', () => {
    expect(Menu).toBe(VueMenu);
    expect(ActionMenu).not.toBe(VueMenu);
    expect(MenuTrigger).not.toBeUndefined();
    expect(MenuTrigger).not.toBe(VueMenu);
    expect(SubmenuTrigger).not.toBe(MenuTrigger);
    expect(ContextualHelpTrigger).not.toBe(MenuTrigger);
    expect(MenuItem).not.toBe(VueMenu);
    expect(MenuSection).not.toBe(VueMenu);
  });

  it('exports listbox base and collection primitives separately', () => {
    expect(ListBox).toBe(VueListBox);
    expect(ListBoxBase).not.toBe(VueListBox);
    expect(ListBoxItem).not.toBe(VueListBox);
    expect(ListBoxSection).not.toBe(VueListBox);
    expect(useListBoxLayout()).toEqual({layout: 'stack'});
  });

  it('exports picker collection primitives separately from VuePicker', () => {
    expect(Picker).toBe(VuePicker);
    expect(PickerItem).not.toBe(VuePicker);
    expect(PickerSection).not.toBe(VuePicker);
  });

  it('exports semantic text primitives on top of VueText', () => {
    expect(Text).not.toBe(VueText);
    expect(Heading).not.toBe(VueText);
    expect(Keyboard).not.toBe(VueText);
  });

  it('exports a dedicated ProgressBarBase wrapper', () => {
    expect(ProgressBar).toBe(VueProgressBar);
    expect(ProgressBarBase).not.toBe(VueProgressBar);
  });

  it('keeps icon exports wired to Vue icon primitives', () => {
    expect(Icon).toBe(VueIcon);
    expect(UIIcon).toBe(VueUIIcon);
    expect(Illustration).toBe(VueIllustration);
  });

  it('exports tabs collection item separately from VueTabs', () => {
    expect(Tabs).toBe(VueTabs);
    expect(TabList).not.toBe(VueTabs);
    expect(TabPanels).not.toBe(VueTabs);
    expect(TabItem).not.toBe(VueTabs);
  });
});
