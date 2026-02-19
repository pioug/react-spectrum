import {VueFlex, VueGrid} from '@vue-spectrum/components';

export const Flex = VueFlex;
export const Grid = VueGrid;

export function repeat(count: number, value: string): string {
  return `repeat(${count}, ${value})`;
}

export function minmax(min: string | number, max: string | number): string {
  return `minmax(${String(min)}, ${String(max)})`;
}

export function fitContent(value: string | number): string {
  return `fit-content(${String(value)})`;
}

export {VueFlex, VueGrid};
export type {DimensionValue} from '@react-types/shared';
export type {FlexProps, GridProps} from '@react-types/layout';
