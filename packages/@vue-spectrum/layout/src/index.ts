import {VueFlex, VueGrid} from '@vue-spectrum/components';
import type {DimensionValue} from '@react-types/shared';

export const Flex = VueFlex;
export const Grid = VueGrid;

export function repeat(count: number | 'auto-fill' | 'auto-fit', value: DimensionValue | DimensionValue[]): string {
  let repeatValue = Array.isArray(value) ? value.join(' ') : value;
  return `repeat(${String(count)}, ${String(repeatValue)})`;
}

export function minmax(min: DimensionValue, max: DimensionValue): string {
  return `minmax(${String(min)}, ${String(max)})`;
}

export function fitContent(dimension: DimensionValue): string {
  return `fit-content(${String(dimension)})`;
}

export {VueFlex, VueGrid};
export type {DimensionValue} from '@react-types/shared';
export type {FlexProps, GridProps} from '@react-types/layout';
