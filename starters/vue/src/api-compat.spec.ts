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
  Checkbox,
  CheckboxGroup,
  VueCheckbox
} from '@vue-spectrum/checkbox';
import {
  Checkbox as RootCheckbox,
  CheckboxGroup as RootCheckboxGroup,
  VueCheckbox as RootVueCheckbox
} from '../../../packages/@vue-spectrum/checkbox/index';
import {
  ColorArea,
  ColorEditor,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorWheel,
  getColorChannels,
  parseColor,
  VueColorArea,
  VueColorEditor,
  VueColorField,
  VueColorPicker,
  VueColorSlider,
  VueColorSwatch,
  VueColorSwatchPicker,
  VueColorWheel
} from '@vue-spectrum/color';
import {
  ColorArea as RootColorArea,
  ColorEditor as RootColorEditor,
  ColorField as RootColorField,
  ColorPicker as RootColorPicker,
  ColorSlider as RootColorSlider,
  ColorSwatch as RootColorSwatch,
  ColorSwatchPicker as RootColorSwatchPicker,
  ColorWheel as RootColorWheel,
  getColorChannels as RootGetColorChannels,
  parseColor as RootParseColor,
  VueColorArea as RootVueColorArea,
  VueColorEditor as RootVueColorEditor,
  VueColorField as RootVueColorField,
  VueColorPicker as RootVueColorPicker,
  VueColorSlider as RootVueColorSlider,
  VueColorSwatch as RootVueColorSwatch,
  VueColorSwatchPicker as RootVueColorSwatchPicker,
  VueColorWheel as RootVueColorWheel
} from '../../../packages/@vue-spectrum/color/index';
import {
  DateField,
  DatePicker,
  DateRangePicker,
  TimeField,
  VueDateField,
  VueDatePicker,
  VueDateRangePicker,
  VueTimeField
} from '@vue-spectrum/datepicker';
import {
  DateField as RootDateField,
  DatePicker as RootDatePicker,
  DateRangePicker as RootDateRangePicker,
  TimeField as RootTimeField,
  VueDateField as RootVueDateField,
  VueDatePicker as RootVueDatePicker,
  VueDateRangePicker as RootVueDateRangePicker,
  VueTimeField as RootVueTimeField
} from '../../../packages/@vue-spectrum/datepicker/index';
import {
  Badge,
  VueBadge
} from '@vue-spectrum/badge';
import {
  Badge as RootBadge,
  VueBadge as RootVueBadge
} from '../../../packages/@vue-spectrum/badge/index';
import {
  Field,
  HelpText,
  Label,
  VueLabel
} from '@vue-spectrum/label';
import {
  Field as RootField,
  HelpText as RootHelpText,
  Label as RootLabel,
  VueLabel as RootVueLabel
} from '../../../packages/@vue-spectrum/label/index';
import {
  Well,
  VueWell
} from '@vue-spectrum/well';
import {
  Well as RootWell,
  VueWell as RootVueWell
} from '../../../packages/@vue-spectrum/well/index';
import {
  clearToastQueue,
  createToastQueue,
  ToastContainer,
  ToastQueue,
  VueToastContainer
} from '@vue-spectrum/toast';
import {
  clearToastQueue as RootClearToastQueue,
  createToastQueue as RootCreateToastQueue,
  ToastContainer as RootToastContainer,
  ToastQueue as RootToastQueue,
  VueToastContainer as RootVueToastContainer
} from '../../../packages/@vue-spectrum/toast/index';
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
  Content as RootContent,
  Footer as RootFooter,
  Header as RootHeader,
  View as RootView
} from '../../../packages/@vue-spectrum/view/index';
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
  Item as RootPickerItem,
  Picker as RootPicker,
  Section as RootPickerSection,
  VuePicker as RootVuePicker
} from '../../../packages/@vue-spectrum/picker/index';
import {
  Autocomplete,
  Item as AutocompleteItem,
  SearchAutocomplete,
  Section as AutocompleteSection,
  VueSearchAutocomplete
} from '@vue-spectrum/autocomplete';
import {
  Autocomplete as RootAutocomplete,
  Item as RootAutocompleteItem,
  SearchAutocomplete as RootSearchAutocomplete,
  Section as RootAutocompleteSection,
  VueSearchAutocomplete as RootVueSearchAutocomplete
} from '../../../packages/@vue-spectrum/autocomplete/index';
import {
  ComboBox,
  Item as ComboBoxItem,
  Section as ComboBoxSection,
  VueComboBox
} from '@vue-spectrum/combobox';
import {
  ComboBox as RootComboBox,
  Item as RootComboBoxItem,
  Section as RootComboBoxSection,
  VueComboBox as RootVueComboBox
} from '../../../packages/@vue-spectrum/combobox/index';
import {
  Form,
  useFormProps,
  VueForm
} from '@vue-spectrum/form';
import {
  Form as RootForm,
  useFormProps as RootUseFormProps,
  VueForm as RootVueForm
} from '../../../packages/@vue-spectrum/form/index';
import {
  Provider as SpectrumProvider,
  useProvider as useSpectrumProvider,
  useProviderProps as useSpectrumProviderProps,
  VueProvider as SpectrumVueProvider
} from '@vue-spectrum/provider';
import {
  Provider as RootSpectrumProvider,
  useProvider as RootUseSpectrumProvider,
  useProviderProps as RootUseSpectrumProviderProps,
  VueProvider as RootSpectrumVueProvider
} from '../../../packages/@vue-spectrum/provider/index';
import {
  Flex,
  fitContent,
  Grid,
  minmax,
  repeat,
  VueFlex,
  VueGrid
} from '@vue-spectrum/layout';
import {
  Flex as RootFlex,
  fitContent as RootFitContent,
  Grid as RootGrid,
  minmax as RootMinmax,
  repeat as RootRepeat,
  VueFlex as RootVueFlex,
  VueGrid as RootVueGrid
} from '../../../packages/@vue-spectrum/layout/index';
import {
  Heading,
  Keyboard,
  Text,
  VueText
} from '@vue-spectrum/text';
import {
  Heading as RootHeading,
  Keyboard as RootKeyboard,
  Text as RootText,
  VueText as RootVueText
} from '../../../packages/@vue-spectrum/text/index';
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
  TextArea,
  TextField,
  TextFieldBase,
  VueTextField
} from '@vue-spectrum/textfield';
import {
  TextArea as RootTextArea,
  TextField as RootTextField,
  TextFieldBase as RootTextFieldBase,
  VueTextField as RootVueTextField
} from '../../../packages/@vue-spectrum/textfield/index';
import {
  SearchField,
  VueSearchField
} from '@vue-spectrum/searchfield';
import {
  SearchField as RootSearchField,
  VueSearchField as RootVueSearchField
} from '../../../packages/@vue-spectrum/searchfield/index';
import {
  IllustratedMessage,
  VueIllustratedMessage
} from '@vue-spectrum/illustratedmessage';
import {
  IllustratedMessage as RootIllustratedMessage,
  VueIllustratedMessage as RootVueIllustratedMessage
} from '../../../packages/@vue-spectrum/illustratedmessage/index';
import {
  LabeledValue,
  VueLabeledValue
} from '@vue-spectrum/labeledvalue';
import {
  LabeledValue as RootLabeledValue,
  VueLabeledValue as RootVueLabeledValue
} from '../../../packages/@vue-spectrum/labeledvalue/index';
import {
  Icon,
  Illustration,
  UIIcon,
  VueIcon,
  VueIllustration,
  VueUIIcon
} from '@vue-spectrum/icon';
import {
  Icon as RootIcon,
  Illustration as RootIllustration,
  UIIcon as RootUIIcon,
  VueIcon as RootVueIcon,
  VueIllustration as RootVueIllustration,
  VueUIIcon as RootVueUIIcon
} from '../../../packages/@vue-spectrum/icon/index';
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
  DIRECTORY_DRAG_TYPE as RootDirectoryDragType,
  DropZone as RootSpectrumDropZone,
  useDragAndDrop as RootUseSpectrumDragAndDrop,
  VueDropZone as RootVueDropZone
} from '../../../packages/@vue-spectrum/dnd/index';
import {
  DropZone as SpectrumFileDropZone,
  VueDropZone as SpectrumVueFileDropZone
} from '@vue-spectrum/dropzone';
import {
  DropZone as RootSpectrumFileDropZone,
  VueDropZone as RootSpectrumVueFileDropZone
} from '../../../packages/@vue-spectrum/dropzone/index';
import {
  Item as TabItem,
  TabList,
  TabPanels,
  Tabs,
  VueTabs
} from '@vue-spectrum/tabs';
import {
  Item as RootTabItem,
  TabList as RootTabList,
  TabPanels as RootTabPanels,
  Tabs as RootTabs,
  VueTabs as RootVueTabs
} from '../../../packages/@vue-spectrum/tabs/index';

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

  it('keeps checkbox exports aligned with VueCheckbox base entry and group primitive', () => {
    expect(Checkbox).toBe(VueCheckbox);
    expect(CheckboxGroup).not.toBe(VueCheckbox);
  });

  it('keeps root checkbox entry exports aligned with source exports', () => {
    expect(RootCheckbox).toBe(Checkbox);
    expect(RootVueCheckbox).toBe(VueCheckbox);
    expect(RootCheckboxGroup).toBe(CheckboxGroup);
  });

  it('keeps color exports aligned with Vue color aliases and helpers', () => {
    expect(ColorArea).toBe(VueColorArea);
    expect(ColorEditor).toBe(VueColorEditor);
    expect(ColorField).toBe(VueColorField);
    expect(ColorPicker).toBe(VueColorPicker);
    expect(ColorSlider).toBe(VueColorSlider);
    expect(ColorSwatch).toBe(VueColorSwatch);
    expect(ColorSwatchPicker).toBe(VueColorSwatchPicker);
    expect(ColorWheel).toBe(VueColorWheel);
    expect(parseColor('#abc')).toBe('#aabbcc');
    expect(getColorChannels('rgb')).toEqual(['red', 'green', 'blue']);
  });

  it('keeps root color entry exports aligned with source exports', () => {
    expect(RootColorArea).toBe(ColorArea);
    expect(RootVueColorArea).toBe(VueColorArea);
    expect(RootColorEditor).toBe(ColorEditor);
    expect(RootVueColorEditor).toBe(VueColorEditor);
    expect(RootColorField).toBe(ColorField);
    expect(RootVueColorField).toBe(VueColorField);
    expect(RootColorPicker).toBe(ColorPicker);
    expect(RootVueColorPicker).toBe(VueColorPicker);
    expect(RootColorSlider).toBe(ColorSlider);
    expect(RootVueColorSlider).toBe(VueColorSlider);
    expect(RootColorSwatch).toBe(ColorSwatch);
    expect(RootVueColorSwatch).toBe(VueColorSwatch);
    expect(RootColorSwatchPicker).toBe(ColorSwatchPicker);
    expect(RootVueColorSwatchPicker).toBe(VueColorSwatchPicker);
    expect(RootColorWheel).toBe(ColorWheel);
    expect(RootVueColorWheel).toBe(VueColorWheel);
    expect(RootParseColor).toBe(parseColor);
    expect(RootGetColorChannels).toBe(getColorChannels);
  });

  it('keeps datepicker exports aligned with Vue date/time aliases', () => {
    expect(DateField).toBe(VueDateField);
    expect(DatePicker).toBe(VueDatePicker);
    expect(DateRangePicker).toBe(VueDateRangePicker);
    expect(TimeField).toBe(VueTimeField);
  });

  it('keeps root datepicker entry exports aligned with source exports', () => {
    expect(RootDateField).toBe(DateField);
    expect(RootVueDateField).toBe(VueDateField);
    expect(RootDatePicker).toBe(DatePicker);
    expect(RootVueDatePicker).toBe(VueDatePicker);
    expect(RootDateRangePicker).toBe(DateRangePicker);
    expect(RootVueDateRangePicker).toBe(VueDateRangePicker);
    expect(RootTimeField).toBe(TimeField);
    expect(RootVueTimeField).toBe(VueTimeField);
  });

  it('keeps badge exports aligned with VueBadge base entry', () => {
    expect(Badge).toBe(VueBadge);
  });

  it('keeps root badge entry exports aligned with source exports', () => {
    expect(RootBadge).toBe(Badge);
    expect(RootVueBadge).toBe(VueBadge);
  });

  it('keeps label exports aligned with VueLabel base entry and field helpers', () => {
    expect(Label).toBe(VueLabel);
    expect(HelpText).not.toBe(VueLabel);
    expect(Field).not.toBe(VueLabel);
  });

  it('keeps root label entry exports aligned with source exports', () => {
    expect(RootLabel).toBe(Label);
    expect(RootVueLabel).toBe(VueLabel);
    expect(RootHelpText).toBe(HelpText);
    expect(RootField).toBe(Field);
  });

  it('keeps well exports aligned with VueWell base entry', () => {
    expect(Well).toBe(VueWell);
  });

  it('keeps root well entry exports aligned with source exports', () => {
    expect(RootWell).toBe(Well);
    expect(RootVueWell).toBe(VueWell);
  });

  it('keeps toast exports aligned with VueToastContainer and queue helpers', () => {
    expect(ToastContainer).toBe(VueToastContainer);
    expect(ToastQueue).toBeTypeOf('object');
    expect(createToastQueue).toBeTypeOf('function');
    expect(clearToastQueue).toBeTypeOf('function');
  });

  it('keeps root toast entry exports aligned with source exports', () => {
    expect(RootToastContainer).toBe(ToastContainer);
    expect(RootVueToastContainer).toBe(VueToastContainer);
    expect(RootToastQueue).toBe(ToastQueue);
    expect(RootCreateToastQueue).toBe(createToastQueue);
    expect(RootClearToastQueue).toBe(clearToastQueue);
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

  it('keeps root view entry exports aligned with source exports', () => {
    expect(RootView).toBe(View);
    expect(RootHeader).toBe(Header);
    expect(RootContent).toBe(Content);
    expect(RootFooter).toBe(Footer);
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

  it('keeps root picker entry exports aligned with source exports', () => {
    expect(RootPicker).toBe(Picker);
    expect(RootVuePicker).toBe(VuePicker);
    expect(RootPickerItem).toBe(PickerItem);
    expect(RootPickerSection).toBe(PickerSection);
  });

  it('exports autocomplete collection primitives separately from VueSearchAutocomplete', () => {
    expect(Autocomplete).toBe(VueSearchAutocomplete);
    expect(SearchAutocomplete).toBe(VueSearchAutocomplete);
    expect(AutocompleteItem).not.toBe(VueSearchAutocomplete);
    expect(AutocompleteSection).not.toBe(VueSearchAutocomplete);
  });

  it('keeps root autocomplete entry exports aligned with source exports', () => {
    expect(RootAutocomplete).toBe(Autocomplete);
    expect(RootSearchAutocomplete).toBe(SearchAutocomplete);
    expect(RootVueSearchAutocomplete).toBe(VueSearchAutocomplete);
    expect(RootAutocompleteItem).toBe(AutocompleteItem);
    expect(RootAutocompleteSection).toBe(AutocompleteSection);
  });

  it('exports combobox collection primitives separately from VueComboBox', () => {
    expect(ComboBox).toBe(VueComboBox);
    expect(ComboBoxItem).not.toBe(VueComboBox);
    expect(ComboBoxSection).not.toBe(VueComboBox);
  });

  it('keeps root combobox entry exports aligned with source exports', () => {
    expect(RootComboBox).toBe(ComboBox);
    expect(RootVueComboBox).toBe(VueComboBox);
    expect(RootComboBoxItem).toBe(ComboBoxItem);
    expect(RootComboBoxSection).toBe(ComboBoxSection);
  });

  it('keeps form exports aligned with VueForm base entry and helper', () => {
    expect(Form).toBe(VueForm);
    expect(useFormProps).toBeTypeOf('function');
  });

  it('keeps root form entry exports aligned with source exports', () => {
    expect(RootForm).toBe(Form);
    expect(RootVueForm).toBe(VueForm);
    expect(RootUseFormProps).toBe(useFormProps);
  });

  it('keeps provider exports aligned with VueProvider base entry and helpers', () => {
    expect(SpectrumProvider).toBe(SpectrumVueProvider);
    expect(useSpectrumProvider).toBeTypeOf('function');
    expect(useSpectrumProviderProps).toBeTypeOf('function');
  });

  it('keeps root provider entry exports aligned with source exports', () => {
    expect(RootSpectrumProvider).toBe(SpectrumProvider);
    expect(RootSpectrumVueProvider).toBe(SpectrumVueProvider);
    expect(RootUseSpectrumProvider).toBe(useSpectrumProvider);
    expect(RootUseSpectrumProviderProps).toBe(useSpectrumProviderProps);
  });

  it('keeps layout exports aligned with Vue layout bases and helpers', () => {
    expect(Flex).toBe(VueFlex);
    expect(Grid).toBe(VueGrid);
    expect(repeat(2, '1fr')).toBe('repeat(2, 1fr)');
    expect(minmax('0', '1fr')).toBe('minmax(0, 1fr)');
    expect(fitContent('100px')).toBe('fit-content(100px)');
  });

  it('keeps root layout entry exports aligned with source exports', () => {
    expect(RootFlex).toBe(Flex);
    expect(RootVueFlex).toBe(VueFlex);
    expect(RootGrid).toBe(Grid);
    expect(RootVueGrid).toBe(VueGrid);
    expect(RootRepeat).toBe(repeat);
    expect(RootMinmax).toBe(minmax);
    expect(RootFitContent).toBe(fitContent);
  });

  it('exports semantic text primitives on top of VueText', () => {
    expect(Text).not.toBe(VueText);
    expect(Heading).not.toBe(VueText);
    expect(Keyboard).not.toBe(VueText);
  });

  it('keeps root text entry exports aligned with source exports', () => {
    expect(RootText).toBe(Text);
    expect(RootVueText).toBe(VueText);
    expect(RootHeading).toBe(Heading);
    expect(RootKeyboard).toBe(Keyboard);
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

  it('exports dedicated textfield wrappers around VueTextField', () => {
    expect(TextField).toBe(VueTextField);
    expect(TextFieldBase).not.toBe(VueTextField);
    expect(TextArea).not.toBe(VueTextField);
  });

  it('keeps root textfield entry exports aligned with source exports', () => {
    expect(RootTextField).toBe(TextField);
    expect(RootVueTextField).toBe(VueTextField);
    expect(RootTextFieldBase).toBe(TextFieldBase);
    expect(RootTextArea).toBe(TextArea);
  });

  it('keeps searchfield exports aligned with VueSearchField base entry', () => {
    expect(SearchField).toBe(VueSearchField);
  });

  it('keeps root searchfield entry exports aligned with source exports', () => {
    expect(RootSearchField).toBe(SearchField);
    expect(RootVueSearchField).toBe(VueSearchField);
  });

  it('keeps illustratedmessage exports aligned with VueIllustratedMessage base entry', () => {
    expect(IllustratedMessage).toBe(VueIllustratedMessage);
  });

  it('keeps root illustratedmessage entry exports aligned with source exports', () => {
    expect(RootIllustratedMessage).toBe(IllustratedMessage);
    expect(RootVueIllustratedMessage).toBe(VueIllustratedMessage);
  });

  it('keeps labeledvalue exports aligned with VueLabeledValue base entry', () => {
    expect(LabeledValue).toBe(VueLabeledValue);
  });

  it('keeps root labeledvalue entry exports aligned with source exports', () => {
    expect(RootLabeledValue).toBe(LabeledValue);
    expect(RootVueLabeledValue).toBe(VueLabeledValue);
  });

  it('keeps icon exports wired to Vue icon primitives', () => {
    expect(Icon).toBe(VueIcon);
    expect(UIIcon).toBe(VueUIIcon);
    expect(Illustration).toBe(VueIllustration);
  });

  it('keeps root icon entry exports aligned with source exports', () => {
    expect(RootIcon).toBe(Icon);
    expect(RootVueIcon).toBe(VueIcon);
    expect(RootUIIcon).toBe(UIIcon);
    expect(RootVueUIIcon).toBe(VueUIIcon);
    expect(RootIllustration).toBe(Illustration);
    expect(RootVueIllustration).toBe(VueIllustration);
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

  it('keeps root dnd entry exports aligned with source exports', () => {
    expect(RootDirectoryDragType).toBe(DIRECTORY_DRAG_TYPE);
    expect(RootSpectrumDropZone).toBe(SpectrumDropZone);
    expect(RootVueDropZone).toBe(SpectrumDropZone);
    expect(RootUseSpectrumDragAndDrop).toBe(useSpectrumDragAndDrop);
  });

  it('keeps dropzone exports aligned with VueDropZone base entry', () => {
    expect(SpectrumFileDropZone).toBe(SpectrumVueFileDropZone);
  });

  it('keeps root dropzone entry exports aligned with source exports', () => {
    expect(RootSpectrumFileDropZone).toBe(SpectrumFileDropZone);
    expect(RootSpectrumVueFileDropZone).toBe(SpectrumVueFileDropZone);
  });

  it('exports tabs collection item separately from VueTabs', () => {
    expect(Tabs).toBe(VueTabs);
    expect(TabList).not.toBe(VueTabs);
    expect(TabPanels).not.toBe(VueTabs);
    expect(TabItem).not.toBe(VueTabs);
  });

  it('keeps root tabs entry exports aligned with source exports', () => {
    expect(RootTabs).toBe(Tabs);
    expect(RootVueTabs).toBe(VueTabs);
    expect(RootTabList).toBe(TabList);
    expect(RootTabPanels).toBe(TabPanels);
    expect(RootTabItem).toBe(TabItem);
  });
});
