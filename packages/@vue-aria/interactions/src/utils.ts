export function getActiveElement(documentObject: Document | null | undefined): Element | null {
  if (!documentObject) {
    return null;
  }

  return documentObject.activeElement;
}

export function getEventTarget(event: Event): EventTarget | null {
  if (typeof event.composedPath === 'function') {
    let composedPath = event.composedPath();
    if (composedPath.length > 0) {
      return composedPath[0] ?? null;
    }
  }

  let typedEvent = event as Event & {srcElement?: EventTarget | null, target?: EventTarget | null};
  return typedEvent.target ?? typedEvent.srcElement ?? null;
}

export function nodeContains(target: EventTarget | null, node: EventTarget | null): boolean {
  if (
    target == null ||
    node == null ||
    typeof target !== 'object' ||
    typeof node !== 'object' ||
    !('nodeType' in target) ||
    !('nodeType' in node)
  ) {
    return false;
  }

  if (target === node) {
    return true;
  }

  if (typeof (target as Node).contains === 'function') {
    return (target as Node).contains(node as Node);
  }

  if (typeof (target as Node).compareDocumentPosition === 'function') {
    return Boolean((target as Node).compareDocumentPosition(node as Node) & 16);
  }

  return false;
}
