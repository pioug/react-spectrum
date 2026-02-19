import {computed, defineComponent, ref} from 'vue';

type AnyRecord = Record<string, unknown>;

type NoopFunction = (...args: unknown[]) => void;

const noop: NoopFunction = () => {};

function passthroughComponent(name: string) {
  return defineComponent({
    name,
    setup(_, {slots}) {
      return () => slots.default ? slots.default() : null;
    }
  });
}

export type Key = string | number;
export type DateValue = string | number | Date;
export type TimeValue = string | number | Date;
export type RangeValue<T> = {
  start: T,
  end: T
};
export type Orientation = 'horizontal' | 'vertical';
export type Placement = string;
export type PlacementAxis = 'main' | 'cross';
export type PositionProps = AnyRecord;

export type AriaBreadcrumbItemProps = AnyRecord;
export type AriaBreadcrumbsProps = AnyRecord;
export type AriaButtonProps = AnyRecord;
export type AriaCalendarCellProps = AnyRecord;
export type AriaCalendarGridProps = AnyRecord;
export type AriaCalendarProps = AnyRecord;
export type CalendarProps<T = DateValue> = AnyRecord & {value?: T};
export type AriaCheckboxGroupItemProps = AnyRecord;
export type AriaCheckboxGroupProps = AnyRecord;
export type AriaCheckboxProps = AnyRecord;
export type AriaColorAreaProps = AnyRecord;
export type AriaColorChannelFieldProps = AnyRecord;
export type AriaColorFieldProps = AnyRecord;
export type AriaColorSliderProps = AnyRecord;
export type AriaColorSwatchProps = AnyRecord;
export type AriaComboBoxProps = AnyRecord;
export type AriaDateFieldProps = AnyRecord;
export type AriaDatePickerProps = AnyRecord;
export type AriaDateRangePickerProps = AnyRecord;
export type AriaDialogProps = AnyRecord;
export type AriaDisclosureProps = AnyRecord;
export type AriaHiddenSelectProps = AnyRecord;
export type AriaListBoxProps = AnyRecord;
export type AriaMenuProps = AnyRecord;
export type AriaMeterProps = AnyRecord;
export type AriaModalOverlayProps = AnyRecord;
export type AriaNumberFieldProps = AnyRecord;
export type AriaOverlayProps = AnyRecord;
export type AriaPopoverProps = AnyRecord;
export type AriaPositionProps = AnyRecord;
export type AriaProgressBarProps = AnyRecord;
export type AriaRadioGroupProps = AnyRecord;
export type AriaRadioProps = AnyRecord;
export type AriaRangeCalendarProps = AnyRecord;
export type RangeCalendarProps<T = DateValue> = AnyRecord & {value?: RangeValue<T>};
export type AriaSearchFieldProps = AnyRecord;
export type AriaSelectProps = AnyRecord;
export type AriaSliderProps = AnyRecord;
export type AriaSliderThumbProps = AnyRecord;
export type AriaSwitchProps = AnyRecord;
export type AriaTabListProps = AnyRecord;
export type AriaTabPanelProps = AnyRecord;
export type AriaTabProps = AnyRecord;
export type AriaTableProps = AnyRecord;
export type AriaTableSelectionCheckboxProps = AnyRecord;
export type AriaTagGroupProps = AnyRecord;
export type AriaTagProps = AnyRecord;
export type AriaTextFieldProps = AnyRecord;
export type AriaTimeFieldProps = AnyRecord;
export type AriaToastProps = AnyRecord;
export type AriaToastRegionProps = AnyRecord;
export type AriaToggleButtonGroupProps = AnyRecord;
export type AriaToggleButtonProps = AnyRecord;
export type AriaTooltipProps = AnyRecord;
export type AriaTreeProps = AnyRecord;
export type DateSegmentAria = AnyRecord;
export type DismissButtonProps = AnyRecord;
export type FocusScopeProps = AnyRecord;
export type ModalProviderAria = AnyRecord;
export type ModalProviderProps = AnyRecord;
export type HiddenSelectProps = AnyRecord;
export type OverlayContainerProps = AnyRecord;
export type OverlayProps = AnyRecord;
export type OverlayTriggerProps = AnyRecord;
export type PressEvents = AnyRecord;
export type SeparatorProps = AnyRecord;
export type TooltipTriggerProps = AnyRecord;
export type TreeProps<T = unknown> = AnyRecord & {items?: T[]};
export type VisuallyHiddenProps = AnyRecord;
export type ClipboardProps = AnyRecord;
export type ClipboardResult = AnyRecord;
export type DirectoryDropItem = AnyRecord;
export type DragEndEvent = AnyRecord;
export type DragMoveEvent = AnyRecord;
export type DragOptions = AnyRecord;
export type DragPreviewProps = AnyRecord;
export type DragPreviewRenderer = AnyRecord;
export type DragResult = AnyRecord;
export type DragStartEvent = AnyRecord;
export type DragTypes = AnyRecord;
export type DraggableCollectionEndEvent = AnyRecord;
export type DraggableCollectionMoveEvent = AnyRecord;
export type DraggableCollectionOptions = AnyRecord;
export type DraggableCollectionStartEvent = AnyRecord;
export type DraggableItemProps = AnyRecord;
export type DraggableItemResult = AnyRecord;
export type DropEnterEvent = AnyRecord;
export type DropEvent = AnyRecord;
export type DropExitEvent = AnyRecord;
export type DropIndicatorAria = AnyRecord;
export type DropIndicatorProps = AnyRecord;
export type DropItem = AnyRecord;
export type DropMoveEvent = AnyRecord;
export type DropOptions = AnyRecord;
export type DropPosition = AnyRecord;
export type DropResult = AnyRecord;
export type DropTarget = AnyRecord;
export type DropTargetDelegate = AnyRecord;
export type DroppableCollectionDropEvent = AnyRecord;
export type DroppableCollectionEnterEvent = AnyRecord;
export type DroppableCollectionExitEvent = AnyRecord;
export type DroppableCollectionInsertDropEvent = AnyRecord;
export type DroppableCollectionMoveEvent = AnyRecord;
export type DroppableCollectionOnItemDropEvent = AnyRecord;
export type DroppableCollectionOptions = AnyRecord;
export type DroppableCollectionReorderEvent = AnyRecord;
export type DroppableCollectionResult = AnyRecord;
export type DroppableCollectionRootDropEvent = AnyRecord;
export type DroppableItemOptions = AnyRecord;
export type DroppableItemResult = AnyRecord;
export type FileDropItem = AnyRecord;
export type FocusEvents = AnyRecord;
export type FocusManager = {
  focusNext: () => void,
  focusPrevious: () => void,
  focusFirst: () => void,
  focusLast: () => void
};
export type FocusManagerOptions = AnyRecord;
export type HoverEvents = AnyRecord;
export type ItemDropTarget = AnyRecord;
export type KeyboardEvents = AnyRecord;
export type ListDropTargetDelegate = AnyRecord;
export type MoveEvent = AnyRecord;
export type RootDropTarget = AnyRecord;
export type TextDropItem = AnyRecord;

export const DIRECTORY_DRAG_TYPE = 'application/x-directory';

export const DismissButton = passthroughComponent('VueAriaDismissButton');
export const DragPreview = passthroughComponent('VueAriaDragPreview');
export const FocusRing = passthroughComponent('VueAriaFocusRing');
export const FocusScope = passthroughComponent('VueAriaFocusScope');
export const HiddenSelect = passthroughComponent('VueAriaHiddenSelect');
export const ModalProvider = passthroughComponent('VueAriaModalProvider');
export const Overlay = passthroughComponent('VueAriaOverlay');
export const OverlayContainer = passthroughComponent('VueAriaOverlayContainer');
export const OverlayProvider = passthroughComponent('VueAriaOverlayProvider');
export const UNSAFE_PortalProvider = passthroughComponent('VueAriaPortalProvider');
export const VisuallyHidden = passthroughComponent('VueAriaVisuallyHidden');

export function useFocusManager(): FocusManager {
  return {
    focusNext: noop,
    focusPrevious: noop,
    focusFirst: noop,
    focusLast: noop
  };
}

export function useDateSegment(props: AnyRecord = {}) {
  return {
    segmentProps: computed(() => props)
  };
}

export function useClipboard(): ClipboardResult {
  return {
    clipboardProps: {}
  };
}

export function useDraggableCollection() {
  return {
    collectionProps: {}
  };
}

export function useDraggableItem() {
  return {
    draggableItemProps: {}
  };
}

export function useDropIndicator() {
  return {
    dropIndicatorProps: {}
  };
}

export function useDroppableCollection() {
  return {
    collectionProps: {}
  };
}

export function useDroppableItem() {
  return {
    droppableItemProps: {}
  };
}

export function useModalProvider() {
  let parent = ref<unknown>(null);
  return {
    modalProviderProps: {},
    parent
  };
}

export function useUNSAFE_PortalContext() {
  return {
    getContainer: () => null
  };
}

export function isDirectoryDropItem(item: unknown): item is DirectoryDropItem {
  return Boolean(item) && typeof item === 'object' && 'kind' in (item as AnyRecord);
}

export function isFileDropItem(item: unknown): item is FileDropItem {
  return Boolean(item) && typeof item === 'object' && 'name' in (item as AnyRecord);
}

export function isTextDropItem(item: unknown): item is TextDropItem {
  return Boolean(item) && typeof item === 'object' && 'text' in (item as AnyRecord);
}
