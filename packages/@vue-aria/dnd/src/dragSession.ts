let activeDragSessionId = 0;
let handledDragSessionId: number | null = null;

export function beginDragSession(): number {
  activeDragSessionId += 1;
  handledDragSessionId = null;
  return activeDragSessionId;
}

export function markActiveDragSessionHandled(): void {
  if (activeDragSessionId > 0) {
    handledDragSessionId = activeDragSessionId;
  }
}

export function isDragSessionHandled(sessionId: number): boolean {
  return handledDragSessionId === sessionId;
}
