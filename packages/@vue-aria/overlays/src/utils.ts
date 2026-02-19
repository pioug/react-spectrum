export function getEventTarget(event: Event): EventTarget | null {
  if (typeof event.composedPath === 'function') {
    let path = event.composedPath();
    if (path.length > 0) {
      return path[0] ?? null;
    }
  }

  let typedEvent = event as Event & {srcElement?: EventTarget | null};
  return typedEvent.srcElement ?? null;
}

export function nodeContains(target: EventTarget | null, node: EventTarget | null): boolean {
  if (!(target instanceof Node) || !(node instanceof Node)) {
    return false;
  }

  if (target === node) {
    return true;
  }

  return Boolean(target.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY);
}
