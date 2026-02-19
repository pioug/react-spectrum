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

type SyntheticEvent<T = EventTarget> = {
  nativeEvent?: Event,
  target: T
};

type EventTargetType<T> = T extends SyntheticEvent<infer E> ? E : EventTarget;

export function getActiveElement(documentObject?: Document): Element | null {
  if (!documentObject) {
    return typeof document !== 'undefined' ? document.activeElement : null;
  }

  return documentObject.activeElement;
}

export function getEventTarget<T extends Event | SyntheticEvent>(event: T): EventTargetType<T> {
  let eventWithPath = event as Event & {composedPath?: () => EventTarget[]};
  if (typeof eventWithPath.composedPath === 'function') {
    let composedPath = eventWithPath.composedPath();
    if (composedPath.length > 0) {
      return (composedPath[0] ?? null) as EventTargetType<T>;
    }
  }

  let typedEvent = event as Event & {srcElement?: EventTarget | null, target?: EventTarget | null};
  return (typedEvent.target ?? typedEvent.srcElement ?? null) as EventTargetType<T>;
}

export function nodeContains(
  target: Node | Element | null | undefined,
  node: Node | Element | null | undefined
): boolean {
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

export function isFocusable(element: Element): boolean;
export function isFocusable(element: Element | null): boolean;
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

export function isTabbable(element: Element): boolean;
export function isTabbable(element: Element | null): boolean;
export function isTabbable(element: Element | null): boolean {
  if (!isFocusable(element)) {
    return false;
  }

  if (!(element instanceof HTMLElement)) {
    return false;
  }

  return element.tabIndex >= 0;
}

export function isFocusWithin(target: Element | null | undefined): boolean {
  if (!(target instanceof Element) || typeof document === 'undefined') {
    return false;
  }

  let activeElement = getActiveElement(document);
  return nodeContains(target, activeElement);
}
