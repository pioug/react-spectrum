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
  Cell as RootCell,
  Column as RootColumn,
  Row as RootRow,
  Section as RootSection,
  Table as RootTable,
  TableBody as RootTableBody,
  TableHeader as RootTableHeader,
  TableView as RootTableView,
  VueTable as RootVueTable
} from '../../../packages/@vue-spectrum/table/index';
import {
  Collection,
  Tree,
  TreeView,
  TreeViewItem,
  TreeViewItemContent,
  VueTree
} from '@vue-spectrum/tree';
import {
  Collection as RootTreeCollection,
  Tree as RootTree,
  TreeView as RootTreeView,
  TreeViewItem as RootTreeViewItem,
  TreeViewItemContent as RootTreeViewItemContent,
  VueTree as RootVueTree
} from '../../../packages/@vue-spectrum/tree/index';
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
  ActionMenu as RootActionMenu,
  ContextualHelpTrigger as RootContextualHelpTrigger,
  Item as RootMenuItem,
  Menu as RootMenu,
  MenuTrigger as RootMenuTrigger,
  Section as RootMenuSection,
  SubmenuTrigger as RootSubmenuTrigger,
  VueMenu as RootVueMenu
} from '../../../packages/@vue-spectrum/menu/index';
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
  Item as ListViewItem,
  ListView,
  VueListView
} from '@vue-spectrum/list';
import {
  Item as RootListViewItem,
  ListView as RootListView,
  VueListView as RootVueListView
} from '../../../packages/@vue-spectrum/list/index';
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
  ProgressCircle,
  VueProgressBar
} from '@vue-spectrum/progress';
import {
  ProgressBar as RootProgressBar,
  ProgressBarBase as RootProgressBarBase,
  ProgressCircle as RootProgressCircle,
  VueProgressBar as RootVueProgressBar
} from '../../../packages/@vue-spectrum/progress/index';
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
import {
  Meter,
  VueMeter
} from '@vue-spectrum/meter';
import {
  Meter as RootMeter,
  VueMeter as RootVueMeter
} from '../../../packages/@vue-spectrum/meter/index';
import {
  NumberField,
  VueNumberField
} from '@vue-spectrum/numberfield';
import {
  NumberField as RootNumberField,
  VueNumberField as RootVueNumberField
} from '../../../packages/@vue-spectrum/numberfield/index';
import {
  StatusLight,
  VueStatusLight
} from '@vue-spectrum/statuslight';
import {
  StatusLight as RootStatusLight,
  VueStatusLight as RootVueStatusLight
} from '../../../packages/@vue-spectrum/statuslight/index';
import {
  Switch,
  VueSwitch
} from '@vue-spectrum/switch';
import {
  Switch as RootSwitch,
  VueSwitch as RootVueSwitch
} from '../../../packages/@vue-spectrum/switch/index';
import {
  Radio,
  RadioGroup,
  VueRadio,
  VueRadioGroup
} from '@vue-spectrum/radio';
import {
  Radio as RootRadio,
  RadioGroup as RootRadioGroup,
  VueRadio as RootVueRadio,
  VueRadioGroup as RootVueRadioGroup
} from '../../../packages/@vue-spectrum/radio/index';
import {
  Modal,
  OpenTransition,
  Overlay,
  Popover,
  Tray,
  Underlay,
  VuePopover
} from '@vue-spectrum/overlays';
import {
  Modal as RootModal,
  OpenTransition as RootOpenTransition,
  Overlay as RootOverlay,
  Popover as RootPopover,
  Tray as RootTray,
  Underlay as RootUnderlay,
  VuePopover as RootVuePopover
} from '../../../packages/@vue-spectrum/overlays/index';
import {
  RangeSlider,
  Slider,
  VueSlider
} from '@vue-spectrum/slider';
import {
  RangeSlider as RootRangeSlider,
  Slider as RootSlider,
  VueSlider as RootVueSlider
} from '../../../packages/@vue-spectrum/slider/index';
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

  it('keeps root table entry exports aligned with source exports', () => {
    expect(RootTable).toBe(Table);
    expect(RootVueTable).toBe(VueTable);
    expect(RootTableView).toBe(TableView);
    expect(RootTableHeader).toBe(TableHeader);
    expect(RootTableBody).toBe(TableBody);
    expect(RootColumn).toBe(Column);
    expect(RootRow).toBe(Row);
    expect(RootCell).toBe(Cell);
    expect(RootSection).toBe(Section);
  });

  it('keeps tree primitives exported and collection as a dedicated primitive', () => {
    expect(Tree).toBe(VueTree);
    expect(TreeView).not.toBe(VueTree);
    expect(TreeViewItem).not.toBe(VueTree);
    expect(TreeViewItemContent).not.toBe(VueTree);
    expect(Collection).not.toBe(VueTree);
  });

  it('keeps root tree entry exports aligned with source exports', () => {
    expect(RootTree).toBe(Tree);
    expect(RootVueTree).toBe(VueTree);
    expect(RootTreeView).toBe(TreeView);
    expect(RootTreeViewItem).toBe(TreeViewItem);
    expect(RootTreeViewItemContent).toBe(TreeViewItemContent);
    expect(RootTreeCollection).toBe(Collection);
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

  it('keeps root menu entry exports aligned with source exports', () => {
    expect(RootMenu).toBe(Menu);
    expect(RootVueMenu).toBe(VueMenu);
    expect(RootActionMenu).toBe(ActionMenu);
    expect(RootMenuTrigger).toBe(MenuTrigger);
    expect(RootSubmenuTrigger).toBe(SubmenuTrigger);
    expect(RootContextualHelpTrigger).toBe(ContextualHelpTrigger);
    expect(RootMenuItem).toBe(MenuItem);
    expect(RootMenuSection).toBe(MenuSection);
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

  it('keeps list exports aligned with VueListView base entry and item primitive', () => {
    expect(ListView).toBe(VueListView);
    expect(ListViewItem).not.toBe(VueListView);
  });

  it('keeps root list entry exports aligned with source exports', () => {
    expect(RootListView).toBe(ListView);
    expect(RootVueListView).toBe(VueListView);
    expect(RootListViewItem).toBe(ListViewItem);
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

  it('exports dedicated progress wrappers around VueProgressBar', () => {
    expect(ProgressBar).toBe(VueProgressBar);
    expect(ProgressBarBase).not.toBe(VueProgressBar);
    expect(ProgressCircle).not.toBe(VueProgressBar);
  });

  it('keeps root progress entry exports aligned with source exports', () => {
    expect(RootProgressBar).toBe(ProgressBar);
    expect(RootVueProgressBar).toBe(VueProgressBar);
    expect(RootProgressBarBase).toBe(ProgressBarBase);
    expect(RootProgressCircle).toBe(ProgressCircle);
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

  it('keeps meter exports aligned with VueMeter base entry', () => {
    expect(Meter).toBe(VueMeter);
  });

  it('keeps root meter entry exports aligned with source exports', () => {
    expect(RootMeter).toBe(Meter);
    expect(RootVueMeter).toBe(VueMeter);
  });

  it('keeps numberfield exports aligned with VueNumberField base entry', () => {
    expect(NumberField).toBe(VueNumberField);
  });

  it('keeps root numberfield entry exports aligned with source exports', () => {
    expect(RootNumberField).toBe(NumberField);
    expect(RootVueNumberField).toBe(VueNumberField);
  });

  it('keeps statuslight exports aligned with VueStatusLight base entry', () => {
    expect(StatusLight).toBe(VueStatusLight);
  });

  it('keeps root statuslight entry exports aligned with source exports', () => {
    expect(RootStatusLight).toBe(StatusLight);
    expect(RootVueStatusLight).toBe(VueStatusLight);
  });

  it('keeps switch exports aligned with VueSwitch base entry', () => {
    expect(Switch).toBe(VueSwitch);
  });

  it('keeps root switch entry exports aligned with source exports', () => {
    expect(RootSwitch).toBe(Switch);
    expect(RootVueSwitch).toBe(VueSwitch);
  });

  it('keeps radio exports aligned with VueRadio and VueRadioGroup base entries', () => {
    expect(Radio).toBe(VueRadio);
    expect(RadioGroup).toBe(VueRadioGroup);
  });

  it('keeps root radio entry exports aligned with source exports', () => {
    expect(RootRadio).toBe(Radio);
    expect(RootRadioGroup).toBe(RadioGroup);
    expect(RootVueRadio).toBe(VueRadio);
    expect(RootVueRadioGroup).toBe(VueRadioGroup);
  });

  it('keeps overlays exports aligned with VuePopover base entry and primitives', () => {
    expect(Popover).toBe(VuePopover);
    expect(Modal).not.toBe(Popover);
    expect(Overlay).not.toBe(Popover);
    expect(OpenTransition).not.toBe(Popover);
    expect(Tray).not.toBe(Popover);
    expect(Underlay).not.toBe(Popover);
  });

  it('keeps root overlays entry exports aligned with source exports', () => {
    expect(RootModal).toBe(Modal);
    expect(RootOpenTransition).toBe(OpenTransition);
    expect(RootOverlay).toBe(Overlay);
    expect(RootPopover).toBe(Popover);
    expect(RootTray).toBe(Tray);
    expect(RootUnderlay).toBe(Underlay);
    expect(RootVuePopover).toBe(VuePopover);
  });

  it('keeps slider exports aligned with VueSlider base entry and range primitive', () => {
    expect(Slider).toBe(VueSlider);
    expect(RangeSlider).not.toBe(VueSlider);
  });

  it('keeps root slider entry exports aligned with source exports', () => {
    expect(RootSlider).toBe(Slider);
    expect(RootVueSlider).toBe(VueSlider);
    expect(RootRangeSlider).toBe(RangeSlider);
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
