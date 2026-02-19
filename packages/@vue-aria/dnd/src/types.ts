export type DropOperation = 'cancel' | 'copy' | 'link' | 'move';

export interface DragItem {
  id: string,
  type: string,
  value: unknown
}
