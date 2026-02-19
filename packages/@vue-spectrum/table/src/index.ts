import {VueTable} from '@vue-spectrum/components';

export const Table = VueTable;
export const TableView = VueTable;
export const TableHeader = VueTable;
export const TableBody = VueTable;
export const Column = VueTable;
export const Row = VueTable;
export const Cell = VueTable;
export const Section = VueTable;
export {VueTable};

export type SpectrumTableProps = Record<string, unknown>;
export type SpectrumColumnProps = SpectrumTableProps;
export type TableHeaderProps<T = unknown> = SpectrumTableProps & {item?: T};
export type TableBodyProps<T = unknown> = SpectrumTableProps & {item?: T};
export type RowProps<T = unknown> = SpectrumTableProps & {item?: T};
export type CellProps<T = unknown> = SpectrumTableProps & {item?: T};
