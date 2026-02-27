import {mount} from '@vue/test-utils';
import {nextTick} from 'vue';
import {describe, expect, it} from 'vitest';
import gridListMeta, {MyGridListItem} from '../../../packages/vue-aria-components/stories/GridList.stories';
import listBoxMeta, {ListBoxExample, MyListBoxLoaderIndicator} from '../../../packages/vue-aria-components/stories/ListBox.stories';
import tableMeta, {
  DndTable,
  DndTableWithNoValidDropTargets,
  OnLoadMoreTableVirtualizedResizeWrapperStory,
  TableWithSuspense,
  makePromise,
  MyCheckbox
} from '../../../packages/vue-aria-components/stories/Table.stories';
import tagGroupMeta, {
  EmptyTagGroup,
  MyTag,
  TagGroupExample,
  TagGroupExampleWithRemove
} from '../../../packages/vue-aria-components/stories/TagGroup.stories';
import {
  CalendarFirstDayOfWeekExample,
  CalendarMultiMonth,
  CalendarResetValue,
  RangeCalendarMultiMonthExample
} from '../../../packages/vue-aria-components/stories/Calendar.stories';
import {SelectSupport as ToolbarSelectSupport, ToolbarExample} from '../../../packages/vue-aria-components/stories/Toolbar.stories';
import treeMeta, {TreeExampleStaticRender} from '../../../packages/vue-aria-components/stories/Tree.stories';
import {
  AutocompleteSearchfield,
  AutocompleteInPopover,
  AutocompleteInPopoverDialogTrigger,
  AutocompleteMenuInPopoverDialogTrigger,
  AutocompleteWithListbox,
  AutocompleteWithVirtualizedListbox
} from '../../../packages/vue-aria-components/stories/Autocomplete.stories';
import {
  AsyncVirtualizedCollectionRenderSelect,
  SelectExample,
  SelectManyItems,
  SelectRenderProps,
  SelectWithTagGroup,
  VirtualizedSelect
} from '../../../packages/vue-aria-components/stories/Select.stories';
import {
  ButtonExample,
  ButtonPerformance,
  ButtonRender,
  PendingButton,
  PendingButtonTooltip,
  RippleButtonExample
} from '../../../packages/vue-aria-components/stories/Button.stories';
import {BreadcrumbsExample, DynamicBreadcrumbsExample} from '../../../packages/vue-aria-components/stories/Breadcrumbs.stories';
import {CheckboxExample} from '../../../packages/vue-aria-components/stories/Checkbox.stories';
import {CheckboxGroupExample, CheckboxGroupSubmitExample} from '../../../packages/vue-aria-components/stories/CheckboxGroup.stories';
import {LinkExample as RacLinkExample} from '../../../packages/vue-aria-components/stories/Link.stories';
import {
  DateRangePickerInsideModalStory as RacDateRangePickerInsideModalStory,
  InertTestStory as RacInertTestStory,
  ModalExample as RacModalExample
} from '../../../packages/vue-aria-components/stories/Modal.stories';
import {ColorAreaExample as RacColorAreaExample} from '../../../packages/vue-aria-components/stories/ColorArea.stories';
import {ColorFieldExample as RacColorFieldExample} from '../../../packages/vue-aria-components/stories/ColorField.stories';
import {
  ColorPickerExample as RacColorPickerExample,
  ColorPickerSliders as RacColorPickerSliders
} from '../../../packages/vue-aria-components/stories/ColorPicker.stories';
import {ColorSliderExample as RacColorSliderExample} from '../../../packages/vue-aria-components/stories/ColorSlider.stories';
import {ColorSwatchExample as RacColorSwatchExample} from '../../../packages/vue-aria-components/stories/ColorSwatch.stories';
import {ColorWheelExample as RacColorWheelExample} from '../../../packages/vue-aria-components/stories/ColorWheel.stories';
import {
  SliderCSS as RacSliderCSS,
  SliderExample as RacSliderExample
} from '../../../packages/vue-aria-components/stories/Slider.stories';
import {
  FileTriggerButton as RacFileTriggerButton,
  FileTriggerDirectories as RacFileTriggerDirectories,
  FileTriggerLinkAllowsMultiple as RacFileTriggerLinkAllowsMultiple
} from '../../../packages/vue-aria-components/stories/FileTrigger.stories';
import {
  CollectionPreviewOffset as DndCollectionPreviewOffset,
  DraggableDisabled as DndDraggableDisabled,
  DraggableEnabledDisabledControl as DndDraggableEnabledDisabledControl,
  DraggableStory as DndDraggableStory,
  InDialog as DndInDialog,
  MultipleCollectionDropTargets as DndMultipleCollectionDropTargets,
  NestedDropRegions as DndNestedDropRegions,
  PreviewOffset as DndPreviewOffset,
  Reorderable as DndReorderable
} from '../../../packages/vue-aria-components/stories/dnd.stories';
import {GCuseId as UseIdGCuseId} from '../../../packages/vue-aria-components/stories/useId.stories';
import {SwitchExample as RacSwitchExample} from '../../../packages/vue-aria-components/stories/Switch.stories';
import {SearchFieldExample as RacSearchFieldExample} from '../../../packages/vue-aria-components/stories/SearchField.stories';
import {FormAutoFillExample as RacFormAutoFillExample} from '../../../packages/vue-aria-components/stories/Form.stories';
import {
  DisclosureControlledExample as RacDisclosureControlledExample,
  DisclosureExample as RacDisclosureExample
} from '../../../packages/vue-aria-components/stories/Disclosure.stories';
import {DisclosureGroupExample as RacDisclosureGroupExample} from '../../../packages/vue-aria-components/stories/DisclosureGroup.stories';
import {
  DropZoneOnlyAcceptPNGWithFileTrigger as RacDropZoneOnlyAcceptPNGWithFileTrigger,
  DropzoneExampleWithFileTriggerLink as RacDropzoneExampleWithFileTriggerLink,
  DropzoneWithRenderProps as RacDropzoneWithRenderProps
} from '../../../packages/vue-aria-components/stories/Dropzone.stories';
import {TextFieldSubmitExample as RacTextFieldSubmitExample, TextfieldExample as RacTextfieldExample} from '../../../packages/vue-aria-components/stories/TextField.stories';
import {TimeFieldExample as RacTimeFieldExample} from '../../../packages/vue-aria-components/stories/TimeField.stories';
import {MeterExample as RacMeterExample} from '../../../packages/vue-aria-components/stories/Meter.stories';
import {ProgressBarExample as RacProgressBarExample} from '../../../packages/vue-aria-components/stories/ProgressBar.stories';
import {
  NumberFieldControlledExample as RacNumberFieldControlledExample,
  NumberFieldExample as RacNumberFieldExample
} from '../../../packages/vue-aria-components/stories/NumberField.stories';
import {PopoverTriggerObserverExample as RacPopoverTriggerObserverExample} from '../../../packages/vue-aria-components/stories/Popover.stories';
import {TooltipArrowBoundaryOffsetExample as RacTooltipArrowBoundaryOffsetExample} from '../../../packages/vue-aria-components/stories/Tooltip.stories';
import {
  RadioGroupControlledExample as RacRadioGroupControlledExample,
  RadioGroupExample as RacRadioGroupExample,
  RadioGroupInDialogExample as RacRadioGroupInDialogExample,
  RadioGroupSubmitExample as RacRadioGroupSubmitExample
} from '../../../packages/vue-aria-components/stories/RadioGroup.stories';
import {
  WithAvatars as SearchAutocompleteWithAvatars,
  iconFilter as SearchAutocompleteIconFilter,
  iconNull as SearchAutocompleteIconNull
} from '../../../packages/@vue-spectrum/autocomplete/stories/SearchAutocomplete.stories';
import {WithExpandedKeys as AccordionWithExpandedKeys} from '../../../packages/@vue-spectrum/accordion/stories/Accordion.stories';
import {Default as ActionBarDefaultStory} from '../../../packages/@vue-spectrum/actionbar/stories/ActionBar.stories';
import {
  Default as ActionGroupDefault,
  StaticColorWhite as ActionGroupStaticColorWhite,
  WithTooltips as ActionGroupWithTooltips
} from '../../../packages/@vue-spectrum/actiongroup/stories/ActionGroup.stories';
import {
  Default as SpectrumToolbarDefault,
  DisabledKeys as SpectrumToolbarDisabledKeys
} from '../../../packages/@vue-spectrum/actiongroup/stories/Toolbar.stories';
import {
  ControlledCards as GridCardViewControlledCards,
  DisabledKeys as GridCardViewDisabledKeys,
  FalsyIds as GridCardViewFalsyIds
} from '../../../packages/@vue-spectrum/card/stories/GridCardView.stories';
import {
  ControlledOpen as ActionMenuControlledOpen,
  DefaultOpen as ActionMenuDefaultOpen,
  DirectionAlignFlip as ActionMenuDirectionAlignFlip,
  WithTooltip as ActionMenuWithTooltip
} from '../../../packages/@vue-spectrum/menu/stories/ActionMenu.stories';
import {Default as DialogContainerDefault, InAMenu as DialogContainerInAMenu, IsDismissable as DialogContainerIsDismissable, NestedDialogContainers as DialogContainerNestedDialogContainers} from '../../../packages/@vue-spectrum/dialog/stories/DialogContainer.stories';
import {
  _AlertDialog as DialogTriggerAlertDialog,
  TypeModalIsDismissable as DialogTriggerTypeModalIsDismissable,
  WithMenuTrigger as DialogTriggerWithMenuTrigger,
  MobileTypeFullscreen as DialogTriggerMobileTypeFullscreen,
  MobileTypeFullscreenTakeover as DialogTriggerMobileTypeFullscreenTakeover,
  PopoverWithMobileTypeModal as DialogTriggerPopoverWithMobileTypeModal,
  PopoverWithMobileTypeTray as DialogTriggerPopoverWithMobileTypeTray,
  ShouldFlipWithWidth as DialogTriggerShouldFlipWithWidth,
  TriggerVisibleThroughUnderlay as DialogTriggerTriggerVisibleThroughUnderlay,
  TriggersOnEdges as DialogTriggerTriggersOnEdges
} from '../../../packages/@vue-spectrum/dialog/stories/DialogTrigger.stories';
import {
  AutoFocusCancel as AlertDialogAutoFocusCancel,
  Destructive as AlertDialogDestructive,
  PrimaryDisabled as AlertDialogPrimaryDisabled
} from '../../../packages/@vue-spectrum/dialog/stories/AlertDialog.stories';
import {CustomCalendar as DatePickerCustomCalendarStory} from '../../../packages/@vue-spectrum/datepicker/stories/DatePicker.stories';
import {CustomCalendar as DateRangePickerCustomCalendarStory} from '../../../packages/@vue-spectrum/datepicker/stories/DateRangePicker.stories';
import {
  AllControlled as ComboBoxAllControlledStory,
  ControlledInputDefaultKey as ComboBoxControlledInputDefaultKeyStory,
  ControlledInputValue as ComboBoxControlledInputValueBySelectedKeyStory,
  ControlledInputValueStory as ComboBoxControlledInputValueStory,
  ControlledSelectedKey as ComboBoxControlledSelectedKeyStory,
  DefaultInputAndKey as ComboBoxDefaultInputAndKeyStory,
  DefaultInputValue as ComboBoxDefaultInputValueStory,
  DefaultSelectedKey as ComboBoxDefaultSelectedKeyStory,
  DisabledKeys as ComboBoxDisabledKeysStory
} from '../../../packages/@vue-spectrum/combobox/stories/ComboBox.stories';
import {DragOut as ListViewDnDDragOut} from '../../../packages/@vue-spectrum/list/stories/ListViewDnD.stories';
import {DragOut as ListViewDnDUtilDragOut} from '../../../packages/@vue-spectrum/list/stories/ListViewDnDUtil.stories';
import {Disabled as PickerDisabledKeysStory} from '../../../packages/@vue-spectrum/picker/stories/Picker.stories';
import {
  Links as SpectrumListBoxLinks,
  ListBoxWManySectionsAndSelection as SpectrumListBoxManySectionsAndSelection,
  ListBoxWSections as SpectrumListBoxSections,
  ListBoxWSectionsAndFalsyIds as SpectrumListBoxSectionsAndFalsyIds,
  ListBoxWSectionsAndNoTitle as SpectrumListBoxSectionsAndNoTitle,
  MultipleSelection as SpectrumListBoxMultipleSelection,
  MultipleSelectionStatic as SpectrumListBoxMultipleSelectionStatic,
  SingleSelectionWithDefaultSelectedOption as SpectrumListBoxSingleSelectionWithDefaultSelectedOption,
  StaticWithDefaultSelectedOptions as SpectrumListBoxStaticWithDefaultSelectedOptions,
  StaticWithDisabledOptions as SpectrumListBoxStaticWithDisabledOptions,
  StaticWithSelectedOptionsControlled as SpectrumListBoxStaticWithSelectedOptionsControlled,
  WithDefaultSelectedOption as SpectrumListBoxWithDefaultSelectedOption,
  WithAvatars as SpectrumListBoxWithAvatars,
  WithSemanticElementsGenerativeMultipleSelection as SpectrumListBoxWithSemanticElementsGenerativeMultipleSelection,
  WithSelectedOptionsControlled as SpectrumListBoxWithSelectedOptionsControlled,
  WithTreeData as SpectrumListBoxWithTreeData,
  WithDisabledOptions as SpectrumListBoxWithDisabledOptions
} from '../../../packages/@vue-spectrum/listbox/stories/ListBox.stories';
import {
  ActionButtons as ListViewActionsActionButtons,
  ActionGroups as ListViewActionsActionGroups,
  ActionMenus as ListViewActionsActionMenus,
  ActionMenusGroup as ListViewActionsActionMenusGroup
} from '../../../packages/@vue-spectrum/list/stories/ListViewActions.stories';
import {
  Default as ListViewDefaultStory,
  WithActionBar as ListViewWithActionBarStory
} from '../../../packages/@vue-spectrum/list/stories/ListView.stories';
import {
  Default as ListViewSelectionDefault,
  OnAction as ListViewSelectionOnAction
} from '../../../packages/@vue-spectrum/list/stories/ListViewSelection.stories';
import {
  AlignEnd as MenuTriggerAlignEnd,
  CloseOnSelectFalse as MenuTriggerCloseOnSelectFalse,
  DirectionTop as MenuTriggerDirectionTop,
  MenuItemUnavailable as MenuTriggerItemUnavailable,
  MenuItemUnavailableDynamic as MenuTriggerItemUnavailableDynamic,
  MenuItemUnavailableToggling as MenuTriggerItemUnavailableToggling,
  MenuItemUnavailableWithSelection as MenuTriggerItemUnavailableWithSelection,
  MenuWithAutoFocusTrueDefaultSelectedKeyUncontrolledSelectionModeSingle as MenuTriggerAutoFocusSingleDefaultSelectedUncontrolled,
  MultipleDefaultSelectedKeyControlledStatic as MenuTriggerMultipleDefaultSelectedControlledStatic,
  MultipleDefaultSelectedKeyUncontrolledGenerative as MenuTriggerMultipleDefaultSelectedUncontrolledGenerative,
  MultipleDefaultSelectedKeyUncontrolledStatic as MenuTriggerMultipleDefaultSelectedUncontrolledStatic,
  MenuWithLinks as MenuTriggerWithLinks,
  MultipleSelectedKeyControlledGenerative as MenuTriggerMultipleSelectedControlledGenerative,
  MenuTriggerWithTriggerLongPress as MenuTriggerWithTriggerLongPress,
  MenuWithAutoFocusFirst as MenuTriggerWithAutoFocusFirst,
  MenuWithKeyboardSelectionWrappingFalse as MenuTriggerWithKeyboardSelectionWrappingFalse,
  SingleDefaultSelectedKeyUncontrolledGenerative as MenuTriggerSingleDefaultSelectedUncontrolledGenerative,
  SingleDefaultSelectedKeyUncontrolledStatic as MenuTriggerSingleDefaultSelectedUncontrolledStatic
} from '../../../packages/@vue-spectrum/menu/stories/MenuTrigger.stories';
import {
  ConditionalSubmenu as MenuSubmenuConditional,
  SubmenuSelection as MenuSubmenuSelection,
  SubmenuStatic as MenuSubmenuStatic,
  UnavailableWithSubmenu as MenuSubmenuUnavailable
} from '../../../packages/@vue-spectrum/menu/stories/Submenu.stories';
import {
  Default as RangeSliderDefault,
  _ContextualHelp as RangeSliderContextualHelp,
  CustomValueLabel as RangeSliderCustomValueLabel
} from '../../../packages/@vue-spectrum/slider/stories/RangeSlider.stories';
import {
  Default as SliderDefault,
  _ContextualHelp as SliderContextualHelp,
  CustomValueLabel as SliderCustomValueLabel,
  FillOffset as SliderFillOffset,
  TrackGradient as SliderTrackGradient
} from '../../../packages/@vue-spectrum/slider/stories/Slider.stories';
import {DisabledKey as StepListDisabledKeyStory} from '../../../packages/@vue-spectrum/steplist/stories/StepList.stories';
import {Default as SpectrumTagGroupDefault} from '../../../packages/@vue-spectrum/tag/stories/TagGroup.stories';
import {DragOutOfTable as TableDnDDragOutOfTable} from '../../../packages/@vue-spectrum/table/stories/TableDnD.stories';
import {DragOutOfTable as TableDnDUtilDragOutOfTable} from '../../../packages/@vue-spectrum/table/stories/TableDnDUtil.stories';
import {
  ColumnWidthsAndDividers as TableColumnWidthsAndDividers,
  DynamicWithDisabledKeys as TableDynamicWithDisabledKeys,
  DynamicSelectedKeys as TableDynamicSelectedKeys,
  DynamicShowDividers as TableDynamicShowDividers,
  FocusableCells as TableFocusableCells,
  IsLoading as TableIsLoading,
  IsLoadingMore as TableIsLoadingMore,
  Links as TableLinks
} from '../../../packages/@vue-spectrum/table/stories/Table.stories';
import {
  DynamicExpandableRowsStory as TreeGridDynamicExpandableRows,
  StaticExpandableRows as TreeGridStaticExpandableRows
} from '../../../packages/@vue-spectrum/table/stories/TreeGridTable.stories';
import {
  Default as ToastDefault,
  MultipleToastContainers as ToastMultipleToastContainers,
  ProgrammaticallyClosing as ToastProgrammaticallyClosing,
  WithAction as ToastWithAction,
  WithDialog as ToastWithDialog,
  WithIframe as ToastWithIframe,
  withFullscreen as ToastWithFullscreen
} from '../../../packages/@vue-spectrum/toast/stories/Toast.stories';
import {clearToastQueue} from '@vue-spectrum/toast';
import {vi} from 'vitest';

function expectExcluded(meta: unknown, storyName: string) {
  let excludeStories = (meta as {excludeStories?: string[]}).excludeStories;
  expect(excludeStories).toContain(storyName);
}

async function openMenuTriggerInStory(wrapper: ReturnType<typeof mount>) {
  if (wrapper.find('.vs-spectrum-menu').exists()) {
    return;
  }

  let triggerElement = wrapper.find('[aria-haspopup="menu"]');
  if (triggerElement.exists()) {
    await triggerElement.trigger('click');
    await nextTick();
    return;
  }

  let triggerButton = wrapper.findAll('button').find((button) => button.text().trim() === 'Menu Button');
  if (!triggerButton) {
    triggerButton = wrapper.findAll('button').find((button) => {
      let label = (button.attributes('aria-label') ?? '').toLowerCase();
      return label === 'more actions' || label.includes('menu');
    });
  }
  if (!triggerButton) {
    triggerButton = wrapper.findAll('button')[0];
  }
  expect(triggerButton).toBeDefined();
  await triggerButton?.trigger('click');
  await nextTick();
}

describe('Vue storybook helper parity', () => {
  it('keeps helper exports excluded from the story list', () => {
    expectExcluded(gridListMeta, 'MyGridListItem');
    expectExcluded(listBoxMeta, 'MyListBoxLoaderIndicator');
    expectExcluded(tableMeta, 'DndTable');
    expectExcluded(tableMeta, 'makePromise');
    expectExcluded(tableMeta, 'MyCheckbox');
    expectExcluded(tagGroupMeta, 'MyTag');
    expectExcluded(treeMeta, 'TreeExampleStaticRender');
  });

  it('retains helper exports used in parity fixtures', async () => {
    expect(MyGridListItem.className).toBe('item');
    expect(MyGridListItem.style.display).toBe('flex');

    let loader = MyListBoxLoaderIndicator({orientation: 'horizontal'});
    expect(loader.style.height).toBe('100px');
    expect(loader.style.width).toBe('30px');

    expect(MyCheckbox.className).toBe('react-aria-Checkbox');
    let dndFixture = DndTable({});
    expect(dndFixture.template).toContain('First Table');

    let deferred = makePromise<number>();
    deferred.resolve(7);
    await expect(deferred.promise).resolves.toBe(7);

    expect(MyTag({href: 'https://example.com'}).cursor).toBe('pointer');
    expect(TreeExampleStaticRender().template).toContain('tree-item');
  });

  it('keeps story descriptions behavior-focused instead of parity-fixture wording', () => {
    let autocompleteDescription = ((AutocompleteSearchfield as {parameters?: {description?: {data?: string}}}).parameters?.description?.data) ?? '';
    let listboxDescription = ((ListBoxExample as {parameters?: {description?: {data?: string}}}).parameters?.description?.data) ?? '';
    let tableDescription = ((DndTableWithNoValidDropTargets as {parameters?: {description?: {data?: string}}}).parameters?.description?.data) ?? '';
    let tableVirtualizedWrapperDescription = ((OnLoadMoreTableVirtualizedResizeWrapperStory as {parameters?: {description?: {data?: string}}}).parameters?.description?.data) ?? '';
    let tableSuspenseDescription = ((TableWithSuspense as {parameters?: {description?: {data?: string}}}).parameters?.description?.data) ?? '';
    let useIdDescription = ((UseIdGCuseId as {parameters?: {description?: {data?: string}}}).parameters?.description?.data) ?? '';

    expect(autocompleteDescription).toContain('Searchfield variant');
    expect(autocompleteDescription).not.toContain('parity fixture');
    expect(listboxDescription).toContain('Hover and focus styling behavior');
    expect(listboxDescription).not.toContain('parity fixture');
    expect(tableDescription).toContain('drop targets are rejected');
    expect(tableDescription).not.toContain('parity fixture');
    expect(tableVirtualizedWrapperDescription).toContain('Resizable wrapper');
    expect(tableVirtualizedWrapperDescription).not.toContain('fixture');
    expect(tableSuspenseDescription).toContain('transition-preserved rows');
    expect(tableSuspenseDescription).not.toContain('fixture');
    expect(useIdDescription).toContain('useId cleanup behavior');
    expect(useIdDescription).toContain('useSSRSafeId');
    expect(useIdDescription).not.toContain('parity fixture');
  });

  it('keeps useId story wired with live toggle and debug controls', () => {
    let useIdStory = UseIdGCuseId.render?.({}) as ReturnType<Exclude<typeof UseIdGCuseId.render, undefined>>;
    expect(useIdStory.template).toContain('toggle');
    expect(useIdStory.template).toContain('See ids held');
    expect(useIdStory.template).not.toContain('scenario');
  });

  it('renders live tag group stories with selection, removal, and empty-state roles', async () => {
    let interactiveStory = TagGroupExample.render?.({selectionMode: 'single'}) as ReturnType<Exclude<typeof TagGroupExample.render, undefined>>;
    let interactiveWrapper = mount(interactiveStory);
    let tags = interactiveWrapper.findAll('.react-aria-Tag');
    expect(tags).toHaveLength(4);
    expect(interactiveWrapper.get('.react-aria-TagList').attributes('role')).toBe('grid');
    expect(interactiveWrapper.find('a[href="https://nytimes.com"]').exists()).toBe(true);
    expect(tags[0].attributes('role')).toBe('row');

    let removableStory = TagGroupExampleWithRemove.render?.({selectionMode: 'none'}) as ReturnType<Exclude<typeof TagGroupExampleWithRemove.render, undefined>>;
    let removableWrapper = mount(removableStory);
    expect(removableWrapper.findAll('button[slot="remove"]')).toHaveLength(4);
    await removableWrapper.find('button[slot="remove"]').trigger('click');
    await nextTick();
    expect(removableWrapper.findAll('.react-aria-Tag')).toHaveLength(3);

    let emptyStory = EmptyTagGroup.render?.({selectionMode: 'none'}) as ReturnType<Exclude<typeof EmptyTagGroup.render, undefined>>;
    let emptyWrapper = mount(emptyStory);
    expect(emptyWrapper.get('.react-aria-TagList').attributes('role')).toBe('group');
    expect(emptyWrapper.text()).toContain('No categories.');
  });

  it('renders toolbar stories with live useToolbar role/orientation props', () => {
    let toolbarStory = ToolbarExample.render?.({orientation: 'vertical'}) as ReturnType<Exclude<typeof ToolbarExample.render, undefined>>;
    let toolbarWrapper = mount(toolbarStory);
    let toolbarElement = toolbarWrapper.get('.react-aria-Toolbar');
    expect(toolbarElement.attributes('role')).toBe('toolbar');
    expect(toolbarElement.attributes('aria-orientation')).toBe('vertical');
    expect(toolbarElement.attributes('data-orientation')).toBe('vertical');

    let selectStory = ToolbarSelectSupport.render?.({orientation: 'horizontal'}) as ReturnType<Exclude<typeof ToolbarSelectSupport.render, undefined>>;
    let selectWrapper = mount(selectStory);
    let selectToolbarElement = selectWrapper.get('.react-aria-Toolbar');
    expect(selectToolbarElement.attributes('role')).toBe('toolbar');
    expect(selectToolbarElement.attributes('aria-label')).toBe('Text formatting');
    expect(selectToolbarElement.attributes('aria-orientation')).toBe('horizontal');
  });

  it('renders calendar stories with live hooks, first-day locale, and reset flows', async () => {
    let calendarResetStory = CalendarResetValue.render?.({}) as ReturnType<Exclude<typeof CalendarResetValue.render, undefined>>;
    let calendarResetWrapper = mount(calendarResetStory);
    let visibleCells = calendarResetWrapper.findAll('.react-aria-CalendarCell')
      .filter((cell) => !(cell.attributes('style') ?? '').includes('display: none'));
    expect(visibleCells.length).toBeGreaterThan(0);

    await visibleCells[0].trigger('click');
    await nextTick();
    expect(calendarResetWrapper.findAll('.react-aria-CalendarCell').some((cell) => cell.attributes('data-selected') === 'true')).toBe(true);

    let resetButtons = calendarResetWrapper.findAll('button');
    await resetButtons[resetButtons.length - 1].trigger('click');
    await nextTick();
    expect(calendarResetWrapper.findAll('.react-aria-CalendarCell').some((cell) => cell.attributes('data-selected') === 'true')).toBe(false);

    let multiMonthStory = CalendarMultiMonth.render?.({selectionAlignment: 'center'}) as ReturnType<Exclude<typeof CalendarMultiMonth.render, undefined>>;
    let multiMonthWrapper = mount(multiMonthStory);
    expect(multiMonthWrapper.findAll('.react-aria-CalendarGrid')).toHaveLength(3);
    expect(multiMonthWrapper.find('button').text()).toBe('Reset focused date');
    expect(multiMonthWrapper.get('.react-aria-Heading').text().startsWith('June')).toBe(true);

    let multiMonthStartStory = CalendarMultiMonth.render?.({selectionAlignment: 'start'}) as ReturnType<Exclude<typeof CalendarMultiMonth.render, undefined>>;
    let multiMonthStartWrapper = mount(multiMonthStartStory);
    expect(multiMonthStartWrapper.get('.react-aria-Heading').text().startsWith('July')).toBe(true);

    let multiMonthEndStory = CalendarMultiMonth.render?.({selectionAlignment: 'end'}) as ReturnType<Exclude<typeof CalendarMultiMonth.render, undefined>>;
    let multiMonthEndWrapper = mount(multiMonthEndStory);
    expect(multiMonthEndWrapper.get('.react-aria-Heading').text().startsWith('May')).toBe(true);

    let firstDayStory = CalendarFirstDayOfWeekExample.render?.({locale: 'en-US-u-ca-iso8601-fw-tue'}) as ReturnType<Exclude<typeof CalendarFirstDayOfWeekExample.render, undefined>>;
    let firstDayWrapper = mount(firstDayStory);
    expect(firstDayWrapper.find('.react-aria-CalendarHeaderCell').text()).toBe('T');

    let rangeStory = RangeCalendarMultiMonthExample.render?.({selectionAlignment: 'center'}) as ReturnType<Exclude<typeof RangeCalendarMultiMonthExample.render, undefined>>;
    let rangeWrapper = mount(rangeStory);
    expect(rangeWrapper.findAll('.react-aria-CalendarGrid')).toHaveLength(3);
    expect(rangeWrapper.findAll('.react-aria-CalendarCell').some((cell) => cell.attributes('data-selected') === 'true')).toBe(true);
    expect(rangeWrapper.get('.react-aria-Heading').text().startsWith('July')).toBe(true);

    let rangeStartStory = RangeCalendarMultiMonthExample.render?.({selectionAlignment: 'start'}) as ReturnType<Exclude<typeof RangeCalendarMultiMonthExample.render, undefined>>;
    let rangeStartWrapper = mount(rangeStartStory);
    expect(rangeStartWrapper.get('.react-aria-Heading').text().startsWith('August')).toBe(true);
  });

  it('renders autocomplete popover stories with real listbox shell content', async () => {
    let listboxStory = AutocompleteWithListbox.render?.({selectionMode: 'single'}) as ReturnType<Exclude<typeof AutocompleteWithListbox.render, undefined>>;
    let listboxWrapper = mount(listboxStory);
    expect(listboxWrapper.find('.react-aria-Popover').exists()).toBe(true);
    expect(listboxWrapper.findAll('.item').length).toBeGreaterThan(0);
    await listboxWrapper.findAll('.item')[0].trigger('click');
    await nextTick();
    expect(listboxWrapper.find('.item[aria-selected="true"]').exists()).toBe(true);

    let virtualizedStory = AutocompleteWithVirtualizedListbox.render?.({selectionMode: 'single'}) as ReturnType<Exclude<typeof AutocompleteWithVirtualizedListbox.render, undefined>>;
    let virtualizedWrapper = mount(virtualizedStory);
    expect(virtualizedWrapper.text()).toContain('Item 0');

    let menuTriggerStory = AutocompleteInPopover.render?.({}) as ReturnType<Exclude<typeof AutocompleteInPopover.render, undefined>>;
    let menuTriggerWrapper = mount(menuTriggerStory);
    expect(menuTriggerWrapper.text()).toContain('Section 0, Item 0');

    let dialogTriggerStory = AutocompleteInPopoverDialogTrigger.render?.({}) as ReturnType<Exclude<typeof AutocompleteInPopoverDialogTrigger.render, undefined>>;
    let dialogTriggerWrapper = mount(dialogTriggerStory);
    expect(dialogTriggerWrapper.text()).toContain('Section 1, Item 1');

    let dynamicDialogStory = AutocompleteMenuInPopoverDialogTrigger.render?.({}) as ReturnType<Exclude<typeof AutocompleteMenuInPopoverDialogTrigger.render, undefined>>;
    let dynamicDialogWrapper = mount(dynamicDialogStory);
    expect(dynamicDialogWrapper.text()).toContain('Command Palette');
  });

  it('renders button stories with pending, ripple, and render override parity behavior', async () => {
    let buttonStory = ButtonExample.render?.({}) as ReturnType<Exclude<typeof ButtonExample.render, undefined>>;
    let buttonWrapper = mount(buttonStory);
    let button = buttonWrapper.get('button');
    expect(button.text()).toContain('Press me');
    expect(button.classes()).toContain('react-aria-Button');
    expect(button.attributes('data-rac')).toBe('');
    expect(button.attributes('data-react-aria-pressable')).toBe('true');
    expect(button.attributes('tabindex')).toBe('0');
    expect(button.attributes('data-style')).toBeUndefined();
    expect(button.attributes('data-variant')).toBeUndefined();

    vi.useFakeTimers();
    try {
      let pendingStory = PendingButton.render?.({children: 'Press me'}) as ReturnType<Exclude<typeof PendingButton.render, undefined>>;
      let pendingWrapper = mount(pendingStory);
      let pendingButton = pendingWrapper.get('button');
      expect(pendingButton.attributes('aria-disabled')).toBeUndefined();
      expect(pendingButton.classes()).toContain('button');
      await pendingButton.trigger('click');
      await nextTick();
      expect(pendingButton.attributes('aria-disabled')).toBe('true');
      expect(pendingButton.attributes('data-pending')).toBe('true');
      expect(pendingButton.attributes('data-hovered')).toBeUndefined();
      expect(pendingButton.attributes('disabled')).toBeUndefined();
      expect(pendingWrapper.get('.pending').exists()).toBe(true);
      expect(pendingWrapper.get('.spinner-pending').exists()).toBe(true);

      vi.advanceTimersByTime(5000);
      await nextTick();
      expect(pendingButton.attributes('aria-disabled')).toBeUndefined();
      expect(pendingButton.attributes('data-pending')).toBeUndefined();
      expect(pendingWrapper.find('.spinner-pending').exists()).toBe(false);
      pendingWrapper.unmount();
    } finally {
      vi.useRealTimers();
    }

    let pendingTooltipStory = PendingButtonTooltip.render?.({children: 'Press me, then hover again to see tooltip'}) as ReturnType<Exclude<typeof PendingButtonTooltip.render, undefined>>;
    let pendingTooltipWrapper = mount(pendingTooltipStory);
    expect(pendingTooltipWrapper.text()).toContain('Press me, then hover again to see tooltip');
    await pendingTooltipWrapper.get('button').trigger('click');
    await nextTick();
    expect(pendingTooltipWrapper.get('button').attributes('aria-disabled')).toBe('true');
    expect(pendingTooltipWrapper.get('button').attributes('data-pending')).toBe('true');
    expect(pendingTooltipWrapper.get('button').attributes('data-hovered')).toBeUndefined();

    let rippleStory = RippleButtonExample.render?.({}) as ReturnType<Exclude<typeof RippleButtonExample.render, undefined>>;
    let rippleWrapper = mount(rippleStory);
    expect(rippleWrapper.get('button').classes()).toContain('ripple-button');
    await rippleWrapper.get('button').trigger('click', {clientX: 15, clientY: 15});
    await nextTick();
    expect(rippleWrapper.find('.ripple').exists()).toBe(true);

    let performanceStory = ButtonPerformance.render?.({}) as ReturnType<Exclude<typeof ButtonPerformance.render, undefined>>;
    let performanceWrapper = mount(performanceStory);
    let performanceTrigger = performanceWrapper.get('button');
    expect(performanceTrigger.classes()).toContain('react-aria-Button');
    expect(performanceTrigger.attributes('data-rac')).toBe('');
    expect(performanceTrigger.attributes('data-style')).toBeUndefined();

    let renderStory = ButtonRender.render?.({}) as ReturnType<Exclude<typeof ButtonRender.render, undefined>>;
    let renderWrapper = mount(renderStory);
    expect(renderWrapper.get('button').classes()).toContain('react-aria-Button');
    expect(renderWrapper.get('button').attributes('data-rac')).toBe('');
    expect(renderWrapper.get('button').attributes('style')?.replace(/\s/g, '')).toContain('background:red');
  });

  it('renders react aria switch story with live selection and data-state contracts', async () => {
    let switchStory = RacSwitchExample();
    let switchWrapper = mount(switchStory);

    try {
      let root = switchWrapper.get('[data-testid="switch-example"]');
      expect(root.classes()).toContain('react-aria-Switch');
      expect(root.classes()).toContain('switchExample');
      expect(root.attributes('data-rac')).toBe('');
      expect(root.attributes('data-selected')).toBeUndefined();

      let input = switchWrapper.get('input[role="switch"]');
      expect((input.element as HTMLInputElement).checked).toBe(false);

      await input.setValue(true);
      await nextTick();
      expect((switchWrapper.get('input[role="switch"]').element as HTMLInputElement).checked).toBe(true);
      expect(switchWrapper.get('[data-testid="switch-example"]').attributes('data-selected')).toBe('true');
      expect(switchWrapper.find('.switchExample-indicator').exists()).toBe(true);
      expect(switchWrapper.text()).toContain('Switch me');
      expect(switchWrapper.get('input[role="switch"]').attributes('data-react-aria-pressable')).toBe('true');
    } finally {
      switchWrapper.unmount();
    }
  });

  it('renders react aria search field story with live input and clear behavior', async () => {
    let searchFieldStory = RacSearchFieldExample();
    let searchFieldWrapper = mount(searchFieldStory);

    try {
      let root = searchFieldWrapper.get('[data-testid="search-field-example"]');
      expect(root.classes()).toContain('react-aria-SearchField');
      expect(root.classes()).toContain('searchFieldExample');
      expect(root.attributes('data-rac')).toBe('');
      expect(root.attributes('data-empty')).toBe('true');

      let input = searchFieldWrapper.get('input[type="search"].react-aria-Input');
      await input.setValue('react');
      await nextTick();
      expect(searchFieldWrapper.get('[data-testid="search-field-example"]').attributes('data-empty')).toBeUndefined();
      expect(searchFieldWrapper.get('.react-aria-Label').text()).toBe('Search');
      expect(searchFieldWrapper.get('button.react-aria-Button').text()).toBe('✕');

      await searchFieldWrapper.get('button.react-aria-Button').trigger('click');
      await nextTick();
      expect((searchFieldWrapper.get('input[type="search"]').element as HTMLInputElement).value).toBe('');
      expect(searchFieldWrapper.get('[data-testid="search-field-example"]').attributes('data-empty')).toBe('true');
      expect(searchFieldWrapper.get('button.react-aria-Button').attributes('data-react-aria-pressable')).toBe('true');
    } finally {
      searchFieldWrapper.unmount();
    }
  });

  it('renders react aria form story with live field state and submit contract', async () => {
    let formStory = RacFormAutoFillExample();
    let formWrapper = mount(formStory);

    try {
      let form = formWrapper.get('form.react-aria-Form');
      expect(form.attributes('data-rac')).toBe('');
      expect(form.attributes('aria-label')).toBe('Shipping information');

      let textFields = formWrapper.findAll('.react-aria-TextField');
      expect(textFields.length).toBeGreaterThanOrEqual(4);

      let addressInput = formWrapper.get('input[name="streetAddress"]');
      let cityInput = formWrapper.get('input[name="city"]');
      let stateInput = formWrapper.get('input[name="state"]');
      let countrySelect = formWrapper.get('select[name="country"]');
      await addressInput.setValue('123 Main St');
      await cityInput.setValue('San Jose');
      await stateInput.setValue('CA');
      await countrySelect.setValue('react-aria-6');
      await nextTick();

      expect((addressInput.element as HTMLInputElement).value).toBe('123 Main St');
      expect((cityInput.element as HTMLInputElement).value).toBe('San Jose');
      expect((stateInput.element as HTMLInputElement).value).toBe('CA');
      expect((countrySelect.element as HTMLSelectElement).value).toBe('react-aria-6');
      expect(formWrapper.get('button[type="submit"].react-aria-Button').text()).toBe('Submit');

      form.element.dispatchEvent(new SubmitEvent('submit', {
        bubbles: true,
        cancelable: true
      }));
      await nextTick();
    } finally {
      formWrapper.unmount();
    }
  });

  it('renders react aria disclosure stories with live expand/collapse contracts', async () => {
    let disclosureStory = RacDisclosureExample();
    let disclosureWrapper = mount(disclosureStory);
    let disclosureControlledStory = RacDisclosureControlledExample();
    let disclosureControlledWrapper = mount(disclosureControlledStory);

    try {
      let disclosureRoot = disclosureWrapper.get('.react-aria-Disclosure');
      expect(disclosureRoot.attributes('data-rac')).toBe('');
      let disclosureTrigger = disclosureWrapper.get('.react-aria-Disclosure .react-aria-Button');
      expect(disclosureTrigger.text().trim().startsWith('➡️')).toBe(true);
      expect(disclosureWrapper.find('.react-aria-DisclosurePanel').exists()).toBe(false);
      await disclosureTrigger.trigger('click');
      await nextTick();
      expect(disclosureWrapper.find('.react-aria-DisclosurePanel').exists()).toBe(true);
      expect(disclosureWrapper.get('.react-aria-Disclosure .react-aria-Button').text().trim().startsWith('⬇️')).toBe(true);
      await disclosureTrigger.trigger('click');
      await nextTick();
      expect(disclosureWrapper.find('.react-aria-DisclosurePanel').exists()).toBe(false);

      let controlledTrigger = disclosureControlledWrapper.get('.react-aria-Disclosure .react-aria-Button');
      expect(disclosureControlledWrapper.find('.react-aria-DisclosurePanel').exists()).toBe(false);
      await controlledTrigger.trigger('click');
      await nextTick();
      expect(disclosureControlledWrapper.find('.react-aria-DisclosurePanel').exists()).toBe(true);
      expect(disclosureControlledWrapper.get('.react-aria-Disclosure .react-aria-Button').text().trim().startsWith('⬇️')).toBe(true);
      await controlledTrigger.trigger('click');
      await nextTick();
      expect(disclosureControlledWrapper.find('.react-aria-DisclosurePanel').exists()).toBe(false);
    } finally {
      disclosureWrapper.unmount();
      disclosureControlledWrapper.unmount();
    }
  });

  it('renders react aria disclosure group story with live disabled toggle behavior', async () => {
    let disclosureGroupStory = RacDisclosureGroupExample();
    let disclosureGroupWrapper = mount(disclosureGroupStory);

    try {
      let groupRoot = disclosureGroupWrapper.get('.react-aria-DisclosureGroup');
      expect(groupRoot.attributes('data-rac')).toBe('');
      let toggleDisabled = disclosureGroupWrapper.findAll('.react-aria-Button').find((button) => button.text().trim() === 'Toggle Disabled');
      expect(toggleDisabled).toBeDefined();

      let disclosureButtons = disclosureGroupWrapper.findAll('.react-aria-Disclosure .react-aria-Button');
      expect(disclosureButtons).toHaveLength(2);
      expect(disclosureButtons[0].attributes('disabled')).toBeUndefined();
      await disclosureButtons[0].trigger('click');
      await nextTick();
      expect(disclosureGroupWrapper.findAll('.react-aria-DisclosurePanel')).toHaveLength(1);

      await toggleDisabled?.trigger('click');
      await nextTick();
      let disabledDisclosureButtons = disclosureGroupWrapper.findAll('.react-aria-Disclosure .react-aria-Button');
      expect(disabledDisclosureButtons).toHaveLength(2);
      expect(disabledDisclosureButtons[0].attributes('disabled')).toBeDefined();
      expect(disabledDisclosureButtons[1].attributes('disabled')).toBeDefined();

      await toggleDisabled?.trigger('click');
      await nextTick();
      let enabledDisclosureButtons = disclosureGroupWrapper.findAll('.react-aria-Disclosure .react-aria-Button');
      expect(enabledDisclosureButtons[0].attributes('disabled')).toBeUndefined();
      expect(enabledDisclosureButtons[1].attributes('disabled')).toBeUndefined();
    } finally {
      disclosureGroupWrapper.unmount();
    }
  });

  it('renders react aria dropzone stories with live dropzone contracts and render-props state', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let linkStory = RacDropzoneExampleWithFileTriggerLink({});
      let linkWrapper = mount(linkStory);
      wrappers.push(linkWrapper);

      let dropZone = linkWrapper.get('.react-aria-DropZone');
      expect(dropZone.attributes('data-rac')).toBe('');
      expect(dropZone.attributes('data-react-aria-pressable')).toBe('true');
      expect(linkWrapper.get('[data-testid="drop-zone-example-with-file-trigger-link"]').exists()).toBe(true);
      expect(linkWrapper.get('.react-aria-Link').text()).toBe('Upload');

      await dropZone.trigger('mouseenter');
      await nextTick();
      expect(dropZone.attributes('data-hovered')).toBe('true');

      await dropZone.trigger('focus');
      await nextTick();
      expect(dropZone.attributes('data-focused')).toBe('true');

      await dropZone.trigger('blur');
      await nextTick();
      expect(dropZone.attributes('data-focused')).toBeUndefined();

      let renderPropsStory = RacDropzoneWithRenderProps.render?.({isDisabled: true}) as ReturnType<Exclude<typeof RacDropzoneWithRenderProps.render, undefined>>;
      let renderPropsWrapper = mount(renderPropsStory);
      wrappers.push(renderPropsWrapper);
      expect(renderPropsWrapper.text()).toContain('isDisabled: true');
      expect(renderPropsWrapper.text()).toContain('isDropTarget: false');

      let renderPropsZone = renderPropsWrapper.get('.react-aria-DropZone');
      expect(renderPropsZone.attributes('data-disabled')).toBe('true');

      let pngStory = RacDropZoneOnlyAcceptPNGWithFileTrigger({});
      let pngWrapper = mount(pngStory);
      wrappers.push(pngWrapper);
      expect(pngWrapper.get('.react-aria-DropZone').attributes('data-rac')).toBe('');
      expect(pngWrapper.get('button.react-aria-Button').text()).toBe('Upload');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders react aria file trigger stories with live hidden-input contracts', () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let buttonStory = RacFileTriggerButton({});
      let buttonWrapper = mount(buttonStory);
      wrappers.push(buttonWrapper);
      expect(buttonWrapper.get('button.react-aria-Button').text()).toBe('Upload');
      let fileInput = buttonWrapper.get('input[type="file"]');
      expect(fileInput.attributes('data-testid')).toBe('filetrigger-example');
      expect(fileInput.attributes('data-rac')).toBe('');
      expect(fileInput.attributes('style')).toContain('display: none');

      let directoriesStory = RacFileTriggerDirectories({});
      let directoriesWrapper = mount(directoriesStory);
      wrappers.push(directoriesWrapper);
      let directoriesInput = directoriesWrapper.get('input[type="file"]');
      expect(directoriesInput.attributes('webkitdirectory')).toBe('true');
      expect(directoriesWrapper.findAll('ul li')).toHaveLength(0);

      let linkStory = RacFileTriggerLinkAllowsMultiple({});
      let linkWrapper = mount(linkStory);
      wrappers.push(linkWrapper);
      expect(linkWrapper.get('.react-aria-Link').text()).toBe('Select a file');
      let multipleInput = linkWrapper.get('input[type="file"]');
      expect(multipleInput.attributes('multiple')).toBeDefined();
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders react aria color stories with live color component contracts', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let swatchStory = RacColorSwatchExample.render?.({color: 'rgb(255, 0, 0)'}) as ReturnType<Exclude<typeof RacColorSwatchExample.render, undefined>>;
      let swatchWrapper = mount(swatchStory);
      wrappers.push(swatchWrapper);
      expect(swatchWrapper.get('.react-aria-ColorSwatch').exists()).toBe(true);
      expect(swatchWrapper.get('.vs-color-swatch').attributes('aria-label')).toContain('vibrant red');

      let fieldStory = RacColorFieldExample.render?.({defaultValue: '#f00', label: 'Test'}) as ReturnType<Exclude<typeof RacColorFieldExample.render, undefined>>;
      let fieldWrapper = mount(fieldStory);
      wrappers.push(fieldWrapper);
      let fieldRoot = fieldWrapper.get('.react-aria-ColorField');
      expect(fieldRoot.attributes('data-rac')).toBe('');
      let fieldInput = fieldWrapper.get('input.vs-color-field__input');
      await fieldInput.setValue('#00ff00');
      await nextTick();
      expect((fieldInput.element as HTMLInputElement).value).toBe('#00ff00');

      let sliderStory = RacColorSliderExample.render?.({channel: 'hue', defaultValue: 'hsl(0, 100%, 50%)'}) as ReturnType<Exclude<typeof RacColorSliderExample.render, undefined>>;
      let sliderWrapper = mount(sliderStory);
      wrappers.push(sliderWrapper);
      let sliderInput = sliderWrapper.get('input[type="range"]');
      await sliderInput.setValue('120');
      await nextTick();
      expect((sliderInput.element as HTMLInputElement).value).toBe('120');

      let areaStory = RacColorAreaExample.render?.({
        defaultValue: 'rgb(100, 149, 237)',
        xChannel: 'red',
        yChannel: 'green'
      }) as ReturnType<Exclude<typeof RacColorAreaExample.render, undefined>>;
      let areaWrapper = mount(areaStory);
      wrappers.push(areaWrapper);
      expect(areaWrapper.get('.react-aria-ColorArea').exists()).toBe(true);
      let areaInput = areaWrapper.findAll('input[type="range"]')[0];
      await areaInput.setValue('70');
      await nextTick();
      expect((areaInput.element as HTMLInputElement).value).toBe('70');

      let wheelStory = RacColorWheelExample({});
      let wheelWrapper = mount(wheelStory);
      wrappers.push(wheelWrapper);
      let wheelInput = wheelWrapper.get('input[type="range"]');
      await wheelInput.setValue('180');
      await nextTick();
      expect((wheelInput.element as HTMLInputElement).value).toBe('180');

      let pickerStory = RacColorPickerExample.render?.({}) as ReturnType<Exclude<typeof RacColorPickerExample.render, undefined>>;
      let pickerWrapper = mount(pickerStory);
      wrappers.push(pickerWrapper);
      expect(pickerWrapper.get('.react-aria-ColorPicker').exists()).toBe(true);
      expect(pickerWrapper.findAll('input.vs-color-field__input').length).toBeGreaterThan(0);

      let pickerSlidersStory = RacColorPickerSliders.render?.({}) as ReturnType<Exclude<typeof RacColorPickerSliders.render, undefined>>;
      let pickerSlidersWrapper = mount(pickerSlidersStory);
      wrappers.push(pickerSlidersWrapper);
      let hueInput = pickerSlidersWrapper.findAll('input[type="range"]')[1];
      await hueInput.setValue('240');
      await nextTick();
      expect((pickerSlidersWrapper.findAll('input.vs-color-field__input')[0].element as HTMLInputElement).value).toBe('#0000ff');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders react aria slider stories with live thumb and reset contracts', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let sliderStory = RacSliderExample({});
      let sliderWrapper = mount(sliderStory);
      wrappers.push(sliderWrapper);

      let output = sliderWrapper.get('.react-aria-SliderOutput');
      expect(output.text()).toBe('30 - 60');
      let sliderInputs = sliderWrapper.findAll('.react-aria-SliderThumb input[type="range"]');
      expect(sliderInputs).toHaveLength(2);
      await sliderInputs[0].setValue('15');
      await sliderInputs[1].setValue('75');
      await nextTick();
      expect(sliderWrapper.get('.react-aria-SliderOutput').text()).toBe('15 - 75');
      await sliderWrapper.get('button[type="button"]').trigger('click');
      await nextTick();
      expect(sliderWrapper.get('.react-aria-SliderOutput').text()).toBe('0 - 100');

      let cssStory = RacSliderCSS({
        orientation: 'vertical',
        isDisabled: false,
        minValue: 0,
        maxValue: 100,
        step: 1
      });
      let cssWrapper = mount(cssStory);
      wrappers.push(cssWrapper);
      let cssRoot = cssWrapper.get('.react-aria-Slider');
      expect(cssRoot.attributes('data-orientation')).toBe('vertical');
      let cssInput = cssWrapper.get('.react-aria-SliderThumb input[type="range"]');
      await cssInput.setValue('45');
      await nextTick();
      expect(cssWrapper.get('.react-aria-SliderOutput').text()).toBe('45');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders react aria link story using live VueLink contract', () => {
    let linkStory = RacLinkExample({});
    let linkWrapper = mount(linkStory);

    try {
      let link = linkWrapper.get('a.react-aria-Link');
      expect(link.attributes('data-testid')).toBe('link-example');
      expect(link.attributes('href')).toBe('https://www.imdb.com/title/tt6348138/');
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('data-rac')).toBe('');
      expect(link.text()).toBe('The missing link');
    } finally {
      linkWrapper.unmount();
    }
  });

  it('renders react aria modal stories with live open and dialog contracts', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let modalStory = RacModalExample.render?.({}) as ReturnType<Exclude<typeof RacModalExample.render, undefined>>;
      let modalWrapper = mount(modalStory);
      wrappers.push(modalWrapper);
      expect(modalWrapper.find('[role="dialog"]').exists()).toBe(false);
      await modalWrapper.get('button.react-aria-Button').trigger('click');
      await nextTick();
      expect(modalWrapper.find('[role="dialog"]').exists()).toBe(true);
      expect(modalWrapper.findAll('.react-aria-TextField')).toHaveLength(2);
      await modalWrapper.findAll('button').find((button) => button.text() === 'Submit')?.trigger('click');
      await nextTick();
      expect(modalWrapper.find('[role="dialog"]').exists()).toBe(false);

      let inertStory = RacInertTestStory.render?.({}) as ReturnType<Exclude<typeof RacInertTestStory.render, undefined>>;
      let inertWrapper = mount(inertStory);
      wrappers.push(inertWrapper);
      await inertWrapper.get('button.react-aria-Button').trigger('click');
      await nextTick();
      expect(inertWrapper.find('[role="dialog"]').exists()).toBe(true);
      expect(inertWrapper.find('.react-aria-TextField').exists()).toBe(true);

      let dateRangeStory = RacDateRangePickerInsideModalStory.render?.({}) as ReturnType<Exclude<typeof RacDateRangePickerInsideModalStory.render, undefined>>;
      let dateRangeWrapper = mount(dateRangeStory);
      wrappers.push(dateRangeWrapper);
      await dateRangeWrapper.get('button.react-aria-Button').trigger('click');
      await nextTick();
      expect(dateRangeWrapper.find('[role="dialog"]').exists()).toBe(true);
      expect(dateRangeWrapper.find('input[type="text"], input[type="date"]').exists()).toBe(true);
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders react aria text field stories with live input and submit-invalid contracts', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let textfieldStory = RacTextfieldExample.render?.({}) as ReturnType<Exclude<typeof RacTextfieldExample.render, undefined>>;
      let textfieldWrapper = mount(textfieldStory);
      wrappers.push(textfieldWrapper);

      let textfieldRoot = textfieldWrapper.get('[data-testid="textfield-example"]');
      expect(textfieldRoot.classes()).toContain('react-aria-TextField');
      expect(textfieldRoot.attributes('data-rac')).toBe('');
      let textfieldInput = textfieldWrapper.get('input.react-aria-Input');
      await textfieldInput.setValue('Jane');
      await nextTick();
      expect((textfieldInput.element as HTMLInputElement).value).toBe('Jane');

      let submitStory = RacTextFieldSubmitExample.render?.({isInvalid: false}) as ReturnType<Exclude<typeof RacTextFieldSubmitExample.render, undefined>>;
      let submitWrapper = mount(submitStory);
      wrappers.push(submitWrapper);
      let submitForm = submitWrapper.get('form.react-aria-Form');
      let submitField = submitWrapper.get('.react-aria-TextField');
      expect(submitField.attributes('data-required')).toBe('true');
      expect(submitField.attributes('data-invalid')).toBeUndefined();
      submitForm.element.dispatchEvent(new SubmitEvent('submit', {
        bubbles: true,
        cancelable: true
      }));
      await nextTick();
      expect(submitField.attributes('data-invalid')).toBe('true');
      expect(submitWrapper.find('.errorMessage').exists()).toBe(true);

      let controlledInvalidStory = RacTextFieldSubmitExample.render?.({isInvalid: true}) as ReturnType<Exclude<typeof RacTextFieldSubmitExample.render, undefined>>;
      let controlledInvalidWrapper = mount(controlledInvalidStory);
      wrappers.push(controlledInvalidWrapper);
      expect(controlledInvalidWrapper.get('.react-aria-TextField').attributes('data-invalid')).toBe('true');
      expect(controlledInvalidWrapper.find('.errorMessage').exists()).toBe(false);
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders react aria time field story with live input contract', async () => {
    let timeFieldStory = RacTimeFieldExample();
    let timeFieldWrapper = mount(timeFieldStory);

    try {
      let root = timeFieldWrapper.get('[data-testid="time-field-example"]');
      expect(root.classes()).toContain('react-aria-TimeField');
      expect(root.attributes('data-rac')).toBe('');
      expect(timeFieldWrapper.get('.field').attributes('data-react-aria-pressable')).toBe('true');

      let input = timeFieldWrapper.get('input[type="time"].react-aria-Input');
      await input.setValue('09:30');
      await nextTick();
      expect((input.element as HTMLInputElement).value).toBe('09:30');
    } finally {
      timeFieldWrapper.unmount();
    }
  });

  it('renders react aria meter and progress bar stories with live value contracts', () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let meterStory = RacMeterExample({value: 50, minValue: 0, maxValue: 100});
      let meterWrapper = mount(meterStory);
      wrappers.push(meterWrapper);
      let meter = meterWrapper.get('.react-aria-Meter');
      expect(meter.attributes('data-rac')).toBe('');
      expect(meter.get('.react-aria-Label').text()).toBe('Storage space');
      expect(meter.get('.value').text()).toBe('50%');
      expect(meter.get('.fill').attributes('style')).toContain('50%');

      let progressStory = RacProgressBarExample({value: 25, minValue: 0, maxValue: 100});
      let progressWrapper = mount(progressStory);
      wrappers.push(progressWrapper);
      let progress = progressWrapper.get('.react-aria-ProgressBar');
      expect(progress.attributes('data-rac')).toBe('');
      expect(progress.get('.react-aria-Label').text()).toBe('Storage space');
      expect(progress.get('.value').text()).toBe('25%');
      expect(progress.get('.fill').attributes('style')).toContain('25%');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders react aria radio group stories with live selection, dialog, and submit-invalid contracts', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let radioGroupStory = RacRadioGroupExample.render?.({
        onFocus: vi.fn(),
        onBlur: vi.fn()
      }) as ReturnType<Exclude<typeof RacRadioGroupExample.render, undefined>>;
      let radioGroupWrapper = mount(radioGroupStory);
      wrappers.push(radioGroupWrapper);

      let radioGroupRoot = radioGroupWrapper.get('[data-testid="radio-group-example"]');
      expect(radioGroupRoot.classes()).toContain('react-aria-RadioGroup');
      expect(radioGroupRoot.attributes('data-rac')).toBe('');
      let radios = radioGroupWrapper.findAll('.react-aria-Radio');
      expect(radios).toHaveLength(3);
      let dogRadio = radioGroupWrapper.get('[data-testid="radio-dog"]');
      await dogRadio.get('input[type="radio"]').setValue(true);
      await nextTick();
      expect(dogRadio.attributes('data-selected')).toBe('true');

      let controlledStory = RacRadioGroupControlledExample();
      let controlledWrapper = mount(controlledStory);
      wrappers.push(controlledWrapper);
      let controlledInputs = controlledWrapper.findAll('.react-aria-Radio input[type="radio"]');
      await controlledInputs[1].setValue(true);
      await nextTick();
      expect(controlledWrapper.findAll('.react-aria-Radio')[1].attributes('data-selected')).toBe('true');

      let dialogStory = RacRadioGroupInDialogExample({});
      let dialogWrapper = mount(dialogStory);
      wrappers.push(dialogWrapper);
      expect(dialogWrapper.find('section.react-aria-Dialog').exists()).toBe(false);
      await dialogWrapper.get('button.react-aria-Button').trigger('click');
      await nextTick();
      expect(dialogWrapper.find('section.react-aria-Dialog').exists()).toBe(true);
      expect(dialogWrapper.findAll('.react-aria-RadioGroup')).toHaveLength(1);

      let submitStory = RacRadioGroupSubmitExample({});
      let submitWrapper = mount(submitStory);
      wrappers.push(submitWrapper);
      let submitGroup = submitWrapper.get('[data-testid="radio-group-example"]');
      expect(submitGroup.attributes('data-required')).toBe('true');
      expect(submitGroup.attributes('data-invalid')).toBeUndefined();
      let submitForm = submitWrapper.get('form.react-aria-Form');
      submitForm.element.dispatchEvent(new SubmitEvent('submit', {
        bubbles: true,
        cancelable: true
      }));
      await nextTick();
      expect(submitGroup.attributes('data-invalid')).toBe('true');
      await submitWrapper.get('[data-testid="radio-dog"] input[type="radio"]').setValue(true);
      await nextTick();
      expect(submitGroup.attributes('data-invalid')).toBeUndefined();
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders react aria number field stories with live increment/decrement and validation contracts', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let numberFieldStory = RacNumberFieldExample.render?.({
        defaultValue: 0,
        minValue: 0,
        maxValue: 100,
        step: 1,
        formatOptions: {style: 'currency', currency: 'USD'},
        isWheelDisabled: false
      }) as ReturnType<Exclude<typeof RacNumberFieldExample.render, undefined>>;
      let numberFieldWrapper = mount(numberFieldStory);
      wrappers.push(numberFieldWrapper);

      let root = numberFieldWrapper.get('.react-aria-NumberField');
      expect(root.attributes('data-rac')).toBe('');
      let input = numberFieldWrapper.get('input.react-aria-Input');
      expect((input.element as HTMLInputElement).value).toBe('$0.00');
      let decrementButton = numberFieldWrapper.get('button[aria-label="Decrease"]');
      let incrementButton = numberFieldWrapper.get('button[aria-label="Increase"]');
      expect(decrementButton.attributes('data-disabled')).toBe('true');
      expect(incrementButton.attributes('data-disabled')).toBeUndefined();

      await incrementButton.trigger('click');
      await nextTick();
      expect((input.element as HTMLInputElement).value).toBe('$1.00');
      expect(root.attributes('data-invalid')).toBe('true');
      expect(numberFieldWrapper.get('.react-aria-FieldError').text()).toBe('Invalid value');

      await incrementButton.trigger('click');
      await nextTick();
      expect((input.element as HTMLInputElement).value).toBe('$2.00');
      expect(root.attributes('data-invalid')).toBeUndefined();
      expect(numberFieldWrapper.find('.react-aria-FieldError').exists()).toBe(false);

      let controlledStory = RacNumberFieldControlledExample.render?.({
        defaultValue: 0,
        minValue: 0,
        maxValue: 100,
        step: 1,
        formatOptions: {style: 'currency', currency: 'USD'},
        isWheelDisabled: false
      }) as ReturnType<Exclude<typeof RacNumberFieldControlledExample.render, undefined>>;
      let controlledWrapper = mount(controlledStory);
      wrappers.push(controlledWrapper);
      let controlledInput = controlledWrapper.get('input.react-aria-Input');
      let controlledIncrement = controlledWrapper.get('button[aria-label="Increase"]');
      await controlledIncrement.trigger('click');
      await nextTick();
      expect((controlledInput.element as HTMLInputElement).value).toBe('$1.00');
      expect(controlledWrapper.get('.react-aria-NumberField').attributes('data-invalid')).toBe('true');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders react aria popover trigger observer story with live open-state contracts', async () => {
    let popoverStory = RacPopoverTriggerObserverExample.render?.({}) as ReturnType<Exclude<typeof RacPopoverTriggerObserverExample.render, undefined>>;
    let popoverWrapper = mount(popoverStory);

    try {
      let trigger = popoverWrapper.get('button.react-aria-Button');
      expect(trigger.text()).toBe('Open popover');
      expect(popoverWrapper.find('[data-testid="underlay"]').exists()).toBe(true);
      expect(popoverWrapper.find('section.react-aria-Dialog').exists()).toBe(true);

      await trigger.trigger('click');
      await nextTick();
      expect(popoverWrapper.find('[data-testid="underlay"]').exists()).toBe(false);
      expect(popoverWrapper.find('section.react-aria-Dialog').exists()).toBe(false);

      await trigger.trigger('click');
      await nextTick();
      expect(popoverWrapper.find('[data-testid="underlay"]').exists()).toBe(true);
      expect(popoverWrapper.find('section.react-aria-Dialog').exists()).toBe(true);
    } finally {
      popoverWrapper.unmount();
    }
  });

  it('renders react aria tooltip arrow-boundary story with live tooltip contracts', async () => {
    let tooltipStory = RacTooltipArrowBoundaryOffsetExample.render?.({
      topLeft: 25,
      topRight: 25,
      leftTop: 15,
      leftBottom: 15,
      rightTop: 15,
      rightBottom: 15,
      bottomLeft: 25,
      bottomRight: 25
    }) as ReturnType<Exclude<typeof RacTooltipArrowBoundaryOffsetExample.render, undefined>>;
    let tooltipWrapper = mount(tooltipStory);

    try {
      let triggerButtons = tooltipWrapper.findAll('button');
      expect(triggerButtons).toHaveLength(8);
      expect(tooltipWrapper.find('.react-aria-Tooltip').exists()).toBe(false);

      await triggerButtons[0].trigger('mouseenter');
      await nextTick();
      expect(tooltipWrapper.findAll('.react-aria-Tooltip')).toHaveLength(1);
      expect(tooltipWrapper.text()).toContain('Top left');

      await triggerButtons[1].trigger('mouseenter');
      await nextTick();
      expect(tooltipWrapper.findAll('.react-aria-Tooltip')).toHaveLength(1);
      expect(tooltipWrapper.text()).toContain('Top right');
    } finally {
      tooltipWrapper.unmount();
    }
  });

  it('renders slider stories with value-label, contextual-help, fill, and gradient contracts', () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let sliderDefaultStory = SliderDefault.render?.({}) as ReturnType<Exclude<typeof SliderDefault.render, undefined>>;
      let sliderDefaultWrapper = mount(sliderDefaultStory);
      wrappers.push(sliderDefaultWrapper);
      expect(sliderDefaultWrapper.find('output.vs-slider__value').exists()).toBe(true);

      let rangeSliderDefaultStory = RangeSliderDefault.render?.({}) as ReturnType<Exclude<typeof RangeSliderDefault.render, undefined>>;
      let rangeSliderDefaultWrapper = mount(rangeSliderDefaultStory);
      wrappers.push(rangeSliderDefaultWrapper);
      expect(rangeSliderDefaultWrapper.find('output.vs-slider__value').exists()).toBe(true);

      let sliderCustomValueStory = SliderCustomValueLabel.render?.({label: 'Label'}) as ReturnType<Exclude<typeof SliderCustomValueLabel.render, undefined>>;
      let sliderCustomValueWrapper = mount(sliderCustomValueStory);
      wrappers.push(sliderCustomValueWrapper);
      expect(sliderCustomValueWrapper.get('output.vs-slider__value').text()).toMatch(/^A .* B$/);

      let rangeCustomValueStory = RangeSliderCustomValueLabel.render?.({label: 'Label'}) as ReturnType<Exclude<typeof RangeSliderCustomValueLabel.render, undefined>>;
      let rangeCustomValueWrapper = mount(rangeCustomValueStory);
      wrappers.push(rangeCustomValueWrapper);
      expect(rangeCustomValueWrapper.get('output.vs-slider__value').text()).toContain('<->');

      let sliderContextualHelpStory = SliderContextualHelp.render?.({label: 'Label'}) as ReturnType<Exclude<typeof SliderContextualHelp.render, undefined>>;
      let sliderContextualHelpWrapper = mount(sliderContextualHelpStory);
      wrappers.push(sliderContextualHelpWrapper);
      expect(sliderContextualHelpWrapper.find('.spectrum-Slider-contextualHelp button[aria-label="Help"]').exists()).toBe(true);

      let rangeContextualHelpStory = RangeSliderContextualHelp.render?.({label: 'Label'}) as ReturnType<Exclude<typeof RangeSliderContextualHelp.render, undefined>>;
      let rangeContextualHelpWrapper = mount(rangeContextualHelpStory);
      wrappers.push(rangeContextualHelpWrapper);
      expect(rangeContextualHelpWrapper.find('.spectrum-Slider-contextualHelp button[aria-label="Help"]').exists()).toBe(true);

      let fillOffsetStory = SliderFillOffset.render?.({}) as ReturnType<Exclude<typeof SliderFillOffset.render, undefined>>;
      let fillOffsetWrapper = mount(fillOffsetStory);
      wrappers.push(fillOffsetWrapper);
      expect(fillOffsetWrapper.find('.spectrum-Slider-fill').exists()).toBe(true);

      let trackGradientStory = SliderTrackGradient.render?.({}) as ReturnType<Exclude<typeof SliderTrackGradient.render, undefined>>;
      let trackGradientWrapper = mount(trackGradientStory);
      wrappers.push(trackGradientWrapper);
      expect(trackGradientWrapper.get('.vs-slider').attributes('style')).toContain('--spectrum-slider-track-gradient');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders search autocomplete icon and avatar scenarios with real story content', () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let iconFilterStory = SearchAutocompleteIconFilter.render?.({}) as ReturnType<Exclude<typeof SearchAutocompleteIconFilter.render, undefined>>;
      let iconFilterWrapper = mount(iconFilterStory);
      wrappers.push(iconFilterWrapper);
      expect(iconFilterWrapper.get('[data-testid="searchicon"]').text()).toBe('🔎');

      let iconNullStory = SearchAutocompleteIconNull.render?.({}) as ReturnType<Exclude<typeof SearchAutocompleteIconNull.render, undefined>>;
      let iconNullWrapper = mount(iconNullStory);
      wrappers.push(iconNullWrapper);
      expect(iconNullWrapper.find('[data-testid="searchicon"]').exists()).toBe(false);

      let withAvatarsStory = SearchAutocompleteWithAvatars.render?.({}) as ReturnType<Exclude<typeof SearchAutocompleteWithAvatars.render, undefined>>;
      let withAvatarsWrapper = mount(withAvatarsStory);
      wrappers.push(withAvatarsWrapper);
      expect(withAvatarsWrapper.text()).not.toContain('With avatars');
      expect(withAvatarsWrapper.findAll('datalist option').map((option) => option.attributes('value'))).toContain('👤 User 1');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders accordion expanded-keys story with iterable expanded key overrides', () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let expandedStory = AccordionWithExpandedKeys.render?.({expandedKeys: new Set(['people'])}) as ReturnType<Exclude<typeof AccordionWithExpandedKeys.render, undefined>>;
      let expandedWrapper = mount(expandedStory);
      wrappers.push(expandedWrapper);

      let accordionItems = expandedWrapper.findAll('.spectrum-Accordion-item');
      expect(accordionItems).toHaveLength(2);
      expect(accordionItems[0].classes()).not.toContain('is-expanded');
      expect(accordionItems[1].classes()).toContain('is-expanded');
      expect(expandedWrapper.get('#people-panel').attributes('aria-hidden')).toBe('false');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders action bar stories with live selection count and clear-selection behavior', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let story = ActionBarDefaultStory.render?.({onAction: vi.fn()}) as ReturnType<Exclude<typeof ActionBarDefaultStory.render, undefined>>;
      let wrapper = mount(story);
      wrappers.push(wrapper);

      expect(wrapper.find('.vs-action-bar').exists()).toBe(false);

      let rowSelection = wrapper.findAll('tbody.vs-table__body input.vs-table__selection-checkbox');
      await rowSelection[0].setValue(true);
      await nextTick();
      expect(wrapper.get('.vs-action-bar').exists()).toBe(true);
      expect(wrapper.get('.vs-action-bar__count').text()).toContain('1 selected');

      await rowSelection[1].setValue(true);
      await nextTick();
      expect(wrapper.get('.vs-action-bar__count').text()).toContain('2 selected');

      await wrapper.get('button.vs-action-bar__clear').trigger('click');
      await nextTick();
      expect(wrapper.find('.vs-action-bar').exists()).toBe(false);
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders action group stories with key-based object items and tooltip wrappers', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let onAction = vi.fn();
      let defaultStory = ActionGroupDefault.render?.({onAction, onSelectionChange: vi.fn()}) as ReturnType<Exclude<typeof ActionGroupDefault.render, undefined>>;
      let defaultWrapper = mount(defaultStory);
      wrappers.push(defaultWrapper);
      let firstActionButton = defaultWrapper.findAll('.vs-action-group__item')[0];
      await firstActionButton.trigger('click');
      expect(onAction).toHaveBeenCalledWith('1');

      let disabledOnAction = vi.fn();
      let defaultStoryWithSetDisabledKeys = ActionGroupDefault.render?.({
        onAction: disabledOnAction,
        onSelectionChange: vi.fn(),
        disabledKeys: new Set(['2'])
      }) as ReturnType<Exclude<typeof ActionGroupDefault.render, undefined>>;
      let setDisabledWrapper = mount(defaultStoryWithSetDisabledKeys);
      wrappers.push(setDisabledWrapper);
      let firstGroupButtons = setDisabledWrapper.findAll('.vs-action-group')[0]?.findAll('.vs-action-group__item') ?? [];
      expect(firstGroupButtons).toHaveLength(3);
      expect(firstGroupButtons[1].attributes('disabled')).toBeDefined();
      expect(firstGroupButtons[1].attributes('aria-disabled')).toBe('true');
      await firstGroupButtons[1].trigger('click');
      expect(disabledOnAction).not.toHaveBeenCalled();

      let staticColorStory = ActionGroupStaticColorWhite.render?.({
        ...((ActionGroupStaticColorWhite.args as Record<string, unknown>) ?? {}),
        onAction: vi.fn(),
        onSelectionChange: vi.fn()
      }) as ReturnType<Exclude<typeof ActionGroupStaticColorWhite.render, undefined>>;
      let staticColorWrapper = mount(staticColorStory);
      wrappers.push(staticColorWrapper);
      expect(staticColorWrapper.text()).toContain('Grid view');
      expect(staticColorWrapper.text()).not.toContain('[object Object]');

      let staticColorSetDefaultSelectedStory = ActionGroupStaticColorWhite.render?.({
        ...((ActionGroupStaticColorWhite.args as Record<string, unknown>) ?? {}),
        defaultSelectedKeys: new Set(['2']),
        onAction: vi.fn(),
        onSelectionChange: vi.fn()
      }) as ReturnType<Exclude<typeof ActionGroupStaticColorWhite.render, undefined>>;
      let staticColorSetDefaultSelectedWrapper = mount(staticColorSetDefaultSelectedStory);
      wrappers.push(staticColorSetDefaultSelectedWrapper);
      let staticColorDisplayExample = staticColorSetDefaultSelectedWrapper.findComponent({name: 'ActionGroupDisplayExample'});
      let staticColorDisplayArgs = staticColorDisplayExample.props('args') as {modelValue?: Iterable<string>};
      expect(Array.from(staticColorDisplayArgs.modelValue ?? [])).toEqual(['2']);

      let withTooltipsStory = ActionGroupWithTooltips.render?.({onAction: vi.fn(), onSelectionChange: vi.fn()}) as ReturnType<Exclude<typeof ActionGroupWithTooltips.render, undefined>>;
      let withTooltipsWrapper = mount(withTooltipsStory);
      wrappers.push(withTooltipsWrapper);
      expect(withTooltipsWrapper.findAll('.vs-tooltip-trigger')).toHaveLength(3);
      expect(withTooltipsWrapper.findAll('.vs-action-group__item').map((button) => button.attributes('aria-label'))).toEqual([
        'Grid view',
        'List view',
        'Gallery view'
      ]);
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders spectrum toolbar stories with tooltip-wrapped manage items and disabled-key selection contracts', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let defaultStory = SpectrumToolbarDefault.render?.({orientation: 'horizontal'}) as ReturnType<Exclude<typeof SpectrumToolbarDefault.render, undefined>>;
      let defaultWrapper = mount(defaultStory);
      wrappers.push(defaultWrapper);

      let defaultGroups = defaultWrapper.findAll('.vs-action-group');
      expect(defaultGroups).toHaveLength(2);
      expect(defaultWrapper.findAll('.vs-tooltip-trigger')).toHaveLength(3);

      let defaultManageButtons = defaultGroups[0].findAll('.vs-action-group__item');
      expect(defaultManageButtons).toHaveLength(3);
      await defaultManageButtons[0].trigger('click');
      await defaultManageButtons[2].trigger('click');
      await nextTick();
      expect(defaultManageButtons[0].classes()).not.toContain('is-selected');
      expect(defaultManageButtons[2].classes()).toContain('is-selected');

      let disabledArgs = (SpectrumToolbarDisabledKeys as {args?: Record<string, unknown>}).args ?? {};
      let disabledStory = SpectrumToolbarDisabledKeys.render?.({...disabledArgs}) as ReturnType<Exclude<typeof SpectrumToolbarDisabledKeys.render, undefined>>;
      let disabledWrapper = mount(disabledStory);
      wrappers.push(disabledWrapper);
      let disabledActionGroups = disabledWrapper.findAllComponents({name: 'VueActionGroup'});
      let manageDisabledKeys = disabledActionGroups[0]?.props('disabledKeys') as Iterable<string> | undefined;
      expect(manageDisabledKeys).toBeInstanceOf(Set);
      expect(Array.from(manageDisabledKeys ?? [])).toEqual(['copy']);

      let disabledGroups = disabledWrapper.findAll('.vs-action-group');
      expect(disabledGroups).toHaveLength(3);
      expect(disabledWrapper.findAll('.vs-tooltip-trigger')).toHaveLength(3);

      let disabledManageButtons = disabledGroups[0].findAll('.vs-action-group__item');
      expect(disabledManageButtons).toHaveLength(3);
      expect(disabledManageButtons[1].attributes('disabled')).toBeDefined();
      expect(disabledManageButtons[1].attributes('aria-disabled')).toBe('true');

      await disabledManageButtons[0].trigger('click');
      await disabledManageButtons[2].trigger('click');
      await nextTick();
      expect(disabledManageButtons[0].classes()).toContain('is-selected');
      expect(disabledManageButtons[2].classes()).toContain('is-selected');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('wires menu stories to real parity props and tooltip wrappers', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let alignStory = MenuTriggerAlignEnd.render?.({}) as ReturnType<Exclude<typeof MenuTriggerAlignEnd.render, undefined>>;
      let alignWrapper = mount(alignStory);
      wrappers.push(alignWrapper);
      await openMenuTriggerInStory(alignWrapper);
      expect(alignWrapper.get('.vs-spectrum-menu').attributes('data-align')).toBe('end');

      let autoFocusStory = MenuTriggerWithAutoFocusFirst.render?.({}) as ReturnType<Exclude<typeof MenuTriggerWithAutoFocusFirst.render, undefined>>;
      let autoFocusWrapper = mount(autoFocusStory);
      wrappers.push(autoFocusWrapper);
      await openMenuTriggerInStory(autoFocusWrapper);
      expect(autoFocusWrapper.get('.vs-spectrum-menu').attributes('data-auto-focus')).toBe('first');

      let directionStory = MenuTriggerDirectionTop.render?.({}) as ReturnType<Exclude<typeof MenuTriggerDirectionTop.render, undefined>>;
      let directionWrapper = mount(directionStory);
      wrappers.push(directionWrapper);
      await openMenuTriggerInStory(directionWrapper);
      expect(directionWrapper.get('.vs-spectrum-menu').attributes('data-direction')).toBe('top');

      let noWrapStory = MenuTriggerWithKeyboardSelectionWrappingFalse.render?.({}) as ReturnType<Exclude<typeof MenuTriggerWithKeyboardSelectionWrappingFalse.render, undefined>>;
      let noWrapWrapper = mount(noWrapStory);
      wrappers.push(noWrapWrapper);
      await openMenuTriggerInStory(noWrapWrapper);
      expect(noWrapWrapper.get('.vs-spectrum-menu').attributes('data-should-focus-wrap')).toBe('false');

      let closeOnSelectStory = MenuTriggerCloseOnSelectFalse.render?.({}) as ReturnType<Exclude<typeof MenuTriggerCloseOnSelectFalse.render, undefined>>;
      let closeOnSelectWrapper = mount(closeOnSelectStory);
      wrappers.push(closeOnSelectWrapper);
      await openMenuTriggerInStory(closeOnSelectWrapper);
      expect(closeOnSelectWrapper.get('.vs-spectrum-menu').attributes('data-close-on-select')).toBe('false');

      let longPressStory = MenuTriggerWithTriggerLongPress.render?.({}) as ReturnType<Exclude<typeof MenuTriggerWithTriggerLongPress.render, undefined>>;
      let longPressWrapper = mount(longPressStory);
      wrappers.push(longPressWrapper);
      await openMenuTriggerInStory(longPressWrapper);
      expect(longPressWrapper.get('.vs-spectrum-menu').attributes('data-trigger')).toBe('longPress');

      let linksArgs = (MenuTriggerWithLinks as {args?: Record<string, unknown>}).args ?? {};
      let linksStory = MenuTriggerWithLinks.render?.({...linksArgs}) as ReturnType<Exclude<typeof MenuTriggerWithLinks.render, undefined>>;
      let linksWrapper = mount(linksStory);
      wrappers.push(linksWrapper);
      await openMenuTriggerInStory(linksWrapper);
      let linkHrefs = linksWrapper.findAll('a.vs-spectrum-menu__item').map((link) => link.attributes('href'));
      expect(linkHrefs).toEqual(expect.arrayContaining(['https://adobe.com', 'https://google.com', 'https://apple.com']));
      expect(linksWrapper.findAll('div.vs-spectrum-menu__item')).toHaveLength(0);
      expect(linksWrapper.text()).not.toContain('Google (https://google.com)');

      let defaultOpenStory = ActionMenuDefaultOpen.render?.({}) as ReturnType<Exclude<typeof ActionMenuDefaultOpen.render, undefined>>;
      let defaultOpenWrapper = mount(defaultOpenStory);
      wrappers.push(defaultOpenWrapper);
      await openMenuTriggerInStory(defaultOpenWrapper);
      let defaultOpenMenu = defaultOpenWrapper.get('.vs-spectrum-menu');
      expect(defaultOpenMenu.attributes('data-open')).toBe('true');
      let defaultOpenComponent = defaultOpenWrapper.getComponent({name: 'VueMenu'});
      let defaultOpenKeys = defaultOpenComponent.props('openKeys') as Set<number | string>;
      expect(defaultOpenKeys).toBeInstanceOf(Set);
      expect(Array.from(defaultOpenKeys)).toEqual(['view']);

      let controlledOpenStory = ActionMenuControlledOpen.render?.({}) as ReturnType<Exclude<typeof ActionMenuControlledOpen.render, undefined>>;
      let controlledOpenWrapper = mount(controlledOpenStory);
      wrappers.push(controlledOpenWrapper);
      await openMenuTriggerInStory(controlledOpenWrapper);
      let controlledOpenActionMenu = controlledOpenWrapper.getComponent({name: 'VueActionMenu'});
      let controlledOpenHandler = (controlledOpenActionMenu.vm.$.vnode.props as {onOpenChange?: (isOpen: boolean) => void} | undefined)?.onOpenChange;
      expect(controlledOpenHandler).toBeTypeOf('function');
      controlledOpenHandler?.(false);
      await nextTick();
      expect(controlledOpenWrapper.find('.vs-spectrum-menu').exists()).toBe(false);
      controlledOpenHandler?.(true);
      await nextTick();
      expect(controlledOpenWrapper.find('.vs-spectrum-menu').exists()).toBe(true);

      let setDisabledStory = ActionMenuDirectionAlignFlip.render?.({disabledKeys: new Set(['two'])}) as ReturnType<Exclude<typeof ActionMenuDirectionAlignFlip.render, undefined>>;
      let setDisabledWrapper = mount(setDisabledStory);
      wrappers.push(setDisabledWrapper);
      await openMenuTriggerInStory(setDisabledWrapper);
      let setDisabledItem = setDisabledWrapper.get('.vs-spectrum-menu__item[aria-label=\"Two\"]');
      expect(setDisabledItem.attributes('aria-disabled')).toBe('true');
      expect(setDisabledItem.classes()).toContain('is-disabled');

      let setDefaultSelectedStory = ActionMenuDirectionAlignFlip.render?.({
        selectionMode: 'multiple',
        defaultSelectedKeys: new Set(['one'])
      }) as ReturnType<Exclude<typeof ActionMenuDirectionAlignFlip.render, undefined>>;
      let setDefaultSelectedWrapper = mount(setDefaultSelectedStory);
      wrappers.push(setDefaultSelectedWrapper);
      await openMenuTriggerInStory(setDefaultSelectedWrapper);
      let selectedItem = setDefaultSelectedWrapper.get('.vs-spectrum-menu__item[aria-label=\"One\"]');
      expect(selectedItem.classes()).toContain('is-selected');

      let setModelSelectedStory = ActionMenuDirectionAlignFlip.render?.({
        selectionMode: 'multiple',
        modelValue: new Set(['one'])
      }) as ReturnType<Exclude<typeof ActionMenuDirectionAlignFlip.render, undefined>>;
      let setModelSelectedWrapper = mount(setModelSelectedStory);
      wrappers.push(setModelSelectedWrapper);
      await openMenuTriggerInStory(setModelSelectedWrapper);
      let modelSelectedItem = setModelSelectedWrapper.get('.vs-spectrum-menu__item[aria-label=\"One\"]');
      expect(modelSelectedItem.classes()).toContain('is-selected');

      let directionAlignFlipStory = ActionMenuDirectionAlignFlip.render?.({}) as ReturnType<Exclude<typeof ActionMenuDirectionAlignFlip.render, undefined>>;
      let directionAlignFlipWrapper = mount(directionAlignFlipStory);
      wrappers.push(directionAlignFlipWrapper);
      await openMenuTriggerInStory(directionAlignFlipWrapper);
      let controls = directionAlignFlipWrapper.findAll('select');
      expect(controls).toHaveLength(2);
      await controls[0].setValue('end');
      await controls[1].setValue('left');
      await directionAlignFlipWrapper.get('input[type="checkbox"]').setValue(false);
      await nextTick();
      let actionMenuRoot = directionAlignFlipWrapper.get('.vs-spectrum-menu');
      expect(actionMenuRoot.attributes('data-align')).toBe('end');
      expect(actionMenuRoot.attributes('data-direction')).toBe('left');
      expect(actionMenuRoot.attributes('data-should-flip')).toBe('false');

      let withTooltipStory = ActionMenuWithTooltip.render?.({}) as ReturnType<Exclude<typeof ActionMenuWithTooltip.render, undefined>>;
      let withTooltipWrapper = mount(withTooltipStory);
      wrappers.push(withTooltipWrapper);
      await openMenuTriggerInStory(withTooltipWrapper);
      expect(withTooltipWrapper.find('.vs-tooltip-trigger').exists()).toBe(true);
      expect(withTooltipWrapper.find('.vs-spectrum-menu').exists()).toBe(true);
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('closes menu trigger stories on Escape and outside pointer interactions', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let escapeStory = MenuTriggerAlignEnd.render?.({}) as ReturnType<Exclude<typeof MenuTriggerAlignEnd.render, undefined>>;
      let escapeWrapper = mount(escapeStory, {attachTo: document.body});
      wrappers.push(escapeWrapper);
      await openMenuTriggerInStory(escapeWrapper);
      expect(escapeWrapper.find('.vs-spectrum-menu').exists()).toBe(true);
      expect(escapeWrapper.findAll('.vs-spectrum-menu__item.is-selected')).toHaveLength(0);

      document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
      await nextTick();
      expect(escapeWrapper.find('.vs-spectrum-menu').exists()).toBe(false);

      await openMenuTriggerInStory(escapeWrapper);
      expect(escapeWrapper.find('.vs-spectrum-menu').exists()).toBe(true);

      await new Promise((resolve) => setTimeout(resolve, 0));
      document.body.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await nextTick();
      expect(escapeWrapper.find('.vs-spectrum-menu').exists()).toBe(false);
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('opens menu trigger stories from keyboard arrows and moves focus into menu items', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let arrowStory = MenuTriggerAlignEnd.render?.({}) as ReturnType<Exclude<typeof MenuTriggerAlignEnd.render, undefined>>;
      let arrowWrapper = mount(arrowStory, {attachTo: document.body});
      wrappers.push(arrowWrapper);

      let triggerButton = arrowWrapper.findAll('button').find((button) => button.text().trim() === 'Menu Button');
      expect(triggerButton).toBeDefined();

      await triggerButton?.trigger('focus');
      await triggerButton?.trigger('keydown', {key: 'ArrowDown'});
      await nextTick();

      expect(arrowWrapper.find('.vs-spectrum-menu').exists()).toBe(true);
      let focusedAfterDown = document.activeElement as HTMLElement | null;
      expect(focusedAfterDown?.getAttribute('aria-label')).toBe('One');

      await triggerButton?.trigger('keydown', {key: 'ArrowUp'});
      await nextTick();
      let focusedAfterUp = document.activeElement as HTMLElement | null;
      expect(focusedAfterUp?.getAttribute('aria-label')).toBe('Three');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('keeps menu trigger default-selected stories wired as uncontrolled defaultSelectedKeys', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let singleStaticStory = MenuTriggerSingleDefaultSelectedUncontrolledStatic.render?.({}) as ReturnType<Exclude<typeof MenuTriggerSingleDefaultSelectedUncontrolledStatic.render, undefined>>;
      let singleStaticWrapper = mount(singleStaticStory);
      wrappers.push(singleStaticWrapper);
      await openMenuTriggerInStory(singleStaticWrapper);
      let singleStaticMenu = singleStaticWrapper.getComponent({name: 'VueMenu'});
      let singleStaticDefaultSelectedKeys = singleStaticMenu.props('defaultSelectedKeys') as Set<number | string>;
      expect(singleStaticDefaultSelectedKeys).toBeInstanceOf(Set);
      expect(Array.from(singleStaticDefaultSelectedKeys)).toEqual(['2']);
      expect(singleStaticMenu.props('modelValue')).toBeUndefined();
      expect(singleStaticWrapper.get('.vs-spectrum-menu__item[aria-label="Two"]').classes()).toContain('is-selected');

      let singleGenerativeStory = MenuTriggerSingleDefaultSelectedUncontrolledGenerative.render?.({}) as ReturnType<Exclude<typeof MenuTriggerSingleDefaultSelectedUncontrolledGenerative.render, undefined>>;
      let singleGenerativeWrapper = mount(singleGenerativeStory);
      wrappers.push(singleGenerativeWrapper);
      await openMenuTriggerInStory(singleGenerativeWrapper);
      let singleGenerativeMenu = singleGenerativeWrapper.getComponent({name: 'VueMenu'});
      let singleGenerativeDefaultSelectedKeys = singleGenerativeMenu.props('defaultSelectedKeys') as Set<number | string>;
      expect(singleGenerativeDefaultSelectedKeys).toBeInstanceOf(Set);
      expect(Array.from(singleGenerativeDefaultSelectedKeys)).toEqual(['Kangaroo']);
      expect(singleGenerativeMenu.props('modelValue')).toBeUndefined();
      expect(singleGenerativeWrapper.get('.vs-spectrum-menu__item[aria-label="Kangaroo"]').classes()).toContain('is-selected');

      let multipleStaticStory = MenuTriggerMultipleDefaultSelectedUncontrolledStatic.render?.({}) as ReturnType<Exclude<typeof MenuTriggerMultipleDefaultSelectedUncontrolledStatic.render, undefined>>;
      let multipleStaticWrapper = mount(multipleStaticStory);
      wrappers.push(multipleStaticWrapper);
      await openMenuTriggerInStory(multipleStaticWrapper);
      let multipleStaticMenu = multipleStaticWrapper.getComponent({name: 'VueMenu'});
      let multipleStaticDefaultSelectedKeys = multipleStaticMenu.props('defaultSelectedKeys') as Set<number | string>;
      expect(multipleStaticDefaultSelectedKeys).toBeInstanceOf(Set);
      expect(Array.from(multipleStaticDefaultSelectedKeys)).toEqual(expect.arrayContaining(['2', '5']));
      expect(multipleStaticMenu.props('modelValue')).toBeUndefined();
      expect(multipleStaticWrapper.get('.vs-spectrum-menu__item[aria-label="Two"]').classes()).toContain('is-selected');
      expect(multipleStaticWrapper.get('.vs-spectrum-menu__item[aria-label="Five"]').classes()).toContain('is-selected');

      let multipleGenerativeStory = MenuTriggerMultipleDefaultSelectedUncontrolledGenerative.render?.({}) as ReturnType<Exclude<typeof MenuTriggerMultipleDefaultSelectedUncontrolledGenerative.render, undefined>>;
      let multipleGenerativeWrapper = mount(multipleGenerativeStory);
      wrappers.push(multipleGenerativeWrapper);
      await openMenuTriggerInStory(multipleGenerativeWrapper);
      let multipleGenerativeMenu = multipleGenerativeWrapper.getComponent({name: 'VueMenu'});
      let multipleGenerativeDefaultSelectedKeys = multipleGenerativeMenu.props('defaultSelectedKeys') as Set<number | string>;
      expect(multipleGenerativeDefaultSelectedKeys).toBeInstanceOf(Set);
      expect(Array.from(multipleGenerativeDefaultSelectedKeys)).toEqual(expect.arrayContaining(['Kangaroo', 'Devon']));
      expect(multipleGenerativeMenu.props('modelValue')).toBeUndefined();
      expect(multipleGenerativeWrapper.get('.vs-spectrum-menu__item[aria-label="Kangaroo"]').classes()).toContain('is-selected');
      expect(multipleGenerativeWrapper.get('.vs-spectrum-menu__item[aria-label="Devon"]').classes()).toContain('is-selected');

      let autoFocusSingleStory = MenuTriggerAutoFocusSingleDefaultSelectedUncontrolled.render?.({}) as ReturnType<Exclude<typeof MenuTriggerAutoFocusSingleDefaultSelectedUncontrolled.render, undefined>>;
      let autoFocusSingleWrapper = mount(autoFocusSingleStory);
      wrappers.push(autoFocusSingleWrapper);
      await openMenuTriggerInStory(autoFocusSingleWrapper);
      let autoFocusSingleMenu = autoFocusSingleWrapper.getComponent({name: 'VueMenu'});
      let autoFocusSingleDefaultSelectedKeys = autoFocusSingleMenu.props('defaultSelectedKeys') as Set<number | string>;
      expect(autoFocusSingleDefaultSelectedKeys).toBeInstanceOf(Set);
      expect(Array.from(autoFocusSingleDefaultSelectedKeys)).toEqual(['Kangaroo']);
      expect(autoFocusSingleMenu.props('modelValue')).toBeUndefined();
      expect(autoFocusSingleWrapper.get('.vs-spectrum-menu__item[aria-label="Kangaroo"]').classes()).toContain('is-selected');
      expect(autoFocusSingleWrapper.get('.vs-spectrum-menu').attributes('data-auto-focus')).toBe('true');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('keeps menu trigger controlled multiple-selection stories wired with set-backed selected and disabled keys', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let staticStory = MenuTriggerMultipleDefaultSelectedControlledStatic.render?.({}) as ReturnType<Exclude<typeof MenuTriggerMultipleDefaultSelectedControlledStatic.render, undefined>>;
      let staticWrapper = mount(staticStory);
      wrappers.push(staticWrapper);
      await openMenuTriggerInStory(staticWrapper);
      let staticMenu = staticWrapper.getComponent({name: 'VueMenu'});
      let staticModelValue = staticMenu.props('modelValue') as Set<number | string>;
      let staticDisabledKeys = staticMenu.props('disabledKeys') as Set<number | string>;
      expect(staticModelValue).toBeInstanceOf(Set);
      expect(Array.from(staticModelValue)).toEqual(expect.arrayContaining(['2', '5']));
      expect(staticDisabledKeys).toBeInstanceOf(Set);
      expect(Array.from(staticDisabledKeys)).toEqual(expect.arrayContaining(['1', '3']));
      expect(staticMenu.props('defaultSelectedKeys')).toEqual([]);
      expect(staticWrapper.get('.vs-spectrum-menu__item[aria-label="Two"]').classes()).toContain('is-selected');
      expect(staticWrapper.get('.vs-spectrum-menu__item[aria-label="Five"]').classes()).toContain('is-selected');
      expect(staticWrapper.get('.vs-spectrum-menu__item[aria-label="One"]').attributes('aria-disabled')).toBe('true');
      expect(staticWrapper.get('.vs-spectrum-menu__item[aria-label="Three"]').attributes('aria-disabled')).toBe('true');

      let generativeStory = MenuTriggerMultipleSelectedControlledGenerative.render?.({}) as ReturnType<Exclude<typeof MenuTriggerMultipleSelectedControlledGenerative.render, undefined>>;
      let generativeWrapper = mount(generativeStory);
      wrappers.push(generativeWrapper);
      await openMenuTriggerInStory(generativeWrapper);
      let generativeMenu = generativeWrapper.getComponent({name: 'VueMenu'});
      let generativeModelValue = generativeMenu.props('modelValue') as Set<number | string>;
      expect(generativeModelValue).toBeInstanceOf(Set);
      expect(Array.from(generativeModelValue)).toEqual(expect.arrayContaining(['Kangaroo', 'Devon']));
      expect(generativeMenu.props('defaultSelectedKeys')).toEqual([]);
      expect(generativeWrapper.get('.vs-spectrum-menu__item[aria-label="Kangaroo"]').classes()).toContain('is-selected');
      expect(generativeWrapper.get('.vs-spectrum-menu__item[aria-label="Devon"]').classes()).toContain('is-selected');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders menu trigger unavailable stories with real disabled-item contracts', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let unavailableStory = MenuTriggerItemUnavailable.render?.({}) as ReturnType<Exclude<typeof MenuTriggerItemUnavailable.render, undefined>>;
      let unavailableWrapper = mount(unavailableStory);
      wrappers.push(unavailableWrapper);
      await openMenuTriggerInStory(unavailableWrapper);
      let unavailableItems = unavailableWrapper.findAll('.vs-spectrum-menu__item.is-disabled').map((button) => button.text());
      expect(unavailableItems).toEqual(expect.arrayContaining(['Two', 'Two point five', 'Four']));
      expect(unavailableWrapper.text()).not.toContain('(unavailable)');

      let unavailableWithSelectionStory = MenuTriggerItemUnavailableWithSelection.render?.({}) as ReturnType<Exclude<typeof MenuTriggerItemUnavailableWithSelection.render, undefined>>;
      let unavailableWithSelectionWrapper = mount(unavailableWithSelectionStory);
      wrappers.push(unavailableWithSelectionWrapper);
      await openMenuTriggerInStory(unavailableWithSelectionWrapper);
      let unavailableWithSelectionItems = unavailableWithSelectionWrapper.findAll('.vs-spectrum-menu__item.is-disabled').map((button) => button.text());
      expect(unavailableWithSelectionItems).toEqual(['Two']);
      expect(unavailableWithSelectionWrapper.text()).not.toContain('(unavailable)');

      let unavailableDynamicStory = MenuTriggerItemUnavailableDynamic.render?.({}) as ReturnType<Exclude<typeof MenuTriggerItemUnavailableDynamic.render, undefined>>;
      let unavailableDynamicWrapper = mount(unavailableDynamicStory);
      wrappers.push(unavailableDynamicWrapper);
      await openMenuTriggerInStory(unavailableDynamicWrapper);
      let unavailableDynamicItems = unavailableDynamicWrapper.findAll('.vs-spectrum-menu__item.is-disabled').map((button) => button.text());
      expect(unavailableDynamicItems).toEqual(['Kangaroo']);
      expect(unavailableDynamicWrapper.text()).not.toContain('(unavailable)');

      let unavailableTogglingStory = MenuTriggerItemUnavailableToggling.render?.({}) as ReturnType<Exclude<typeof MenuTriggerItemUnavailableToggling.render, undefined>>;
      let unavailableTogglingWrapper = mount(unavailableTogglingStory);
      wrappers.push(unavailableTogglingWrapper);
      await openMenuTriggerInStory(unavailableTogglingWrapper);
      let unavailableToggleButton = unavailableTogglingWrapper.findAll('button').find((button) => button.text() === 'Toggle item 2');
      expect(unavailableToggleButton).toBeDefined();
      let unavailableToggleItem = unavailableTogglingWrapper.get('.vs-spectrum-menu__item[aria-label="Two"]');
      expect(unavailableToggleButton?.attributes('aria-pressed')).toBe('false');
      expect(unavailableToggleItem.attributes('aria-disabled')).toBeUndefined();
      await unavailableToggleButton?.trigger('click');
      await nextTick();
      expect(unavailableToggleButton?.attributes('aria-pressed')).toBe('true');
      expect(unavailableTogglingWrapper.get('.vs-spectrum-menu__item[aria-label="Two"]').attributes('aria-disabled')).toBe('true');
      await unavailableToggleButton?.trigger('click');
      await nextTick();
      expect(unavailableToggleButton?.attributes('aria-pressed')).toBe('false');
      expect(unavailableTogglingWrapper.get('.vs-spectrum-menu__item[aria-label="Two"]').attributes('aria-disabled')).toBeUndefined();
      expect(unavailableTogglingWrapper.text()).not.toContain('(unavailable)');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders submenu stories with iterable open and selection key contracts', () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let submenuStaticStory = MenuSubmenuStatic.render?.({}) as ReturnType<Exclude<typeof MenuSubmenuStatic.render, undefined>>;
      let submenuStaticWrapper = mount(submenuStaticStory);
      wrappers.push(submenuStaticWrapper);
      let submenuStaticComponent = submenuStaticWrapper.getComponent({name: 'VueMenu'});
      let submenuStaticOpenKeys = submenuStaticComponent.props('openKeys') as Set<number | string>;
      expect(submenuStaticOpenKeys).toBeInstanceOf(Set);
      expect(Array.from(submenuStaticOpenKeys)).toEqual(expect.arrayContaining(['lvl1-2', 'lvl2-3']));
      expect(submenuStaticWrapper.find('.vs-spectrum-menu__submenu[aria-hidden="false"]').exists()).toBe(true);

      let submenuSelectionStory = MenuSubmenuSelection.render?.({}) as ReturnType<Exclude<typeof MenuSubmenuSelection.render, undefined>>;
      let submenuSelectionWrapper = mount(submenuSelectionStory);
      wrappers.push(submenuSelectionWrapper);
      let submenuSelectionComponent = submenuSelectionWrapper.getComponent({name: 'VueMenu'});
      let submenuSelectionModelValue = submenuSelectionComponent.props('modelValue') as Set<number | string>;
      expect(submenuSelectionModelValue).toBeInstanceOf(Set);
      expect(Array.from(submenuSelectionModelValue)).toEqual(expect.arrayContaining(['lvl1-1', 'lvl3-2']));
      let submenuSelectedItems = submenuSelectionWrapper.findAll('.vs-spectrum-menu__item.is-selected').map((button) => button.text());
      expect(submenuSelectedItems).toEqual(expect.arrayContaining(['Lvl 1 Item 1', 'Lvl 3 Item 2']));
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders submenu unavailable and conditional stories with React-aligned disabled contracts', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let unavailableStory = MenuSubmenuUnavailable.render?.({}) as ReturnType<Exclude<typeof MenuSubmenuUnavailable.render, undefined>>;
      let unavailableWrapper = mount(unavailableStory);
      wrappers.push(unavailableWrapper);

      let unavailableItems = unavailableWrapper.findAll('.vs-spectrum-menu__item.is-disabled').map((button) => button.text());
      expect(unavailableItems).toEqual(expect.arrayContaining(['Lvl 2.2 Item 1', 'Lvl 1 Item 3']));
      expect(unavailableWrapper.text()).toContain('Lvl 2.2 Item 3');
      expect(unavailableWrapper.text()).toContain('Lvl 2.4 Item 3');
      expect(unavailableWrapper.text()).not.toContain('(unavailable)');

      let conditionalStory = MenuSubmenuConditional.render?.({}) as ReturnType<Exclude<typeof MenuSubmenuConditional.render, undefined>>;
      let conditionalWrapper = mount(conditionalStory);
      wrappers.push(conditionalWrapper);

      let conditionalToggleButton = conditionalWrapper.findAll('button').find((button) => button.text() === 'Toggle item 2 unavailable');
      expect(conditionalToggleButton).toBeDefined();
      expect(conditionalToggleButton?.attributes('aria-pressed')).toBe('false');
      expect(conditionalWrapper.get('.vs-spectrum-menu__item[aria-label="Lvl 1 Item 2"]').attributes('aria-disabled')).toBeUndefined();
      expect(conditionalWrapper.findAll('.vs-spectrum-menu__submenu').length).toBeGreaterThan(0);

      await conditionalToggleButton?.trigger('click');
      await nextTick();
      expect(conditionalToggleButton?.attributes('aria-pressed')).toBe('true');
      expect(conditionalWrapper.get('.vs-spectrum-menu__item[aria-label="Lvl 1 Item 2"]').attributes('aria-disabled')).toBe('true');
      expect(conditionalWrapper.findAll('.vs-spectrum-menu__submenu')).toHaveLength(0);

      await conditionalToggleButton?.trigger('click');
      await nextTick();
      expect(conditionalToggleButton?.attributes('aria-pressed')).toBe('false');
      expect(conditionalWrapper.get('.vs-spectrum-menu__item[aria-label="Lvl 1 Item 2"]').attributes('aria-disabled')).toBeUndefined();
      expect(conditionalWrapper.findAll('.vs-spectrum-menu__submenu').length).toBeGreaterThan(0);
      expect(conditionalWrapper.text()).not.toContain('(unavailable)');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders date picker custom calendar stories with live locale/calendar descriptions', () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let datePickerStory = DatePickerCustomCalendarStory.render?.({}) as ReturnType<Exclude<typeof DatePickerCustomCalendarStory.render, undefined>>;
      let datePickerWrapper = mount(datePickerStory);
      wrappers.push(datePickerWrapper);
      expect(datePickerWrapper.findAll('select').length).toBeGreaterThanOrEqual(2);
      expect(datePickerWrapper.get('.vs-date-picker').exists()).toBe(true);
      expect(datePickerWrapper.text()).toContain('Custom 4-5-4 calendar');
      expect(datePickerWrapper.text()).toContain('Locale:');
      expect(datePickerWrapper.text()).not.toContain('scenario preview');

      let dateRangePickerStory = DateRangePickerCustomCalendarStory.render?.({}) as ReturnType<Exclude<typeof DateRangePickerCustomCalendarStory.render, undefined>>;
      let dateRangePickerWrapper = mount(dateRangePickerStory);
      wrappers.push(dateRangePickerWrapper);
      expect(dateRangePickerWrapper.findAll('select').length).toBeGreaterThanOrEqual(2);
      expect(dateRangePickerWrapper.get('.vs-date-range-picker').exists()).toBe(true);
      expect(dateRangePickerWrapper.text()).toContain('Custom 4-5-4 calendar');
      expect(dateRangePickerWrapper.text()).toContain('Locale:');
      expect(dateRangePickerWrapper.text()).not.toContain('scenario preview');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders picker disabled-keys story with real disabled option contracts', () => {
    let disabledStory = PickerDisabledKeysStory.render?.({}) as ReturnType<Exclude<typeof PickerDisabledKeysStory.render, undefined>>;
    let disabledWrapper = mount(disabledStory);
    let disabledSetStory = PickerDisabledKeysStory.render?.({disabledKeys: new Set(['option-2'])}) as ReturnType<Exclude<typeof PickerDisabledKeysStory.render, undefined>>;
    let disabledSetWrapper = mount(disabledSetStory);

    try {
      let options = disabledWrapper.findAll('select.vs-picker__select option');
      let disabledOption = options.find((option) => option.attributes('value') === 'option-2');
      expect(disabledOption?.attributes('disabled')).toBeDefined();
      expect(disabledWrapper.text()).not.toContain('disabled in React');

      let setOptions = disabledSetWrapper.findAll('select.vs-picker__select option');
      let setDisabledOption = setOptions.find((option) => option.attributes('value') === 'option-2');
      expect(setDisabledOption?.attributes('disabled')).toBeDefined();
    } finally {
      disabledWrapper.unmount();
      disabledSetWrapper.unmount();
    }
  });

  it('renders combobox disabled-keys story with disabled option contracts', async () => {
    let disabledArgs = (ComboBoxDisabledKeysStory as {args?: Record<string, unknown>}).args ?? {};
    let disabledStory = ComboBoxDisabledKeysStory.render?.({...disabledArgs}) as ReturnType<Exclude<typeof ComboBoxDisabledKeysStory.render, undefined>>;
    let disabledWrapper = mount(disabledStory);
    let disabledSetStory = ComboBoxDisabledKeysStory.render?.({...disabledArgs, disabledKeys: new Set(['Snake', 'Ross'])}) as ReturnType<Exclude<typeof ComboBoxDisabledKeysStory.render, undefined>>;
    let disabledSetWrapper = mount(disabledSetStory);
    let selectedSetStory = ComboBoxDisabledKeysStory.render?.({
      ...disabledArgs,
      selectionMode: 'multiple',
      selectedKeys: new Set(['Aardvark']),
      disabledKeys: []
    }) as ReturnType<Exclude<typeof ComboBoxDisabledKeysStory.render, undefined>>;
    let selectedSetWrapper = mount(selectedSetStory);

    try {
      await disabledWrapper.get('button.spectrum-FieldButton').trigger('mousedown');
      await disabledWrapper.get('button.spectrum-FieldButton').trigger('click');
      let snakeOption = disabledWrapper.get('[role="option"][data-key="Snake"]');
      let rossOption = disabledWrapper.get('[role="option"][data-key="Ross"]');

      expect(snakeOption.classes()).toContain('is-disabled');
      expect(snakeOption.attributes('aria-disabled')).toBe('true');
      expect(rossOption.classes()).toContain('is-disabled');
      expect(rossOption.attributes('aria-disabled')).toBe('true');
      expect(disabledWrapper.text()).not.toContain('disabled in React');

      await disabledSetWrapper.get('button.spectrum-FieldButton').trigger('mousedown');
      await disabledSetWrapper.get('button.spectrum-FieldButton').trigger('click');
      let setSnakeOption = disabledSetWrapper.get('[role="option"][data-key="Snake"]');
      let setRossOption = disabledSetWrapper.get('[role="option"][data-key="Ross"]');
      expect(setSnakeOption.attributes('aria-disabled')).toBe('true');
      expect(setRossOption.attributes('aria-disabled')).toBe('true');

      await selectedSetWrapper.get('button.spectrum-FieldButton').trigger('mousedown');
      await selectedSetWrapper.get('button.spectrum-FieldButton').trigger('click');
      let selectedAardvarkOption = selectedSetWrapper.get('[role="option"][data-key="Aardvark"]');
      expect(selectedAardvarkOption.attributes('aria-selected')).toBe('true');
      expect(selectedAardvarkOption.classes()).toContain('is-selected');
    } finally {
      disabledWrapper.unmount();
      disabledSetWrapper.unmount();
      selectedSetWrapper.unmount();
    }
  });

  it('keeps combobox controlled/default stories wired with disabledKeys parity args', () => {
    expect((ComboBoxControlledInputValueStory as {args?: Record<string, unknown>}).args).toMatchObject({
      disabledKeys: ['2', '6']
    });
    expect((ComboBoxDefaultInputValueStory as {args?: Record<string, unknown>}).args).toMatchObject({
      disabledKeys: ['two']
    });
    expect((ComboBoxControlledSelectedKeyStory as {args?: Record<string, unknown>}).args).toMatchObject({
      disabledKeys: ['2', '6']
    });
    expect((ComboBoxDefaultSelectedKeyStory as {args?: Record<string, unknown>}).args).toMatchObject({
      disabledKeys: ['one']
    });
    expect((ComboBoxAllControlledStory as {args?: Record<string, unknown>}).args).toMatchObject({
      disabledKeys: ['2', '6']
    });
    expect((ComboBoxDefaultInputAndKeyStory as {args?: Record<string, unknown>}).args).toMatchObject({
      disabledKeys: ['two']
    });
    expect((ComboBoxControlledInputDefaultKeyStory as {args?: Record<string, unknown>}).args).toMatchObject({
      disabledKeys: ['2', '6']
    });
    expect((ComboBoxControlledInputValueBySelectedKeyStory as {args?: Record<string, unknown>}).args).toMatchObject({
      disabledKeys: ['2', '6']
    });
  });

  it('renders steplist disabled key story with disabled step contract', () => {
    let disabledStory = StepListDisabledKeyStory.render?.({}) as ReturnType<Exclude<typeof StepListDisabledKeyStory.render, undefined>>;
    let disabledWrapper = mount(disabledStory);

    try {
      let links = disabledWrapper.findAll('a.vs-steplist__link');
      expect(links).toHaveLength(4);
      expect(links[1].attributes('aria-disabled')).toBe('true');
      expect(links[1].classes()).toContain('is-disabled');
    } finally {
      disabledWrapper.unmount();
    }
  });

  it('renders toast stories with iframe and fullscreen parity contracts', async () => {
    clearToastQueue();
    let defaultWrapper: ReturnType<typeof mount> | null = null;
    let actionWrapper: ReturnType<typeof mount> | null = null;
    let withDialogWrapper: ReturnType<typeof mount> | null = null;
    let multipleWrapper: ReturnType<typeof mount> | null = null;
    let closingWrapper: ReturnType<typeof mount> | null = null;
    let iframeWrapper: ReturnType<typeof mount> | null = null;
    let fullscreenWrapper: ReturnType<typeof mount> | null = null;

    try {
      let defaultStory = ToastDefault.render?.({placement: undefined, shouldCloseOnAction: false, timeout: undefined}) as ReturnType<Exclude<typeof ToastDefault.render, undefined>>;
      defaultWrapper = mount(defaultStory);
      let neutralButton = defaultWrapper.get('button');
      expect(neutralButton.text()).toBe('Show Neutral Toast');
      expect(neutralButton.attributes('data-react-aria-pressable')).toBe('true');

      await neutralButton.trigger('click');
      await nextTick();
      expect(defaultWrapper.get('section.vs-toast-region').attributes('aria-label')).toBe('Notifications');
      expect(defaultWrapper.find('.vs-toast').exists()).toBe(true);

      clearToastQueue();
      await nextTick();
      expect(defaultWrapper.find('.vs-toast').exists()).toBe(false);
      defaultWrapper.unmount();
      defaultWrapper = null;

      let actionStory = ToastWithAction.render?.({placement: undefined, shouldCloseOnAction: true, timeout: undefined}) as ReturnType<Exclude<typeof ToastWithAction.render, undefined>>;
      actionWrapper = mount(actionStory);
      await actionWrapper.get('button').trigger('click');
      await nextTick();
      expect(actionWrapper.find('.vs-toast__action').text()).toBe('Action');

      clearToastQueue();
      await nextTick();
      actionWrapper.unmount();
      actionWrapper = null;

      let withDialogStory = ToastWithDialog.render?.({placement: undefined, shouldCloseOnAction: false, timeout: undefined}) as ReturnType<Exclude<typeof ToastWithDialog.render, undefined>>;
      withDialogWrapper = mount(withDialogStory);
      expect(withDialogWrapper.find('section.vs-dialog').exists() || document.body.querySelector('section.vs-dialog') !== null).toBe(false);
      await withDialogWrapper.get('button').trigger('click');
      await nextTick();
      expect(withDialogWrapper.find('section.vs-dialog').exists() || document.body.querySelector('section.vs-dialog') !== null).toBe(true);
      let neutralToastButtonWrapper = withDialogWrapper.findAll('button').find((button) => button.text() === 'Show Neutral Toast');
      if (neutralToastButtonWrapper) {
        await neutralToastButtonWrapper.trigger('click');
      } else {
        let neutralToastButton = Array.from(document.querySelectorAll('button'))
          .find((button) => button.textContent?.trim() === 'Show Neutral Toast');
        neutralToastButton?.click();
      }
      await nextTick();
      expect(withDialogWrapper.find('.vs-toast').exists() || document.body.querySelector('.vs-toast') !== null).toBe(true);

      clearToastQueue();
      await nextTick();
      withDialogWrapper.unmount();
      withDialogWrapper = null;

      let multipleStory = ToastMultipleToastContainers.render?.({placement: undefined, shouldCloseOnAction: false, timeout: undefined}) as ReturnType<Exclude<typeof ToastMultipleToastContainers.render, undefined>>;
      multipleWrapper = mount(multipleStory);
      expect(multipleWrapper.findAll('input[type="checkbox"]')).toHaveLength(2);
      await multipleWrapper.findAll('button').find((button) => button.text() === 'Show Positive Toast')?.trigger('click');
      await nextTick();
      expect(multipleWrapper.findAll('section.vs-toast-region').length + document.querySelectorAll('section.vs-toast-region').length).toBeGreaterThan(0);
      let firstCheckbox = multipleWrapper.findAll('input[type="checkbox"]')[0];
      await firstCheckbox.setValue(false);
      await nextTick();
      expect(multipleWrapper.findAll('section.vs-toast-region').length + document.querySelectorAll('section.vs-toast-region').length).toBeGreaterThan(0);

      clearToastQueue();
      await nextTick();
      multipleWrapper.unmount();
      multipleWrapper = null;

      let closingStory = ToastProgrammaticallyClosing.render?.({placement: undefined, shouldCloseOnAction: false, timeout: undefined}) as ReturnType<Exclude<typeof ToastProgrammaticallyClosing.render, undefined>>;
      closingWrapper = mount(closingStory);
      let toggleButton = closingWrapper.get('button');
      expect(toggleButton.text()).toContain('Show');
      await toggleButton.trigger('click');
      await nextTick();
      expect(closingWrapper.get('button').text()).toContain('Hide');
      expect(closingWrapper.find('.vs-toast').exists()).toBe(true);
      await closingWrapper.get('button').trigger('click');
      await nextTick();
      expect(closingWrapper.get('button').text()).toContain('Show');

      let iframeStory = ToastWithIframe.render?.({placement: undefined, shouldCloseOnAction: false, timeout: undefined}) as ReturnType<Exclude<typeof ToastWithIframe.render, undefined>>;
      iframeWrapper = mount(iframeStory);
      let iframe = iframeWrapper.get('iframe');
      expect(iframe.attributes('title')).toBe('iframe');
      expect(iframe.attributes('width')).toBe('500');
      expect(iframe.attributes('height')).toBe('500');
      expect(iframe.attributes('src')).toContain('id=toast--with-dialog');
      expect(iframeWrapper.text()).not.toContain('Iframe parity scenario placeholder');

      let fullscreenStory = ToastWithFullscreen.render?.({placement: undefined, shouldCloseOnAction: false, timeout: undefined}) as ReturnType<Exclude<typeof ToastWithFullscreen.render, undefined>>;
      fullscreenWrapper = mount(fullscreenStory);
      let fullscreenRoot = fullscreenWrapper.get('div');
      let rootStyle = (fullscreenRoot.attributes('style') ?? '').replace(/\s/g, '');
      expect(rootStyle).toContain('position:fixed');
      expect(rootStyle).toContain('width:100vw');
      expect(rootStyle).toContain('height:100vh');
      expect(fullscreenWrapper.text()).toContain('Enter fullscreen');
    } finally {
      clearToastQueue();
      defaultWrapper?.unmount();
      actionWrapper?.unmount();
      withDialogWrapper?.unmount();
      multipleWrapper?.unmount();
      closingWrapper?.unmount();
      iframeWrapper?.unmount();
      fullscreenWrapper?.unmount();
    }
  });

  it('renders alert dialog stories with trigger and action-state parity contracts', async () => {
    let destructiveWrapper: ReturnType<typeof mount> | null = null;
    let primaryDisabledWrapper: ReturnType<typeof mount> | null = null;
    let autoFocusCancelWrapper: ReturnType<typeof mount> | null = null;

    try {
      let destructiveArgs = (AlertDialogDestructive as {args?: Record<string, unknown>}).args ?? {};
      let destructiveStory = AlertDialogDestructive.render?.({...destructiveArgs}) as ReturnType<Exclude<typeof AlertDialogDestructive.render, undefined>>;
      destructiveWrapper = mount(destructiveStory);
      expect(destructiveWrapper.get('button').text()).toBe('Trigger');
      expect(destructiveWrapper.find('section[role="alertdialog"]').exists()).toBe(true);
      expect(destructiveWrapper.text()).toContain('Cancel');
      await destructiveWrapper.get('button.vs-dialog__close').trigger('click');
      await nextTick();
      expect(destructiveWrapper.find('section[role="alertdialog"]').exists()).toBe(false);
      await destructiveWrapper.get('button').trigger('click');
      await nextTick();
      expect(destructiveWrapper.find('section[role="alertdialog"]').exists()).toBe(true);

      let primaryDisabledArgs = (AlertDialogPrimaryDisabled as {args?: Record<string, unknown>}).args ?? {};
      let primaryDisabledStory = AlertDialogPrimaryDisabled.render?.({...primaryDisabledArgs}) as ReturnType<Exclude<typeof AlertDialogPrimaryDisabled.render, undefined>>;
      primaryDisabledWrapper = mount(primaryDisabledStory);
      let acceptButton = primaryDisabledWrapper.findAll('button').find((button) => button.text() === 'Accept');
      expect(acceptButton).toBeDefined();
      expect(acceptButton?.attributes('disabled') != null || acceptButton?.attributes('aria-disabled') === 'true').toBe(true);

      let autoFocusCancelArgs = (AlertDialogAutoFocusCancel as {args?: Record<string, unknown>}).args ?? {};
      let autoFocusCancelStory = AlertDialogAutoFocusCancel.render?.({...autoFocusCancelArgs}) as ReturnType<Exclude<typeof AlertDialogAutoFocusCancel.render, undefined>>;
      autoFocusCancelWrapper = mount(autoFocusCancelStory);
      expect(autoFocusCancelWrapper.text()).toContain('Cancel');
      expect(autoFocusCancelWrapper.text()).toContain('Secondary button');
      expect(autoFocusCancelWrapper.text()).toContain('Accept');
    } finally {
      destructiveWrapper?.unmount();
      primaryDisabledWrapper?.unmount();
      autoFocusCancelWrapper?.unmount();
    }
  });

  it('renders dialog container stories with menu opening and nested container parity behavior', async () => {
    let defaultWrapper: ReturnType<typeof mount> | null = null;
    let menuWrapper: ReturnType<typeof mount> | null = null;
    let dismissableWrapper: ReturnType<typeof mount> | null = null;
    let nestedWrapper: ReturnType<typeof mount> | null = null;

    try {
      let defaultStory = DialogContainerDefault.render?.({}) as ReturnType<Exclude<typeof DialogContainerDefault.render, undefined>>;
      defaultWrapper = mount(defaultStory);
      let initialDialogCount = document.querySelectorAll('section.vs-dialog').length;
      expect(defaultWrapper.find('section.vs-dialog').exists() || document.body.querySelector('section.vs-dialog') !== null).toBe(false);
      await defaultWrapper.get('button').trigger('click');
      await nextTick();
      let openedDialogCount = document.querySelectorAll('section.vs-dialog').length;
      expect(openedDialogCount).toBeGreaterThan(initialDialogCount);
      expect(defaultWrapper.text().includes('The Heading') || (document.body.textContent ?? '').includes('The Heading')).toBe(true);
      let activeDialog = Array.from(document.querySelectorAll('section.vs-dialog')).at(-1);
      let cancelButton = defaultWrapper.findAll('button').find((button) => button.text() === 'Cancel')
        ?? Array.from(activeDialog?.querySelectorAll('button') ?? []).find((button) => button.textContent?.trim() === 'Cancel')
        ?? Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.trim() === 'Cancel');
      expect(cancelButton).toBeDefined();
      if (cancelButton && 'trigger' in cancelButton) {
        await cancelButton.trigger('click');
      } else {
        (cancelButton as HTMLButtonElement | undefined)?.click();
      }
      await new Promise((resolve) => setTimeout(resolve, 360));
      await nextTick();
      expect(document.querySelectorAll('section.vs-dialog').length).toBeLessThan(openedDialogCount);

      let inAMenuStory = DialogContainerInAMenu.render?.({}) as ReturnType<Exclude<typeof DialogContainerInAMenu.render, undefined>>;
      menuWrapper = mount(inAMenuStory);
      await menuWrapper.get('.vs-spectrum-menu__item').trigger('click');
      await nextTick();
      expect(menuWrapper.find('section.vs-dialog').exists() || document.body.querySelector('section.vs-dialog') !== null).toBe(true);
      menuWrapper.unmount();
      menuWrapper = null;

      let dismissableStory = DialogContainerIsDismissable.render?.({isDismissable: true}) as ReturnType<Exclude<typeof DialogContainerIsDismissable.render, undefined>>;
      dismissableWrapper = mount(dismissableStory);
      await dismissableWrapper.get('.vs-spectrum-menu__item').trigger('click');
      await nextTick();
      let dismissButton = dismissableWrapper.find('button.vs-dialog__close');
      if (dismissButton.exists()) {
        await dismissButton.trigger('click');
      } else {
        let globalDismissButton = document.querySelector('button.vs-dialog__close') as HTMLButtonElement | null;
        expect(globalDismissButton).not.toBeNull();
        globalDismissButton?.click();
      }
      await new Promise((resolve) => setTimeout(resolve, 360));
      await nextTick();
      expect(dismissableWrapper.find('section.vs-dialog').exists() || document.body.querySelector('section.vs-dialog') !== null).toBe(false);

      let nestedStory = DialogContainerNestedDialogContainers.render?.({}) as ReturnType<Exclude<typeof DialogContainerNestedDialogContainers.render, undefined>>;
      nestedWrapper = mount(nestedStory);
      await nestedWrapper.get('.vs-spectrum-menu__item').trigger('click');
      await nextTick();
      let nestedDialogCount = nestedWrapper.findAll('section.vs-dialog').length + document.querySelectorAll('section.vs-dialog').length;
      expect(nestedDialogCount).toBeGreaterThan(0);
      let nestedToggleButton = nestedWrapper.findAll('button').find((button) => button.text() === 'Do that')
        ?? Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.trim() === 'Do that');
      expect(nestedToggleButton).toBeDefined();
      if (nestedToggleButton && 'trigger' in nestedToggleButton) {
        await nestedToggleButton.trigger('click');
      } else {
        (nestedToggleButton as HTMLButtonElement | undefined)?.click();
      }
      await nextTick();
      let nestedDialogCountAfterToggle = nestedWrapper.findAll('section.vs-dialog').length + document.querySelectorAll('section.vs-dialog').length;
      expect(nestedDialogCountAfterToggle).toBeGreaterThan(nestedDialogCount);
    } finally {
      defaultWrapper?.unmount();
      menuWrapper?.unmount();
      dismissableWrapper?.unmount();
      nestedWrapper?.unmount();
    }
  });

  it('renders drag and drop stories with live drag/drop targets and state updates', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let draggableStory = DndDraggableStory.render?.({}) as ReturnType<Exclude<typeof DndDraggableStory.render, undefined>>;
      let draggableWrapper = mount(draggableStory);
      wrappers.push(draggableWrapper);
      expect(draggableWrapper.text()).not.toContain('Default drag and drop playground');
      expect(draggableWrapper.text()).not.toContain('scenario');

      let dragButton = draggableWrapper.get('button.vs-dnd__draggable');

      await dragButton.trigger('pointerdown');
      await nextTick();
      expect(draggableWrapper.get('.vs-dnd__preview').exists()).toBe(true);
      expect(draggableWrapper.get('.vs-dnd__status').text()).toContain('Dragging: true');

      let primaryDropZone = draggableWrapper.get('.vs-dnd__dropzone--primary');
      await primaryDropZone.trigger('pointerenter');
      await primaryDropZone.trigger('pointerup');
      await nextTick();
      expect(draggableWrapper.get('.vs-dnd__status').text()).toContain('copy:primary:');

      let disabledStory = DndDraggableDisabled.render?.({}) as ReturnType<Exclude<typeof DndDraggableDisabled.render, undefined>>;
      let disabledWrapper = mount(disabledStory);
      wrappers.push(disabledWrapper);
      expect(disabledWrapper.get('.vs-dnd__listbox').attributes('aria-disabled')).toBe('true');

      let toggleStory = DndDraggableEnabledDisabledControl.render?.({}) as ReturnType<Exclude<typeof DndDraggableEnabledDisabledControl.render, undefined>>;
      let toggleWrapper = mount(toggleStory);
      wrappers.push(toggleWrapper);
      await toggleWrapper.get('input[type="checkbox"]').setValue(false);
      await nextTick();
      expect(toggleWrapper.get('.vs-dnd__listbox').attributes('aria-disabled')).toBe('true');

      let multipleTargetsStory = DndMultipleCollectionDropTargets.render?.({}) as ReturnType<Exclude<typeof DndMultipleCollectionDropTargets.render, undefined>>;
      let multipleTargetsWrapper = mount(multipleTargetsStory);
      wrappers.push(multipleTargetsWrapper);
      expect(multipleTargetsWrapper.findAll('.vs-dnd__dropzone[data-accepts]').map((dropZone) => dropZone.attributes('data-accepts'))).toEqual(['folder', 'item']);

      let nestedStory = DndNestedDropRegions.render?.({}) as ReturnType<Exclude<typeof DndNestedDropRegions.render, undefined>>;
      let nestedWrapper = mount(nestedStory);
      wrappers.push(nestedWrapper);
      expect(nestedWrapper.find('.vs-dnd__dropzone--nested-parent .vs-dnd__dropzone--nested-child').exists()).toBe(true);

      let dialogStory = DndInDialog.render?.({}) as ReturnType<Exclude<typeof DndInDialog.render, undefined>>;
      let dialogWrapper = mount(dialogStory);
      wrappers.push(dialogWrapper);
      expect(dialogWrapper.get('[role="dialog"]').text()).toContain('Dialog');
      expect(dialogWrapper.text()).not.toContain('Dialog shell');

      let previewOffsetStory = DndPreviewOffset.render?.({}) as ReturnType<Exclude<typeof DndPreviewOffset.render, undefined>>;
      let previewOffsetWrapper = mount(previewOffsetStory);
      wrappers.push(previewOffsetWrapper);
      await previewOffsetWrapper.get('button.vs-dnd__draggable').trigger('pointerdown');
      await nextTick();
      expect(previewOffsetWrapper.get('.vs-dnd__preview').attributes('style') ?? '').toContain('translate(32px, 16px)');

      let collectionPreviewOffsetStory = DndCollectionPreviewOffset.render?.({}) as ReturnType<Exclude<typeof DndCollectionPreviewOffset.render, undefined>>;
      let collectionPreviewOffsetWrapper = mount(collectionPreviewOffsetStory);
      wrappers.push(collectionPreviewOffsetWrapper);
      await collectionPreviewOffsetWrapper.get('button.vs-dnd__draggable').trigger('pointerdown');
      await nextTick();
      expect(collectionPreviewOffsetWrapper.get('.vs-dnd__preview').attributes('style') ?? '').toContain('translate(16px, 8px)');

      let reorderableStory = DndReorderable.render?.({}) as ReturnType<Exclude<typeof DndReorderable.render, undefined>>;
      let reorderableWrapper = mount(reorderableStory);
      wrappers.push(reorderableWrapper);
      expect(reorderableWrapper.findAll('.vs-dnd__option')[0].text()).toBe('Item 1');
      await reorderableWrapper.get('button.vs-dnd__draggable').trigger('pointerdown');
      let reorderDropZone = reorderableWrapper.get('.vs-dnd__dropzone--primary');
      await reorderDropZone.trigger('pointerenter');
      await reorderDropZone.trigger('pointerup');
      await nextTick();
      expect(reorderableWrapper.get('.vs-dnd__status').text()).toContain('move:primary:');
      expect(reorderableWrapper.findAll('.vs-dnd__option')[0].text()).toBe('Item 2');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders list/table dnd stories with drop target shell parity contracts', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];
    let stories = [
      ListViewDnDDragOut,
      ListViewDnDUtilDragOut,
      TableDnDDragOutOfTable,
      TableDnDUtilDragOutOfTable
    ];

    try {
      for (let story of stories) {
        let renderedStory = story.render?.({}) as ReturnType<Exclude<typeof story.render, undefined>>;
        let wrapper = mount(renderedStory);
        wrappers.push(wrapper);
        let dropTarget = wrapper.get('[data-testid="drop-target"]');
        expect(dropTarget.attributes('role')).toBe('region');
        expect(dropTarget.attributes('aria-label')).toBe('Drop target');
        expect(dropTarget.text()).toBe('Drop target');
        expect(wrapper.text()).not.toContain('Droppable placeholder');
      }
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders list action stories with live action controls instead of note banners', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let actionButtonStory = ListViewActionsActionButtons.render?.({}) as ReturnType<Exclude<typeof ListViewActionsActionButtons.render, undefined>>;
      let actionButtonWrapper = mount(actionButtonStory);
      wrappers.push(actionButtonWrapper);
      expect(actionButtonWrapper.get('button[aria-label="Copy"]').exists()).toBe(true);
      expect(actionButtonWrapper.get('.vs-list-view').exists()).toBe(true);
      expect(actionButtonWrapper.text()).not.toContain('ActionButton parity scenario');

      let actionGroupStory = ListViewActionsActionGroups.render?.({}) as ReturnType<Exclude<typeof ListViewActionsActionGroups.render, undefined>>;
      let actionGroupWrapper = mount(actionGroupStory);
      wrappers.push(actionGroupWrapper);
      expect(actionGroupWrapper.find('.spectrum-ActionGroup, .vs-action-group').exists()).toBe(true);
      expect(actionGroupWrapper.get('.vs-list-view').exists()).toBe(true);

      let actionMenuStory = ListViewActionsActionMenus.render?.({}) as ReturnType<Exclude<typeof ListViewActionsActionMenus.render, undefined>>;
      let actionMenuWrapper = mount(actionMenuStory);
      wrappers.push(actionMenuWrapper);
      await openMenuTriggerInStory(actionMenuWrapper);
      expect(actionMenuWrapper.find('.vs-spectrum-menu').exists()).toBe(true);
      expect(actionMenuWrapper.get('.vs-list-view').exists()).toBe(true);

      let actionMenuGroupStory = ListViewActionsActionMenusGroup.render?.({}) as ReturnType<Exclude<typeof ListViewActionsActionMenusGroup.render, undefined>>;
      let actionMenuGroupWrapper = mount(actionMenuGroupStory);
      wrappers.push(actionMenuGroupWrapper);
      await openMenuTriggerInStory(actionMenuGroupWrapper);
      expect(actionMenuGroupWrapper.find('.spectrum-ActionGroup, .vs-action-group').exists()).toBe(true);
      expect(actionMenuGroupWrapper.find('.vs-spectrum-menu').exists()).toBe(true);
      expect(actionMenuGroupWrapper.get('.vs-list-view').exists()).toBe(true);
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders list view stories with iterable selection and action-bar clear contracts', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let defaultStory = ListViewDefaultStory.render?.({}) as ReturnType<Exclude<typeof ListViewDefaultStory.render, undefined>>;
      let defaultWrapper = mount(defaultStory);
      wrappers.push(defaultWrapper);

      let defaultListView = defaultWrapper.getComponent({name: 'VueListView'});
      let defaultSelectionHandler = (defaultListView.vm.$.vnode.props as {'onUpdate:modelValue'?: (value: unknown) => void} | undefined)?.['onUpdate:modelValue'];
      expect(defaultSelectionHandler).toBeTypeOf('function');
      defaultSelectionHandler?.(new Set(['a', 'b']));
      await nextTick();
      let defaultSelectedItems = defaultWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text());
      expect(defaultSelectedItems).toEqual(expect.arrayContaining(['Adobe Photoshop', 'Adobe XD']));

      let actionBarStory = ListViewWithActionBarStory.render?.({}) as ReturnType<Exclude<typeof ListViewWithActionBarStory.render, undefined>>;
      let actionBarWrapper = mount(actionBarStory);
      wrappers.push(actionBarWrapper);
      expect(actionBarWrapper.get('.vs-action-bar__count').text()).toContain('1 selected');

      let actionBarListView = actionBarWrapper.getComponent({name: 'VueListView'});
      let actionBarSelectionHandler = (actionBarListView.vm.$.vnode.props as {'onUpdate:modelValue'?: (value: unknown) => void} | undefined)?.['onUpdate:modelValue'];
      expect(actionBarSelectionHandler).toBeTypeOf('function');
      actionBarSelectionHandler?.(new Set(['a', 'b']));
      await nextTick();
      expect(actionBarWrapper.get('.vs-action-bar__count').text()).toContain('2 selected');

      await actionBarWrapper.get('button.vs-action-bar__clear').trigger('click');
      await nextTick();
      expect(actionBarWrapper.findAll('button.vs-listbox__item.is-selected')).toHaveLength(0);
      expect(actionBarWrapper.find('.vs-action-bar').exists()).toBe(false);
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders list selection stories with iterable selection and navigation contracts', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let selectionDefaultStory = ListViewSelectionDefault.render?.({}) as ReturnType<Exclude<typeof ListViewSelectionDefault.render, undefined>>;
      let selectionDefaultWrapper = mount(selectionDefaultStory);
      wrappers.push(selectionDefaultWrapper);

      let selectionDefaultListView = selectionDefaultWrapper.getComponent({name: 'VueListView'});
      let selectionDefaultHandler = (selectionDefaultListView.vm.$.vnode.props as {onSelectionChange?: (value: unknown) => void} | undefined)?.onSelectionChange;
      expect(selectionDefaultHandler).toBeTypeOf('function');
      selectionDefaultHandler?.(new Set(['a', 'b']));
      await nextTick();
      let defaultSelectedItems = selectionDefaultWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text());
      expect(defaultSelectedItems).toEqual(expect.arrayContaining(['Adobe Photoshop', 'Adobe XD']));

      let selectionOnActionStory = ListViewSelectionOnAction.render?.({}) as ReturnType<Exclude<typeof ListViewSelectionOnAction.render, undefined>>;
      let selectionOnActionWrapper = mount(selectionOnActionStory);
      wrappers.push(selectionOnActionWrapper);

      let selectionOnActionListView = selectionOnActionWrapper.getComponent({name: 'VueListView'});
      let selectionOnActionHandler = (selectionOnActionListView.vm.$.vnode.props as {onSelectionChange?: (value: unknown) => void} | undefined)?.onSelectionChange;
      expect(selectionOnActionHandler).toBeTypeOf('function');
      selectionOnActionHandler?.(new Set(['a']));
      await nextTick();
      expect(selectionOnActionWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text())).toEqual(['Adobe Photoshop']);

      let documentsButton = selectionOnActionWrapper.findAll('button.vs-listbox__item').find((button) => button.text() === 'Documents');
      expect(documentsButton).toBeDefined();
      await documentsButton?.trigger('click');
      await nextTick();
      expect(selectionOnActionWrapper.text()).toContain('Sales Pitch');
      expect(selectionOnActionWrapper.findAll('button[type="button"]').some((button) => button.text() === 'Documents')).toBe(true);

      let rootBreadcrumb = selectionOnActionWrapper.findAll('button[type="button"]').find((button) => button.text() === 'Root');
      expect(rootBreadcrumb).toBeDefined();
      await rootBreadcrumb?.trigger('click');
      await nextTick();
      expect(selectionOnActionWrapper.text()).toContain('Adobe Photoshop');
      expect(selectionOnActionWrapper.findAll('button.vs-listbox__item.is-selected')).toHaveLength(0);
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders listbox stories with disabled keys, links, avatars, and tree-data parity', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let withDisabledStory = SpectrumListBoxWithDisabledOptions.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxWithDisabledOptions.render, undefined>>;
      let withDisabledWrapper = mount(withDisabledStory);
      wrappers.push(withDisabledWrapper);
      let withDisabledItems = withDisabledWrapper.findAll('button.vs-listbox__item[disabled]').map((item) => item.text());
      expect(withDisabledItems).toEqual(expect.arrayContaining(['Kangaroo', 'Ross']));
      expect(withDisabledWrapper.text()).not.toContain('disabled in React');

      let withDisabledSetStory = SpectrumListBoxWithDisabledOptions.render?.({disabledKeys: new Set(['Kangaroo'])}) as ReturnType<Exclude<typeof SpectrumListBoxWithDisabledOptions.render, undefined>>;
      let withDisabledSetWrapper = mount(withDisabledSetStory);
      wrappers.push(withDisabledSetWrapper);
      let withDisabledSetItems = withDisabledSetWrapper.findAll('button.vs-listbox__item[disabled]').map((item) => item.text());
      expect(withDisabledSetItems).toEqual(['Kangaroo']);

      let linksStory = SpectrumListBoxLinks.render?.({selectionMode: 'none'}) as ReturnType<Exclude<typeof SpectrumListBoxLinks.render, undefined>>;
      let linksWrapper = mount(linksStory);
      wrappers.push(linksWrapper);
      let links = linksWrapper.findAll('a.vs-listbox__item').map((link) => ({
        href: link.attributes('href'),
        text: link.text()
      }));
      expect(links).toEqual(expect.arrayContaining([
        {href: 'https://adobe.com/', text: 'Adobe'},
        {href: 'https://google.com/', text: 'Google'},
        {href: 'https://apple.com/', text: 'Apple'},
        {href: 'https://nytimes.com/', text: 'New York Times'}
      ]));
      expect(linksWrapper.findAll('button.vs-listbox__item').map((button) => button.text())).toContain('Non link');
      expect(linksWrapper.text()).not.toContain('https://adobe.com');

      let withAvatarsStory = SpectrumListBoxWithAvatars.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxWithAvatars.render, undefined>>;
      let withAvatarsWrapper = mount(withAvatarsStory);
      wrappers.push(withAvatarsWrapper);
      expect(withAvatarsWrapper.findAll('.vs-listbox__item img')).toHaveLength(3);
      expect(withAvatarsWrapper.text()).toContain('Person 1');
      expect(withAvatarsWrapper.text()).toContain('Person 2');
      expect(withAvatarsWrapper.text()).toContain('Person 3');
      expect(withAvatarsWrapper.text()).not.toContain('(avatar)');

      let withTreeDataStory = SpectrumListBoxWithTreeData.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxWithTreeData.render, undefined>>;
      let withTreeDataWrapper = mount(withTreeDataStory);
      wrappers.push(withTreeDataWrapper);
      expect(withTreeDataWrapper.findAll('.vs-listbox__section')).toHaveLength(2);
      expect(withTreeDataWrapper.findAll('.vs-listbox__section-heading').map((item) => item.text())).toEqual(['People', 'Animals']);
      let withTreeDataSelected = withTreeDataWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text());
      expect(withTreeDataSelected).toEqual(expect.arrayContaining(['Sam', 'Kangaroo']));
      let davidOption = withTreeDataWrapper.findAll('button.vs-listbox__item').find((item) => item.text() === 'David');
      expect(davidOption).toBeDefined();
      await davidOption?.trigger('click');
      await nextTick();
      let nextWithTreeDataSelected = withTreeDataWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text());
      expect(nextWithTreeDataSelected).toEqual(expect.arrayContaining(['Sam', 'Kangaroo', 'David']));

      let semanticMultipleStory = SpectrumListBoxWithSemanticElementsGenerativeMultipleSelection.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxWithSemanticElementsGenerativeMultipleSelection.render, undefined>>;
      let semanticMultipleWrapper = mount(semanticMultipleStory);
      wrappers.push(semanticMultipleWrapper);
      let semanticMultipleSelected = semanticMultipleWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text());
      expect(semanticMultipleSelected).toEqual(expect.arrayContaining(['Article', 'Paragraph']));

      let sectionsStory = SpectrumListBoxSections.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxSections.render, undefined>>;
      let sectionsWrapper = mount(sectionsStory);
      wrappers.push(sectionsWrapper);
      expect(sectionsWrapper.findAll('.vs-listbox__section-heading').map((item) => item.text())).toEqual(['Animals', 'People']);
      expect(sectionsWrapper.findAll('button.vs-listbox__item').map((item) => item.text())).toEqual(expect.arrayContaining(['Aardvark', 'Ross']));

      let sectionsFalsyIdsStory = SpectrumListBoxSectionsAndFalsyIds.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxSectionsAndFalsyIds.render, undefined>>;
      let sectionsFalsyIdsWrapper = mount(sectionsFalsyIdsStory);
      wrappers.push(sectionsFalsyIdsWrapper);
      expect(sectionsFalsyIdsWrapper.findAll('.vs-listbox__section-heading').map((item) => item.text())).toEqual(['key=0', 'key=""']);
      expect(sectionsFalsyIdsWrapper.findAll('button.vs-listbox__item')).toHaveLength(6);

      let sectionsNoTitleStory = SpectrumListBoxSectionsAndNoTitle.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxSectionsAndNoTitle.render, undefined>>;
      let sectionsNoTitleWrapper = mount(sectionsNoTitleStory);
      wrappers.push(sectionsNoTitleWrapper);
      expect(sectionsNoTitleWrapper.findAll('.vs-listbox__section-heading')).toHaveLength(0);
      expect(sectionsNoTitleWrapper.findAll('.vs-listbox__section').map((section) => section.attributes('aria-label'))).toEqual(['Animals', 'People']);

      let manySectionsStory = SpectrumListBoxManySectionsAndSelection.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxManySectionsAndSelection.render, undefined>>;
      let manySectionsWrapper = mount(manySectionsStory);
      wrappers.push(manySectionsWrapper);
      expect(manySectionsWrapper.findAll('.vs-listbox__section')).toHaveLength(50);
      expect(manySectionsWrapper.findAll('.vs-listbox__item')).toHaveLength(2500);
      expect(manySectionsWrapper.findAll('.vs-listbox__section-heading').at(0)?.text()).toBe('Section 0');
      expect(manySectionsWrapper.findAll('button.vs-listbox__item.is-selected')).toHaveLength(0);

      let withDefaultSelectedStory = SpectrumListBoxWithDefaultSelectedOption.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxWithDefaultSelectedOption.render, undefined>>;
      let withDefaultSelectedWrapper = mount(withDefaultSelectedStory);
      wrappers.push(withDefaultSelectedWrapper);
      expect(withDefaultSelectedWrapper.findAll('.vs-listbox__section-heading').map((item) => item.text())).toEqual(['Animals', 'People']);
      expect(withDefaultSelectedWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text())).toEqual(['Kangaroo']);

      let singleSelectionDefaultStory = SpectrumListBoxSingleSelectionWithDefaultSelectedOption.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxSingleSelectionWithDefaultSelectedOption.render, undefined>>;
      let singleSelectionDefaultWrapper = mount(singleSelectionDefaultStory);
      wrappers.push(singleSelectionDefaultWrapper);
      expect(singleSelectionDefaultWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text())).toEqual(['Kangaroo']);

      let staticDefaultSelectedStory = SpectrumListBoxStaticWithDefaultSelectedOptions.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxStaticWithDefaultSelectedOptions.render, undefined>>;
      let staticDefaultSelectedWrapper = mount(staticDefaultSelectedStory);
      wrappers.push(staticDefaultSelectedWrapper);
      expect(staticDefaultSelectedWrapper.findAll('.vs-listbox__section-heading').map((item) => item.text())).toEqual(['Section 1', 'Section 2']);
      expect(staticDefaultSelectedWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text())).toEqual(expect.arrayContaining(['Two', 'Three']));

      let controlledSelectedStory = SpectrumListBoxWithSelectedOptionsControlled.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxWithSelectedOptionsControlled.render, undefined>>;
      let controlledSelectedWrapper = mount(controlledSelectedStory);
      wrappers.push(controlledSelectedWrapper);
      expect(controlledSelectedWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text())).toEqual(['Kangaroo']);

      let staticControlledSelectedStory = SpectrumListBoxStaticWithSelectedOptionsControlled.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxStaticWithSelectedOptionsControlled.render, undefined>>;
      let staticControlledSelectedWrapper = mount(staticControlledSelectedStory);
      wrappers.push(staticControlledSelectedWrapper);
      expect(staticControlledSelectedWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text())).toEqual(['Two']);

      let staticDisabledStory = SpectrumListBoxStaticWithDisabledOptions.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxStaticWithDisabledOptions.render, undefined>>;
      let staticDisabledWrapper = mount(staticDisabledStory);
      wrappers.push(staticDisabledWrapper);
      let staticDisabledItems = staticDisabledWrapper.findAll('button.vs-listbox__item[disabled]').map((item) => item.text());
      expect(staticDisabledItems).toEqual(expect.arrayContaining(['Three', 'Five']));

      let multipleStory = SpectrumListBoxMultipleSelection.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxMultipleSelection.render, undefined>>;
      let multipleWrapper = mount(multipleStory);
      wrappers.push(multipleWrapper);
      let multipleSelectedItems = multipleWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text());
      let multipleDisabledItems = multipleWrapper.findAll('button.vs-listbox__item.is-disabled').map((item) => item.text());
      expect(multipleSelectedItems).toEqual(expect.arrayContaining(['Aardvark', 'Snake']));
      expect(multipleDisabledItems).toEqual(expect.arrayContaining(['Kangaroo', 'Ross']));

      let multipleStaticStory = SpectrumListBoxMultipleSelectionStatic.render?.({}) as ReturnType<Exclude<typeof SpectrumListBoxMultipleSelectionStatic.render, undefined>>;
      let multipleStaticWrapper = mount(multipleStaticStory);
      wrappers.push(multipleStaticWrapper);
      let multipleStaticSelectedItems = multipleStaticWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text());
      let multipleStaticDisabledItems = multipleStaticWrapper.findAll('button.vs-listbox__item.is-disabled').map((item) => item.text());
      expect(multipleStaticWrapper.findAll('.vs-listbox__section-heading').map((item) => item.text())).toEqual(['Section 1', 'Section 2']);
      expect(multipleStaticSelectedItems).toEqual(expect.arrayContaining(['Two', 'Five']));
      expect(multipleStaticDisabledItems).toEqual(expect.arrayContaining(['One', 'Three']));

      let multipleSetModelValueStory = SpectrumListBoxMultipleSelection.render?.({modelValue: new Set(['Aardvark'])}) as ReturnType<Exclude<typeof SpectrumListBoxMultipleSelection.render, undefined>>;
      let multipleSetModelValueWrapper = mount(multipleSetModelValueStory);
      wrappers.push(multipleSetModelValueWrapper);
      let multipleSetModelValueSelectedItems = multipleSetModelValueWrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text());
      expect(multipleSetModelValueSelectedItems).toEqual(['Aardvark']);
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders tag group story with iterable modelValue selection overrides', () => {
    let setModelValueStory = SpectrumTagGroupDefault.render?.({
      label: 'Tag group',
      selectionMode: 'multiple',
      modelValue: new Set(['1'])
    }) as ReturnType<Exclude<typeof SpectrumTagGroupDefault.render, undefined>>;
    let wrapper = mount(setModelValueStory);

    try {
      let tags = wrapper.findAll('.vs-tag-group__tag');
      expect(tags).toHaveLength(6);
      expect(tags[0].classes()).toContain('is-selected');
      expect(tags[1].classes()).not.toContain('is-selected');
    } finally {
      wrapper.unmount();
    }
  });

  it('renders card view disabled keys story with disabled-card contracts', async () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let cardArgs = (GridCardViewDisabledKeys as {args?: Record<string, unknown>}).args ?? {};
      let cardStory = GridCardViewDisabledKeys.render?.({...cardArgs}) as ReturnType<Exclude<typeof GridCardViewDisabledKeys.render, undefined>>;
      let cardWrapper = mount(cardStory);
      wrappers.push(cardWrapper);
      let disabledCards = cardWrapper.findAll('.vs-card-view__item[aria-disabled="true"]').map((card) => card.attributes('aria-label'));
      expect(disabledCards).toEqual(expect.arrayContaining(['Joe 2', 'Bob 4']));
      expect(cardWrapper.text()).not.toContain('disabled in React');

      let selectedSetStory = GridCardViewDisabledKeys.render?.({
        ...cardArgs,
        disabledKeys: [],
        selectionMode: 'multiple',
        modelValue: new Set(['Bob 1'])
      }) as ReturnType<Exclude<typeof GridCardViewDisabledKeys.render, undefined>>;
      let selectedSetWrapper = mount(selectedSetStory);
      wrappers.push(selectedSetWrapper);
      let selectedCards = selectedSetWrapper.findAll('.vs-card-view__item.is-selected').map((card) => card.attributes('aria-label'));
      expect(selectedCards).toEqual(['Bob 1']);

      let numericSelectedStory = GridCardViewFalsyIds.render?.({modelValue: 0}) as ReturnType<Exclude<typeof GridCardViewFalsyIds.render, undefined>>;
      let numericSelectedWrapper = mount(numericSelectedStory);
      wrappers.push(numericSelectedWrapper);
      let numericSelectedCards = numericSelectedWrapper.findAll('.vs-card-view__item.is-selected').map((card) => card.attributes('aria-label'));
      expect(numericSelectedCards).toEqual(['Bob 1']);

      let controlledArgs = (GridCardViewControlledCards as {args?: Record<string, unknown>}).args ?? {};
      let controlledStory = GridCardViewControlledCards.render?.({
        ...controlledArgs,
        selectionMode: 'multiple'
      }) as ReturnType<Exclude<typeof GridCardViewControlledCards.render, undefined>>;
      let controlledWrapper = mount(controlledStory);
      wrappers.push(controlledWrapper);
      let controlledCardView = controlledWrapper.getComponent({name: 'VueCardView'});
      let onSelectionChange = (controlledCardView.vm.$.vnode.props as {onSelectionChange?: (keys: unknown) => void} | undefined)?.onSelectionChange;
      expect(onSelectionChange).toBeTypeOf('function');
      onSelectionChange?.(new Set(['Bob 1']));
      await nextTick();
      let controlledSelectedKeys = controlledWrapper.getComponent({name: 'VueCardView'}).props('selectedKeys') as unknown;
      expect(controlledSelectedKeys).toBeInstanceOf(Set);
      expect(Array.from(controlledSelectedKeys as Set<string>)).toEqual(['Bob 1']);
      let controlledSelectedCards = controlledWrapper.findAll('.vs-card-view__item.is-selected').map((card) => card.attributes('aria-label'));
      expect(controlledSelectedCards).toEqual(['Bob 1']);
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders table stories with live divider, loading, link, and focus contracts', () => {
    let wrappers: Array<ReturnType<typeof mount>> = [];

    try {
      let disabledArgs = (TableDynamicWithDisabledKeys as {args?: Record<string, unknown>}).args ?? {};
      let disabledStory = TableDynamicWithDisabledKeys.render?.({...disabledArgs}) as ReturnType<Exclude<typeof TableDynamicWithDisabledKeys.render, undefined>>;
      let disabledWrapper = mount(disabledStory);
      wrappers.push(disabledWrapper);
      let disabledRows = disabledWrapper.findAll('tr.vs-table__row.is-disabled');
      expect(disabledRows).toHaveLength(2);
      expect(disabledRows.map((row) => row.find('.vs-table__cell-text').text())).toEqual(expect.arrayContaining(['Adobe XD', 'Quarterly Plan']));
      expect(disabledWrapper.emitted('update:modelValue')).toBeUndefined();

      let openSetStory = TableDynamicWithDisabledKeys.render?.({
        ...disabledArgs,
        rows: [
          {id: 1, name: 'Parent row', type: 'Folder', date: '2025-10-12', children: [{id: '1-1', name: 'Child row', type: 'Doc', date: '2025-10-13'}]},
          {id: 2, name: 'Sibling row', type: 'Document', date: '2025-10-14'}
        ],
        openKeys: new Set([1]),
        disabledKeys: []
      }) as ReturnType<Exclude<typeof TableDynamicWithDisabledKeys.render, undefined>>;
      let openSetWrapper = mount(openSetStory);
      wrappers.push(openSetWrapper);
      let openRows = openSetWrapper.findAll('tr.vs-table__row.is-open');
      expect(openRows).toHaveLength(1);
      expect(openRows[0].find('.vs-table__cell-text').text()).toBe('Parent row');
      expect(openRows[0].get('.vs-table__open-toggle').classes()).toContain('is-open');

      let selectedKeysArgs = (TableDynamicSelectedKeys as {args?: Record<string, unknown>}).args ?? {};
      expect(selectedKeysArgs.modelValue).toBeInstanceOf(Set);
      expect(Array.from(selectedKeysArgs.modelValue as Set<number>)).toEqual([1, 3]);
      let selectedSetStory = TableDynamicSelectedKeys.render?.({
        ...selectedKeysArgs,
        modelValue: new Set([1, 3])
      }) as ReturnType<Exclude<typeof TableDynamicSelectedKeys.render, undefined>>;
      let selectedSetWrapper = mount(selectedSetStory);
      wrappers.push(selectedSetWrapper);
      let selectedRows = selectedSetWrapper.findAll('tr.vs-table__row.is-selected');
      expect(selectedRows).toHaveLength(2);
      expect(selectedRows.map((row) => row.find('.vs-table__cell-text').text())).toEqual(expect.arrayContaining(['Adobe XD', 'Quarterly Plan']));

      let dividerArgs = (TableDynamicShowDividers as {args?: Record<string, unknown>}).args ?? {};
      let dividerStory = TableDynamicShowDividers.render?.({...dividerArgs}) as ReturnType<Exclude<typeof TableDynamicShowDividers.render, undefined>>;
      let dividerWrapper = mount(dividerStory);
      wrappers.push(dividerWrapper);
      expect(dividerWrapper.findAll('.spectrum-Table-cell--divider').length).toBeGreaterThan(0);
      expect(dividerWrapper.text()).not.toContain('Divider visibility');

      let widthArgs = (TableColumnWidthsAndDividers as {args?: Record<string, unknown>}).args ?? {};
      let widthStory = TableColumnWidthsAndDividers.render?.({...widthArgs}) as ReturnType<Exclude<typeof TableColumnWidthsAndDividers.render, undefined>>;
      let widthWrapper = mount(widthStory);
      wrappers.push(widthWrapper);
      expect(widthWrapper.find('th.vs-table__head-cell').attributes('style') ?? '').toContain('width');

      let focusArgs = (TableFocusableCells as {args?: Record<string, unknown>}).args ?? {};
      let focusStory = TableFocusableCells.render?.({...focusArgs}) as ReturnType<Exclude<typeof TableFocusableCells.render, undefined>>;
      let focusWrapper = mount(focusStory);
      wrappers.push(focusWrapper);
      expect(focusWrapper.find('#focus-before').exists()).toBe(true);
      expect(focusWrapper.find('#focus-after').exists()).toBe(true);

      let loadingArgs = (TableIsLoading as {args?: Record<string, unknown>}).args ?? {};
      let loadingStory = TableIsLoading.render?.({...loadingArgs}) as ReturnType<Exclude<typeof TableIsLoading.render, undefined>>;
      let loadingWrapper = mount(loadingStory);
      wrappers.push(loadingWrapper);
      expect(loadingWrapper.get('.vs-table').attributes('data-loading-state')).toBe('loading');
      expect(loadingWrapper.text()).toContain('Loading…');

      let loadingMoreArgs = (TableIsLoadingMore as {args?: Record<string, unknown>}).args ?? {};
      let loadingMoreStory = TableIsLoadingMore.render?.({...loadingMoreArgs}) as ReturnType<Exclude<typeof TableIsLoadingMore.render, undefined>>;
      let loadingMoreWrapper = mount(loadingMoreStory);
      wrappers.push(loadingMoreWrapper);
      expect(loadingMoreWrapper.get('.vs-table').attributes('data-loading-state')).toBe('loadingMore');
      expect(loadingMoreWrapper.text()).toContain('Loading more…');

      let linksArgs = (TableLinks as {args?: Record<string, unknown>}).args ?? {};
      let linksStory = TableLinks.render?.({...linksArgs}) as ReturnType<Exclude<typeof TableLinks.render, undefined>>;
      let linksWrapper = mount(linksStory);
      wrappers.push(linksWrapper);
      let link = linksWrapper.get('a.vs-table__cell-link');
      expect(link.attributes('href')).toBe('https://react-spectrum.adobe.com');
      expect(link.attributes('target')).toBe('_blank');
    } finally {
      for (let wrapper of wrappers) {
        wrapper.unmount();
      }
    }
  });

  it('renders tree grid table story with iterable openKeys overrides', () => {
    let treeGridArgs = (TreeGridStaticExpandableRows as {args?: Record<string, unknown>}).args ?? {};
    let treeGridStory = TreeGridStaticExpandableRows.render?.({
      ...treeGridArgs,
      openKeys: new Set(['row-1'])
    }) as ReturnType<Exclude<typeof TreeGridStaticExpandableRows.render, undefined>>;
    let wrapper = mount(treeGridStory);

    try {
      let openRows = wrapper.findAll('tr.vs-table__row.is-open');
      expect(openRows).toHaveLength(1);
      expect(openRows[0].find('.vs-table__cell-text').text()).toBe('Lvl 1 Foo 1');
      expect(openRows[0].get('.vs-table__open-toggle').classes()).toContain('is-open');
    } finally {
      wrapper.unmount();
    }
  });

  it('renders tree grid dynamic story with set-backed open-key state transitions', async () => {
    let treeGridArgs = (TreeGridDynamicExpandableRows as {args?: Record<string, unknown>}).args ?? {};
    let treeGridStory = TreeGridDynamicExpandableRows.render?.({...treeGridArgs}) as ReturnType<Exclude<typeof TreeGridDynamicExpandableRows.render, undefined>>;
    let wrapper = mount(treeGridStory);

    try {
      let treeGridTable = wrapper.getComponent({name: 'VueTable'});
      let initialOpenKeys = treeGridTable.props('openKeys') as Set<string | number>;
      expect(initialOpenKeys).toBeInstanceOf(Set);
      expect(Array.from(initialOpenKeys)).toEqual(['row-1']);

      let controls = wrapper.findAll('button');
      let expandAllButton = controls.find((button) => button.text() === 'Expand all');
      let collapseAllButton = controls.find((button) => button.text() === 'Collapse all');
      let loadRowsButton = controls.find((button) => button.text() === 'Load rows');
      expect(expandAllButton).toBeDefined();
      expect(collapseAllButton).toBeDefined();
      expect(loadRowsButton).toBeDefined();

      await collapseAllButton?.trigger('click');
      await nextTick();
      let collapsedOpenKeys = treeGridTable.props('openKeys') as Set<string | number>;
      expect(collapsedOpenKeys).toBeInstanceOf(Set);
      expect(Array.from(collapsedOpenKeys)).toEqual([]);

      await expandAllButton?.trigger('click');
      await nextTick();
      let expandedOpenKeys = treeGridTable.props('openKeys') as Set<string | number>;
      expect(expandedOpenKeys).toBeInstanceOf(Set);
      expect(Array.from(expandedOpenKeys)).toEqual(['row-1']);

      await loadRowsButton?.trigger('click');
      await nextTick();
      let reloadedOpenKeys = treeGridTable.props('openKeys') as Set<string | number>;
      expect(reloadedOpenKeys).toBeInstanceOf(Set);
      expect(Array.from(reloadedOpenKeys)).toEqual(['row-1']);
    } finally {
      wrapper.unmount();
    }
  });

  it('keeps dialog trigger mobileType stories wired to mobileType args', () => {
    expect((DialogTriggerMobileTypeFullscreen as {args?: Record<string, unknown>}).args).toMatchObject({
      mobileType: 'fullscreen',
      type: 'modal'
    });
    expect((DialogTriggerMobileTypeFullscreenTakeover as {args?: Record<string, unknown>}).args).toMatchObject({
      mobileType: 'fullscreenTakeover',
      type: 'modal'
    });
    expect((DialogTriggerPopoverWithMobileTypeModal as {args?: Record<string, unknown>}).args).toMatchObject({
      mobileType: 'modal',
      type: 'popover'
    });
    expect((DialogTriggerPopoverWithMobileTypeTray as {args?: Record<string, unknown>}).args).toMatchObject({
      mobileType: 'tray',
      type: 'popover'
    });
  });

  it('keeps dialog trigger story labels free of scaffold scenario wording', () => {
    let shouldFlipStory = DialogTriggerShouldFlipWithWidth.render?.({}) as ReturnType<Exclude<typeof DialogTriggerShouldFlipWithWidth.render, undefined>>;
    expect(shouldFlipStory.template).toContain('Popover width constrained');
    expect(shouldFlipStory.template).not.toContain('scenario');

    let underlayStory = DialogTriggerTriggerVisibleThroughUnderlay.render?.({}) as ReturnType<Exclude<typeof DialogTriggerTriggerVisibleThroughUnderlay.render, undefined>>;
    expect(underlayStory.template).toContain('Underlay visibility');
    expect(underlayStory.template).not.toContain('scenario');

    let edgeStory = DialogTriggerTriggersOnEdges.render?.({}) as ReturnType<Exclude<typeof DialogTriggerTriggersOnEdges.render, undefined>>;
    expect(edgeStory.template).toContain('title="Placement"');
    expect(edgeStory.template).not.toContain('scenario');
  });

  it('renders dialog trigger alert/menu stories with live trigger and open-state contracts', async () => {
    let menuWrapper: ReturnType<typeof mount> | null = null;
    let alertWrapper: ReturnType<typeof mount> | null = null;

    try {
      let menuStory = DialogTriggerWithMenuTrigger.render?.({}) as ReturnType<Exclude<typeof DialogTriggerWithMenuTrigger.render, undefined>>;
      menuWrapper = mount(menuStory);
      expect(menuWrapper.find('section.vs-dialog').exists() || document.body.querySelector('section.vs-dialog') !== null).toBe(false);
      await menuWrapper.get('button').trigger('click');
      await nextTick();
      expect(menuWrapper.find('section.vs-dialog').exists() || document.body.querySelector('section.vs-dialog') !== null).toBe(true);
      expect(menuWrapper.find('.vs-spectrum-menu').exists() || document.body.querySelector('.vs-spectrum-menu') !== null).toBe(true);

      let alertStory = DialogTriggerAlertDialog.render?.({}) as ReturnType<Exclude<typeof DialogTriggerAlertDialog.render, undefined>>;
      alertWrapper = mount(alertStory);
      expect(alertWrapper.find('section[role="alertdialog"]').exists()).toBe(false);
      await alertWrapper.get('button').trigger('click');
      await nextTick();
      expect(alertWrapper.find('section[role="alertdialog"]').exists()).toBe(true);
      expect(alertWrapper.text()).toContain('Accept');
      expect(alertWrapper.text()).toContain('Whoa');
      expect(alertWrapper.text()).toContain('Cancel');
    } finally {
      menuWrapper?.unmount();
      alertWrapper?.unmount();
    }
  });

  it('dismisses modal dialog trigger stories from Escape and underlay interactions', async () => {
    let dismissableStory = DialogTriggerTypeModalIsDismissable.render?.({
      isDismissable: true,
      type: 'modal'
    }) as ReturnType<Exclude<typeof DialogTriggerTypeModalIsDismissable.render, undefined>>;
    let wrapper = mount(dismissableStory);

    try {
      let triggerButton = wrapper.get('button');
      expect(wrapper.find('section.vs-dialog').exists() || document.body.querySelector('section.vs-dialog') !== null).toBe(false);

      await triggerButton.trigger('click');
      await nextTick();
      expect(wrapper.find('section.vs-dialog').exists() || document.body.querySelector('section.vs-dialog') !== null).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Escape'}));
      await nextTick();
      expect(wrapper.find('section.vs-dialog').exists() || document.body.querySelector('section.vs-dialog') !== null).toBe(false);

      await triggerButton.trigger('click');
      await nextTick();
      expect(wrapper.find('section.vs-dialog').exists() || document.body.querySelector('section.vs-dialog') !== null).toBe(true);

      let underlay = document.body.querySelector('[data-testid="underlay"]');
      expect(underlay).not.toBeNull();
      underlay?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await nextTick();
      expect(wrapper.find('section.vs-dialog').exists() || document.body.querySelector('section.vs-dialog') !== null).toBe(false);
    } finally {
      wrapper.unmount();
    }
  });

  it('renders breadcrumbs stories with current-item and aria semantics parity', () => {
    let breadcrumbsStory = BreadcrumbsExample.render?.({}) as ReturnType<Exclude<typeof BreadcrumbsExample.render, undefined>>;
    let breadcrumbsWrapper = mount(breadcrumbsStory);
    let root = breadcrumbsWrapper.get('ol.react-aria-Breadcrumbs');
    expect(root.attributes('aria-label')).toBe('Breadcrumbs');
    expect(root.attributes('data-rac')).toBeUndefined();

    let breadcrumbs = breadcrumbsWrapper.findAll('li.react-aria-Breadcrumb');
    expect(breadcrumbs).toHaveLength(3);
    expect(breadcrumbs[2].attributes('data-current')).toBe('true');
    expect(breadcrumbs[2].attributes('data-disabled')).toBe('true');

    let currentItem = breadcrumbs[2].get('.react-aria-Link');
    expect(currentItem.element.tagName.toLowerCase()).toBe('span');
    expect(currentItem.attributes('aria-current')).toBe('page');
    expect(currentItem.attributes('aria-disabled')).toBe('true');
    expect(currentItem.attributes('data-current')).toBe('true');
    expect(currentItem.attributes('data-disabled')).toBe('true');

    let dynamicStory = DynamicBreadcrumbsExample.render?.({}) as ReturnType<Exclude<typeof DynamicBreadcrumbsExample.render, undefined>>;
    let dynamicWrapper = mount(dynamicStory);
    let dynamicBreadcrumbs = dynamicWrapper.findAll('li.react-aria-Breadcrumb');
    expect(dynamicBreadcrumbs).toHaveLength(3);
    expect(dynamicBreadcrumbs[2].get('.react-aria-Link').attributes('href')).toBe('/react-aria/breadcrumbs');
  });

  it('renders checkbox stories with selection and interaction state parity', async () => {
    let checkboxStory = CheckboxExample.render?.({}) as ReturnType<Exclude<typeof CheckboxExample.render, undefined>>;
    let checkboxWrapper = mount(checkboxStory);
    let checkboxRoot = checkboxWrapper.get('.react-aria-Checkbox');
    let checkboxInput = checkboxWrapper.get('input[type="checkbox"]');

    expect(checkboxRoot.attributes('data-selected')).toBeUndefined();
    expect(checkboxRoot.attributes('data-rac')).toBe('');
    expect(checkboxRoot.attributes('data-react-aria-pressable')).toBe('true');

    await checkboxInput.trigger('focus');
    await nextTick();
    expect(checkboxRoot.attributes('data-focused')).toBe('true');

    await checkboxRoot.trigger('mouseenter');
    await nextTick();
    expect(checkboxRoot.attributes('data-hovered')).toBe('true');

    await checkboxInput.setValue(true);
    await nextTick();
    expect(checkboxRoot.attributes('data-selected')).toBe('true');

    await checkboxInput.trigger('keydown', {key: ' '});
    await nextTick();
    expect(checkboxRoot.attributes('data-pressed')).toBe('true');
    expect(checkboxRoot.attributes('data-focus-visible')).toBe('true');

    await checkboxInput.trigger('keyup', {key: ' '});
    await nextTick();
    expect(checkboxRoot.attributes('data-pressed')).toBeUndefined();

    await checkboxRoot.trigger('mouseleave');
    await checkboxInput.trigger('blur');
    await checkboxInput.setValue(false);
    await nextTick();
    expect(checkboxRoot.attributes('data-hovered')).toBeUndefined();
    expect(checkboxRoot.attributes('data-focused')).toBeUndefined();
    expect(checkboxRoot.attributes('data-selected')).toBeUndefined();
  });

  it('renders checkbox group stories with required submit invalid-state parity', async () => {
    let checkboxGroupStory = CheckboxGroupExample.render?.({}) as ReturnType<Exclude<typeof CheckboxGroupExample.render, undefined>>;
    let checkboxGroupWrapper = mount(checkboxGroupStory);
    let group = checkboxGroupWrapper.get('.react-aria-CheckboxGroup');
    expect(group.attributes('role')).toBe('group');
    expect(group.attributes('data-rac')).toBe('');
    expect(checkboxGroupWrapper.findAll('.react-aria-Checkbox')).toHaveLength(3);

    let submitStory = CheckboxGroupSubmitExample.render?.({}) as ReturnType<Exclude<typeof CheckboxGroupSubmitExample.render, undefined>>;
    let submitWrapper = mount(submitStory);
    let submitGroup = submitWrapper.get('.react-aria-CheckboxGroup');
    expect(submitGroup.attributes('data-required')).toBe('true');
    expect(submitGroup.attributes('data-invalid')).toBeUndefined();

    await submitWrapper.get('form.react-aria-Form').trigger('submit');
    await nextTick();
    expect(submitGroup.attributes('data-invalid')).toBe('true');

    await submitWrapper.findAll('.react-aria-Checkbox input[type="checkbox"]')[0].setValue(true);
    await nextTick();
    expect(submitGroup.attributes('data-invalid')).toBeUndefined();

    await submitWrapper.get('form.react-aria-Form').trigger('reset');
    await nextTick();
    expect(submitGroup.attributes('data-invalid')).toBeUndefined();
    expect(submitWrapper.findAll('.react-aria-Checkbox')[0].attributes('data-selected')).toBeUndefined();
  });

  it('renders select stories with live open and selection behavior', async () => {
    let selectStory = SelectExample({selectionMode: 'single'});
    let selectWrapper = mount(selectStory);
    expect(selectWrapper.find('.menu').exists()).toBe(false);

    await selectWrapper.get('button.react-aria-Button').trigger('click');
    expect(selectWrapper.find('.menu').exists()).toBe(true);
    await selectWrapper.findAll('.item')[1].trigger('click');
    await nextTick();
    expect(selectWrapper.get('.react-aria-SelectValue').text()).toBe('Bar');

    let renderPropsStory = SelectRenderProps({selectionMode: 'multiple'});
    let renderPropsWrapper = mount(renderPropsStory);
    await renderPropsWrapper.get('button.react-aria-Button').trigger('click');
    await renderPropsWrapper.findAll('.item')[0].trigger('click');
    await renderPropsWrapper.findAll('.item')[1].trigger('click');
    expect(renderPropsWrapper.get('.react-aria-SelectValue').text()).toBe('2 selected items');
    expect(renderPropsWrapper.get('button.react-aria-Button').text()).toContain('▲');

    let tagGroupStory = SelectWithTagGroup({selectionMode: 'multiple'});
    let tagGroupWrapper = mount(tagGroupStory);
    await tagGroupWrapper.get('button.react-aria-Button').trigger('click');
    await tagGroupWrapper.findAll('.item')[0].trigger('click');
    await tagGroupWrapper.findAll('.item')[1].trigger('click');
    expect(tagGroupWrapper.findAll('.react-aria-Tag')).toHaveLength(2);

    let manyItemsStory = SelectManyItems({selectionMode: 'single'});
    let manyItemsWrapper = mount(manyItemsStory);
    await manyItemsWrapper.get('button.react-aria-Button').trigger('click');
    expect(manyItemsWrapper.findAll('.item').length).toBeGreaterThan(40);

    let virtualizedStory = VirtualizedSelect({selectionMode: 'single'});
    let virtualizedWrapper = mount(virtualizedStory);
    await virtualizedWrapper.get('button.react-aria-Button').trigger('click');
    expect(virtualizedWrapper.findAll('.item').length).toBeGreaterThan(80);

    let asyncStory = AsyncVirtualizedCollectionRenderSelect.render?.({delay: 0}) as ReturnType<Exclude<typeof AsyncVirtualizedCollectionRenderSelect.render, undefined>>;
    let asyncWrapper = mount(asyncStory);
    await asyncWrapper.get('button.react-aria-Button').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();
    expect(asyncWrapper.findAll('.item').length).toBeGreaterThan(0);
  });
});
