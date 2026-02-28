let activeDragSessionId = 0;
let activeDragSessions = new Set<number>();
let handledDragSessionId: number | null = null;

export function beginDragSession(): number {
  activeDragSessionId += 1;
  activeDragSessions.add(activeDragSessionId);
  handledDragSessionId = null;
  return activeDragSessionId;
}

export function endDragSession(sessionId: number): void {
  activeDragSessions.delete(sessionId);
}

export function isVirtualDraggingSessionActive(): boolean {
  return activeDragSessions.size > 0;
}

export function markActiveDragSessionHandled(): void {
  if (activeDragSessionId > 0) {
    handledDragSessionId = activeDragSessionId;
  }
}

export function isDragSessionHandled(sessionId: number): boolean {
  return handledDragSessionId === sessionId;
}
