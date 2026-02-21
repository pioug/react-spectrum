import {type AriaGridOptions, type GridAria, type GridElementProps, type GridProps, useGrid as useGridInternal} from './useGrid';
import {type AriaGridSelectionCheckboxProps, type GridSelectionCheckboxAria, useGridSelectionCheckbox as useGridSelectionCheckboxInternal} from './useGridSelectionCheckbox';
import {type GridCellAria, type GridCellProps, useGridCell as useGridCellInternal} from './useGridCell';
import type {GridCellNode, GridKey, GridRowNode, GridSelectionBehavior, GridSelectionMode, MaybeRef, GridCollection as VueGridCollection} from './types';
import {GridKeyboardDelegate} from './GridKeyboardDelegate';
import {type GridRowAria, type GridRowProps, useGridRow as useGridRowInternal} from './useGridRow';
import {type GridRowGroupAria, useGridRowGroup} from './useGridRowGroup';
import {
  type GridSelectionAnnouncementAria,
  type GridSelectionAnnouncementProps,
  type GridSelectionAnnouncementState,
  useGridSelectionAnnouncement as useGridSelectionAnnouncementInternal
} from './useGridSelectionAnnouncement';
import type {GridState} from '@vue-stately/grid';
import {type HighlightSelectionDescriptionAria, type HighlightSelectionDescriptionProps, useHighlightSelectionDescription as useHighlightSelectionDescriptionInternal} from './useHighlightSelectionDescription';

type RefObject<T> = {
  current: T
};

type FocusableElement = Element;
type AriaLabelingProps = Record<string, unknown>;
type GridCollection<T> = VueGridCollection & {
  _itemType?: T
};
type GridSelectionState<T> = GridSelectionAnnouncementState & {
  selectedKeys?: Set<GridKey>,
  _itemType?: T
};

export {GridKeyboardDelegate};
export type {GridKeyboardDelegateOptions} from './GridKeyboardDelegate';
export {useGridRowGroup};
export type {
  AriaGridOptions,
  GridAria,
  GridElementProps,
  GridProps,
  GridCellAria,
  GridCellProps,
  GridRowAria,
  GridRowProps,
  GridRowGroupAria,
  GridSelectionAnnouncementAria,
  GridSelectionAnnouncementProps,
  GridSelectionAnnouncementState,
  AriaGridSelectionCheckboxProps,
  GridSelectionCheckboxAria,
  HighlightSelectionDescriptionAria,
  HighlightSelectionDescriptionProps,
  GridCellNode,
  VueGridCollection as GridCollection,
  GridKey,
  GridRowNode,
  GridSelectionBehavior,
  GridSelectionMode,
  MaybeRef
};

export function useGrid<T>(
  props: GridProps,
  state: GridState<T, GridCollection<T>>,
  ref: RefObject<HTMLElement | null>
): GridAria;
export function useGrid(options: AriaGridOptions): GridAria;
export function useGrid(options: AriaGridOptions): GridAria {
  return useGridInternal(options);
}

export function useGridRow<T, C extends GridCollection<T>, S extends GridState<T, C>>(
  props: GridRowProps<T>,
  state: S,
  ref: RefObject<FocusableElement | null>
): GridRowAria;
export function useGridRow(props: GridRowProps): GridRowAria;
export function useGridRow(props: GridRowProps): GridRowAria {
  return useGridRowInternal(props);
}

export function useGridCell<T, C extends GridCollection<T>>(
  props: GridCellProps,
  state: GridState<T, C>,
  ref: RefObject<FocusableElement | null>
): GridCellAria;
export function useGridCell(props: GridCellProps): GridCellAria;
export function useGridCell(props: GridCellProps): GridCellAria {
  return useGridCellInternal(props);
}

export function useGridSelectionCheckbox<T, C extends GridCollection<T>>(
  props: AriaGridSelectionCheckboxProps,
  state: GridState<T, C>
): GridSelectionCheckboxAria;
export function useGridSelectionCheckbox(props: AriaGridSelectionCheckboxProps): GridSelectionCheckboxAria;
export function useGridSelectionCheckbox(props: AriaGridSelectionCheckboxProps): GridSelectionCheckboxAria {
  return useGridSelectionCheckboxInternal(props);
}

export function useHighlightSelectionDescription(props: HighlightSelectionDescriptionProps): AriaLabelingProps;
export function useHighlightSelectionDescription(props: HighlightSelectionDescriptionProps): HighlightSelectionDescriptionAria;
export function useHighlightSelectionDescription(props: HighlightSelectionDescriptionProps): HighlightSelectionDescriptionAria {
  return useHighlightSelectionDescriptionInternal(props);
}

export function useGridSelectionAnnouncement<T>(
  props: GridSelectionAnnouncementProps,
  state: GridSelectionState<T>
): void;
export function useGridSelectionAnnouncement(
  props: GridSelectionAnnouncementProps,
  state: GridSelectionAnnouncementState
): GridSelectionAnnouncementAria;
export function useGridSelectionAnnouncement(
  props: GridSelectionAnnouncementProps,
  state: GridSelectionAnnouncementState
): GridSelectionAnnouncementAria {
  return useGridSelectionAnnouncementInternal(props, state);
}
