import {ref} from 'vue';
import type {DragItem} from './types';

let activeDragSessionId = 0;
let activeDragSessions = new Set<number>();
let handledDragSessionId: number | null = null;
let activeDragSessionCount = ref(0);
let activeDragItems: DragItem[] = [];

export function beginDragSession(items: DragItem[] = []): number {
  activeDragSessionId += 1;
  activeDragSessions.add(activeDragSessionId);
  activeDragSessionCount.value = activeDragSessions.size;
  activeDragItems = items;
  handledDragSessionId = null;
  return activeDragSessionId;
}

export function endDragSession(sessionId: number): void {
  activeDragSessions.delete(sessionId);
  activeDragSessionCount.value = activeDragSessions.size;
  if (activeDragSessionCount.value === 0) {
    activeDragItems = [];
  }
}

export function isVirtualDraggingSessionActive(): boolean {
  return activeDragSessionCount.value > 0;
}

export function markActiveDragSessionHandled(): void {
  if (activeDragSessionId > 0) {
    handledDragSessionId = activeDragSessionId;
  }
}

export function isDragSessionHandled(sessionId: number): boolean {
  return handledDragSessionId === sessionId;
}

export function getActiveDragItems(): DragItem[] {
  return activeDragItems;
}
