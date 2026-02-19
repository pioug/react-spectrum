let savedUserSelect = '';
let iOSDisableCount = 0;
let modifiedElementMap = new WeakMap<HTMLElement | SVGElement, string>();

function isIOS(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function getDocument(target?: Element | null): Document | null {
  if (target?.ownerDocument) {
    return target.ownerDocument;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return document;
}

export function disableTextSelection(target?: Element | null): void {
  if (isIOS()) {
    let ownerDocument = getDocument(target);
    if (!ownerDocument) {
      return;
    }

    if (iOSDisableCount === 0) {
      savedUserSelect = ownerDocument.documentElement.style.webkitUserSelect;
      ownerDocument.documentElement.style.webkitUserSelect = 'none';
    }

    iOSDisableCount += 1;
    return;
  }

  if (!(target instanceof HTMLElement || target instanceof SVGElement)) {
    return;
  }

  let property: 'userSelect' | 'webkitUserSelect' = 'userSelect' in target.style ? 'userSelect' : 'webkitUserSelect';
  modifiedElementMap.set(target, target.style[property]);
  target.style[property] = 'none';
}

export function restoreTextSelection(target?: Element | null): void {
  if (isIOS()) {
    let ownerDocument = getDocument(target);
    if (!ownerDocument || iOSDisableCount === 0) {
      return;
    }

    iOSDisableCount -= 1;

    if (iOSDisableCount === 0) {
      window.setTimeout(() => {
        ownerDocument.documentElement.style.webkitUserSelect = savedUserSelect || '';
        savedUserSelect = '';
      }, 30);
    }

    return;
  }

  if (!(target instanceof HTMLElement || target instanceof SVGElement)) {
    return;
  }

  if (!modifiedElementMap.has(target)) {
    return;
  }

  let property: 'userSelect' | 'webkitUserSelect' = 'userSelect' in target.style ? 'userSelect' : 'webkitUserSelect';
  let previousUserSelect = modifiedElementMap.get(target) ?? '';
  target.style[property] = previousUserSelect;

  if (target.getAttribute('style') === '') {
    target.removeAttribute('style');
  }

  modifiedElementMap.delete(target);
}
