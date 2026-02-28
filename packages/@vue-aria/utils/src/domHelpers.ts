const focusableElements = [
  'input:not([disabled]):not([type=hidden])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'a[href]',
  'area[href]',
  'summary',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable^="false"])',
  'permission'
];

const FOCUSABLE_SELECTOR = focusableElements.join(':not([hidden]),') + ',[tabindex]:not([disabled]):not([hidden])';
const TABBABLE_SELECTOR = [...focusableElements, '[tabindex]:not([tabindex="-1"]):not([disabled])'].join(':not([hidden]):not([tabindex="-1"]),');
const supportsCheckVisibility = typeof Element !== 'undefined' && 'checkVisibility' in Element.prototype;

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

function getOwnerWindow(element: Element): Window | null {
  return element.ownerDocument?.defaultView ?? (typeof window !== 'undefined' ? window : null);
}

function isStyleVisible(element: Element): boolean {
  let ownerWindow = getOwnerWindow(element);
  if (!ownerWindow) {
    return false;
  }

  if (!(element instanceof ownerWindow.HTMLElement) && !(element instanceof ownerWindow.SVGElement)) {
    return false;
  }

  let {display, visibility} = (element as HTMLElement).style;
  let isVisible = display !== 'none' && visibility !== 'hidden' && visibility !== 'collapse';
  if (isVisible) {
    let computedStyle = ownerWindow.getComputedStyle(element);
    isVisible = computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden' && computedStyle.visibility !== 'collapse';
  }

  return isVisible;
}

function isAttributeVisible(element: Element, childElement?: Element): boolean {
  return (
    !element.hasAttribute('hidden') &&
    !element.hasAttribute('data-react-aria-prevent-focus') &&
    (element.nodeName === 'DETAILS' &&
      childElement &&
      childElement.nodeName !== 'SUMMARY'
      ? element.hasAttribute('open')
      : true)
  );
}

function isElementVisible(element: Element, childElement?: Element): boolean {
  if (supportsCheckVisibility && typeof (element as Element & {checkVisibility?: (options?: {visibilityProperty?: boolean}) => boolean}).checkVisibility === 'function') {
    return (element as Element & {checkVisibility: (options?: {visibilityProperty?: boolean}) => boolean}).checkVisibility({visibilityProperty: true}) && !element.closest('[data-react-aria-prevent-focus]');
  }

  return (
    element.nodeName !== '#comment' &&
    isStyleVisible(element) &&
    isAttributeVisible(element, childElement) &&
    (!element.parentElement || isElementVisible(element.parentElement, element))
  );
}

function isInert(element: Element): boolean {
  let node: Element | null = element;
  while (node != null) {
    let ownerWindow = getOwnerWindow(node);
    if (
      ownerWindow &&
      node instanceof ownerWindow.HTMLElement &&
      Boolean((node as HTMLElement & {inert?: boolean}).inert)
    ) {
      return true;
    }

    node = node.parentElement;
  }

  return false;
}

export function isFocusable(element: Element): boolean;
export function isFocusable(element: Element | null): boolean;
export function isFocusable(element: Element | null): boolean {
  if (!(element instanceof Element)) {
    return false;
  }

  return element.matches(FOCUSABLE_SELECTOR) && isElementVisible(element) && !isInert(element);
}

export function isTabbable(element: Element): boolean;
export function isTabbable(element: Element | null): boolean;
export function isTabbable(element: Element | null): boolean {
  if (!(element instanceof Element)) {
    return false;
  }

  return element.matches(TABBABLE_SELECTOR) && isElementVisible(element) && !isInert(element);
}

export function isFocusWithin(target: Element | null | undefined): boolean {
  if (!(target instanceof Element) || typeof document === 'undefined') {
    return false;
  }

  let activeElement = getActiveElement(document);
  return nodeContains(target, activeElement);
}
