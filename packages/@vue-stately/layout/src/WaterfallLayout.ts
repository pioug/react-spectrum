import {GridLayout, type GridLayoutOptions} from './GridLayout';
import type {LayoutNode} from './types';

export interface WaterfallLayoutOptions extends GridLayoutOptions {}

export class WaterfallLayout<T extends LayoutNode = LayoutNode> extends GridLayout<T> {}
