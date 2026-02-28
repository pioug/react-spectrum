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
  ActionButton as RootActionButton,
  Button as RootButton,
  ClearButton as RootClearButton,
  FieldButton as RootFieldButton,
  LogicButton as RootLogicButton,
  ToggleButton as RootToggleButton,
  VueButton as RootVueButton
} from '../../../packages/@vue-spectrum/button/index';
import {
  ButtonGroup,
  VueButtonGroup
} from '@vue-spectrum/buttongroup';
import {
  ButtonGroup as RootButtonGroup,
  VueButtonGroup as RootVueButtonGroup
} from '../../../packages/@vue-spectrum/buttongroup/index';
import {
  AlertDialog,
  Dialog,
  DialogContainer,
  DialogTrigger,
  useDialogContainer,
  VueDialog
} from '@vue-spectrum/dialog';
import {
  AlertDialog as RootAlertDialog,
  Dialog as RootDialog,
  DialogContainer as RootDialogContainer,
  DialogTrigger as RootDialogTrigger,
  useDialogContainer as RootUseDialogContainer,
  VueDialog as RootVueDialog
} from '../../../packages/@vue-spectrum/dialog/index';
import {
  Divider,
  VueDivider
} from '@vue-spectrum/divider';
import {
  Divider as RootDivider,
  VueDivider as RootVueDivider
} from '../../../packages/@vue-spectrum/divider/index';
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
  Item as RootListBoxItem,
  ListBox as RootListBox,
  ListBoxBase as RootListBoxBase,
  Section as RootListBoxSection,
  useListBoxLayout as RootUseListBoxLayout,
  VueListBox as RootVueListBox
} from '../../../packages/@vue-spectrum/listbox/index';
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
  TextField,
  TextFieldBase,
  VueTextField
} from '@vue-spectrum/textfield';
import {
  Icon,
  Illustration,
  UIIcon,
  VueIcon,
  VueIllustration,
  VueUIIcon
} from '@vue-spectrum/icon';
import {
  Link,
  VueLink
} from '@vue-spectrum/link';
import {
  Link as RootLink,
  VueLink as RootVueLink
} from '../../../packages/@vue-spectrum/link/index';
import {DIRECTORY_DRAG_TYPE, DropZone as SpectrumDropZone, useDragAndDrop as useSpectrumDragAndDrop} from '@vue-spectrum/dnd';
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

  it('keeps root button entry exports aligned with source exports', () => {
    expect(RootButton).toBe(Button);
    expect(RootVueButton).toBe(VueButton);
    expect(RootActionButton).toBe(ActionButton);
    expect(RootFieldButton).toBe(FieldButton);
    expect(RootLogicButton).toBe(LogicButton);
    expect(RootClearButton).toBe(ClearButton);
    expect(RootToggleButton).toBe(ToggleButton);
  });

  it('keeps buttongroup exports aligned with VueButtonGroup base entry', () => {
    expect(ButtonGroup).toBe(VueButtonGroup);
  });

  it('keeps root buttongroup entry exports aligned with source exports', () => {
    expect(RootButtonGroup).toBe(ButtonGroup);
    expect(RootVueButtonGroup).toBe(VueButtonGroup);
  });

  it('exports dialog trigger/container as controllers and enforces dialog context', () => {
    expect(Dialog).toBe(VueDialog);
    expect(AlertDialog).not.toBeUndefined();
    expect(DialogTrigger).not.toBe(VueDialog);
    expect(DialogContainer).not.toBe(VueDialog);
    expect(() => useDialogContainer()).toThrow('Cannot call useDialogContext outside a <DialogTrigger> or <DialogContainer>.');
  });

  it('keeps root dialog entry exports aligned with source exports', () => {
    expect(RootDialog).toBe(Dialog);
    expect(RootVueDialog).toBe(VueDialog);
    expect(RootAlertDialog).toBe(AlertDialog);
    expect(RootDialogTrigger).toBe(DialogTrigger);
    expect(RootDialogContainer).toBe(DialogContainer);
    expect(RootUseDialogContainer).toBe(useDialogContainer);
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
    expect(TreeView).not.toBe(VueTree);
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

  it('keeps divider exports aligned with VueDivider base entry', () => {
    expect(Divider).toBe(VueDivider);
  });

  it('keeps root divider entry exports aligned with source exports', () => {
    expect(RootDivider).toBe(Divider);
    expect(RootVueDivider).toBe(VueDivider);
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

  it('keeps root listbox entry exports aligned with source exports', () => {
    expect(RootListBox).toBe(ListBox);
    expect(RootVueListBox).toBe(VueListBox);
    expect(RootListBoxBase).toBe(ListBoxBase);
    expect(RootListBoxItem).toBe(ListBoxItem);
    expect(RootListBoxSection).toBe(ListBoxSection);
    expect(RootUseListBoxLayout()).toEqual(useListBoxLayout());
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

  it('exports a dedicated TextFieldBase wrapper', () => {
    expect(TextField).toBe(VueTextField);
    expect(TextFieldBase).not.toBe(VueTextField);
  });

  it('keeps icon exports wired to Vue icon primitives', () => {
    expect(Icon).toBe(VueIcon);
    expect(UIIcon).toBe(VueUIIcon);
    expect(Illustration).toBe(VueIllustration);
  });

  it('keeps link exports aligned with VueLink base entry', () => {
    expect(Link).toBe(VueLink);
  });

  it('keeps root link entry exports aligned with source exports', () => {
    expect(RootLink).toBe(Link);
    expect(RootVueLink).toBe(VueLink);
  });

  it('exports dnd drag/drop compatibility primitives', () => {
    expect(SpectrumDropZone).not.toBeUndefined();
    expect(DIRECTORY_DRAG_TYPE).toBe('application/x-directory');
    expect(useSpectrumDragAndDrop()).toEqual({
      dragAndDropHooks: {}
    });

    let hooks = useSpectrumDragAndDrop({
      getItems: () => [{id: 'one', type: 'item', value: {id: 1}}],
      onDrop: () => {}
    });
    expect(hooks.dragAndDropHooks.useDraggableCollectionState).toBeTypeOf('function');
    expect(hooks.dragAndDropHooks.useDraggableCollection).toBeTypeOf('function');
    expect(hooks.dragAndDropHooks.useDraggableItem).toBeTypeOf('function');
    expect(hooks.dragAndDropHooks.DragPreview).not.toBeUndefined();
    expect(hooks.dragAndDropHooks.useDroppableCollectionState).toBeTypeOf('function');
    expect(hooks.dragAndDropHooks.useDroppableCollection).toBeTypeOf('function');
    expect(hooks.dragAndDropHooks.useDroppableItem).toBeTypeOf('function');
    expect(hooks.dragAndDropHooks.useDropIndicator).toBeTypeOf('function');
    expect(hooks.dragAndDropHooks.isVirtualDragging).toBeTypeOf('function');
  });

  it('exports tabs collection item separately from VueTabs', () => {
    expect(Tabs).toBe(VueTabs);
    expect(TabList).not.toBe(VueTabs);
    expect(TabPanels).not.toBe(VueTabs);
    expect(TabItem).not.toBe(VueTabs);
  });
});
