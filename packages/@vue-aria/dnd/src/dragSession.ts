import {ref} from 'vue';

let activeDragSessionId = 0;
let activeDragSessions = new Set<number>();
let handledDragSessionId: number | null = null;
let activeDragSessionCount = ref(0);

export function beginDragSession(): number {
  activeDragSessionId += 1;
  activeDragSessions.add(activeDragSessionId);
  activeDragSessionCount.value = activeDragSessions.size;
  handledDragSessionId = null;
  return activeDragSessionId;
}

export function endDragSession(sessionId: number): void {
  activeDragSessions.delete(sessionId);
  activeDragSessionCount.value = activeDragSessions.size;
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
