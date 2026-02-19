/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  useCalendarState as useCalendarStateInternal,
  useRangeCalendarState as useRangeCalendarStateInternal,
  type CalendarState,
  type CalendarStateOptions,
  type RangeCalendarState,
  type RangeCalendarStateOptions
} from '@vue-stately/calendar';
import {useCheckboxGroupState as useCheckboxGroupStateInternal, type CheckboxGroupProps, type CheckboxGroupState} from '@vue-stately/checkbox';
import {
  parseColor as parseColorInternal,
  useColorFieldState as useColorFieldStateInternal,
  useColorWheelState as useColorWheelStateInternal,
  type Color,
  type ColorFieldProps,
  type ColorFieldState,
  type ColorWheelProps,
  type ColorWheelState
} from '@vue-stately/color';
import {useComboBoxState as useComboBoxStateInternal, type ComboBoxState, type ComboBoxStateOptions} from '@vue-stately/combobox';
import {
  useDraggableCollectionState as useDraggableCollectionStateInternal,
  type DraggableCollectionState,
  type DraggableCollectionStateOptions
} from '@vue-stately/dnd';
import {useRadioGroupState as useRadioGroupStateInternal, type RadioGroupProps, type RadioGroupState} from '@vue-stately/radio';
import {useSearchFieldState as useSearchFieldStateInternal, type SearchFieldProps, type SearchFieldState} from '@vue-stately/searchfield';
import {useSelectState as useSelectStateInternal, type SelectState, type SelectStateOptions} from '@vue-stately/select';
import {
  useTableColumnResizeState as useTableColumnResizeStateInternal,
  useTableState as useTableStateInternal,
  type TableColumnResizeState,
  type TableColumnResizeStateProps,
  type TableState,
  type TableStateProps
} from '@vue-stately/table';
import {useTreeState as useTreeStateInternal, type TreeProps, type TreeState} from '@vue-stately/tree';

type DateValue = string | number | Date;
type IColor = Color;
type SelectionMode = 'single' | 'multiple';

export * from '@vue-stately/autocomplete';
export * from '@vue-stately/calendar';
export * from '@vue-stately/checkbox';
export {
  CollectionBuilder,
  CollectionBuilderClass,
  Item,
  Section,
  compareNodeOrder,
  getChildNodes,
  getFirstItem,
  getItemCount,
  getLastItem,
  getNthItem,
  useCollection
} from '@vue-stately/collections';
export type {
  BaseCollection,
  CollectionNode,
  CollectionOptions,
  ItemProps,
  PartialNode,
  SectionProps,
  VueCollectionOptions
} from '@vue-stately/collections';
export * from '@vue-stately/color';
export * from '@vue-stately/combobox';
export * from '@vue-stately/data';
export * from '@vue-stately/datepicker';
export * from '@vue-stately/disclosure';
export * from '@vue-stately/dnd';
export * from '@vue-stately/flags';
export * from '@vue-stately/form';
export * from '@vue-stately/grid';
export * from '@vue-stately/layout';
export * from '@vue-stately/list';
export * from '@vue-stately/menu';
export * from '@vue-stately/numberfield';
export * from '@vue-stately/overlays';
export * from '@vue-stately/radio';
export * from '@vue-stately/searchfield';
export * from '@vue-stately/select';
export * from '@vue-stately/selection';
export * from '@vue-stately/slider';
export * from '@vue-stately/steplist';
export * from '@vue-stately/table';
export * from '@vue-stately/tabs';
export * from '@vue-stately/toast';
export * from '@vue-stately/toggle';
export * from '@vue-stately/tooltip';
export * from '@vue-stately/tree';
export * from '@vue-stately/utils';
export * from '@vue-stately/virtualizer';

export type {CheckboxGroupProps} from '@vue-stately/checkbox';
export type {ColorFieldProps, ColorWheelProps} from '@vue-stately/color';
export type {RadioGroupProps} from '@vue-stately/radio';
export type {SearchFieldProps} from '@vue-stately/searchfield';
export type {SelectProps} from '@vue-stately/select';
export type {TabListProps} from '@vue-stately/tabs';
export type {ToggleProps} from '@vue-stately/toggle';
export type {SingleSelectListState as SingleSelectionState} from '@vue-stately/list';

export type DateSegmentType = string;
export interface DateSegment {
  type: DateSegmentType,
  text: string,
  isPlaceholder?: boolean
}

export interface Collection<T = unknown> {
  getKeys?: () => Iterable<string | number>,
  size?: number,
  [key: string]: unknown
}

export type Orientation = 'horizontal' | 'vertical';
export interface Node<T = unknown> {
  key: string | number,
  value?: T,
  type?: string
}

export function useCalendarState<T extends DateValue = DateValue>(props: CalendarStateOptions<T>): CalendarState {
  return useCalendarStateInternal(props as CalendarStateOptions) as unknown as CalendarState;
}

export function useRangeCalendarState<T extends DateValue = DateValue>(props: RangeCalendarStateOptions<T>): RangeCalendarState<T> {
  return useRangeCalendarStateInternal(props as RangeCalendarStateOptions) as unknown as RangeCalendarState<T>;
}

export function useCheckboxGroupState(props: CheckboxGroupProps): CheckboxGroupState {
  return useCheckboxGroupStateInternal(props as never) as CheckboxGroupState;
}

export function parseColor(value: string): IColor {
  return parseColorInternal(value) as unknown as IColor;
}

export function useColorFieldState(props: ColorFieldProps): ColorFieldState {
  return useColorFieldStateInternal(props as never) as ColorFieldState;
}

export function useColorWheelState(props: ColorWheelProps): ColorWheelState {
  return useColorWheelStateInternal(props as never) as ColorWheelState;
}

export function useComboBoxState<T extends object, M extends SelectionMode = 'single'>(
  props: ComboBoxStateOptions<T, M>
): ComboBoxState<T> {
  return useComboBoxStateInternal(props as ComboBoxStateOptions) as unknown as ComboBoxState<T>;
}

export function useDraggableCollectionState<T = object>(props: DraggableCollectionStateOptions<T>): DraggableCollectionState {
  return useDraggableCollectionStateInternal(props) as unknown as DraggableCollectionState;
}

export function useRadioGroupState(props: RadioGroupProps): RadioGroupState {
  return useRadioGroupStateInternal(props);
}

export function useSearchFieldState(props: SearchFieldProps): SearchFieldState {
  return useSearchFieldStateInternal(props);
}

export function useSelectState<T extends object, M extends SelectionMode = 'single'>(
  props: SelectStateOptions<T, M>
): SelectState<T, M> {
  return useSelectStateInternal(props as unknown as SelectStateOptions<T, any>) as unknown as SelectState<T, M>;
}

export function useTableState<T extends object>(props: TableStateProps<T>): TableState<T> {
  return useTableStateInternal(props);
}

export function useTableColumnResizeState<T>(
  props: TableColumnResizeStateProps<T>,
  state: TableState<T>
): TableColumnResizeState<T> {
  return useTableColumnResizeStateInternal(props, state);
}

export function useTreeState<T extends object>(props: TreeProps<T>): TreeState<T> {
  return useTreeStateInternal(props);
}
