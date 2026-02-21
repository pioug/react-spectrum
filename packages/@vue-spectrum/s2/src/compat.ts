import type {Color as IColor} from '@vue-types/color';
import type * as ReactSpectrumS2 from './index';

type CSSProperties = Record<string, unknown>;
type RefObject<T> = {current: T};

const compatPlaceholder: any = new Proxy(function compatPlaceholder() {}, {
  apply: () => compatPlaceholder,
  get: () => compatPlaceholder
});

export const Accordion: ReactSpectrumS2.Accordion = compatPlaceholder as ReactSpectrumS2.Accordion;

export const AccordionContext: ReactSpectrumS2.AccordionContext = compatPlaceholder as ReactSpectrumS2.AccordionContext;

export const AccordionItem: ReactSpectrumS2.AccordionItem = compatPlaceholder as ReactSpectrumS2.AccordionItem;

export const AccordionItemHeader: ReactSpectrumS2.AccordionItemHeader = compatPlaceholder as ReactSpectrumS2.AccordionItemHeader;

export type AccordionItemHeaderProps = ReactSpectrumS2.AccordionItemHeaderProps;

export const AccordionItemPanel: ReactSpectrumS2.AccordionItemPanel = compatPlaceholder as ReactSpectrumS2.AccordionItemPanel;

export type AccordionItemPanelProps = ReactSpectrumS2.AccordionItemPanelProps;

export type AccordionItemProps = ReactSpectrumS2.AccordionItemProps;

export type AccordionItemRenderProps = ReactSpectrumS2.AccordionItemRenderProps;

export type AccordionItemState = ReactSpectrumS2.AccordionItemState;

export const AccordionItemTitle: ReactSpectrumS2.AccordionItemTitle = compatPlaceholder as ReactSpectrumS2.AccordionItemTitle;

export type AccordionItemTitleProps = ReactSpectrumS2.AccordionItemTitleProps;

export type AccordionProps = ReactSpectrumS2.AccordionProps;

export const ActionBar: ReactSpectrumS2.ActionBar = compatPlaceholder as ReactSpectrumS2.ActionBar;

export const ActionBarContext: ReactSpectrumS2.ActionBarContext = compatPlaceholder as ReactSpectrumS2.ActionBarContext;

export type ActionBarProps = ReactSpectrumS2.ActionBarProps;

export const ActionButton: ReactSpectrumS2.ActionButton = compatPlaceholder as ReactSpectrumS2.ActionButton;

export const ActionButtonContext: ReactSpectrumS2.ActionButtonContext = compatPlaceholder as ReactSpectrumS2.ActionButtonContext;

export const ActionButtonGroup: ReactSpectrumS2.ActionButtonGroup = compatPlaceholder as ReactSpectrumS2.ActionButtonGroup;

export const ActionButtonGroupContext: ReactSpectrumS2.ActionButtonGroupContext = compatPlaceholder as ReactSpectrumS2.ActionButtonGroupContext;

export type ActionButtonGroupProps = ReactSpectrumS2.ActionButtonGroupProps;

export type ActionButtonProps = ReactSpectrumS2.ActionButtonProps;

export const ActionMenu: ReactSpectrumS2.ActionMenu = compatPlaceholder as ReactSpectrumS2.ActionMenu;

export const ActionMenuContext: ReactSpectrumS2.ActionMenuContext = compatPlaceholder as ReactSpectrumS2.ActionMenuContext;

export type ActionMenuProps = ReactSpectrumS2.ActionMenuProps;

export const AlertDialog: ReactSpectrumS2.AlertDialog = compatPlaceholder as ReactSpectrumS2.AlertDialog;

export type AlertDialogProps = ReactSpectrumS2.AlertDialogProps;

export const AssetCard: ReactSpectrumS2.AssetCard = compatPlaceholder as ReactSpectrumS2.AssetCard;

export type AssetCardProps = ReactSpectrumS2.AssetCardProps;

export type AsyncListData = ReactSpectrumS2.AsyncListData;

export const Autocomplete: ReactSpectrumS2.Autocomplete = compatPlaceholder as ReactSpectrumS2.Autocomplete;

export type AutocompleteProps = ReactSpectrumS2.AutocompleteProps;

export const Avatar: ReactSpectrumS2.Avatar = compatPlaceholder as ReactSpectrumS2.Avatar;

export const AvatarContext: ReactSpectrumS2.AvatarContext = compatPlaceholder as ReactSpectrumS2.AvatarContext;

export const AvatarGroup: ReactSpectrumS2.AvatarGroup = compatPlaceholder as ReactSpectrumS2.AvatarGroup;

export const AvatarGroupContext: ReactSpectrumS2.AvatarGroupContext = compatPlaceholder as ReactSpectrumS2.AvatarGroupContext;

export type AvatarGroupProps = ReactSpectrumS2.AvatarGroupProps;

export type AvatarProps = ReactSpectrumS2.AvatarProps;

export const Badge: ReactSpectrumS2.Badge = compatPlaceholder as ReactSpectrumS2.Badge;

export const BadgeContext: ReactSpectrumS2.BadgeContext = compatPlaceholder as ReactSpectrumS2.BadgeContext;

export type BadgeProps = ReactSpectrumS2.BadgeProps;

export const Breadcrumb: ReactSpectrumS2.Breadcrumb = compatPlaceholder as ReactSpectrumS2.Breadcrumb;

export type BreadcrumbProps = ReactSpectrumS2.BreadcrumbProps;

export const Breadcrumbs: ReactSpectrumS2.Breadcrumbs = compatPlaceholder as ReactSpectrumS2.Breadcrumbs;

export const BreadcrumbsContext: ReactSpectrumS2.BreadcrumbsContext = compatPlaceholder as ReactSpectrumS2.BreadcrumbsContext;

export type BreadcrumbsProps = ReactSpectrumS2.BreadcrumbsProps;

export const ButtonContext: ReactSpectrumS2.ButtonContext = compatPlaceholder as ReactSpectrumS2.ButtonContext;

export const ButtonGroup: ReactSpectrumS2.ButtonGroup = compatPlaceholder as ReactSpectrumS2.ButtonGroup;

export const ButtonGroupContext: ReactSpectrumS2.ButtonGroupContext = compatPlaceholder as ReactSpectrumS2.ButtonGroupContext;

export type ButtonGroupProps = ReactSpectrumS2.ButtonGroupProps;

export type ButtonProps = ReactSpectrumS2.ButtonProps;

export const Calendar: ReactSpectrumS2.Calendar = compatPlaceholder as ReactSpectrumS2.Calendar;

export const CalendarContext: ReactSpectrumS2.CalendarContext = compatPlaceholder as ReactSpectrumS2.CalendarContext;

export type CalendarProps = ReactSpectrumS2.CalendarProps;

export const Card: ReactSpectrumS2.Card = compatPlaceholder as ReactSpectrumS2.Card;

export const CardContext: ReactSpectrumS2.CardContext = compatPlaceholder as ReactSpectrumS2.CardContext;

export const CardPreview: ReactSpectrumS2.CardPreview = compatPlaceholder as ReactSpectrumS2.CardPreview;

export type CardPreviewProps = ReactSpectrumS2.CardPreviewProps;

export type CardProps = ReactSpectrumS2.CardProps;

export const CardView: ReactSpectrumS2.CardView = compatPlaceholder as ReactSpectrumS2.CardView;

export const CardViewContext: ReactSpectrumS2.CardViewContext = compatPlaceholder as ReactSpectrumS2.CardViewContext;

export type CardViewProps = ReactSpectrumS2.CardViewProps;

export const Cell: ReactSpectrumS2.Cell = compatPlaceholder as ReactSpectrumS2.Cell;

export type CellProps = ReactSpectrumS2.CellProps;

export const CheckboxContext: ReactSpectrumS2.CheckboxContext = compatPlaceholder as ReactSpectrumS2.CheckboxContext;

export const CheckboxGroup: ReactSpectrumS2.CheckboxGroup = compatPlaceholder as ReactSpectrumS2.CheckboxGroup;

export const CheckboxGroupContext: ReactSpectrumS2.CheckboxGroupContext = compatPlaceholder as ReactSpectrumS2.CheckboxGroupContext;

export type CheckboxGroupProps = ReactSpectrumS2.CheckboxGroupProps;

export type CheckboxProps = ReactSpectrumS2.CheckboxProps;

export const CloseButton: ReactSpectrumS2.CloseButton = compatPlaceholder as ReactSpectrumS2.CloseButton;

export type CloseButtonProps = ReactSpectrumS2.CloseButtonProps;

export const Collection: ReactSpectrumS2.Collection = compatPlaceholder as ReactSpectrumS2.Collection;

export const CollectionCardPreview: ReactSpectrumS2.CollectionCardPreview = compatPlaceholder as ReactSpectrumS2.CollectionCardPreview;

export type Color = ReactSpectrumS2.Color;

export const ColorArea: ReactSpectrumS2.ColorArea = compatPlaceholder as ReactSpectrumS2.ColorArea;

export const ColorAreaContext: ReactSpectrumS2.ColorAreaContext = compatPlaceholder as ReactSpectrumS2.ColorAreaContext;

export type ColorAreaProps = ReactSpectrumS2.ColorAreaProps;

export const ColorField: ReactSpectrumS2.ColorField = compatPlaceholder as ReactSpectrumS2.ColorField;

export const ColorFieldContext: ReactSpectrumS2.ColorFieldContext = compatPlaceholder as ReactSpectrumS2.ColorFieldContext;

export type ColorFieldProps = ReactSpectrumS2.ColorFieldProps;

export const ColorSchemeContext: ReactSpectrumS2.ColorSchemeContext = compatPlaceholder as ReactSpectrumS2.ColorSchemeContext;

export const ColorSlider: ReactSpectrumS2.ColorSlider = compatPlaceholder as ReactSpectrumS2.ColorSlider;

export const ColorSliderContext: ReactSpectrumS2.ColorSliderContext = compatPlaceholder as ReactSpectrumS2.ColorSliderContext;

export type ColorSliderProps = ReactSpectrumS2.ColorSliderProps;

export const ColorSwatch: ReactSpectrumS2.ColorSwatch = compatPlaceholder as ReactSpectrumS2.ColorSwatch;

export const ColorSwatchContext: ReactSpectrumS2.ColorSwatchContext = compatPlaceholder as ReactSpectrumS2.ColorSwatchContext;

export const ColorSwatchPicker: ReactSpectrumS2.ColorSwatchPicker = compatPlaceholder as ReactSpectrumS2.ColorSwatchPicker;

export const ColorSwatchPickerContext: ReactSpectrumS2.ColorSwatchPickerContext = compatPlaceholder as ReactSpectrumS2.ColorSwatchPickerContext;

export type ColorSwatchPickerProps = ReactSpectrumS2.ColorSwatchPickerProps;

export type ColorSwatchProps = ReactSpectrumS2.ColorSwatchProps;

export const ColorWheel: ReactSpectrumS2.ColorWheel = compatPlaceholder as ReactSpectrumS2.ColorWheel;

export const ColorWheelContext: ReactSpectrumS2.ColorWheelContext = compatPlaceholder as ReactSpectrumS2.ColorWheelContext;

export type ColorWheelProps = ReactSpectrumS2.ColorWheelProps;

export const Column: ReactSpectrumS2.Column = compatPlaceholder as ReactSpectrumS2.Column;

export type ColumnProps = ReactSpectrumS2.ColumnProps;

export const ComboBox: ReactSpectrumS2.ComboBox = compatPlaceholder as ReactSpectrumS2.ComboBox;

export const ComboBoxContext: ReactSpectrumS2.ComboBoxContext = compatPlaceholder as ReactSpectrumS2.ComboBoxContext;

export const ComboBoxItem: ReactSpectrumS2.ComboBoxItem = compatPlaceholder as ReactSpectrumS2.ComboBoxItem;

export type ComboBoxItemProps = ReactSpectrumS2.ComboBoxItemProps;

export type ComboBoxProps = ReactSpectrumS2.ComboBoxProps;

export const ComboBoxSection: ReactSpectrumS2.ComboBoxSection = compatPlaceholder as ReactSpectrumS2.ComboBoxSection;

export type ComboBoxSectionProps = ReactSpectrumS2.ComboBoxSectionProps;

export const Content: ReactSpectrumS2.Content = compatPlaceholder as ReactSpectrumS2.Content;

export const ContentContext: ReactSpectrumS2.ContentContext = compatPlaceholder as ReactSpectrumS2.ContentContext;

export const ContextualHelp: ReactSpectrumS2.ContextualHelp = compatPlaceholder as ReactSpectrumS2.ContextualHelp;

export const ContextualHelpContext: ReactSpectrumS2.ContextualHelpContext = compatPlaceholder as ReactSpectrumS2.ContextualHelpContext;

export const createIcon: (Component: ComponentType<SVGProps<SVGSVGElement>>, context?: Context<ContextValue<IconContextValue, SVGElement>>) => FunctionComponent<IconProps> = compatPlaceholder as (Component: ComponentType<SVGProps<SVGSVGElement>>, context?: Context<ContextValue<IconContextValue, SVGElement>>) => FunctionComponent<IconProps>;

export const createIllustration: (Component: ComponentType<SVGProps<SVGSVGElement>>) => FunctionComponent<IllustrationProps> = compatPlaceholder as (Component: ComponentType<SVGProps<SVGSVGElement>>) => FunctionComponent<IllustrationProps>;

export const CustomDialog: ReactSpectrumS2.CustomDialog = compatPlaceholder as ReactSpectrumS2.CustomDialog;

export type CustomDialogProps = ReactSpectrumS2.CustomDialogProps;

export const DateField: ReactSpectrumS2.DateField = compatPlaceholder as ReactSpectrumS2.DateField;

export const DateFieldContext: ReactSpectrumS2.DateFieldContext = compatPlaceholder as ReactSpectrumS2.DateFieldContext;

export type DateFieldProps = ReactSpectrumS2.DateFieldProps;

export const DatePicker: ReactSpectrumS2.DatePicker = compatPlaceholder as ReactSpectrumS2.DatePicker;

export const DatePickerContext: ReactSpectrumS2.DatePickerContext = compatPlaceholder as ReactSpectrumS2.DatePickerContext;

export type DatePickerProps = ReactSpectrumS2.DatePickerProps;

export const DateRangePicker: ReactSpectrumS2.DateRangePicker = compatPlaceholder as ReactSpectrumS2.DateRangePicker;

export const DateRangePickerContext: ReactSpectrumS2.DateRangePickerContext = compatPlaceholder as ReactSpectrumS2.DateRangePickerContext;

export type DateRangePickerProps = ReactSpectrumS2.DateRangePickerProps;

export const DialogContainer: ReactSpectrumS2.DialogContainer = compatPlaceholder as ReactSpectrumS2.DialogContainer;

export type DialogContainerProps = ReactSpectrumS2.DialogContainerProps;

export type DialogContainerValue = ReactSpectrumS2.DialogContainerValue;

export type DialogProps = ReactSpectrumS2.DialogProps;

export const DialogTrigger: ReactSpectrumS2.DialogTrigger = compatPlaceholder as ReactSpectrumS2.DialogTrigger;

export type DialogTriggerProps = ReactSpectrumS2.DialogTriggerProps;

export const Disclosure: ReactSpectrumS2.Disclosure = compatPlaceholder as ReactSpectrumS2.Disclosure;

export const DisclosureContext: ReactSpectrumS2.DisclosureContext = compatPlaceholder as ReactSpectrumS2.DisclosureContext;

export const DisclosureHeader: ReactSpectrumS2.DisclosureHeader = compatPlaceholder as ReactSpectrumS2.DisclosureHeader;

export const DisclosurePanel: ReactSpectrumS2.DisclosurePanel = compatPlaceholder as ReactSpectrumS2.DisclosurePanel;

export type DisclosurePanelProps = ReactSpectrumS2.DisclosurePanelProps;

export type DisclosureProps = ReactSpectrumS2.DisclosureProps;

export const DisclosureTitle: ReactSpectrumS2.DisclosureTitle = compatPlaceholder as ReactSpectrumS2.DisclosureTitle;

export const Divider: ReactSpectrumS2.Divider = compatPlaceholder as ReactSpectrumS2.Divider;

export const DividerContext: ReactSpectrumS2.DividerContext = compatPlaceholder as ReactSpectrumS2.DividerContext;

export type DividerProps = ReactSpectrumS2.DividerProps;

export const DropZone: ReactSpectrumS2.DropZone = compatPlaceholder as ReactSpectrumS2.DropZone;

export const DropZoneContext: ReactSpectrumS2.DropZoneContext = compatPlaceholder as ReactSpectrumS2.DropZoneContext;

export type DropZoneProps = ReactSpectrumS2.DropZoneProps;

export const EditableCell: ReactSpectrumS2.EditableCell = compatPlaceholder as ReactSpectrumS2.EditableCell;

export const FileTrigger: ReactSpectrumS2.FileTrigger = compatPlaceholder as ReactSpectrumS2.FileTrigger;

export type FileTriggerProps = ReactSpectrumS2.FileTriggerProps;

export const Footer: ReactSpectrumS2.Footer = compatPlaceholder as ReactSpectrumS2.Footer;

export const FooterContext: ReactSpectrumS2.FooterContext = compatPlaceholder as ReactSpectrumS2.FooterContext;

export const Form: ReactSpectrumS2.Form = compatPlaceholder as ReactSpectrumS2.Form;

export type FormProps = ReactSpectrumS2.FormProps;

export const FullscreenDialog: ReactSpectrumS2.FullscreenDialog = compatPlaceholder as ReactSpectrumS2.FullscreenDialog;

export type FullscreenDialogProps = ReactSpectrumS2.FullscreenDialogProps;

export const Header: ReactSpectrumS2.Header = compatPlaceholder as ReactSpectrumS2.Header;

export const HeaderContext: ReactSpectrumS2.HeaderContext = compatPlaceholder as ReactSpectrumS2.HeaderContext;

export const Heading: ReactSpectrumS2.Heading = compatPlaceholder as ReactSpectrumS2.Heading;

export const HeadingContext: ReactSpectrumS2.HeadingContext = compatPlaceholder as ReactSpectrumS2.HeadingContext;

export const IconContext: ReactSpectrumS2.IconContext = compatPlaceholder as ReactSpectrumS2.IconContext;

export type IconContextValue = ReactSpectrumS2.IconContextValue;

export type IconProps = ReactSpectrumS2.IconProps;

export const IllustratedMessage: ReactSpectrumS2.IllustratedMessage = compatPlaceholder as ReactSpectrumS2.IllustratedMessage;

export const IllustratedMessageContext: ReactSpectrumS2.IllustratedMessageContext = compatPlaceholder as ReactSpectrumS2.IllustratedMessageContext;

export const IllustrationContext: ReactSpectrumS2.IllustrationContext = compatPlaceholder as ReactSpectrumS2.IllustrationContext;

export type IllustrationContextValue = ReactSpectrumS2.IllustrationContextValue;

export type IllustrationProps = ReactSpectrumS2.IllustrationProps;

export const Image: ReactSpectrumS2.Image = compatPlaceholder as ReactSpectrumS2.Image;

export const ImageContext: ReactSpectrumS2.ImageContext = compatPlaceholder as ReactSpectrumS2.ImageContext;

export const ImageCoordinator: ReactSpectrumS2.ImageCoordinator = compatPlaceholder as ReactSpectrumS2.ImageCoordinator;

export type ImageCoordinatorProps = ReactSpectrumS2.ImageCoordinatorProps;

export type ImageProps = ReactSpectrumS2.ImageProps;

export const InlineAlert: ReactSpectrumS2.InlineAlert = compatPlaceholder as ReactSpectrumS2.InlineAlert;

export const InlineAlertContext: ReactSpectrumS2.InlineAlertContext = compatPlaceholder as ReactSpectrumS2.InlineAlertContext;

export type InlineAlertProps = ReactSpectrumS2.InlineAlertProps;

export type Key = ReactSpectrumS2.Key;

export const Keyboard: ReactSpectrumS2.Keyboard = compatPlaceholder as ReactSpectrumS2.Keyboard;

export const KeyboardContext: ReactSpectrumS2.KeyboardContext = compatPlaceholder as ReactSpectrumS2.KeyboardContext;

export const Link: ReactSpectrumS2.Link = compatPlaceholder as ReactSpectrumS2.Link;

export const LinkButton: ReactSpectrumS2.LinkButton = compatPlaceholder as ReactSpectrumS2.LinkButton;

export const LinkButtonContext: ReactSpectrumS2.LinkButtonContext = compatPlaceholder as ReactSpectrumS2.LinkButtonContext;

export type LinkButtonProps = ReactSpectrumS2.LinkButtonProps;

export const LinkContext: ReactSpectrumS2.LinkContext = compatPlaceholder as ReactSpectrumS2.LinkContext;

export type LinkProps = ReactSpectrumS2.LinkProps;

export type ListData = ReactSpectrumS2.ListData;

export const Menu: ReactSpectrumS2.Menu = compatPlaceholder as ReactSpectrumS2.Menu;

export const MenuContext: ReactSpectrumS2.MenuContext = compatPlaceholder as ReactSpectrumS2.MenuContext;

export const MenuItem: ReactSpectrumS2.MenuItem = compatPlaceholder as ReactSpectrumS2.MenuItem;

export type MenuItemProps = ReactSpectrumS2.MenuItemProps;

export type MenuProps = ReactSpectrumS2.MenuProps;

export const MenuSection: ReactSpectrumS2.MenuSection = compatPlaceholder as ReactSpectrumS2.MenuSection;

export type MenuSectionProps = ReactSpectrumS2.MenuSectionProps;

export const MenuTrigger: ReactSpectrumS2.MenuTrigger = compatPlaceholder as ReactSpectrumS2.MenuTrigger;

export type MenuTriggerProps = ReactSpectrumS2.MenuTriggerProps;

export const Meter: ReactSpectrumS2.Meter = compatPlaceholder as ReactSpectrumS2.Meter;

export const MeterContext: ReactSpectrumS2.MeterContext = compatPlaceholder as ReactSpectrumS2.MeterContext;

export type MeterProps = ReactSpectrumS2.MeterProps;

export const NotificationBadge: ReactSpectrumS2.NotificationBadge = compatPlaceholder as ReactSpectrumS2.NotificationBadge;

export const NotificationBadgeContext: ReactSpectrumS2.NotificationBadgeContext = compatPlaceholder as ReactSpectrumS2.NotificationBadgeContext;

export type NotificationBadgeProps = ReactSpectrumS2.NotificationBadgeProps;

export const NumberField: ReactSpectrumS2.NumberField = compatPlaceholder as ReactSpectrumS2.NumberField;

export const NumberFieldContext: ReactSpectrumS2.NumberFieldContext = compatPlaceholder as ReactSpectrumS2.NumberFieldContext;

export function parseColor(value: string): IColor {
  return compatPlaceholder(value);
}

export const Picker: ReactSpectrumS2.Picker = compatPlaceholder as ReactSpectrumS2.Picker;

export const PickerContext: ReactSpectrumS2.PickerContext = compatPlaceholder as ReactSpectrumS2.PickerContext;

export const PickerItem: ReactSpectrumS2.PickerItem = compatPlaceholder as ReactSpectrumS2.PickerItem;

export type PickerItemProps = ReactSpectrumS2.PickerItemProps;

export type PickerProps = ReactSpectrumS2.PickerProps;

export const PickerSection: ReactSpectrumS2.PickerSection = compatPlaceholder as ReactSpectrumS2.PickerSection;

export type PickerSectionProps = ReactSpectrumS2.PickerSectionProps;

export type PopoverProps = ReactSpectrumS2.PopoverProps;

export function pressScale<R extends {isPressed: boolean}>(ref: RefObject<HTMLElement | null>, style?: CSSProperties | ((renderProps: R) => CSSProperties)): (renderProps: R) => CSSProperties {
  return compatPlaceholder(ref, style);
}

export const ProductCard: ReactSpectrumS2.ProductCard = compatPlaceholder as ReactSpectrumS2.ProductCard;

export type ProductCardProps = ReactSpectrumS2.ProductCardProps;

export const ProgressBar: ReactSpectrumS2.ProgressBar = compatPlaceholder as ReactSpectrumS2.ProgressBar;

export const ProgressBarContext: ReactSpectrumS2.ProgressBarContext = compatPlaceholder as ReactSpectrumS2.ProgressBarContext;

export type ProgressBarProps = ReactSpectrumS2.ProgressBarProps;

export const ProgressCircle: ReactSpectrumS2.ProgressCircle = compatPlaceholder as ReactSpectrumS2.ProgressCircle;

export const ProgressCircleContext: ReactSpectrumS2.ProgressCircleContext = compatPlaceholder as ReactSpectrumS2.ProgressCircleContext;

export type ProgressCircleProps = ReactSpectrumS2.ProgressCircleProps;

export type ProviderProps = ReactSpectrumS2.ProviderProps;

export const RadioGroupContext: ReactSpectrumS2.RadioGroupContext = compatPlaceholder as ReactSpectrumS2.RadioGroupContext;

export type RadioGroupProps = ReactSpectrumS2.RadioGroupProps;

export type RadioProps = ReactSpectrumS2.RadioProps;

export const RangeCalendar: ReactSpectrumS2.RangeCalendar = compatPlaceholder as ReactSpectrumS2.RangeCalendar;

export const RangeCalendarContext: ReactSpectrumS2.RangeCalendarContext = compatPlaceholder as ReactSpectrumS2.RangeCalendarContext;

export type RangeCalendarProps = ReactSpectrumS2.RangeCalendarProps;

export const RangeSlider: ReactSpectrumS2.RangeSlider = compatPlaceholder as ReactSpectrumS2.RangeSlider;

export const RangeSliderContext: ReactSpectrumS2.RangeSliderContext = compatPlaceholder as ReactSpectrumS2.RangeSliderContext;

export type RangeSliderProps = ReactSpectrumS2.RangeSliderProps;

export type RouterConfig = ReactSpectrumS2.RouterConfig;

export const Row: ReactSpectrumS2.Row = compatPlaceholder as ReactSpectrumS2.Row;

export type RowProps = ReactSpectrumS2.RowProps;

export const SearchField: ReactSpectrumS2.SearchField = compatPlaceholder as ReactSpectrumS2.SearchField;

export const SearchFieldContext: ReactSpectrumS2.SearchFieldContext = compatPlaceholder as ReactSpectrumS2.SearchFieldContext;

export type SearchFieldProps = ReactSpectrumS2.SearchFieldProps;

export const SegmentedControl: ReactSpectrumS2.SegmentedControl = compatPlaceholder as ReactSpectrumS2.SegmentedControl;

export const SegmentedControlContext: ReactSpectrumS2.SegmentedControlContext = compatPlaceholder as ReactSpectrumS2.SegmentedControlContext;

export const SegmentedControlItem: ReactSpectrumS2.SegmentedControlItem = compatPlaceholder as ReactSpectrumS2.SegmentedControlItem;

export type SegmentedControlItemProps = ReactSpectrumS2.SegmentedControlItemProps;

export type SegmentedControlProps = ReactSpectrumS2.SegmentedControlProps;

export const SelectBox: ReactSpectrumS2.SelectBox = compatPlaceholder as ReactSpectrumS2.SelectBox;

export const SelectBoxGroup: ReactSpectrumS2.SelectBoxGroup = compatPlaceholder as ReactSpectrumS2.SelectBoxGroup;

export const SelectBoxGroupContext: ReactSpectrumS2.SelectBoxGroupContext = compatPlaceholder as ReactSpectrumS2.SelectBoxGroupContext;

export type SelectBoxGroupProps = ReactSpectrumS2.SelectBoxGroupProps;

export type SelectBoxProps = ReactSpectrumS2.SelectBoxProps;

export type Selection = ReactSpectrumS2.Selection;

export const Skeleton: ReactSpectrumS2.Skeleton = compatPlaceholder as ReactSpectrumS2.Skeleton;

export const SkeletonCollection: ReactSpectrumS2.SkeletonCollection = compatPlaceholder as ReactSpectrumS2.SkeletonCollection;

export type SkeletonCollectionProps = ReactSpectrumS2.SkeletonCollectionProps;

export type SkeletonProps = ReactSpectrumS2.SkeletonProps;

export const Slider: ReactSpectrumS2.Slider = compatPlaceholder as ReactSpectrumS2.Slider;

export const SliderContext: ReactSpectrumS2.SliderContext = compatPlaceholder as ReactSpectrumS2.SliderContext;

export type SliderProps = ReactSpectrumS2.SliderProps;

export type SortDescriptor = ReactSpectrumS2.SortDescriptor;

export const StatusLight: ReactSpectrumS2.StatusLight = compatPlaceholder as ReactSpectrumS2.StatusLight;

export const StatusLightContext: ReactSpectrumS2.StatusLightContext = compatPlaceholder as ReactSpectrumS2.StatusLightContext;

export type StatusLightProps = ReactSpectrumS2.StatusLightProps;

export const SubmenuTrigger: ReactSpectrumS2.SubmenuTrigger = compatPlaceholder as ReactSpectrumS2.SubmenuTrigger;

export type SubmenuTriggerProps = ReactSpectrumS2.SubmenuTriggerProps;

export const SwitchContext: ReactSpectrumS2.SwitchContext = compatPlaceholder as ReactSpectrumS2.SwitchContext;

export type SwitchProps = ReactSpectrumS2.SwitchProps;

export const Tab: ReactSpectrumS2.Tab = compatPlaceholder as ReactSpectrumS2.Tab;

export const TableBody: ReactSpectrumS2.TableBody = compatPlaceholder as ReactSpectrumS2.TableBody;

export type TableBodyProps = ReactSpectrumS2.TableBodyProps;

export const TableContext: ReactSpectrumS2.TableContext = compatPlaceholder as ReactSpectrumS2.TableContext;

export const TableHeader: ReactSpectrumS2.TableHeader = compatPlaceholder as ReactSpectrumS2.TableHeader;

export type TableHeaderProps = ReactSpectrumS2.TableHeaderProps;

export type TableViewProps = ReactSpectrumS2.TableViewProps;

export const TabList: ReactSpectrumS2.TabList = compatPlaceholder as ReactSpectrumS2.TabList;

export type TabListProps = ReactSpectrumS2.TabListProps;

export const TabPanel: ReactSpectrumS2.TabPanel = compatPlaceholder as ReactSpectrumS2.TabPanel;

export type TabPanelProps = ReactSpectrumS2.TabPanelProps;

export type TabProps = ReactSpectrumS2.TabProps;

export const Tabs: ReactSpectrumS2.Tabs = compatPlaceholder as ReactSpectrumS2.Tabs;

export const TabsContext: ReactSpectrumS2.TabsContext = compatPlaceholder as ReactSpectrumS2.TabsContext;

export type TabsProps = ReactSpectrumS2.TabsProps;

export const Tag: ReactSpectrumS2.Tag = compatPlaceholder as ReactSpectrumS2.Tag;

export const TagGroup: ReactSpectrumS2.TagGroup = compatPlaceholder as ReactSpectrumS2.TagGroup;

export const TagGroupContext: ReactSpectrumS2.TagGroupContext = compatPlaceholder as ReactSpectrumS2.TagGroupContext;

export type TagGroupProps = ReactSpectrumS2.TagGroupProps;

export type TagProps = ReactSpectrumS2.TagProps;

export const Text: ReactSpectrumS2.Text = compatPlaceholder as ReactSpectrumS2.Text;

export const TextArea: ReactSpectrumS2.TextArea = compatPlaceholder as ReactSpectrumS2.TextArea;

export const TextAreaContext: ReactSpectrumS2.TextAreaContext = compatPlaceholder as ReactSpectrumS2.TextAreaContext;

export type TextAreaProps = ReactSpectrumS2.TextAreaProps;

export const TextContext: ReactSpectrumS2.TextContext = compatPlaceholder as ReactSpectrumS2.TextContext;

export const TextFieldContext: ReactSpectrumS2.TextFieldContext = compatPlaceholder as ReactSpectrumS2.TextFieldContext;

export type TextFieldProps = ReactSpectrumS2.TextFieldProps;

export const TimeField: ReactSpectrumS2.TimeField = compatPlaceholder as ReactSpectrumS2.TimeField;

export const TimeFieldContext: ReactSpectrumS2.TimeFieldContext = compatPlaceholder as ReactSpectrumS2.TimeFieldContext;

export type TimeFieldProps = ReactSpectrumS2.TimeFieldProps;

export const ToastContainer: ReactSpectrumS2.ToastContainer = compatPlaceholder as ReactSpectrumS2.ToastContainer;

export type ToastContainerProps = ReactSpectrumS2.ToastContainerProps;

export type ToastOptions = ReactSpectrumS2.ToastOptions;

export const ToastQueue: ReactSpectrumS2.ToastQueue = compatPlaceholder as ReactSpectrumS2.ToastQueue;

export const ToggleButton: ReactSpectrumS2.ToggleButton = compatPlaceholder as ReactSpectrumS2.ToggleButton;

export const ToggleButtonContext: ReactSpectrumS2.ToggleButtonContext = compatPlaceholder as ReactSpectrumS2.ToggleButtonContext;

export const ToggleButtonGroup: ReactSpectrumS2.ToggleButtonGroup = compatPlaceholder as ReactSpectrumS2.ToggleButtonGroup;

export const ToggleButtonGroupContext: ReactSpectrumS2.ToggleButtonGroupContext = compatPlaceholder as ReactSpectrumS2.ToggleButtonGroupContext;

export type ToggleButtonGroupProps = ReactSpectrumS2.ToggleButtonGroupProps;

export type ToggleButtonProps = ReactSpectrumS2.ToggleButtonProps;

export const Tooltip: ReactSpectrumS2.Tooltip = compatPlaceholder as ReactSpectrumS2.Tooltip;

export type TooltipProps = ReactSpectrumS2.TooltipProps;

export const TooltipTrigger: ReactSpectrumS2.TooltipTrigger = compatPlaceholder as ReactSpectrumS2.TooltipTrigger;

export type TooltipTriggerProps = ReactSpectrumS2.TooltipTriggerProps;

export type TreeData = ReactSpectrumS2.TreeData;

export const TreeViewItem: ReactSpectrumS2.TreeViewItem = compatPlaceholder as ReactSpectrumS2.TreeViewItem;

export const TreeViewItemContent: ReactSpectrumS2.TreeViewItemContent = compatPlaceholder as ReactSpectrumS2.TreeViewItemContent;

export type TreeViewItemContentProps = ReactSpectrumS2.TreeViewItemContentProps;

export type TreeViewItemProps = ReactSpectrumS2.TreeViewItemProps;

export const TreeViewLoadMoreItem: ReactSpectrumS2.TreeViewLoadMoreItem = compatPlaceholder as ReactSpectrumS2.TreeViewLoadMoreItem;

export type TreeViewLoadMoreItemProps = ReactSpectrumS2.TreeViewLoadMoreItemProps;

export type TreeViewProps = ReactSpectrumS2.TreeViewProps;

export const useAsyncList: <T, C = string>(options: AsyncListOptions<T, C>) => AsyncListData<T> = compatPlaceholder as <T, C = string>(options: AsyncListOptions<T, C>) => AsyncListData<T>;

export const useDialogContainer: () => DialogContainerValue = compatPlaceholder as () => DialogContainerValue;

export const useIsSkeleton: () => boolean = compatPlaceholder as () => boolean;

export const useListData: <T>(options: ListOptions<T>) => ListData<T> = compatPlaceholder as <T>(options: ListOptions<T>) => ListData<T>;

export const useLocale: () => Locale = compatPlaceholder as () => Locale;

export const UserCard: ReactSpectrumS2.UserCard = compatPlaceholder as ReactSpectrumS2.UserCard;

export type UserCardProps = ReactSpectrumS2.UserCardProps;

export const useTreeData: <T extends object>(options: TreeOptions<T>) => TreeData<T> = compatPlaceholder as <T extends object>(options: TreeOptions<T>) => TreeData<T>;
