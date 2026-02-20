import type * as ReactAriaComponents from '../../../react-aria-components/src/index';
import type {Color as IColor} from '@react-types/color';
import type * as React from 'react';
import type {Context, ForwardedRef, ReactElement, ReactNode} from 'react';

type CollectionNodeClass<T> = ReactAriaComponents.CollectionNodeClass<T>;
type Node<T> = ReactAriaComponents.Node<T>;
type SlottedContextValue<T> = ReactAriaComponents.SlottedContextValue<T>;

const compatPlaceholder: any = new Proxy(function compatPlaceholder() {}, {
  apply: () => compatPlaceholder,
  get: () => compatPlaceholder
});

export type AsyncListData = ReactAriaComponents.AsyncListData;

export const Autocomplete: ReactAriaComponents.Autocomplete = compatPlaceholder as ReactAriaComponents.Autocomplete;

export const AutocompleteContext: ReactAriaComponents.AutocompleteContext = compatPlaceholder as ReactAriaComponents.AutocompleteContext;

export type AutocompleteProps = ReactAriaComponents.AutocompleteProps;

export type AutocompleteState = ReactAriaComponents.AutocompleteState;

export const AutocompleteStateContext: ReactAriaComponents.AutocompleteStateContext = compatPlaceholder as ReactAriaComponents.AutocompleteStateContext;

export const Breadcrumb: ReactAriaComponents.Breadcrumb = compatPlaceholder as ReactAriaComponents.Breadcrumb;

export type BreadcrumbProps = ReactAriaComponents.BreadcrumbProps;

export type BreadcrumbRenderProps = ReactAriaComponents.BreadcrumbRenderProps;

export const Breadcrumbs: ReactAriaComponents.Breadcrumbs = compatPlaceholder as ReactAriaComponents.Breadcrumbs;

export const BreadcrumbsContext: ReactAriaComponents.BreadcrumbsContext = compatPlaceholder as ReactAriaComponents.BreadcrumbsContext;

export type BreadcrumbsProps = ReactAriaComponents.BreadcrumbsProps;

export const Button: ReactAriaComponents.Button = compatPlaceholder as ReactAriaComponents.Button;

export const ButtonContext: ReactAriaComponents.ButtonContext = compatPlaceholder as ReactAriaComponents.ButtonContext;

export type ButtonProps = ReactAriaComponents.ButtonProps;

export type ButtonRenderProps = ReactAriaComponents.ButtonRenderProps;

export const Calendar: ReactAriaComponents.Calendar = compatPlaceholder as ReactAriaComponents.Calendar;

export const CalendarCell: ReactAriaComponents.CalendarCell = compatPlaceholder as ReactAriaComponents.CalendarCell;

export type CalendarCellProps = ReactAriaComponents.CalendarCellProps;

export type CalendarCellRenderProps = ReactAriaComponents.CalendarCellRenderProps;

export const CalendarContext: ReactAriaComponents.CalendarContext = compatPlaceholder as ReactAriaComponents.CalendarContext;

export const CalendarGrid: ReactAriaComponents.CalendarGrid = compatPlaceholder as ReactAriaComponents.CalendarGrid;

export const CalendarGridBody: ReactAriaComponents.CalendarGridBody = compatPlaceholder as ReactAriaComponents.CalendarGridBody;

export type CalendarGridBodyProps = ReactAriaComponents.CalendarGridBodyProps;

export const CalendarGridHeader: ReactAriaComponents.CalendarGridHeader = compatPlaceholder as ReactAriaComponents.CalendarGridHeader;

export type CalendarGridHeaderProps = ReactAriaComponents.CalendarGridHeaderProps;

export type CalendarGridProps = ReactAriaComponents.CalendarGridProps;

export const CalendarHeaderCell: ReactAriaComponents.CalendarHeaderCell = compatPlaceholder as ReactAriaComponents.CalendarHeaderCell;

export type CalendarHeaderCellProps = ReactAriaComponents.CalendarHeaderCellProps;

export type CalendarProps = ReactAriaComponents.CalendarProps;

export type CalendarRenderProps = ReactAriaComponents.CalendarRenderProps;

export type CalendarState = ReactAriaComponents.CalendarState;

export const CalendarStateContext: ReactAriaComponents.CalendarStateContext = compatPlaceholder as ReactAriaComponents.CalendarStateContext;

export const Cell: ReactAriaComponents.Cell = compatPlaceholder as ReactAriaComponents.Cell;

export type CellProps = ReactAriaComponents.CellProps;

export type CellRenderProps = ReactAriaComponents.CellRenderProps;

export const Checkbox: ReactAriaComponents.Checkbox = compatPlaceholder as ReactAriaComponents.Checkbox;

export const CheckboxContext: ReactAriaComponents.CheckboxContext = compatPlaceholder as ReactAriaComponents.CheckboxContext;

export const CheckboxGroup: ReactAriaComponents.CheckboxGroup = compatPlaceholder as ReactAriaComponents.CheckboxGroup;

export const CheckboxGroupContext: ReactAriaComponents.CheckboxGroupContext = compatPlaceholder as ReactAriaComponents.CheckboxGroupContext;

export type CheckboxGroupProps = ReactAriaComponents.CheckboxGroupProps;

export type CheckboxGroupRenderProps = ReactAriaComponents.CheckboxGroupRenderProps;

export type CheckboxGroupState = ReactAriaComponents.CheckboxGroupState;

export const CheckboxGroupStateContext: ReactAriaComponents.CheckboxGroupStateContext = compatPlaceholder as ReactAriaComponents.CheckboxGroupStateContext;

export type CheckboxProps = ReactAriaComponents.CheckboxProps;

export type CheckboxRenderProps = ReactAriaComponents.CheckboxRenderProps;

export const Collection: ReactAriaComponents.Collection = compatPlaceholder as ReactAriaComponents.Collection;

export const CollectionBuilder: ReactAriaComponents.CollectionBuilder = compatPlaceholder as ReactAriaComponents.CollectionBuilder;

export type CollectionRenderer = ReactAriaComponents.CollectionRenderer;

export const CollectionRendererContext: ReactAriaComponents.CollectionRendererContext = compatPlaceholder as ReactAriaComponents.CollectionRendererContext;

export type Color = ReactAriaComponents.Color;

export const ColorArea: ReactAriaComponents.ColorArea = compatPlaceholder as ReactAriaComponents.ColorArea;

export const ColorAreaContext: ReactAriaComponents.ColorAreaContext = compatPlaceholder as ReactAriaComponents.ColorAreaContext;

export type ColorAreaProps = ReactAriaComponents.ColorAreaProps;

export type ColorAreaRenderProps = ReactAriaComponents.ColorAreaRenderProps;

export type ColorAreaState = ReactAriaComponents.ColorAreaState;

export const ColorAreaStateContext: ReactAriaComponents.ColorAreaStateContext = compatPlaceholder as ReactAriaComponents.ColorAreaStateContext;

export const ColorField: ReactAriaComponents.ColorField = compatPlaceholder as ReactAriaComponents.ColorField;

export const ColorFieldContext: ReactAriaComponents.ColorFieldContext = compatPlaceholder as ReactAriaComponents.ColorFieldContext;

export type ColorFieldProps = ReactAriaComponents.ColorFieldProps;

export type ColorFieldRenderProps = ReactAriaComponents.ColorFieldRenderProps;

export type ColorFieldState = ReactAriaComponents.ColorFieldState;

export const ColorFieldStateContext: ReactAriaComponents.ColorFieldStateContext = compatPlaceholder as ReactAriaComponents.ColorFieldStateContext;

export type ColorFormat = ReactAriaComponents.ColorFormat;

export const ColorPicker: ReactAriaComponents.ColorPicker = compatPlaceholder as ReactAriaComponents.ColorPicker;

export const ColorPickerContext: ReactAriaComponents.ColorPickerContext = compatPlaceholder as ReactAriaComponents.ColorPickerContext;

export type ColorPickerProps = ReactAriaComponents.ColorPickerProps;

export type ColorPickerRenderProps = ReactAriaComponents.ColorPickerRenderProps;

export type ColorPickerState = ReactAriaComponents.ColorPickerState;

export const ColorPickerStateContext: ReactAriaComponents.ColorPickerStateContext = compatPlaceholder as ReactAriaComponents.ColorPickerStateContext;

export const ColorSlider: ReactAriaComponents.ColorSlider = compatPlaceholder as ReactAriaComponents.ColorSlider;

export const ColorSliderContext: ReactAriaComponents.ColorSliderContext = compatPlaceholder as ReactAriaComponents.ColorSliderContext;

export type ColorSliderProps = ReactAriaComponents.ColorSliderProps;

export type ColorSliderRenderProps = ReactAriaComponents.ColorSliderRenderProps;

export type ColorSliderState = ReactAriaComponents.ColorSliderState;

export const ColorSliderStateContext: ReactAriaComponents.ColorSliderStateContext = compatPlaceholder as ReactAriaComponents.ColorSliderStateContext;

export type ColorSpace = ReactAriaComponents.ColorSpace;

export const ColorSwatch: ReactAriaComponents.ColorSwatch = compatPlaceholder as ReactAriaComponents.ColorSwatch;

export const ColorSwatchContext: ReactAriaComponents.ColorSwatchContext = compatPlaceholder as ReactAriaComponents.ColorSwatchContext;

export const ColorSwatchPicker: ReactAriaComponents.ColorSwatchPicker = compatPlaceholder as ReactAriaComponents.ColorSwatchPicker;

export const ColorSwatchPickerContext: ReactAriaComponents.ColorSwatchPickerContext = compatPlaceholder as ReactAriaComponents.ColorSwatchPickerContext;

export const ColorSwatchPickerItem: ReactAriaComponents.ColorSwatchPickerItem = compatPlaceholder as ReactAriaComponents.ColorSwatchPickerItem;

export type ColorSwatchPickerItemProps = ReactAriaComponents.ColorSwatchPickerItemProps;

export type ColorSwatchPickerItemRenderProps = ReactAriaComponents.ColorSwatchPickerItemRenderProps;

export type ColorSwatchPickerProps = ReactAriaComponents.ColorSwatchPickerProps;

export type ColorSwatchPickerRenderProps = ReactAriaComponents.ColorSwatchPickerRenderProps;

export type ColorSwatchProps = ReactAriaComponents.ColorSwatchProps;

export type ColorSwatchRenderProps = ReactAriaComponents.ColorSwatchRenderProps;

export const ColorThumb: ReactAriaComponents.ColorThumb = compatPlaceholder as ReactAriaComponents.ColorThumb;

export type ColorThumbProps = ReactAriaComponents.ColorThumbProps;

export type ColorThumbRenderProps = ReactAriaComponents.ColorThumbRenderProps;

export const ColorWheel: ReactAriaComponents.ColorWheel = compatPlaceholder as ReactAriaComponents.ColorWheel;

export const ColorWheelContext: ReactAriaComponents.ColorWheelContext = compatPlaceholder as ReactAriaComponents.ColorWheelContext;

export type ColorWheelProps = ReactAriaComponents.ColorWheelProps;

export type ColorWheelRenderProps = ReactAriaComponents.ColorWheelRenderProps;

export type ColorWheelState = ReactAriaComponents.ColorWheelState;

export const ColorWheelStateContext: ReactAriaComponents.ColorWheelStateContext = compatPlaceholder as ReactAriaComponents.ColorWheelStateContext;

export const ColorWheelTrack: ReactAriaComponents.ColorWheelTrack = compatPlaceholder as ReactAriaComponents.ColorWheelTrack;

export const ColorWheelTrackContext: ReactAriaComponents.ColorWheelTrackContext = compatPlaceholder as ReactAriaComponents.ColorWheelTrackContext;

export type ColorWheelTrackProps = ReactAriaComponents.ColorWheelTrackProps;

export type ColorWheelTrackRenderProps = ReactAriaComponents.ColorWheelTrackRenderProps;

export const Column: ReactAriaComponents.Column = compatPlaceholder as ReactAriaComponents.Column;

export type ColumnProps = ReactAriaComponents.ColumnProps;

export type ColumnRenderProps = ReactAriaComponents.ColumnRenderProps;

export const ColumnResizer: ReactAriaComponents.ColumnResizer = compatPlaceholder as ReactAriaComponents.ColumnResizer;

export type ColumnResizerProps = ReactAriaComponents.ColumnResizerProps;

export type ColumnResizerRenderProps = ReactAriaComponents.ColumnResizerRenderProps;

export const ComboBox: ReactAriaComponents.ComboBox = compatPlaceholder as ReactAriaComponents.ComboBox;

export const ComboBoxContext: ReactAriaComponents.ComboBoxContext = compatPlaceholder as ReactAriaComponents.ComboBoxContext;

export type ComboBoxProps = ReactAriaComponents.ComboBoxProps;

export type ComboBoxRenderProps = ReactAriaComponents.ComboBoxRenderProps;

export type ComboBoxState = ReactAriaComponents.ComboBoxState;

export const ComboBoxStateContext: ReactAriaComponents.ComboBoxStateContext = compatPlaceholder as ReactAriaComponents.ComboBoxStateContext;

export const ComboBoxValue: ReactAriaComponents.ComboBoxValue = compatPlaceholder as ReactAriaComponents.ComboBoxValue;

export const ComboBoxValueContext: ReactAriaComponents.ComboBoxValueContext = compatPlaceholder as ReactAriaComponents.ComboBoxValueContext;

export type ComboBoxValueProps = ReactAriaComponents.ComboBoxValueProps;

export type ComboBoxValueRenderProps = ReactAriaComponents.ComboBoxValueRenderProps;

export const composeRenderProps: typeof ReactAriaComponents.composeRenderProps = compatPlaceholder as typeof ReactAriaComponents.composeRenderProps;

export type ContextValue = ReactAriaComponents.ContextValue;

export function createBranchComponent<T extends object, P extends {children?: any}, E extends Element>(CollectionNodeClass: CollectionNodeClass<any> | string, render: (props: P, ref: ForwardedRef<E>, node: Node<T>) => ReactElement | null, useChildren?: (props: P) => ReactNode): (props: P & React.RefAttributes<E>) => ReactElement | null {
  return compatPlaceholder(CollectionNodeClass, render, useChildren);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createLeafComponent<T extends object, P extends object, E extends Element>(CollectionNodeClass: CollectionNodeClass<any> | string, render: (props: P, ref: ForwardedRef<E>) => ReactElement | null): (props: P & React.RefAttributes<E>) => ReactElement | null;
export function createLeafComponent<T extends object, P extends object, E extends Element>(CollectionNodeClass: CollectionNodeClass<any> | string, render: (props: P, ref: ForwardedRef<E>, node: Node<T>) => ReactElement | null): (props: P & React.RefAttributes<E>) => ReactElement | null;
export function createLeafComponent(...args: any[]): any {
  return compatPlaceholder(...args);
}

export const DateField: ReactAriaComponents.DateField = compatPlaceholder as ReactAriaComponents.DateField;

export const DateFieldContext: ReactAriaComponents.DateFieldContext = compatPlaceholder as ReactAriaComponents.DateFieldContext;

export type DateFieldProps = ReactAriaComponents.DateFieldProps;

export type DateFieldRenderProps = ReactAriaComponents.DateFieldRenderProps;

export type DateFieldState = ReactAriaComponents.DateFieldState;

export const DateFieldStateContext: ReactAriaComponents.DateFieldStateContext = compatPlaceholder as ReactAriaComponents.DateFieldStateContext;

export const DateInput: ReactAriaComponents.DateInput = compatPlaceholder as ReactAriaComponents.DateInput;

export type DateInputProps = ReactAriaComponents.DateInputProps;

export type DateInputRenderProps = ReactAriaComponents.DateInputRenderProps;

export const DatePicker: ReactAriaComponents.DatePicker = compatPlaceholder as ReactAriaComponents.DatePicker;

export const DatePickerContext: ReactAriaComponents.DatePickerContext = compatPlaceholder as ReactAriaComponents.DatePickerContext;

export type DatePickerProps = ReactAriaComponents.DatePickerProps;

export type DatePickerRenderProps = ReactAriaComponents.DatePickerRenderProps;

export type DatePickerState = ReactAriaComponents.DatePickerState;

export const DatePickerStateContext: ReactAriaComponents.DatePickerStateContext = compatPlaceholder as ReactAriaComponents.DatePickerStateContext;

export type DateRange = ReactAriaComponents.DateRange;

export const DateRangePicker: ReactAriaComponents.DateRangePicker = compatPlaceholder as ReactAriaComponents.DateRangePicker;

export const DateRangePickerContext: ReactAriaComponents.DateRangePickerContext = compatPlaceholder as ReactAriaComponents.DateRangePickerContext;

export type DateRangePickerProps = ReactAriaComponents.DateRangePickerProps;

export type DateRangePickerRenderProps = ReactAriaComponents.DateRangePickerRenderProps;

export type DateRangePickerState = ReactAriaComponents.DateRangePickerState;

export const DateRangePickerStateContext: ReactAriaComponents.DateRangePickerStateContext = compatPlaceholder as ReactAriaComponents.DateRangePickerStateContext;

export const DateSegment: ReactAriaComponents.DateSegment = compatPlaceholder as ReactAriaComponents.DateSegment;

export type DateSegmentProps = ReactAriaComponents.DateSegmentProps;

export type DateSegmentRenderProps = ReactAriaComponents.DateSegmentRenderProps;

export type DateValue = ReactAriaComponents.DateValue;

export const DEFAULT_SLOT: ReactAriaComponents.DEFAULT_SLOT = compatPlaceholder as ReactAriaComponents.DEFAULT_SLOT;

export const DefaultCollectionRenderer: ReactAriaComponents.DefaultCollectionRenderer = compatPlaceholder as ReactAriaComponents.DefaultCollectionRenderer;

export const Dialog: ReactAriaComponents.Dialog = compatPlaceholder as ReactAriaComponents.Dialog;

export const DialogContext: ReactAriaComponents.DialogContext = compatPlaceholder as ReactAriaComponents.DialogContext;

export type DialogProps = ReactAriaComponents.DialogProps;

export type DialogRenderProps = ReactAriaComponents.DialogRenderProps;

export const DialogTrigger: ReactAriaComponents.DialogTrigger = compatPlaceholder as ReactAriaComponents.DialogTrigger;

export type DialogTriggerProps = ReactAriaComponents.DialogTriggerProps;

export const DIRECTORY_DRAG_TYPE: ReactAriaComponents.DIRECTORY_DRAG_TYPE = compatPlaceholder as ReactAriaComponents.DIRECTORY_DRAG_TYPE;

export type DirectoryDropItem = ReactAriaComponents.DirectoryDropItem;

export const Disclosure: ReactAriaComponents.Disclosure = compatPlaceholder as ReactAriaComponents.Disclosure;

export const DisclosureContext: ReactAriaComponents.DisclosureContext = compatPlaceholder as ReactAriaComponents.DisclosureContext;

export const DisclosureGroup: ReactAriaComponents.DisclosureGroup = compatPlaceholder as ReactAriaComponents.DisclosureGroup;

export type DisclosureGroupProps = ReactAriaComponents.DisclosureGroupProps;

export type DisclosureGroupRenderProps = ReactAriaComponents.DisclosureGroupRenderProps;

export type DisclosureGroupState = ReactAriaComponents.DisclosureGroupState;

export const DisclosureGroupStateContext: ReactAriaComponents.DisclosureGroupStateContext = compatPlaceholder as ReactAriaComponents.DisclosureGroupStateContext;

export const DisclosurePanel: ReactAriaComponents.DisclosurePanel = compatPlaceholder as ReactAriaComponents.DisclosurePanel;

export type DisclosurePanelProps = ReactAriaComponents.DisclosurePanelProps;

export type DisclosurePanelRenderProps = ReactAriaComponents.DisclosurePanelRenderProps;

export type DisclosureProps = ReactAriaComponents.DisclosureProps;

export type DisclosureRenderProps = ReactAriaComponents.DisclosureRenderProps;

export type DisclosureState = ReactAriaComponents.DisclosureState;

export const DisclosureStateContext: ReactAriaComponents.DisclosureStateContext = compatPlaceholder as ReactAriaComponents.DisclosureStateContext;

export const DragAndDropContext: ReactAriaComponents.DragAndDropContext = compatPlaceholder as ReactAriaComponents.DragAndDropContext;

export type DragAndDropHooks = ReactAriaComponents.DragAndDropHooks;

export type DragAndDropOptions = ReactAriaComponents.DragAndDropOptions;

export type DraggableCollectionEndEvent = ReactAriaComponents.DraggableCollectionEndEvent;

export type DraggableCollectionMoveEvent = ReactAriaComponents.DraggableCollectionMoveEvent;

export type DraggableCollectionStartEvent = ReactAriaComponents.DraggableCollectionStartEvent;

export type DragOptions = ReactAriaComponents.DragOptions;

export type DragPreviewRenderer = ReactAriaComponents.DragPreviewRenderer;

export type DragResult = ReactAriaComponents.DragResult;

export type DragTypes = ReactAriaComponents.DragTypes;

export const DropIndicator: ReactAriaComponents.DropIndicator = compatPlaceholder as ReactAriaComponents.DropIndicator;

export const DropIndicatorContext: ReactAriaComponents.DropIndicatorContext = compatPlaceholder as ReactAriaComponents.DropIndicatorContext;

export type DropIndicatorProps = ReactAriaComponents.DropIndicatorProps;

export type DropIndicatorRenderProps = ReactAriaComponents.DropIndicatorRenderProps;

export type DropItem = ReactAriaComponents.DropItem;

export type DropOperation = ReactAriaComponents.DropOperation;

export type DroppableCollectionDropEvent = ReactAriaComponents.DroppableCollectionDropEvent;

export type DroppableCollectionEnterEvent = ReactAriaComponents.DroppableCollectionEnterEvent;

export type DroppableCollectionExitEvent = ReactAriaComponents.DroppableCollectionExitEvent;

export type DroppableCollectionInsertDropEvent = ReactAriaComponents.DroppableCollectionInsertDropEvent;

export type DroppableCollectionMoveEvent = ReactAriaComponents.DroppableCollectionMoveEvent;

export type DroppableCollectionOnItemDropEvent = ReactAriaComponents.DroppableCollectionOnItemDropEvent;

export type DroppableCollectionReorderEvent = ReactAriaComponents.DroppableCollectionReorderEvent;

export type DroppableCollectionRootDropEvent = ReactAriaComponents.DroppableCollectionRootDropEvent;

export type DropPosition = ReactAriaComponents.DropPosition;

export type DropTarget = ReactAriaComponents.DropTarget;

export const DropZone: ReactAriaComponents.DropZone = compatPlaceholder as ReactAriaComponents.DropZone;

export const DropZoneContext: ReactAriaComponents.DropZoneContext = compatPlaceholder as ReactAriaComponents.DropZoneContext;

export type DropZoneProps = ReactAriaComponents.DropZoneProps;

export type DropZoneRenderProps = ReactAriaComponents.DropZoneRenderProps;

export const FieldError: ReactAriaComponents.FieldError = compatPlaceholder as ReactAriaComponents.FieldError;

export const FieldErrorContext: ReactAriaComponents.FieldErrorContext = compatPlaceholder as ReactAriaComponents.FieldErrorContext;

export type FieldErrorProps = ReactAriaComponents.FieldErrorProps;

export type FieldErrorRenderProps = ReactAriaComponents.FieldErrorRenderProps;

export const FieldInputContext: ReactAriaComponents.FieldInputContext = compatPlaceholder as ReactAriaComponents.FieldInputContext;

export type FileDropItem = ReactAriaComponents.FileDropItem;

export const FileTrigger: ReactAriaComponents.FileTrigger = compatPlaceholder as ReactAriaComponents.FileTrigger;

export type FileTriggerProps = ReactAriaComponents.FileTriggerProps;

export const Focusable: ReactAriaComponents.Focusable = compatPlaceholder as ReactAriaComponents.Focusable;

export const Form: ReactAriaComponents.Form = compatPlaceholder as ReactAriaComponents.Form;

export const FormContext: ReactAriaComponents.FormContext = compatPlaceholder as ReactAriaComponents.FormContext;

export type FormProps = ReactAriaComponents.FormProps;

export const FormValidationContext: ReactAriaComponents.FormValidationContext = compatPlaceholder as ReactAriaComponents.FormValidationContext;

export const getColorChannels: (colorSpace: ColorSpace) => [ColorChannel, ColorChannel, ColorChannel] = compatPlaceholder as (colorSpace: ColorSpace) => [ColorChannel, ColorChannel, ColorChannel];

export type GridLayout = ReactAriaComponents.GridLayout;
export const GridLayout: ReactAriaComponents.GridLayout = compatPlaceholder as ReactAriaComponents.GridLayout;

export type GridLayoutOptions = ReactAriaComponents.GridLayoutOptions;

export const GridList: ReactAriaComponents.GridList = compatPlaceholder as ReactAriaComponents.GridList;

export const GridListContext: ReactAriaComponents.GridListContext = compatPlaceholder as ReactAriaComponents.GridListContext;

export const GridListHeader: ReactAriaComponents.GridListHeader = compatPlaceholder as ReactAriaComponents.GridListHeader;

export const GridListHeaderContext: ReactAriaComponents.GridListHeaderContext = compatPlaceholder as ReactAriaComponents.GridListHeaderContext;

export const GridListItem: ReactAriaComponents.GridListItem = compatPlaceholder as ReactAriaComponents.GridListItem;

export type GridListItemProps = ReactAriaComponents.GridListItemProps;

export type GridListItemRenderProps = ReactAriaComponents.GridListItemRenderProps;

export const GridListLoadMoreItem: ReactAriaComponents.GridListLoadMoreItem = compatPlaceholder as ReactAriaComponents.GridListLoadMoreItem;

export type GridListLoadMoreItemProps = ReactAriaComponents.GridListLoadMoreItemProps;

export type GridListProps = ReactAriaComponents.GridListProps;

export type GridListRenderProps = ReactAriaComponents.GridListRenderProps;

export const GridListSection: ReactAriaComponents.GridListSection = compatPlaceholder as ReactAriaComponents.GridListSection;

export type GridListSectionProps = ReactAriaComponents.GridListSectionProps;

export const Group: ReactAriaComponents.Group = compatPlaceholder as ReactAriaComponents.Group;

export const GroupContext: ReactAriaComponents.GroupContext = compatPlaceholder as ReactAriaComponents.GroupContext;

export type GroupProps = ReactAriaComponents.GroupProps;

export type GroupRenderProps = ReactAriaComponents.GroupRenderProps;

export const Header: ReactAriaComponents.Header = compatPlaceholder as ReactAriaComponents.Header;

export const HeaderContext: ReactAriaComponents.HeaderContext = compatPlaceholder as ReactAriaComponents.HeaderContext;

export type HeaderProps = ReactAriaComponents.HeaderProps;

export const Heading: ReactAriaComponents.Heading = compatPlaceholder as ReactAriaComponents.Heading;

export const HeadingContext: ReactAriaComponents.HeadingContext = compatPlaceholder as ReactAriaComponents.HeadingContext;

export type HeadingProps = ReactAriaComponents.HeadingProps;

export const I18nProvider: ReactAriaComponents.I18nProvider = compatPlaceholder as ReactAriaComponents.I18nProvider;

export const Input: ReactAriaComponents.Input = compatPlaceholder as ReactAriaComponents.Input;

export const InputContext: ReactAriaComponents.InputContext = compatPlaceholder as ReactAriaComponents.InputContext;

export type InputProps = ReactAriaComponents.InputProps;

export type InputRenderProps = ReactAriaComponents.InputRenderProps;

export const isDirectoryDropItem: (dropItem: DropItem) => dropItem is DirectoryDropItem = compatPlaceholder as (dropItem: DropItem) => dropItem is DirectoryDropItem;

export const isFileDropItem: (dropItem: DropItem) => dropItem is FileDropItem = compatPlaceholder as (dropItem: DropItem) => dropItem is FileDropItem;

export const isRTL: (localeString: string) => boolean = compatPlaceholder as (localeString: string) => boolean;

export const isTextDropItem: (dropItem: DropItem) => dropItem is TextDropItem = compatPlaceholder as (dropItem: DropItem) => dropItem is TextDropItem;

export type ItemDropTarget = ReactAriaComponents.ItemDropTarget;

export type Key = ReactAriaComponents.Key;

export const Keyboard: ReactAriaComponents.Keyboard = compatPlaceholder as ReactAriaComponents.Keyboard;

export const KeyboardContext: ReactAriaComponents.KeyboardContext = compatPlaceholder as ReactAriaComponents.KeyboardContext;

export const Label: ReactAriaComponents.Label = compatPlaceholder as ReactAriaComponents.Label;

export const LabelContext: ReactAriaComponents.LabelContext = compatPlaceholder as ReactAriaComponents.LabelContext;

export type LabelProps = ReactAriaComponents.LabelProps;

export type Layout = ReactAriaComponents.Layout;
export const Layout: ReactAriaComponents.Layout = compatPlaceholder as ReactAriaComponents.Layout;

export type LayoutInfo = ReactAriaComponents.LayoutInfo;
export const LayoutInfo: ReactAriaComponents.LayoutInfo = compatPlaceholder as ReactAriaComponents.LayoutInfo;

export const Link: ReactAriaComponents.Link = compatPlaceholder as ReactAriaComponents.Link;

export const LinkContext: ReactAriaComponents.LinkContext = compatPlaceholder as ReactAriaComponents.LinkContext;

export type LinkProps = ReactAriaComponents.LinkProps;

export type LinkRenderProps = ReactAriaComponents.LinkRenderProps;

export const ListBox: ReactAriaComponents.ListBox = compatPlaceholder as ReactAriaComponents.ListBox;

export const ListBoxContext: ReactAriaComponents.ListBoxContext = compatPlaceholder as ReactAriaComponents.ListBoxContext;

export const ListBoxItem: ReactAriaComponents.ListBoxItem = compatPlaceholder as ReactAriaComponents.ListBoxItem;

export type ListBoxItemProps = ReactAriaComponents.ListBoxItemProps;

export type ListBoxItemRenderProps = ReactAriaComponents.ListBoxItemRenderProps;

export const ListBoxLoadMoreItem: ReactAriaComponents.ListBoxLoadMoreItem = compatPlaceholder as ReactAriaComponents.ListBoxLoadMoreItem;

export type ListBoxLoadMoreItemProps = ReactAriaComponents.ListBoxLoadMoreItemProps;

export type ListBoxProps = ReactAriaComponents.ListBoxProps;

export type ListBoxRenderProps = ReactAriaComponents.ListBoxRenderProps;

export const ListBoxSection: ReactAriaComponents.ListBoxSection = compatPlaceholder as ReactAriaComponents.ListBoxSection;

export type ListBoxSectionProps = ReactAriaComponents.ListBoxSectionProps;

export type ListData = ReactAriaComponents.ListData;

export type ListLayout = ReactAriaComponents.ListLayout;
export const ListLayout: ReactAriaComponents.ListLayout = compatPlaceholder as ReactAriaComponents.ListLayout;

export type ListLayoutOptions = ReactAriaComponents.ListLayoutOptions;

export type ListState = ReactAriaComponents.ListState;

export const ListStateContext: ReactAriaComponents.ListStateContext = compatPlaceholder as ReactAriaComponents.ListStateContext;

export const Menu: ReactAriaComponents.Menu = compatPlaceholder as ReactAriaComponents.Menu;

export const MenuContext: ReactAriaComponents.MenuContext = compatPlaceholder as ReactAriaComponents.MenuContext;

export const MenuItem: ReactAriaComponents.MenuItem = compatPlaceholder as ReactAriaComponents.MenuItem;

export type MenuItemProps = ReactAriaComponents.MenuItemProps;

export type MenuItemRenderProps = ReactAriaComponents.MenuItemRenderProps;

export type MenuProps = ReactAriaComponents.MenuProps;

export const MenuSection: ReactAriaComponents.MenuSection = compatPlaceholder as ReactAriaComponents.MenuSection;

export type MenuSectionProps = ReactAriaComponents.MenuSectionProps;

export const MenuStateContext: ReactAriaComponents.MenuStateContext = compatPlaceholder as ReactAriaComponents.MenuStateContext;

export const MenuTrigger: ReactAriaComponents.MenuTrigger = compatPlaceholder as ReactAriaComponents.MenuTrigger;

export type MenuTriggerProps = ReactAriaComponents.MenuTriggerProps;

export const Meter: ReactAriaComponents.Meter = compatPlaceholder as ReactAriaComponents.Meter;

export const MeterContext: ReactAriaComponents.MeterContext = compatPlaceholder as ReactAriaComponents.MeterContext;

export type MeterProps = ReactAriaComponents.MeterProps;

export type MeterRenderProps = ReactAriaComponents.MeterRenderProps;

export const Modal: ReactAriaComponents.Modal = compatPlaceholder as ReactAriaComponents.Modal;

export const ModalContext: ReactAriaComponents.ModalContext = compatPlaceholder as ReactAriaComponents.ModalContext;

export const ModalOverlay: ReactAriaComponents.ModalOverlay = compatPlaceholder as ReactAriaComponents.ModalOverlay;

export type ModalOverlayProps = ReactAriaComponents.ModalOverlayProps;

export type ModalRenderProps = ReactAriaComponents.ModalRenderProps;

export const NumberField: ReactAriaComponents.NumberField = compatPlaceholder as ReactAriaComponents.NumberField;

export const NumberFieldContext: ReactAriaComponents.NumberFieldContext = compatPlaceholder as ReactAriaComponents.NumberFieldContext;

export type NumberFieldProps = ReactAriaComponents.NumberFieldProps;

export type NumberFieldRenderProps = ReactAriaComponents.NumberFieldRenderProps;

export type NumberFieldState = ReactAriaComponents.NumberFieldState;

export const NumberFieldStateContext: ReactAriaComponents.NumberFieldStateContext = compatPlaceholder as ReactAriaComponents.NumberFieldStateContext;

export const OverlayArrow: ReactAriaComponents.OverlayArrow = compatPlaceholder as ReactAriaComponents.OverlayArrow;

export type OverlayArrowProps = ReactAriaComponents.OverlayArrowProps;

export type OverlayArrowRenderProps = ReactAriaComponents.OverlayArrowRenderProps;

export type OverlayTriggerState = ReactAriaComponents.OverlayTriggerState;

export const OverlayTriggerStateContext: ReactAriaComponents.OverlayTriggerStateContext = compatPlaceholder as ReactAriaComponents.OverlayTriggerStateContext;

export function parseColor(value: string): IColor {
  return compatPlaceholder(value);
}

export type Point = ReactAriaComponents.Point;
export const Point: ReactAriaComponents.Point = compatPlaceholder as ReactAriaComponents.Point;

export const Popover: ReactAriaComponents.Popover = compatPlaceholder as ReactAriaComponents.Popover;

export const PopoverContext: ReactAriaComponents.PopoverContext = compatPlaceholder as ReactAriaComponents.PopoverContext;

export type PopoverProps = ReactAriaComponents.PopoverProps;

export type PopoverRenderProps = ReactAriaComponents.PopoverRenderProps;

export const Pressable: ReactAriaComponents.Pressable = compatPlaceholder as ReactAriaComponents.Pressable;

export type PressEvent = ReactAriaComponents.PressEvent;

export const ProgressBar: ReactAriaComponents.ProgressBar = compatPlaceholder as ReactAriaComponents.ProgressBar;

export const ProgressBarContext: ReactAriaComponents.ProgressBarContext = compatPlaceholder as ReactAriaComponents.ProgressBarContext;

export type ProgressBarProps = ReactAriaComponents.ProgressBarProps;

export type ProgressBarRenderProps = ReactAriaComponents.ProgressBarRenderProps;

export const Provider: ReactAriaComponents.Provider = compatPlaceholder as ReactAriaComponents.Provider;

export type QueuedToast = ReactAriaComponents.QueuedToast;

export const Radio: ReactAriaComponents.Radio = compatPlaceholder as ReactAriaComponents.Radio;

export const RadioContext: ReactAriaComponents.RadioContext = compatPlaceholder as ReactAriaComponents.RadioContext;

export const RadioGroup: ReactAriaComponents.RadioGroup = compatPlaceholder as ReactAriaComponents.RadioGroup;

export const RadioGroupContext: ReactAriaComponents.RadioGroupContext = compatPlaceholder as ReactAriaComponents.RadioGroupContext;

export type RadioGroupProps = ReactAriaComponents.RadioGroupProps;

export type RadioGroupRenderProps = ReactAriaComponents.RadioGroupRenderProps;

export type RadioGroupState = ReactAriaComponents.RadioGroupState;

export const RadioGroupStateContext: ReactAriaComponents.RadioGroupStateContext = compatPlaceholder as ReactAriaComponents.RadioGroupStateContext;

export type RadioProps = ReactAriaComponents.RadioProps;

export type RadioRenderProps = ReactAriaComponents.RadioRenderProps;

export const RangeCalendar: ReactAriaComponents.RangeCalendar = compatPlaceholder as ReactAriaComponents.RangeCalendar;

export const RangeCalendarContext: ReactAriaComponents.RangeCalendarContext = compatPlaceholder as ReactAriaComponents.RangeCalendarContext;

export type RangeCalendarProps = ReactAriaComponents.RangeCalendarProps;

export type RangeCalendarRenderProps = ReactAriaComponents.RangeCalendarRenderProps;

export type RangeCalendarState = ReactAriaComponents.RangeCalendarState;

export const RangeCalendarStateContext: ReactAriaComponents.RangeCalendarStateContext = compatPlaceholder as ReactAriaComponents.RangeCalendarStateContext;

export type RangeValue = ReactAriaComponents.RangeValue;

export type Rect = ReactAriaComponents.Rect;
export const Rect: ReactAriaComponents.Rect = compatPlaceholder as ReactAriaComponents.Rect;

export type RenderProps = ReactAriaComponents.RenderProps;

export const ResizableTableContainer: ReactAriaComponents.ResizableTableContainer = compatPlaceholder as ReactAriaComponents.ResizableTableContainer;

export type ResizableTableContainerProps = ReactAriaComponents.ResizableTableContainerProps;

export type RootDropTarget = ReactAriaComponents.RootDropTarget;

export type RootMenuTriggerState = ReactAriaComponents.RootMenuTriggerState;

export const RootMenuTriggerStateContext: ReactAriaComponents.RootMenuTriggerStateContext = compatPlaceholder as ReactAriaComponents.RootMenuTriggerStateContext;

export type RouterConfig = ReactAriaComponents.RouterConfig;

export const RouterProvider: ReactAriaComponents.RouterProvider = compatPlaceholder as ReactAriaComponents.RouterProvider;

export const Row: ReactAriaComponents.Row = compatPlaceholder as ReactAriaComponents.Row;

export type RowProps = ReactAriaComponents.RowProps;

export type RowRenderProps = ReactAriaComponents.RowRenderProps;

export const SearchField: ReactAriaComponents.SearchField = compatPlaceholder as ReactAriaComponents.SearchField;

export const SearchFieldContext: ReactAriaComponents.SearchFieldContext = compatPlaceholder as ReactAriaComponents.SearchFieldContext;

export type SearchFieldProps = ReactAriaComponents.SearchFieldProps;

export type SearchFieldRenderProps = ReactAriaComponents.SearchFieldRenderProps;

export type SearchFieldState = ReactAriaComponents.SearchFieldState;

export const Section: ReactAriaComponents.Section = compatPlaceholder as ReactAriaComponents.Section;

export type SectionProps = ReactAriaComponents.SectionProps;

export const Select: ReactAriaComponents.Select = compatPlaceholder as ReactAriaComponents.Select;

export const SelectableCollectionContext: ReactAriaComponents.SelectableCollectionContext = compatPlaceholder as ReactAriaComponents.SelectableCollectionContext;

export type SelectableCollectionContextValue = ReactAriaComponents.SelectableCollectionContextValue;

export const SelectContext: ReactAriaComponents.SelectContext = compatPlaceholder as ReactAriaComponents.SelectContext;

export type Selection = ReactAriaComponents.Selection;

export const SelectionIndicator: ReactAriaComponents.SelectionIndicator = compatPlaceholder as ReactAriaComponents.SelectionIndicator;

export const SelectionIndicatorContext: ReactAriaComponents.SelectionIndicatorContext = compatPlaceholder as ReactAriaComponents.SelectionIndicatorContext;

export type SelectionIndicatorProps = ReactAriaComponents.SelectionIndicatorProps;

export type SelectionMode = ReactAriaComponents.SelectionMode;

export type SelectProps = ReactAriaComponents.SelectProps;

export type SelectRenderProps = ReactAriaComponents.SelectRenderProps;

export type SelectState = ReactAriaComponents.SelectState;

export const SelectStateContext: ReactAriaComponents.SelectStateContext = compatPlaceholder as ReactAriaComponents.SelectStateContext;

export const SelectValue: ReactAriaComponents.SelectValue = compatPlaceholder as ReactAriaComponents.SelectValue;

export const SelectValueContext: ReactAriaComponents.SelectValueContext = compatPlaceholder as ReactAriaComponents.SelectValueContext;

export type SelectValueProps = ReactAriaComponents.SelectValueProps;

export type SelectValueRenderProps = ReactAriaComponents.SelectValueRenderProps;

export const Separator: ReactAriaComponents.Separator = compatPlaceholder as ReactAriaComponents.Separator;

export const SeparatorContext: ReactAriaComponents.SeparatorContext = compatPlaceholder as ReactAriaComponents.SeparatorContext;

export type SeparatorProps = ReactAriaComponents.SeparatorProps;

export const SharedElement: ReactAriaComponents.SharedElement = compatPlaceholder as ReactAriaComponents.SharedElement;

export type SharedElementProps = ReactAriaComponents.SharedElementProps;

export type SharedElementRenderProps = ReactAriaComponents.SharedElementRenderProps;

export const SharedElementTransition: ReactAriaComponents.SharedElementTransition = compatPlaceholder as ReactAriaComponents.SharedElementTransition;

export type SharedElementTransitionProps = ReactAriaComponents.SharedElementTransitionProps;

export type Size = ReactAriaComponents.Size;
export const Size: ReactAriaComponents.Size = compatPlaceholder as ReactAriaComponents.Size;

export const Slider: ReactAriaComponents.Slider = compatPlaceholder as ReactAriaComponents.Slider;

export const SliderContext: ReactAriaComponents.SliderContext = compatPlaceholder as ReactAriaComponents.SliderContext;

export const SliderOutput: ReactAriaComponents.SliderOutput = compatPlaceholder as ReactAriaComponents.SliderOutput;

export const SliderOutputContext: ReactAriaComponents.SliderOutputContext = compatPlaceholder as ReactAriaComponents.SliderOutputContext;

export type SliderOutputProps = ReactAriaComponents.SliderOutputProps;

export type SliderProps = ReactAriaComponents.SliderProps;

export type SliderRenderProps = ReactAriaComponents.SliderRenderProps;

export type SliderState = ReactAriaComponents.SliderState;

export const SliderStateContext: ReactAriaComponents.SliderStateContext = compatPlaceholder as ReactAriaComponents.SliderStateContext;

export const SliderThumb: ReactAriaComponents.SliderThumb = compatPlaceholder as ReactAriaComponents.SliderThumb;

export type SliderThumbProps = ReactAriaComponents.SliderThumbProps;

export type SliderThumbRenderProps = ReactAriaComponents.SliderThumbRenderProps;

export const SliderTrack: ReactAriaComponents.SliderTrack = compatPlaceholder as ReactAriaComponents.SliderTrack;

export const SliderTrackContext: ReactAriaComponents.SliderTrackContext = compatPlaceholder as ReactAriaComponents.SliderTrackContext;

export type SliderTrackProps = ReactAriaComponents.SliderTrackProps;

export type SliderTrackRenderProps = ReactAriaComponents.SliderTrackRenderProps;

export type SlotProps = ReactAriaComponents.SlotProps;

export type SortDescriptor = ReactAriaComponents.SortDescriptor;

export type SortDirection = ReactAriaComponents.SortDirection;

export const SSRProvider: ReactAriaComponents.SSRProvider = compatPlaceholder as ReactAriaComponents.SSRProvider;

export type StyleRenderProps = ReactAriaComponents.StyleRenderProps;

export const SubmenuTrigger: ReactAriaComponents.SubmenuTrigger = compatPlaceholder as ReactAriaComponents.SubmenuTrigger;

export type SubmenuTriggerProps = ReactAriaComponents.SubmenuTriggerProps;

export const Switch: ReactAriaComponents.Switch = compatPlaceholder as ReactAriaComponents.Switch;

export const SwitchContext: ReactAriaComponents.SwitchContext = compatPlaceholder as ReactAriaComponents.SwitchContext;

export type SwitchProps = ReactAriaComponents.SwitchProps;

export type SwitchRenderProps = ReactAriaComponents.SwitchRenderProps;

export const Tab: ReactAriaComponents.Tab = compatPlaceholder as ReactAriaComponents.Tab;

export const Table: ReactAriaComponents.Table = compatPlaceholder as ReactAriaComponents.Table;

export const TableBody: ReactAriaComponents.TableBody = compatPlaceholder as ReactAriaComponents.TableBody;

export type TableBodyProps = ReactAriaComponents.TableBodyProps;

export type TableBodyRenderProps = ReactAriaComponents.TableBodyRenderProps;

export const TableColumnResizeStateContext: ReactAriaComponents.TableColumnResizeStateContext = compatPlaceholder as ReactAriaComponents.TableColumnResizeStateContext;

export const TableContext: ReactAriaComponents.TableContext = compatPlaceholder as ReactAriaComponents.TableContext;

export const TableHeader: ReactAriaComponents.TableHeader = compatPlaceholder as ReactAriaComponents.TableHeader;

export type TableHeaderProps = ReactAriaComponents.TableHeaderProps;

export type TableLayout = ReactAriaComponents.TableLayout;
export const TableLayout: ReactAriaComponents.TableLayout = compatPlaceholder as ReactAriaComponents.TableLayout;

export const TableLoadMoreItem: ReactAriaComponents.TableLoadMoreItem = compatPlaceholder as ReactAriaComponents.TableLoadMoreItem;

export type TableLoadMoreItemProps = ReactAriaComponents.TableLoadMoreItemProps;

export type TableProps = ReactAriaComponents.TableProps;

export type TableRenderProps = ReactAriaComponents.TableRenderProps;

export type TableState = ReactAriaComponents.TableState;

export const TableStateContext: ReactAriaComponents.TableStateContext = compatPlaceholder as ReactAriaComponents.TableStateContext;

export const TabList: ReactAriaComponents.TabList = compatPlaceholder as ReactAriaComponents.TabList;

export type TabListProps = ReactAriaComponents.TabListProps;

export type TabListRenderProps = ReactAriaComponents.TabListRenderProps;

export type TabListState = ReactAriaComponents.TabListState;

export const TabListStateContext: ReactAriaComponents.TabListStateContext = compatPlaceholder as ReactAriaComponents.TabListStateContext;

export const TabPanel: ReactAriaComponents.TabPanel = compatPlaceholder as ReactAriaComponents.TabPanel;

export type TabPanelProps = ReactAriaComponents.TabPanelProps;

export type TabPanelRenderProps = ReactAriaComponents.TabPanelRenderProps;

export const TabPanels: ReactAriaComponents.TabPanels = compatPlaceholder as ReactAriaComponents.TabPanels;

export type TabPanelsProps = ReactAriaComponents.TabPanelsProps;

export type TabProps = ReactAriaComponents.TabProps;

export type TabRenderProps = ReactAriaComponents.TabRenderProps;

export const Tabs: ReactAriaComponents.Tabs = compatPlaceholder as ReactAriaComponents.Tabs;

export const TabsContext: ReactAriaComponents.TabsContext = compatPlaceholder as ReactAriaComponents.TabsContext;

export type TabsProps = ReactAriaComponents.TabsProps;

export type TabsRenderProps = ReactAriaComponents.TabsRenderProps;

export const Tag: ReactAriaComponents.Tag = compatPlaceholder as ReactAriaComponents.Tag;

export const TagGroup: ReactAriaComponents.TagGroup = compatPlaceholder as ReactAriaComponents.TagGroup;

export const TagGroupContext: ReactAriaComponents.TagGroupContext = compatPlaceholder as ReactAriaComponents.TagGroupContext;

export type TagGroupProps = ReactAriaComponents.TagGroupProps;

export const TagList: ReactAriaComponents.TagList = compatPlaceholder as ReactAriaComponents.TagList;

export const TagListContext: ReactAriaComponents.TagListContext = compatPlaceholder as ReactAriaComponents.TagListContext;

export type TagListProps = ReactAriaComponents.TagListProps;

export type TagListRenderProps = ReactAriaComponents.TagListRenderProps;

export type TagProps = ReactAriaComponents.TagProps;

export type TagRenderProps = ReactAriaComponents.TagRenderProps;

export const Text: ReactAriaComponents.Text = compatPlaceholder as ReactAriaComponents.Text;

export const TextArea: ReactAriaComponents.TextArea = compatPlaceholder as ReactAriaComponents.TextArea;

export const TextAreaContext: ReactAriaComponents.TextAreaContext = compatPlaceholder as ReactAriaComponents.TextAreaContext;

export type TextAreaProps = ReactAriaComponents.TextAreaProps;

export const TextContext: ReactAriaComponents.TextContext = compatPlaceholder as ReactAriaComponents.TextContext;

export type TextDropItem = ReactAriaComponents.TextDropItem;

export const TextField: ReactAriaComponents.TextField = compatPlaceholder as ReactAriaComponents.TextField;

export const TextFieldContext: ReactAriaComponents.TextFieldContext = compatPlaceholder as ReactAriaComponents.TextFieldContext;

export type TextFieldProps = ReactAriaComponents.TextFieldProps;

export type TextFieldRenderProps = ReactAriaComponents.TextFieldRenderProps;

export type TextProps = ReactAriaComponents.TextProps;

export const TimeField: ReactAriaComponents.TimeField = compatPlaceholder as ReactAriaComponents.TimeField;

export const TimeFieldContext: ReactAriaComponents.TimeFieldContext = compatPlaceholder as ReactAriaComponents.TimeFieldContext;

export type TimeFieldProps = ReactAriaComponents.TimeFieldProps;

export type TimeFieldState = ReactAriaComponents.TimeFieldState;

export const TimeFieldStateContext: ReactAriaComponents.TimeFieldStateContext = compatPlaceholder as ReactAriaComponents.TimeFieldStateContext;

export type TimeValue = ReactAriaComponents.TimeValue;

export type ToastListProps = ReactAriaComponents.ToastListProps;

export type ToastOptions = ReactAriaComponents.ToastOptions;

export type ToastProps = ReactAriaComponents.ToastProps;

export type ToastRegionProps = ReactAriaComponents.ToastRegionProps;

export type ToastRegionRenderProps = ReactAriaComponents.ToastRegionRenderProps;

export type ToastRenderProps = ReactAriaComponents.ToastRenderProps;

export type ToastState = ReactAriaComponents.ToastState;

export const ToggleButton: ReactAriaComponents.ToggleButton = compatPlaceholder as ReactAriaComponents.ToggleButton;

export const ToggleButtonContext: ReactAriaComponents.ToggleButtonContext = compatPlaceholder as ReactAriaComponents.ToggleButtonContext;

export const ToggleButtonGroup: ReactAriaComponents.ToggleButtonGroup = compatPlaceholder as ReactAriaComponents.ToggleButtonGroup;

export const ToggleButtonGroupContext: ReactAriaComponents.ToggleButtonGroupContext = compatPlaceholder as ReactAriaComponents.ToggleButtonGroupContext;

export type ToggleButtonGroupProps = ReactAriaComponents.ToggleButtonGroupProps;

export type ToggleButtonGroupRenderProps = ReactAriaComponents.ToggleButtonGroupRenderProps;

export type ToggleButtonProps = ReactAriaComponents.ToggleButtonProps;

export type ToggleButtonRenderProps = ReactAriaComponents.ToggleButtonRenderProps;

export type ToggleGroupState = ReactAriaComponents.ToggleGroupState;

export const ToggleGroupStateContext: ReactAriaComponents.ToggleGroupStateContext = compatPlaceholder as ReactAriaComponents.ToggleGroupStateContext;

export type ToggleState = ReactAriaComponents.ToggleState;

export const Toolbar: ReactAriaComponents.Toolbar = compatPlaceholder as ReactAriaComponents.Toolbar;

export const ToolbarContext: ReactAriaComponents.ToolbarContext = compatPlaceholder as ReactAriaComponents.ToolbarContext;

export type ToolbarProps = ReactAriaComponents.ToolbarProps;

export type ToolbarRenderProps = ReactAriaComponents.ToolbarRenderProps;

export const Tooltip: ReactAriaComponents.Tooltip = compatPlaceholder as ReactAriaComponents.Tooltip;

export const TooltipContext: ReactAriaComponents.TooltipContext = compatPlaceholder as ReactAriaComponents.TooltipContext;

export type TooltipProps = ReactAriaComponents.TooltipProps;

export type TooltipRenderProps = ReactAriaComponents.TooltipRenderProps;

export const TooltipTrigger: ReactAriaComponents.TooltipTrigger = compatPlaceholder as ReactAriaComponents.TooltipTrigger;

export type TooltipTriggerComponentProps = ReactAriaComponents.TooltipTriggerComponentProps;

export type TooltipTriggerState = ReactAriaComponents.TooltipTriggerState;

export const TooltipTriggerStateContext: ReactAriaComponents.TooltipTriggerStateContext = compatPlaceholder as ReactAriaComponents.TooltipTriggerStateContext;

export const Tree: ReactAriaComponents.Tree = compatPlaceholder as ReactAriaComponents.Tree;

export const TreeContext: ReactAriaComponents.TreeContext = compatPlaceholder as ReactAriaComponents.TreeContext;

export type TreeData = ReactAriaComponents.TreeData;

export const TreeHeader: ReactAriaComponents.TreeHeader = compatPlaceholder as ReactAriaComponents.TreeHeader;

export const TreeItem: ReactAriaComponents.TreeItem = compatPlaceholder as ReactAriaComponents.TreeItem;

export const TreeItemContent: ReactAriaComponents.TreeItemContent = compatPlaceholder as ReactAriaComponents.TreeItemContent;

export type TreeItemContentProps = ReactAriaComponents.TreeItemContentProps;

export type TreeItemContentRenderProps = ReactAriaComponents.TreeItemContentRenderProps;

export type TreeItemProps = ReactAriaComponents.TreeItemProps;

export type TreeItemRenderProps = ReactAriaComponents.TreeItemRenderProps;

export const TreeLoadMoreItem: ReactAriaComponents.TreeLoadMoreItem = compatPlaceholder as ReactAriaComponents.TreeLoadMoreItem;

export type TreeLoadMoreItemProps = ReactAriaComponents.TreeLoadMoreItemProps;

export type TreeLoadMoreItemRenderProps = ReactAriaComponents.TreeLoadMoreItemRenderProps;

export type TreeProps = ReactAriaComponents.TreeProps;

export type TreeRenderProps = ReactAriaComponents.TreeRenderProps;

export const TreeSection: ReactAriaComponents.TreeSection = compatPlaceholder as ReactAriaComponents.TreeSection;

export type TreeState = ReactAriaComponents.TreeState;

export const TreeStateContext: ReactAriaComponents.TreeStateContext = compatPlaceholder as ReactAriaComponents.TreeStateContext;

export const UNSTABLE_Toast: ReactAriaComponents.UNSTABLE_Toast = compatPlaceholder as ReactAriaComponents.UNSTABLE_Toast;

export const UNSTABLE_ToastContent: ReactAriaComponents.UNSTABLE_ToastContent = compatPlaceholder as ReactAriaComponents.UNSTABLE_ToastContent;

export const UNSTABLE_ToastList: ReactAriaComponents.UNSTABLE_ToastList = compatPlaceholder as ReactAriaComponents.UNSTABLE_ToastList;

export type UNSTABLE_ToastQueue = ReactAriaComponents.UNSTABLE_ToastQueue;
export const UNSTABLE_ToastQueue: ReactAriaComponents.UNSTABLE_ToastQueue = compatPlaceholder as ReactAriaComponents.UNSTABLE_ToastQueue;

export const UNSTABLE_ToastRegion: ReactAriaComponents.UNSTABLE_ToastRegion = compatPlaceholder as ReactAriaComponents.UNSTABLE_ToastRegion;

export const UNSTABLE_ToastStateContext: ReactAriaComponents.UNSTABLE_ToastStateContext = compatPlaceholder as ReactAriaComponents.UNSTABLE_ToastStateContext;

export const useAsyncList: <T, C = string>(options: AsyncListOptions<T, C>) => AsyncListData<T> = compatPlaceholder as <T, C = string>(options: AsyncListOptions<T, C>) => AsyncListData<T>;

export const useContextProps: <T, U extends SlotProps, E extends Element>(props: T & SlotProps, ref: ForwardedRef<E> | undefined, context: Context<ContextValue<U, E>>) => [T, RefObject<E | null>] = compatPlaceholder as <T, U extends SlotProps, E extends Element>(props: T & SlotProps, ref: ForwardedRef<E> | undefined, context: Context<ContextValue<U, E>>) => [T, RefObject<E | null>];

export const useDrag: (options: DragOptions) => DragResult = compatPlaceholder as (options: DragOptions) => DragResult;

export const useDragAndDrop: <T = object>(options: DragAndDropOptions<T>) => DragAndDrop<T> = compatPlaceholder as <T = object>(options: DragAndDropOptions<T>) => DragAndDrop<T>;

export const useDrop: (options: DropOptions) => DropResult = compatPlaceholder as (options: DropOptions) => DropResult;

export const useFilter: typeof ReactAriaComponents.useFilter = compatPlaceholder as typeof ReactAriaComponents.useFilter;

export const useListData: <T>(options: ListOptions<T>) => ListData<T> = compatPlaceholder as <T>(options: ListOptions<T>) => ListData<T>;

export const useLocale: () => Locale = compatPlaceholder as () => Locale;

export const useRenderProps: <T, E extends keyof React.JSX.IntrinsicElements>(props: RenderPropsHookOptions<T, E>) => RenderPropsHookRetVal<T, E> = compatPlaceholder as <T, E extends keyof React.JSX.IntrinsicElements>(props: RenderPropsHookOptions<T, E>) => RenderPropsHookRetVal<T, E>;

export function useSlottedContext<T>(context: Context<SlottedContextValue<T>>, slot?: string | null): T | null | undefined {
  return compatPlaceholder(context, slot);
}

export const useTableOptions: () => TableOptionsContextValue = compatPlaceholder as () => TableOptionsContextValue;

export const useTreeData: <T extends object>(options: TreeOptions<T>) => TreeData<T> = compatPlaceholder as <T extends object>(options: TreeOptions<T>) => TreeData<T>;

export type ValidationResult = ReactAriaComponents.ValidationResult;

export const Virtualizer: ReactAriaComponents.Virtualizer = compatPlaceholder as ReactAriaComponents.Virtualizer;

export type VirtualizerProps = ReactAriaComponents.VirtualizerProps;

export const VisuallyHidden: ReactAriaComponents.VisuallyHidden = compatPlaceholder as ReactAriaComponents.VisuallyHidden;

export type WaterfallLayout = ReactAriaComponents.WaterfallLayout;
export const WaterfallLayout: ReactAriaComponents.WaterfallLayout = compatPlaceholder as ReactAriaComponents.WaterfallLayout;

export type WaterfallLayoutOptions = ReactAriaComponents.WaterfallLayoutOptions;
