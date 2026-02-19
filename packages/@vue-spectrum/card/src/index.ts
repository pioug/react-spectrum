import {VueCard, VueCardView} from '@vue-spectrum/components';

export type GalleryLayoutOptions = {
  columns?: number,
  gap?: string
};

export type GridLayoutOptions = {
  columns?: number,
  gap?: string
};

export type WaterfallLayoutOptions = {
  columns?: number,
  gap?: string
};

export const Card = VueCard;
export const CardView = VueCardView;
export const GalleryLayout = (options: GalleryLayoutOptions = {}) => options;
export const GridLayout = (options: GridLayoutOptions = {}) => options;
export const WaterfallLayout = (options: WaterfallLayoutOptions = {}) => options;
export {VueCard, VueCardView};
