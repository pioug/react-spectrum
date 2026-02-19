export type Key = string | number;

export interface Rect {
  height: number,
  width: number,
  x: number,
  y: number
}

export interface Size {
  height: number,
  width: number
}

export interface LayoutInfo {
  estimatedSize: boolean,
  key: Key,
  rect: Rect,
  type: string
}

export interface LayoutNode {
  index: number,
  key: Key,
  textValue?: string,
  type?: string
}
