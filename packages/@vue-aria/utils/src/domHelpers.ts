const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])'
].join(',');

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

  let typedEvent = event as Event & {srcElement?: EventTarget | null};
  return typedEvent.srcElement ?? null;
}

export function nodeContains(target: EventTarget | null | undefined, node: EventTarget | null | undefined): boolean {
  if (!(target instanceof Node) || !(node instanceof Node)) {
    return false;
  }

  if (target === node) {
    return true;
  }

  return Boolean(target.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY);
}

function isHiddenElement(element: Element): boolean {
  if (element.hasAttribute('hidden') || element.closest('[hidden]')) {
    return true;
  }

  if (element.getAttribute('aria-hidden') === 'true') {
    return true;
  }

  return Boolean(element.closest('[aria-hidden="true"]'));
}

export function isFocusable(element: Element | null): boolean {
  if (!(element instanceof HTMLElement) || isHiddenElement(element)) {
    return false;
  }

  if ('disabled' in element && Boolean((element as HTMLInputElement).disabled)) {
    return false;
  }

  if (element instanceof HTMLAnchorElement) {
    if (!element.hasAttribute('href')) {
      return false;
    }
  }

  if (element instanceof HTMLInputElement && element.type === 'hidden') {
    return false;
  }

  if (element.matches(FOCUSABLE_SELECTOR)) {
    return element.tabIndex >= 0;
  }

  return false;
}

export function isTabbable(element: Element | null): boolean {
  if (!isFocusable(element)) {
    return false;
  }

  if (!(element instanceof HTMLElement)) {
    return false;
  }

  return element.tabIndex >= 0;
}

export function isFocusWithin(target: EventTarget | null | undefined): boolean {
  if (!(target instanceof Node) || typeof document === 'undefined') {
    return false;
  }

  let activeElement = getActiveElement(document);
  return nodeContains(target, activeElement);
}
