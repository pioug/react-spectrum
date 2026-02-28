export type DropOperation = 'cancel' | 'copy' | 'link' | 'move';

export const DIRECTORY_DRAG_TYPE = 'application/x-directory';

export interface DragItem {
  id: string,
  type: string,
  value: unknown
}
